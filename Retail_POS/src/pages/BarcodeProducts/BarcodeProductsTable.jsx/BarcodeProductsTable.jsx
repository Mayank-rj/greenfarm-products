import { useState, useEffect } from 'react';
import './BarcodeProductsTable.css';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import { fetchCategory } from '../../../api/fetchCategory';
import BarcodeAddEditModal from '../BarcodeAddEditModal/BarcodeAddEditModal';
import { updateBarcodeProduct } from '../../../api/updateBarcode';
import { toast } from "react-toastify";
export default function BarcodeProductsTable({ barcodeProducts = [],fetchBarcodeProductHandler,setKeypadfocus }) {
  const width = { width: "80%" };
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [categories, setCategories] = useState([]);
  const tableHead = ['CATEGORY', 'PRODUCT NAME', 'BARCODE', 'PRICE', 'REMARK', 'STATUS', 'ACTION'];

  const handleClose = () => {
    setOpenModal(false);
    setModalContent(null);
    setKeypadfocus("false")
  };
  const updateBarcodeProductHandler = async (formData) => {
    try {
      // Simulating API call to fetch categories

      const res = await updateBarcodeProduct(formData)
      if (res.success) {
        fetchBarcodeProductHandler()
        handleClose();
        toast.success("Barcode Product Updated Successfully...");
      }
    } catch (err) {
      console.error('Error updating barcode product:', err)
      toast.error("Barcode Product Already Exists...");
    } 
    // finally {
    //   handleClose();
    // }
  }

  const handleClick = (data) => {
    setModalContent(<BarcodeAddEditModal data={data} onConfirm={updateBarcodeProductHandler} />); // Set the modal content to the product data
    setOpenModal(true);
    setKeypadfocus("true")
  };
  useEffect(() => {
    const fetchCategoriesHandler = async () => {
      const res = await fetchCategory();
      setCategories(res);
    }
    fetchCategoriesHandler();
  }, []);

  

  return (
    <div className="barcode-products-table-container">
      <table className="barcode-products-table">
        <thead>
          <tr>
            {tableHead.map((heading, index) => (
              <th key={index} >{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>

          {barcodeProducts.map((product) => (
            <tr key={product._id}>
              <td>{categories.find(item => item._id === product.category)?.name}</td>
              <td>{product.name}</td>
              <td>{product.barcode}</td>
              <td>${product.sell_price}</td>
              <td>{product.descriptions}</td>
              <td>{product.status}</td>
              <td>
                <Button
                  item="Edit"
                  style={{ width: '100%', zIndex: '' }}
                  handleClick={() => handleClick(product)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {openModal && (
        <Modal isOpen={openModal} onClose={handleClose} width={width}>
          {modalContent}
        </Modal>
      )}
      {barcodeProducts.length === 0 &&
        <div className='bg-white text-center p-4'>No barcode products found</div>
      }

    </div>
  );
}
