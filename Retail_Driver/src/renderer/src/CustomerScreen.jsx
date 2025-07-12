import { useEffect, useState } from 'react'
import './CustomerScreen.css'
import logo from '../../renderer/images/logo.png'
export default function CustomerScreen() {
  const [details, setDetails] = useState()
  const [surchargeAmount, setSurchargeAmount] = useState(0)

  useEffect(() => {
    const handleDisplayData = (event, data) => {
      console.log('Data received from main process:', data)
      setDetails(data)
    }

    window.electron.ipcRenderer.on('display-data', handleDisplayData)

    // Clean up the event listener on component unmount
    return () => {
      window.electron.ipcRenderer.removeListener('display-data', handleDisplayData)
    }
  }, [])

  useEffect(() => {
    setSurchargeAmount(
      parseFloat(details?.grand_total) +
        parseFloat(details?.discount) -
        parseFloat(details?.sub_total)
    )
  }, [details])
  return (
    <div className="main">
      <nav className="navbar">
        <img src={logo} alt="logo" />
        <h1>ORDER SUMMARY</h1>
      </nav>
      <hr />
      <div className="customer-facing-table">
        <table>
          <tbody>
            {details?.items?.map((item) => {
              return (
                <tr key={item.uniqueId}>
                  <td>
                    {item.quantity} x {item.name.toUpperCase()}
                     {/* - ${item.price}/kg x {item.weight}kg */}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    ${' '}
                    {parseFloat(item.weight) !== 0
                      ? (
                          parseFloat(item.price) *
                          parseFloat(item.quantity) *
                          parseFloat(item.weight)
                        ).toFixed(2)
                      : (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <hr />
      <div className="main_headings">
        <div className="Sub_headings1">
          <p>SUB TOTAL: ${details?.sub_total || ''}</p>
          {details && details?.surcharge ? <p>SURCHARGE :${surchargeAmount.toFixed(2)}</p> : ''}
          {details &&
          details?.discount &&
          parseFloat(details?.discount) !== 0 &&
          details?.discount !== '' ? (
            <p>DISCOUNT : ${details?.discount}</p>
          ) : (
            ''
          )}
          <p>ITEM : {details?.items?.length}</p>
        </div>
        <div className="Sub_headings2">
          <p>
            ORDER TOTAL <br />
            <span className="Sub_headings2_span"> $ {details?.grand_total}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
