import { useEffect, useRef, useState } from 'react'

import './BarcodeSearch.css'
import Button from '../../../components/Button/Button'
import DraggableNumpad from '../../../components/KeyBoard/DraggableNumpad/DraggableNumpad'
import Modal from '../../../components/Modal/Modal'
import BarcodeAddEditModal from '../BarcodeAddEditModal/BarcodeAddEditModal'
import { addBarcodeProduct } from '../../../api/addBarcodeProduct'
import { toast } from "react-toastify";
export default function BarcodeSearch({ searchProduct,fetchBarcodeProductHandler,keypadfocus }) {
    const width = { width: "80%" }
    const [inputFocused, setInputFocused] = useState(false)
    const [input, setInput] = useState('');
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const typingTimerRef = useRef(null);
    const inputRef = useRef('');
    const debounceInterval = 300;

    const handleClose = () => {
        setOpenModal(false)
        setModalContent(null)
    }
    const addBarcodeProductHandler = async (formData) => {
        try {
            // Simulating API call to fetch categories

            const res = await addBarcodeProduct(formData)
            if (res.success) {
                handleClose();
                fetchBarcodeProductHandler()
                toast.success('Barcode product added successfully')
            }
        } catch (err) {
            toast.error("Barcode Product Already Exists...")
            console.error('Error adding barcode product', err)
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {

            if(openModal){
                return 
            }
            // Clear the previous timeout
            clearTimeout(typingTimerRef.current);
            setInput('');
            inputRef.current += event.key;
            // console.log(inputRef.current);
            if (/^\d+$/.test(inputRef.current)) {
                setInput(inputRef.current);
            }
            // Debounce logic
            typingTimerRef.current = setTimeout(() => {
                inputRef.current = '';
            }, debounceInterval);
        };
        const inputElement = inputRef.current;
        // // Add the event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(typingTimerRef.current);
        };
    }, [openModal]);
    

    useEffect(() => {
        if (openModal || keypadfocus) {
            setInputFocused(false); 
        }
    }, [openModal,keypadfocus]);

    const handleClickAddNew = () => {
        setModalContent(<BarcodeAddEditModal onConfirm={addBarcodeProductHandler} />)
        setOpenModal(true)
    }
    const handleClickSearch = () => {
        searchProduct(input);
    }
    useEffect(() => {
        handleClickSearch();
    }, [input])

    return (
        <div className="barcode-add-container">
            {/* <div> */}
                <input
                    name='input'
                    type="text"
                    placeholder="Enter Barcode"
                    value={input}
                    onFocus={(e) => setInputFocused(e.target.name)}
                    className="addBarcode-search_field"
                    readOnly
                    ref={inputRef} 
                />
                {/* <Button
                    item={"search"}
                    icon={faMagnifyingGlass}
                    handleClick={handleClickSearch}
                    style={{padding:"5px 5px",height:"100%"}}
                /> */}
            {/* </div> */}
            <Button
                item="Add New"
                handleClick={handleClickAddNew}
            />
            {inputFocused === "input" && (
                <DraggableNumpad
                    setInputFocused={setInputFocused}
                    searchTerm={input}
                    setSearchTerm={setInput}
                />
            )}

            {openModal && (
                <Modal isOpen={openModal} onClose={handleClose} width={width}>
                    {modalContent}
                </Modal>
            )}
        </div>
    )
}
