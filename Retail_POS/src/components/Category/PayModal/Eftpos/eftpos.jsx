import Modal from '../../../Modal/Modal.jsx'
import { useEffect, useState } from 'react'
import './eftpos.css'
import Button from '../../../Button/Button.jsx'
import { eftposBgBtn } from '../../../../assets/btn-bg.js'
import Cardpayment from './cardpayment.jsx'
import {
  purchase

} from "../../../../SPI/transaction.js"
import { useDispatch, useSelector } from 'react-redux'
import { setTransactionState } from '../../../../feature/transactionSlice.js'



function Eftpos({ cardamount, onClose, sendOrderDetails, payment_mode, cashamount, setDataToShow, handlePrint, printData }) {
  const [openModal, setOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [width, setWidth] = useState({ width: '80%' })
  // const [transactionmsg, setTransactionmsg] = useState("")
   const dispatch=useDispatch()
   const posData=  useSelector(state=>state.posData)

  //  console.log(posData)

  const handleClose = () => {
    setOpenModal(false)
    setModalContent(null)
  }



  
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log("interval");
  //     setTransactionmsg(transactionMessage)
  //   }, 500);

    

  //   return () => clearInterval(intervalId);
  // }, [transactionmsg]);

  // console.log(transactionmsg);


  useEffect(() => {
    if (payment_mode === 'eftpos') {
      setDataToShow(prev => {
        const updatedData = { ...prev };
        updatedData.grand_total = parseFloat(cardamount);
        updatedData.surcharge = posData.surcharge;
        return updatedData;
      })
    }
    else if (payment_mode === 'split payment') {
      setDataToShow(prev => {
        const updatedData = { ...prev };
        updatedData.grand_total = Number(cardamount) + Number(cashamount);
        updatedData.surcharge = posData.surcharge;
        return updatedData;
      })
    }

  }, [cardamount, payment_mode])

  // useEffect(() => {

  // }, [cardamount, payment_mode]);

  const handleClick = async (e) => {
    const buttonname = e.target.innerText
    if (buttonname === 'Do Txn') {
      if (payment_mode === 'eftpos') {
        dispatch(setTransactionState(true));
        // await sendOrderDetails(payment_mode, "paid", cardamount, 0)
        // console.log(typeof (parseFloat(cardamount)));
        purchase(parseFloat(cardamount*100), 0, 0, 0, 0);
       
      }
      else if (payment_mode === 'split payment') {
        // await sendOrderDetails(payment_mode, "paid", cardamount, cashamount)
        purchase(parseFloat(cardamount*100), 0, 0, 0, 0);
        dispatch(setTransactionState(true));
      }
      setOpenModal(!openModal)
      // ! Check This
      setWidth({ width: '80%' })
      setModalContent(<Cardpayment cardamount={cardamount} handleClose={handleClose} onClose={onClose} 
        payment_mode={payment_mode} cashamount={cashamount}  sendOrderDetails={sendOrderDetails} />)
    }
    else if (buttonname == 'REPRINT') {
      if (payment_mode === 'eftpos') {
        handlePrint({ ...printData, payment_mode: payment_mode, status: "paid", grand_total: parseFloat(cardamount) });
      }
      else if (payment_mode === 'split payment') {
        handlePrint({ ...printData, payment_mode: payment_mode, status: "pais", grand_total: ((Number(cashamount) + Number(cardamount))), split_card_amount: Number(cardamount), split_cash_amount: Number(cashamount) });
      }

    }
  }

  return (
    <>
      <div className="efp-container">
        <h1>EFTPOS</h1>
        <h5>TOTAL AMOUNT</h5>
        <div className="card-amount">$ {cardamount}</div>
        <div className="para">
          <p>
            Additional Surcharge On Card {posData.surcharge}% <input type="checkbox" disabled checked />{' '}
          </p>
        </div>
        <div className="btn-container">
          <Button
            item="Do Txn"
            style={{
              backgroundColor: 'red',
              color: 'white'
            }}
            handleClick={handleClick}
            background={eftposBgBtn[0]}
          />

          {/* <Button
            item="REPRINT"
            style={{
              backgroundColor: 'green',
              color: 'white'
            }}
            handleClick={handleClick}
            background={eftposBgBtn[1]}
          /> */}

          {openModal && (
            <Modal isOpen={openModal} onClose={handleClose} width={width}>
              {modalContent}
            </Modal>
          )}
        </div>
      </div>
    </>
  )
}
export default Eftpos
