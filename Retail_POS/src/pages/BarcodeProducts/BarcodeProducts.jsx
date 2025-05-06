import './BarcodeProducts.css'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/Button/Button'
import BarcodeProductsTable from './BarcodeProductsTable.jsx/BarcodeProductsTable'
import { fetchBarcodeProducts } from '../../api/fetchBarcodeProducts'
import BarcodeSearch from './BarcodeAdd/BarcodeSearch'

export default function BarcodeProducts() {
  const navigate = useNavigate()
  const posData=  useSelector(state=>state.posData)
  const [barcodeProducts, setBarcodeProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [keypadfocus,setKeypadfocus]=useState("false")

  const fetchBarcodeProductHandler = async () => {
    try {
      // Simulating API call to fetch categories
      const res = await fetchBarcodeProducts(posData?.store?._id)
      setBarcodeProducts(res)
      setFilteredProducts(res)
    } catch (err) {
      console.error('Error fetching barcode barcodeProducts:', err)
    }
  }
 
  useEffect(() => {
    fetchBarcodeProductHandler()
  }, [posData])
  
  const searchProduct = (searchedBarcode) => {

    if (searchedBarcode.trim() === '') {
      setFilteredProducts(barcodeProducts); 
    } else {
      setFilteredProducts(barcodeProducts.filter(item => item.barcode.includes(searchedBarcode)));
    }
  }
  const handleBackClick = () => navigate("/retailpos");

  return (
    <div className="barcode-container">
      <div className="heading">
        <div className="barcode-heading-logo">
          <img src="images/logo_bh.png" alt="logo not found" />
        </div>
        <h1>MANAGE BARCODE PRODUCT</h1>
        <Button item="BACK TO POS" handleClick={handleBackClick} />
      </div>
      <div className="main-field">
      <BarcodeSearch keypadfocus={keypadfocus} searchProduct={searchProduct} fetchBarcodeProductHandler={fetchBarcodeProductHandler}/>
        <div className="table-field">
          <BarcodeProductsTable setKeypadfocus={setKeypadfocus}  barcodeProducts={filteredProducts} fetchBarcodeProductHandler={fetchBarcodeProductHandler}/>
        </div>
      </div>
    
    </div>
  )
}

