import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Pagination } from "swiper/modules";
import AccordionMenu from "./AccordionMenu/AccordionMenu"; // No changes made here
import Card from "../Card/Card";
import SITE_CONFIG from "../../../controller";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProductBySubId } from "../../api/fetchProductBySubId";
import { productByCatnStore } from "../../api/productByCatnStore";
import { fetchBanners } from "../../api/fetchBanners";

export const Catalogue = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [topBanners, setTopBanners] = useState([]);
  const subcategory = useSelector((state) => state.subcategory.selectedSubcategory);
  const [sortCriteria, setSortCriteria] = useState("popularity");
  const [subcategoryProduct, setSubcategoryProduct] = useState([]);
  const storeSliceData = useSelector((state) => state.storeData);
  const location = useLocation();
  const { itemData, categoryName } = location.state || {};

  // Retrieve cid and subcid from the URL query params
  const queryparam = new URLSearchParams(location.search);
  const cid = queryparam.get("cid");
  const subcid = queryparam.get("subcid");

  const [activeSubcategoryid, setActiveSubcategoryid] = useState(subcid || "0");
  const [activecategoryid, setActivecategoryid] = useState(cid || "0");

  const [categorydata, setcategorydata] = useState([]);

  const handleSubcategoryClick = async () => {
    try {
      if (cid && storeSliceData.store?._id && !subcid) {
        const res = await productByCatnStore(cid, storeSliceData.store?._id);
        const filteredProducts = res.filter((item) => item.status === "active");
        setSubcategoryProduct(filteredProducts);
      }
      if (subcid && storeSliceData.store?._id) {
        const res = await fetchProductBySubId(subcid, storeSliceData.store?._id);
        const filteredProducts = res.filter((item) => item.status === "active");
        setSubcategoryProduct(filteredProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err.response ? err.response.data : err.message);
    }
  };

  useEffect(() => {
    if (subcategory) {
      handleSubcategoryClick();
      setActiveSubcategoryid(subcategory.id);
    }
  }, [subcategory, storeSliceData.store?._id, subcid, cid]);
  useEffect(() => {
    if (storeSliceData.store?._id) {
      fetchTopBanners(storeSliceData.store?._id);
    }
  }, []);

  useEffect(() => {
    if (storeSliceData.store?._id) {
      fetchTopBanners(storeSliceData.store?._id);
    }
  }, [storeSliceData.store?._id]);


  useEffect(() => {
    const sortedProducts = sortProducts([...subcategoryProduct]);
    setSubcategoryProduct(sortedProducts);
  }, [sortCriteria]);

  const sortProducts = (products) => {
    const sortedProducts = [...products];
    switch (sortCriteria) {
      case "popularity":
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      case "highToLow":
        return sortedProducts.sort((a, b) => b.sell_price - a.sell_price);
      case "lowToHigh":
        return sortedProducts.sort((a, b) => a.sell_price - b.sell_price);
      case "aToZ":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "zToA":
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case "%OffHighToLow":
        return sortedProducts.sort((a, b) => b.discount - a.discount);
      default:
        return sortedProducts;
    }
  };

  const fetchTopBanners = async (storeId) => {
    try {
      const response = await fetchBanners(storeId);
      const banners = response.filter(
        (banner) => banner.position === "top" && banner.page === "catalogue"
      );
      setTopBanners(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
  };

  useEffect(() => {
    // When the URL parameters change, update the active category and subcategory
    if (cid) {
      setActivecategoryid(cid);
    }
    if (subcid) {
      setActiveSubcategoryid(subcid);
    }

    // Fetch the products when category or subcategory changes
    handleSubcategoryClick();
  }, [cid, subcid, storeSliceData.store?._id]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12 gap-5 lg:mx-[50px] lg:px-[15px]">
        {/*------------ Accordion Menu ----------------*/}
        <div className="col-span-3 hidden lg:inline-block">
          <AccordionMenu
            subcategory={subcategory}
            activeSubcategoryid={activeSubcategoryid}
            activecategoryid={activecategoryid}
            setActiveSubcategoryid={setActiveSubcategoryid}
            setActivecategoryid={setActivecategoryid}
            setSubcategoryProduct={setSubcategoryProduct}
          />
        </div>

        <div className="lg:col-span-9 mb-20 col-span-12">
          {/*------------ Slider ----------------*/}
          <div className="hidden lg:inline">
            <Swiper
              spaceBetween={30}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {topBanners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${SITE_CONFIG.imageUrl}/${banner.cover}`}
                    alt={`Banner ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Filter functionality */}
          <div className="flex flex-col lg:flex-row items-end lg:items-start lg:justify-end gap-4 p-4 my-[25px]">
            <div className="flex flex-wrap lg:flex-row gap-2 lg:gap-4">
              {/* Filter Buttons */}
              <p className="relative text-gray-800 py-[3px] px-[15px] rounded-md font-   border-1 border-transparent  transition-colors duration-300 focus:outline-none">
                Sort by:
              </p>
              {["popularity", "highToLow", "lowToHigh", "aToZ", "zToA", "%OffHighToLow"].map((criteria) => (
                <button
                  key={criteria}
                  onClick={() => handleSort(criteria)}
                  className={`px-[12px] py-[3px] text-sm relative text-gray-800 rounded-md border-1 border-transparent ${sortCriteria === criteria
                    ? "border-red-700 text-red-700"
                    : "hover:border-red-700 hover:text-red-700"
                    } transition-colors duration-300 focus:outline-none active:text-red-700`}
                >
                  <span className="absolute inset-0 border-1 border-transparent rounded-md transition-colors duration-300 group-hover:border-red-700 group-hover:text-red-700"></span>
                  {criteria.replace(/([A-Z])/g, " $1").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategoryProduct.length === 0 ? (
              <p className="text-center m-auto my-auto">No Product Available</p>
            ) : (
              subcategoryProduct.map((item) => (
                <Card key={item._id} item={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;