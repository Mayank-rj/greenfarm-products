import { lazy, Suspense, useEffect, useState } from 'react'
import { fetchProductsByCid } from '../../api/fetchProductsByCid'
import logo from '../../assets/images/maskable-icon.png'
const ProductCard = lazy(() => import('./ProductCard'))
import { useDispatch, useSelector } from 'react-redux'
import './Products.css'
import SITE_CONFIG from '../../../controller'
import { toast } from 'react-toastify'
import { showOrder } from '../../feature/displayOrderSlice'
import { v4 as uuidv4 } from 'uuid';
const Products = () => {
  const dispatch = useDispatch();
  const { imageUrl } = SITE_CONFIG;
  const categoryId = useSelector((state) => state.manageCategory.id);
  const { webOrder, orders } = useSelector((state) => state.footer);
  const posData=  useSelector(state=>state.posData)
  const weight = useSelector((state) => state.weight)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const getProducts = async () => {
    if (categoryId) {
      if(!posData?.store?._id){
        toast.error("Store Data is missing. Please Connect the driver")
        return;
      }
      try {
        setLoading(true);
        const res = await fetchProductsByCid(categoryId,posData?.store?._id);
        const filteredProducts = res.filter(product => product.status === 'active');
        setProducts(filteredProducts);
      } catch (error) {
        setProducts([])
        console.error(error);
        if (error.response.data) {
          toast.error(error?.response?.data?.message)
        } else {
          toast.error("Unexpected Error Occured")
        }

      } finally {
        setLoading(false);
      }
    }
  };
  // const weight = 1
  const handleProductCardClick = (item) => {
    // console.log(item);

    if (item.size === 'variations' || item.size === 'novariations' || (item.size === 'slider' && weight !== 0)) {
      dispatch(
        showOrder({
          name: item.name,
          weight: (item.size === 'variations' || item.size === 'novariations') ? 0 : weight,
          id: item._id,
          price: item.sell_price,
          size: item.size,
          quantity: 1,
          uniqueId: uuidv4(),
          product: item
        })
      );
    }
    // console.log(item);

  }

  useEffect(() => {
    if (categoryId) {
      getProducts();
    }
  }, [categoryId]);

  if(products.length === 0){
    return(
      <div className='product-container flex items-center justify-center'>
       { categoryId === "" ? (
        <img src={logo} alt="logo" />
      ):
        <h1 className='text-gray-400 uppercase font-extrabold text-5xl'>No Products Found</h1>
      } 
      </div>
    )
  }
  return (
    <div className="product-container">
      {categoryId === "" ? (
        <img src={logo} alt="logo" />
      ) : (
        <div className="product-inner-container">
          {loading ? (
            <div className="flex justify-center items-center w-full h-full">
              <div className="w-16 h-16 rounded-full animate-spin text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#36b734" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12a9 9 0 11-6.219-8.56"></path> </g></svg>
              </div>
            </div>
          ) : (
            products.map((item, i) => (
              <Suspense key={i} fallback={<div>Loading...</div>}>
                <ProductCard
                  img={`${imageUrl}${item.cover}`}
                  item={item.name}
                  price={item.sell_price.toFixed(2)}
                  handleClick={() => handleProductCardClick(item)}
                  disabled={webOrder || orders}
                />
              </Suspense>
            ))
          )}
        </div>

      )}
    </div>
  )
}

export default Products;
