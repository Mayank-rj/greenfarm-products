import { useState, useEffect } from "react";
import Card from "../Card/Card";
import { useSelector } from "react-redux";
import { fetchProductBysid } from "../../api/fetchProductBysid";

const AllProductPage = () => {
  const [sortCriteria, setSortCriteria] = useState("popularity");
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState(64);
  const storeSliceData = useSelector(state => state.storeData);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetchProductBysid(storeSliceData.store?._id)
      const activeproduct = response;
      setAllProducts(activeproduct);
      setDisplayedProducts(activeproduct.slice(0, 64));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Sort products based on criteria
  const sortProducts = (products) => {
    switch (sortCriteria) {
      case "popularity":
        return products.sort((a, b) => b.rating - a.rating);
      case "highToLow":
        return products.sort((a, b) => b.sell_price - a.sell_price);
      case "lowToHigh":
        return products.sort((a, b) => a.sell_price - b.sell_price);
      case "aToZ":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case "zToA":
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case "%OffHighToLow":
        return products.sort((a, b) => b.discount - a.discount);
      default:
        return products;
    }
  };

  useEffect(() => {
    if(storeSliceData.store?._id){

      fetchProducts();
    }
  }, [storeSliceData.store?._id]);

  useEffect(() => {
    const sortedProducts = sortProducts([...allProducts]);
    setDisplayedProducts(sortedProducts.slice(0, productsToShow));
  }, [sortCriteria, allProducts, productsToShow]);

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleShowMore = () => {
    setProductsToShow((prev) => {
      const newCount = prev + 64;
      setDisplayedProducts(sortProducts([...allProducts]).slice(0, newCount));
      return newCount;
    });
  };


  return (
    <div className="lg:mx-[80px] mb-[100px]">
      {/* Filter functionality */}
      <div className="flex flex-wrap lg:flex-row lg:justify-end gap-2 lg:gap-4 px-3 pt-4">
        {/* Filter Buttons */}
        <p className="relative text-gray-800 py-[3px] px-[15px] rounded-md border-1 border-transparent transition-colors duration-300 focus:outline-none">
          Sort By:
        </p>
        {[
          "popularity",
          "highToLow",
          "lowToHigh",
          "aToZ",
          "zToA",
          "%OffHighToLow",
        ].map((criteria) => (
          <button
            key={criteria}
            onClick={() => handleSort(criteria)}
            className={`px-[5px] py-[1px] text-sm relative text-gray-800 rounded-md border-1 ${
              sortCriteria === criteria
                ? "border-red-700 text-red-700"
                : "border-transparent hover:border-red-700 hover:text-red-700"
            } transition-colors duration-300 focus:outline-none`}
          >
            {criteria.replace(/([A-Z])/g, " $1").toUpperCase()}
          </button>
        ))}
      </div>
      <p className="uppercase px-3 pt-4">All Products</p>
   
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
        {displayedProducts.map((item, index) => (
          <Card
            item={item}
            key={index}
            // title={item.name}
            // price={item.sell_price}
            // imageUrl={`${SITE_CONFIG.imageUrl}/${item.cover}`}
            // size={item.size}
            // images={item.images}
            // variations={item.variations}
            // category={item.category}
            // descriptions={item.descriptions}
          />
        ))}
      </div>

      {/* Show More Button */}
      {productsToShow < allProducts.length && (
        <div className="text-center mt-4 mb-16">
          <button
            onClick={handleShowMore}
            className="px-[15px] py-[8px] bg-red-700 text-white"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default AllProductPage;
