import { memo, useEffect, useState } from 'react'
import io from 'socket.io-client'
// import { addWeight } from '../feature/slices/weightSlice'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { addWeight } from '../../../feature/weightSlice'
import { socket } from '../../../app/driverConnection'
// const socket = io(SITE_CONFIG.socketIp)

const WeightDisplay = () => {
  const dispatch = useDispatch()
  const [weight, setWeight] = useState('')
  //   socket.emit("message",{
  //     "command":"open-drawer"
  // });
  const handleWeight = (weight) => {
    weight = Number(weight)
    dispatch(addWeight(weight));
  }
  function customParse(str) {
    // Regular expression to match a valid floating point number
    const regex = /^\d+(\.\d+)+$/;
    // Check if the input string matches the regex
    if (regex.test(str)) {
      return str
    } else {
      return null;
    }
  }

  useEffect(() => {
    // Define a function to handle weight messages
    const handleWeightMessage = (event) => {
      // console.log(event.data);
      const parsedData = JSON.parse(event.data)
      if (parsedData?.type === "weight") {
        
        // const parsedWeight = parsedData.value.slice(2,7); // for testing
        const parsedWeight = parsedData.value.slice(0,5); // for production
        let customparsedWeight= customParse(parsedWeight) // for production
        if (parsedWeight) { // for production
          setWeight(parsedWeight); // for production
          handleWeight(parsedWeight); // for production
        } 
        
        // if (parsedWeight) { // for testing
        //   setWeight(parsedWeight); // for testing
        //   handleWeight(parsedWeight); // for testing
        // } 
      
      }

    };

    // Define a function to handle disconnects
    const handleDisconnect = () => {
      setWeight('0.000'); // Reset weight to '0.000' on disconnect
      dispatch(addWeight(0));
    };

    // Add event listeners
    socket.addEventListener("message", handleWeightMessage);
   
    socket.addEventListener("close", handleDisconnect);

    // Cleanup function to remove event listeners
    return () => {
      socket.removeEventListener("message", handleWeightMessage);
      socket.removeEventListener("close", handleDisconnect);
    };
  }, []);
  return (
    <div>
      <h1>{weight} KG</h1>
    </div>
  )
}

export default memo(WeightDisplay)
