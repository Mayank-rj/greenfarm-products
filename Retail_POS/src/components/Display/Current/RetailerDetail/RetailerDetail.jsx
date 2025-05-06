import { useEffect, useState, useRef } from 'react';
import './RetailerDetail.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBarcodeProductbyBarcode } from '../../../../api/fetchBarcodeProductbyBarcode';
import { v4 as uuidv4 } from 'uuid';
import { showOrder } from '../../../../feature/displayOrderSlice';
const RetailerDetail = () => {
  const dispatch = useDispatch();
  const posData = useSelector(state => state.posData)
  const inputRef = useRef('');
  const [input, setInput] = useState('');
  const typingTimerRef = useRef(null);
  const fetchBarcodeproduct = async (barcode) => {

      try {

        const res = await fetchBarcodeProductbyBarcode(barcode, posData?.store?._id)
        if (res) {
          dispatch(
            showOrder({
              name: res.name,
              weight: 0,
              id: res._id,
              price: res.sell_price,
              size: res.size,
              quantity: res.quantity,
              uniqueId: uuidv4()
            })
          )
        }
        setInput('');
      } catch (err) {
        console.error('Error fetching barcode:', err)
      }


  }

  useEffect(() => {
    // let typingTimer;
    const debounceInterval = 300; // Time in ms to determine if input is from a scanner

    const handleKeyDown = (event) => {
      // Clear the previous timeout
      clearTimeout(typingTimerRef.current);
      setInput('');
      inputRef.current += event.key;
      // console.log(inputRef.current);
      if (/^\d{4,30}$/.test(inputRef.current)) {
        // console.log("inputRef",inputRef.current);
        fetchBarcodeproduct(inputRef.current);
        setInput(inputRef.current);
      }
      // Debounce logic
      typingTimerRef.current = setTimeout(() => {
        inputRef.current = '';
      }, debounceInterval);
    };
     // // Add the event listener when the component mounts
     window.addEventListener('keydown', handleKeyDown);

     // // Remove the event listener when the component unmounts
     return () => {
         window.removeEventListener('keydown', handleKeyDown);
         clearTimeout(typingTimerRef.current);
     };
    // if (document.activeElement.id === 'scan') {
    //   clearTimeout(typingTimer);
    //   const newInput = event.key;

    //   // Only consider numeric keys and Enter key
    //   if (/\d/.test(newInput) || newInput === 'Enter') {
    //     typingTimer = setTimeout(() => {
    //       // If input length is significant and time is short, consider it from a scanner
    //       if (input.length > 5 && event.key === 'Enter') {

    //         setScannnedBarcode(input);
    //         fetchBarcodeproduct(input);
    //         setInput(''); // Clear input after processing
    //       } else if (/\d/.test(newInput)) {
    //         // Only append numeric keys to the input
    //         setInput(newInput);
    //         console.log("input",input);

    //       } else if (event.key === 'Enter') {
    //         fetchBarcodeproduct();
    //         setScannnedBarcode('');

    //       }
    //     }, debounceInterval);
    //   }
    // }
    // };

    // Add the event listener when the component mounts
    // window.addEventListener('keydown', handleKeyDown);

    // Remove the event listener when the component unmounts
    // return () => {
    //   window.removeEventListener('keydown', handleKeyDown);
    //   clearTimeout(typingTimer);
    // };

  }, []);
  const handleBarcodeChange = (e) => {
    // setScannnedBarcode(e.target.value)
  }
  return (
    <div className="retailer-detail">
      <div className="phone">
        <label htmlFor="phone">Phone : </label>
        <input type="text" id="phone" />
        <button>SUBMIT</button>
      </div>
      <div className="name">
        <label htmlFor="name">Name : </label>
        <input type="text" id="name" value="Sales" readOnly />
      </div>
      <div className="scan">
        <label htmlFor="scan">Scan.. : </label>
        <input type="text" id="scan" value={input}  ref={inputRef} readOnly/>
      </div>
    </div>
  )
}

export default RetailerDetail
