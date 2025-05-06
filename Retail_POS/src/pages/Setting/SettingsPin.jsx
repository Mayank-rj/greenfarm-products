import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from '../../feature/settingsAuth';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router';



const SettingsPin = () => {
    const dispatch = useDispatch();
    const [pin, setPin] = useState(["", "", "", ""]);
    const [errorMessage, setErrorMessage] = useState("");
    const posData = useSelector(state => state.posData)
    const navigate = useNavigate()

    //   console.log(posData.pin);



    const correctPin = posData.pin;
    const inputRefs = useRef([]);
    const handlePinChange = (index, value) => {
        if (value.match(/[0-9]/) || value === "") {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Focus management
            if (value && index < pin.length - 1) {
                inputRefs.current[index + 1].focus();
            } else if (!value && index > 0) {
                inputRefs.current[index - 1].focus();
            }

            // Check if all digits are filled
            if (newPin.every(digit => digit !== "")) {
                handlePinSubmit(newPin); // Automatically submit when all digits are entered
            }
        }
    };




    const handlePinSubmit = (enteredPinArray) => {
        const enteredPin = enteredPinArray.join(""); // Combine array into a string
        if (enteredPin === correctPin) {
            dispatch(authenticate());
            setErrorMessage("");
            // navigate('/settings'); // Adjust the path as necessary
        } else {
            setErrorMessage("Enter correct PIN");
            setPin(["", "", "", ""]); // Reset PIN on incorrect attempt
            inputRefs.current[0].focus(); // Focus the first input again
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && pin[index] === "") {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const getInputClass = (index) => {
        const baseClass = "block w-12 h-12 py-3 text-lg font-extrabold text-center rounded-lg border";
        const borderClass = errorMessage ? 'border-2 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ' : 'border-gray-300';
        return `${baseClass} ${borderClass}`;
    };

    useEffect(() => {
        // Focus the input and select its content when the component mounts
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
            inputRefs.current[0].select();
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-[100vh] bg-gray-900">
            {/* Back to POS button */}
            <div className="absolute top-4 left-4">
                <Button
                    item="Back To POS"
                    handleClick={() => navigate("/retailpos")}
                />
            </div>
            <form
                className="bg-gray-800 p-8 rounded-lg shadow-lg"
                onSubmit={(e) => { e.preventDefault(); handlePinSubmit(pin); }}
            >
                <h2 className="text-xl font-bold mb-4 text-white">Enter PIN</h2>
                <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            type="password"
                            maxLength="1"
                            ref={el => (inputRefs.current[index] = el)} // Assigning refs
                            value={digit}
                            onChange={(e) => handlePinChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={getInputClass(index)}
                            style={{
                                outline: 'none',
                            }}
                            required
                        />
                    ))}
                </div>
                {errorMessage && (
                    <p className="text-red-500 mb-4">{errorMessage}</p>
                )}
            </form>
        </div>
    )
}

export default SettingsPin
