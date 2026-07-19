import { useEffect, useState } from 'react'
import './SplitPayment.css'
import Modal from '../../../Modal/Modal'
import Button from '../../../Button/Button'
import Numpad from '../../../KeyBoard/Numpad/Numpad'
import { splitPayBgBtn } from '../../../../assets/btn-bg'
import Eftpos from '../Eftpos/eftpos'
import { toast } from 'react-toastify'
import { terminalStatus } from '../../../../SPI/event'
export default function SplitPayment({ onClose, amount, sendOrderDetails, payment_mode, setDataToShow, handlePrint, printData }) {
  const [input, setInput] = useState({
    cash: '',
    eftpos: ''
  })
  const [activeInput, setActiveInput] = useState('cash')
  const [openModal, setOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [width, setWidth] = useState({ width: '80%' })
  
  const handleClose = () => {
    setOpenModal(false)
    setModalContent(null)
  }

  const handleInputChange = (value) => {
    const isValid = /^(\d+(\.\d{0,2})?)?$/.test(value);
    if (isValid) {
      if (Number(value) < amount) {
        const fixedValue = amount - value
        setInput((prevInput) => {
          // console.log(prevInput)

          return { ...prevInput, cash: value, eftpos: fixedValue.toFixed(2) }
        })
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      // setterminalStatus(terminalmsg);
      terminalStatus
    }, 500);

    return () => clearInterval(intervalId);
  }, [terminalStatus]);

  const handleClick = (e) => {
    const buttonName = e.target.innerText
    if (buttonName === 'CASH') {
      if (input.cash !== '0' && input.cash !== '') {

        setOpenModal(!openModal)
        setWidth({ width: '50%' })
        setModalContent(
          <div className="split-payment-alert">
            <h1>Collect Cash : ${input.cash}</h1>
            <h1>Collect Eftpos Amount : ${input.eftpos}</h1>
            <Button
              item={'EFTPOS'}
              style={{ backgroundColor: 'yellow' }}
              handleClick={handleEftpos}
              background={splitPayBgBtn[1]}
            />
          </div>
        )
      }
    }
  }

  const handleEftpos = () => {
    const cardamount = (Number(input.eftpos) + Number(input.eftpos * 0.015)).toFixed(2)
    if (cardamount >= 1 && terminalStatus === "PairedConnected" && cardamount <= 10000) {
      setOpenModal(!openModal)
      setWidth({ width: '50%' })
      // cardamount, onClose, sendOrderDetails, paid_method
      setModalContent(
        <Eftpos
          onClose={onClose}
          cardamount={cardamount}
          sendOrderDetails={sendOrderDetails}
          payment_mode={payment_mode}
          cashamount={input.cash}
          setDataToShow={setDataToShow}
          handlePrint={handlePrint}
          printData={printData}
        />
      )
    }
    else if (cardamount < 1) {
      toast.error("Amount should be greater than $ 1")
    }
    else if(cardamount > 1000){
      toast.error("Amount should be less than $ 10000")
    }
    else if (terminalStatus !== "PairedConnected") {
      toast.error("Please Connect the terminal first")
    }
   

  }
  return (
    <>
      <div className="split-container">
        <h1 className="heading">SPLIT PAYMENT</h1>
        <div className="amt-box">
          <p>TOTAL AMOUNT</p>
          <h5>$ {amount}</h5>
        </div>
        <div>
          <div className="flex-box">
            <div>
              <p>Cash Amount</p>
              <input
                type="text"
                placeholder="$"
                value={input.cash}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setActiveInput('cash')}
              />
            </div>
            <div>
              <p>EFTPOS Amount</p>
              <input
                type="text"
                placeholder="$"
                value={input.eftpos}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setActiveInput('eftpos')}
                readOnly
              />
            </div>
          </div>
          <div className="keyboard">
            <Numpad input={input[activeInput]} setInput={handleInputChange} />
          </div>
          <div className="flex-box">
            <Button
              item={'CASH'}
              style={{ backgroundColor: 'green', color: 'white' }}
              handleClick={handleClick}
              background={splitPayBgBtn[0]}
            />
          </div>
        </div>
        {openModal && (
          <Modal isOpen={openModal} onClose={handleClose} width={width}>
            {modalContent}
          </Modal>
        )}
      </div>
    </>
  )
}
