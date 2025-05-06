import { app, shell, BrowserWindow, ipcMain, screen, Tray, Menu } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import printlogo from '../../resources/printlogo.png?asset'
import fs from 'fs'
import axios from 'axios'
import macaddress from 'macaddress'
import { ReadlineParser, SerialPort } from 'serialport'
import WebSocket from 'ws'
import { printer as ThermalPrinter, types as PrinterTypes,CharacterSet,BreakLine } from 'node-thermal-printer'

const documentsPath = process.resourcesPath
const logFilePath = path.join(documentsPath, 'error.log')
let device = null
let tray = null
let serialport = null
let mainWindow = null
let parser = null

const wss = new WebSocket.Server({ port: 3737 })
const logError = (error) => {
  const errorMessage = `[${new Date().toLocaleString()}] ${error.stack}\n`

  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) {
      console.error('Error writing to error log file:', err)
    }
  })
}
const fetchMacAddress = () => {
  return new Promise((resolve, reject) => {
    macaddress.one((err, macAddress) => {
      if (err) {
        reject(err)
      } else {
        resolve(macAddress)
      }
    })
  })
}
async function accessDevice() {
  try {
    const macAddress = await fetchMacAddress()
    const response = await axios.post(
      'http://localhost:5001/api/driver/posconfiguration/getbymac',
      { mac_address: macAddress },
      {
        headers: {
          Authorization: `Bearer a1b2c3d4`
        }
      }
    )
    if (response.data.success) {
      console.log(response.data)
      device = response.data.data

      createWindow()
      startWebSocketServer()
      // createSerialPort();
    } else {
      app.quit()
    }
  } catch (error) {
    console.log(error);
    
    console.error('Error fetching POS Configurations:', `${error.response?.data?.message}`)
    logError(error)
    app.quit()
  }
}
accessDevice()

function startWebSocketServer() {
  wss.once('connection', (ws) => {
    serialport = new SerialPort({
      path: device.weight_scale_port,
      baudRate: device.boud_rate,
      DataBits: device.data_bits,
      parity: device.parity,
      stopBits: device.stop_bits,
      flowType: device.flow_type,
      autoOpen: false
      // path: "COM3",
      // baudRate: 9600,
      // DataBits: 8,
      // parity: "none",
      // stopBits: 1,
      // flowType: false
    })
    // serialport.setMaxListeners(0);
    parser = serialport.pipe(new ReadlineParser({ delimiter: '\r\n' })) // testing
    // parser = serialport.pipe(new ReadlineParser({ delimiter: ' ' })) // production
    

    serialport.on('close', () => {
      console.log('Serial Port Closed')
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: `weight`, value: `` }))
      }
    })
    serialport.on('error', (err) => {
      console.error('Serial Port Error: ', err.message)
      logError(err)
      // reconnectSerialPort()
    })
  })
  wss.on('connection', (ws) => {
    createSerialPort(ws)
    ws.on('message', async (message) => {
      if (!message) {
        ws.send(JSON.stringify({ success: false, message: 'No data provided!' }))
        return
      }
      try {
        // console.log(message);

        const parsedMessage = JSON.parse(message)
        handleCommand(ws, parsedMessage)
      } catch (error) {
        ws.send(JSON.stringify({ success: false, message: 'Failed to parse command!' }))
        console.error('Failed to parse command:', error)
        logError(error)
      }
    })

    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      logError(error)
      serialport.close((err) => {
        if (err) {
          return console.log('Error closing port: ', err.message)
        }
        console.log('Serial Port Closed')
      })
    })

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected')
      parser.removeAllListeners()
      // parser.off("data");
      // parser.off("error");
    })
  })

  // Handle global errors for the WebSocket server
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error)
    logError(error)
    // Optionally handle server shutdown here
    app.quit()
  })
}

async function handleCommand(ws, parsedMessage) {
  const { command, data } = parsedMessage
  // console.log(parsedMessage);

  if (!command) {
    ws.send(JSON.stringify({ success: false, message: 'Invalid data structure!' }))
    console.log('Invalid data structure:', parsedMessage)
    return
  }

  const commandHandlers = {
    print: async () => {
      console.log('Print command received')
      const result = await printingMethod(data)
      ws.send(
        JSON.stringify(
          { ...result, type: 'response' } || { success: false,type:'response', message: 'Something went wrong!' }
        )
      )
    },
    display: () => {
      if (mainWindow) {
        mainWindow.webContents.send('display-data', data)
      }
    },
    'open-drawer': async () => {
      console.log('Drawer open command received')
      const result = await openDrawer()
      ws.send(JSON.stringify({...result,type:'response'} || { success: false,type:'response', message: 'Something went wrong!' }))
    },
    getposdata: () => {
      ws.send(
        JSON.stringify(
          {
            success: true,
            message: 'Data fetched successfully',
            data: { ...device },
            type: 'posdata'
          } || { success: false,type:'response', message: 'Something went wrong!' }
        )
      )
    },
    zprint: async () => {
      console.log('Z-Print command received')
      const result = await zprintingMethod(data)
      ws.send(JSON.stringify({...result,type:'response'} || { success: false,type:'response', message: 'Something went wrong!' }))
    },
    webprint: async () => {
      console.log('Print command received')
      const result = await webprintingMethod(data)
      ws.send(
        JSON.stringify(
          { ...result, type: 'response' } || { success: false,type:'response', message: 'Something went wrong!' }
        )
      )
    },
    signatureprint: async () => {
      console.log('Print command received')
      const result = await signatureprintingMethod(data)
      ws.send(
        JSON.stringify(
          { ...result, type: 'response' } || { success: false,type:'response', message: 'Something went wrong!' }
        )
      )
    },
    merchant_receipt: async () => {
      console.log('Merchant command received')
      const result = await merchantprintingMethod(data)
      ws.send(
        JSON.stringify(
          { ...result, type: 'response' } || { success: false,type:'response', message: 'Something went wrong!' }
        )
      )
    },


  }

  const handler = commandHandlers[command]
  if (handler) {
    await handler()
  } else {
    ws.send(JSON.stringify({ success: false, message: 'Unknown command!' }))
  }
}

const createSerialPort = (ws) => {
  if (!serialport.isOpen) {
    serialport.open((err) => {
      if (err) {
        return console.log('Error opening port: ', err.message)
      }
      console.log('Serial Port Opened')

      // startSendingCode();  //production
    })
  }

  parser.on('data', (data) => {
    // io.emit('weight', `${data}`)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: `weight`, value: data }))
    }
    // return data
  })
  parser.on('error', (err) => {
    console.error('Parser error', err.message)
    logError(err)
  })
}

const startSendingCode = () => {
  if (serialport && serialport.isOpen) {
    let hexCommand3 = Buffer.from([0x05, 0x12])

    const sendCommand = () => {
      serialport.write(hexCommand3, (err) => {
        if (err) {
          console.error('Error on write: ', err.message)
          logError(err)
        }
      })
    }
    setInterval(sendCommand, 100)
  }
}
const reconnectSerialPort = () => {
  setTimeout(() => {
    console.log('Attempting to reconnect to Serial Port...')
    createSerialPort()
  }, 5000) // attempt to reconnect every 5 seconds
}

const formatDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }
  return date.toLocaleString('en-US', options)
}


// console.log(data)

const printingMethod = async (data) => {


  console.log(`tcp://${device.printer_ip}:${device.printer_port}`)
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${device.printer_ip}:${device.printer_port}`
  })

  printer.alignCenter()
  await printer.printImage(printlogo)
  printer.drawLine()
  printer.newLine()
  printer.setTextDoubleHeight() // Set text to double height
  printer.setTextDoubleWidth()
  printer.println('TAX INVOICE / RECEIPT')
  printer.setTextNormal()
  printer.println(`ABN: ${device?.store?.abn}`);
  // printer.println(`ABN: 87263876228`)
  printer.newLine()
  printer.println(`${device?.store?.name}`);
  printer.println(`${device?.store?.address}`);
  // printer.println(`The Green Bay Waterfront Cafe`)
  // printer.println(`1714 Pittwater Road, Bayview`)
  // printer.println(`New South Wales 2104`)
  printer.println(`Ph: ${device?.store?.mobile}`)
  printer.newLine()
  printer.alignLeft()
  printer.setTextNormal()
  printer.setTextDoubleHeight() // Set text to double height
  printer.setTextDoubleWidth()
  printer.println(`Order #: ${data.order_number}\n`)
  printer.setTextNormal()
  printer.println(`Date : ${formatDate(new Date(data.date_time))}\n`)
  // printer.println(`Served by : ${data.served_by}`);
  // if ((data.table && data.area)) {
  //   printer.println(`Table no.: ${data.table.table_no}`);
  //   printer.println(`Area: ${data.area}`);
  // }
  printer.drawLine()
  printer.alignCenter()
  printer.bold(true)
  printer.println(`"ORDER DETAILS"`)
  printer.alignLeft()
  printer.leftRight(`Description`, `Amount`)
  printer.bold(false)
  printer.drawLine()
  JSON.parse(data.product_details)?.map((item) => {
    printer.leftRight(
      `${item.name} x${item.quantity}`,
      `$${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}`
    )
    console.log(
      `${item.name} x${item.quantity}`,
      `$${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}`
    )

    // item.variations.map(varItem => {
    //   printer.leftRight(`  -${varItem.name}`, `$${(parseFloat(varItem.sell_price)).toFixed(2)}`);
    //   console.log(`  -${varItem.name}`, `$${(parseFloat(varItem.sell_price)).toFixed(2)}`);

    // })
  })
  printer.drawLine()
  printer.leftRight('Subtotal', `$${data.sub_total.toFixed(2)}`)
  if (data.discount !== 0) {
    printer.leftRight('Discount', `$${data.discount.toFixed(2)}`)
  }
  if (data.surcharge !== 0) {
    printer.leftRight('Surcharge', `${data.surcharge}%`)
  }

  // printer.println(`GST`);
  // Object.entries(JSON.parse(data.gst_percent)).map(([key, value]) => {
  //   printer.leftRight(`${key}%`, `$${value}`);
  // });
  printer.bold(true)
  printer.leftRight('Total', `$${data.grand_total.toFixed(2)}`)
  printer.bold(false)
  if (data.payment_mode === 'cash') {
    printer.leftRight('Tendered', `$${data.tender_amount.toFixed(2)}`)
    printer.leftRight('Change', `$${data.change_amount.toFixed(2)}`)
  }
  if (data.payment_mode === 'eftpos' || data.payment_mode === 'split payment') {
    printer.leftRight('Cash amount', `$${data.split_cash_amount.toFixed(2)}`)
    printer.leftRight('Card amount', `$${data.split_card_amount.toFixed(2)}`)
  }
  printer.alignCenter()
  printer.drawLine()
  printer.println(`PAYMENT MODE '${data.payment_mode.toUpperCase()}'`)
  printer.drawLine()
  // printer.println("Support the local business by following and");
  // printer.println("sharing us on Instagram");
  // await printer.printImage(path.join(__dirname, '../renderer/images/QrCodeInsta.png'));
  // printer.drawLine();
  printer.println('Printed by : Greenfarm Retail POS')
  // printer.drawLine()
  printer.println();
  printer.cut()

  try {
    await printer.execute()
    return { success: true, message: 'Printing job successfull' }
  } catch (error) {
    logError(error)
    console.log('Print failed:', error.message)
    return { success: false, message: error.message }
  }
}


const webprintingMethod = async (data) => {

console.log(data)

  console.log(`tcp://${device.printer_ip}:${device.printer_port}`)
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${device.printer_ip}:${device.printer_port}`,
  encoding: 'utf8'
  })

  printer.alignCenter()
  await printer.printImage(printlogo)
  printer.drawLine()
  printer.newLine()
  printer.println(`ABN: ${device?.store?.abn}`);
  printer.newLine()
  printer.println(`${device?.store?.name}`);
  printer.println(`${device?.store?.address}`);
  // printer.println(`The Green Bay Waterfront Cafe`)
  // printer.println(`1714 Pittwater Road, Bayview`)
  // printer.println(`New South Wales 2104`)
  printer.println(`Ph: ${device?.store?.mobile}`)
  printer.setTextDoubleHeight() // Set text to double height
  printer.setTextDoubleWidth()
  // printer.println('TAX INVOICE / RECEIPT')
  printer.println(`${data.deliverytype.toUpperCase()}`)
  printer.newLine()
  printer.alignLeft()
  printer.println(`Web Order #: ${data.order_number}\n`)
  printer.setTextNormal()
  printer.newLine()
  printer.println(`Date : ${formatDate(new Date(data.date_time))}\n`)
  printer.newLine()
  printer.println("T/By:Web")
  printer.drawLine()
  printer.newLine()
  printer.setTextDoubleHeight() // Set text to double height
  printer.setTextDoubleWidth()
  printer.println(`Phone: ${data.user_id.mobile}`)
  printer.newLine()
  printer.setTextNormal()
  printer.println(`Name: ${data.user_id.first_name} ${data.user_id.last_name}`)
  printer.newLine()
  if(data.deliverytype==="delivery"){
  printer.println( `${data.address}`)
  printer.newLine()}
  printer.println(`Phone: ${data.user_id.email}`)
  printer.newLine()
  printer.newLine()
  printer.println(`Notes: ${data.notes}`)
  printer.drawLine()







  printer.alignCenter()
  printer.bold(true)
  printer.println(`"ORDER DETAILS"`)
  printer.alignLeft()
  printer.leftRight(`Description`, `Amount`)
  printer.bold(false)
  printer.drawLine()
  JSON.parse(data.product_details)?.map((item) => {
    printer.leftRight(
      `${item.product.name} x${item.quantity}`,
      `$${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}`
    )
    console.log(
      `${item.product.name} x${item.quantity}`,
      `$${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}`
    )

    // item.variations.map(varItem => {
    //   printer.leftRight(`  -${varItem.name}`, `$${(parseFloat(varItem.sell_price)).toFixed(2)}`);
    //   console.log(`  -${varItem.name}`, `$${(parseFloat(varItem.sell_price)).toFixed(2)}`);

    // })
  })
  printer.drawLine()
  printer.leftRight('Subtotal', `$${data.sub_total.toFixed(2)}`)
  if (data.discount !== 0) {
    printer.leftRight('Discount', `$${data.discount.toFixed(2)}`)
  }
  if (data.delivery_charge !== 0) {
    printer.leftRight('Delivery Charge', `${data.delivery_charge}`)
  }

  // printer.println(`GST`);
  // Object.entries(JSON.parse(data.gst_percent)).map(([key, value]) => {
  //   printer.leftRight(`${key}%`, `$${value}`);
  // });
  printer.bold(true)
  printer.leftRight('Total Receipt', `$${data.grand_total.toFixed(2)}`)
  printer.bold(false)
  printer.alignCenter()
  printer.drawLine()
  printer.println("| PAID BY : Online |")
  printer.println();
  printer.cut()


  
  
  try {
    await printer.execute()
    return { success: true, message: 'Web Printing job successfull' }
  } catch (error) {
    logError(error)
    console.log('Web Print failed:', error.message)
    return { success: false, message: error.message }
  }
}


const openDrawer = async () => {
  console.log(`tcp://${device.printer_ip}:${device.printer_port}`)
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${device.printer_ip}:${device.printer_port}`
  })
  printer.openCashDrawer()
  try {
    await printer.execute()
    return { success: true, message: 'Drawer opened successfully' }
  } catch (error) {
    logError(error)
    console.log('Drawer opening failed:', error.message)
    return { success: false, message: error.message }
  }
}

const zprintingMethod = async (printdata) => {
  console.log(printdata)
  console.log(`tcp://${device.printer_ip}:${device.printer_port}`)
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${device.printer_ip}:${device.printer_port}`
  })
  if (printdata) {
    const today = new Date().toLocaleString()
    printer.alignCenter()
    printer.println(`${device?.store?.name}`);
    printer.println(`${device?.store?.address}`);
    printer.println(`Ph: ${device?.store?.mobile}`)
    // printer.println(`The Green Bay Waterfront Cafe`)
    // printer.println(`1714 Pittwater Road, Bayview`)
    // printer.println(`New South Wales 2104`)
    // printer.println(`Ph: +61 468380542`)
    printer.newLine()
    printer.setTextDoubleHeight() // Set text to double height
    printer.setTextDoubleWidth()
    if (printdata.type === 'dailySummary' || printdata.type === 'hourly') {
      if (printdata.type === 'dailySummary') {
        printer.println('DAILY SUMMARY')
      }else{
        printer.println('HOURLY REPORT')
      }
      printer.println()
      printer.setTextNormal()
      printer.alignLeft()
      printer.println(`Printed Date: ${today}`)
      printer.leftRight(`From: ${printdata.from}`, `  To: ${printdata.to}`)

      printer.setTextDoubleHeight()
      printer.setTextDoubleWidth()
      printer.alignRight()
      printer.println(`Count`)
      printer.alignLeft()
      printer.bold(true)
      printer.leftRight(
        `CASH: ${printdata.cashData.totalAmount}`,
        `${printdata.cashData.count}`
      )
      console.log(`CASH: ${printdata.cashData.totalAmount}`, `${printdata.cashData.count}`)

      printer.leftRight(
        `EFTPOS: ${printdata.eftposData.totalAmount}`,
        `${printdata.eftposData.count}`
      )

      if (printdata.splitPaymentData.count > 0) {
        printer.leftRight(
          `SPLIT: ${printdata.splitPaymentData.totalAmount}`,
          `${printdata.splitPaymentData.count}`
        )
      }

      printer.leftRight(
        `TOTAL: ${printdata.allData.totalAmount}`,
        `${printdata.allData.count}`
      )

      printer.println()
      printer.println(`Discount: ${printdata.allData.totalDiscount}`)
      printer.bold(false)
      printer.setTextNormal()
      printer.println(`TOTAL is less discount`)
      printer.setTextDoubleHeight()
      printer.setTextDoubleWidth()
      printer.bold(true)
      // printer.println(`Surcharge: ${printdata.data.data.totalSurcharge}`)
      printer.bold(false)
      printer.setTextNormal()
      printer.println(`TOTAL is include Surcharge`)
      printer.drawLine()
      printer.println()
      printer.println(`Z Reading`)
    }
    else if (printdata.type === 'hold'){
      printer.println("HOLD");
      printer.println()
      printer.setTextNormal();
      printer.alignLeft();
      printer.println(`Printed Date: ${today}`)
      printer.leftRight(`From: ${printdata.from}`, `  To: ${printdata.to}`)
      printer.alignRight();
      printer.println(`Count`)
      printer.alignLeft();
      printer.leftRight(`HOLD: ${printdata.allData.totalAmount}`,`${printdata.allData.count}`);
      // printer.println(`${data.holdSalesCount}`)
      // printer.println(`${data.holdSubAmount}`)
      // printer.println(`${data.holdDiscount}`)
      // printer.println(`${data.holdSurcharge}`)
      // printer.println(`${data.holdTotal}`)
      printer.drawLine();
      printer.println();
    }
    printer.cut()
  }

  try {
    await printer.execute()
    return { success: true, message: 'Z-Printing job successfull' }
  } catch (error) {
    logError(error)
    console.log('Z-Print failed:', error.message)
    return { success: false, message: error.message }
  }
}



 const merchantprintingMethod=async (data)=>{
  console.log(data);
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${device.printer_ip}:${device.printer_port}`,
    characterSet:CharacterSet.WPC1252,
    breakLine: BreakLine.NONE,
    width: 80
  });
  printer.alignCenter();
  printer.println(`${data}`);
  
  
  printer.cut();
  try {
    await printer.execute();
    return { success: true, message: "Printing job successfull" }
  } catch (error) {
    logError(error)
    console.log("Print failed:", error.message);
    return { success: false, message: error.message }
  }
 }




function createWindow() {
  const displays = screen.getAllDisplays()
  const posDisplay = displays[0]
  const customerDisplay = displays[1]
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Green farm Retail POS')
  // Create the browser window.
  mainWindow = new BrowserWindow({
    fullscreen: true,
    width: customerDisplay?.bounds.width,
    height: customerDisplay?.bounds.height,
    x: customerDisplay?.bounds.x,
    y: customerDisplay?.bounds.y,
    show: false,
    icon: icon,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // createWindow()
  // startWebSocketServer()
  // createSerialPort();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
