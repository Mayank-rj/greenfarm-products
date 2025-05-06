import { useState, useEffect, useRef } from "react";
import { FaMinus } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./SingleProduct.css";
import SITE_CONFIG from "../../../controller";
import { FaPlus } from "react-icons/fa";
import discountimg from "../../assets/discount.png";
import { useDispatch, useSelector } from "react-redux";
import { productByCatnStore } from "../../api/productByCatnStore";
import { fetchProductBySidnId } from "../../api/fetchProductBySidnId";
import {
  selectExistingItem,
  selectNewcartItemExists,
} from "../../slices/cart/newcartReducer";
import {
  newaddItemToCart,
  newremoveItemFromCart,
} from "../../slices/cart/cartActions";
import { toast } from "react-toastify";
const SingleProduct = () => {
  const { imageUrl } = SITE_CONFIG;
  const { productId, variationId } = useParams();
  // console.log(variationId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let current_path = location.pathname;
  const storeSliceData = useSelector((state) => state.storeData);
  const [exisitingCartItem, setExisitingCartItem] = useState({});
  const [itemExists, setItemExists] = useState(false);
  const { cart, error, loading } = useSelector((state) => state.newCart);
  const [productData, setproductData] = useState({});
  const [selectedImage, setSelectedImage] = useState(1);
  const [value, setValue] = useState(1);
  const [amount, setAmount] = useState(0);

  const [selectedVariationId, setSelectedVariationId] = useState(
    exisitingCartItem.variationId || ""
  );
  const [selectedVariation, setSelectedVariation] = useState({});
  const [localQuantity, setLocalQuantity] = useState(1);
  const [similarProductData, setSimilarProductData] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  let user = localStorage.getItem("User");
  let imagesArray = Array.isArray(productData?.images)
    ? productData?.images
    : JSON.parse(productData?.images || "[]");
  let imageC = [
    imageUrl + productData?.cover,
    ...imagesArray.map((item) => imageUrl + item),
  ];
  const validImages = imageC.filter((url) => url && !url.endsWith("/images/"));

  const handleImageClick = (imageIndex) => {
    setSelectedImage(imageIndex);
  };
  const handlesetSelectedVariationId = (event) => {
    const selected_Variation_Id = event.target.value;
    setSelectedVariationId(selected_Variation_Id);
    if (selected_Variation_Id) {
      navigate(
        `${SITE_CONFIG.linkPath}/product/${productId}/${selected_Variation_Id}`
      );
      // location.replace = `${SITE_CONFIG.linkPath}/product/${productId}/ ${selected_Variation_Id}`;
      // window.history.pushState(
      //   null,
      //   "",
      //   `${SITE_CONFIG.linkPath}/product/${productId}/${selected_Variation_Id}`
      // );
    } else {
      navigate(`${SITE_CONFIG.linkPath}/product/${productId}`);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetchProductBySidnId(
        storeSliceData.store?._id,
        productId
      );

      if (response.length) {
        setproductData(response[0]);
        fetchProductbycat(storeSliceData.store?._id, response[0]?.category);
      }
      else {
        setproductData([]);
      }
    } catch (error) {
      setproductData([]);
      console.error("Error fetching product data:", error);
    }
  };

  const fetchProductbycat = async (store, category) => {
    try {
      const response = await productByCatnStore(category, store);

      setSimilarProductData(response);
    } catch (e) {
      console.log("unable to fetch similar product:", e);
    }
  };

  useEffect(() => {
    if (similarProductData && productData?.category && productData?.name) {
      const filteredProducts = similarProductData.filter(
        (product) =>
          product.category === productData?.category &&
          product.name !== productData?.name
      );
      setSimilarProducts(filteredProducts);
    }
  }, [similarProductData, productData?.category]);

  useEffect(() => {
    if (storeSliceData.store?._id && productId) {
      fetchProductData();
    }
  }, [storeSliceData.store?._id, productId]);

  const checkCartItemQuantity = () => {
    if (itemExists) {
      if (exisitingCartItem.quantity > 1) {
        setLocalQuantity(exisitingCartItem.quantity);
      }
      if (exisitingCartItem.weight > 1) {
        setValue(exisitingCartItem.weight);
      }
    } else {
      setValue(1);
      setLocalQuantity(1);
    }
  };
  useEffect(() => {
    if (cart?.length !== 0) {
      checkCartItemQuantity();
    } else {
      setValue(1);
      setLocalQuantity(1);
    }
  }, [cart, exisitingCartItem]);

  const containerRef = useRef(null);

  const handleCategoryPageChange = (direction) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scrollAmount =
        direction === "next" ? containerWidth / 2 : -containerWidth / 2;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddCartItem = async () => {
    // let existingData = [...cart.product_details];
    const existingData = Array.isArray(cart?.product_details)
      ? cart?.product_details
      : [];
    // if (!user) {
    //   toast.error("Please login add item in cart");
    //  } else {//
    if (productData?.size === "novariations") {
      dispatch(
        newaddItemToCart(
          storeSliceData.store?._id,
          user,
          {
            product: productData?._id,
            weight: 0,
            quantity: localQuantity,
            price: amount,
            variationId: "",
          },
          existingData
        )
      );
    } else if (productData?.size === "slider") {
      dispatch(
        newaddItemToCart(
          storeSliceData.store?._id,
          user,
          {
            product: productData?._id,
            weight: value,
            quantity: localQuantity,
            price: amount,
            variationId: "",
          },
          existingData
        )
      );
    } else if (productData?.size === "variations") {
      dispatch(
        newaddItemToCart(
          storeSliceData.store?._id,
          user,
          {
            product: productData?._id,
            weight: 0,
            quantity: localQuantity,
            price: amount,
            variationId: selectedVariationId,
          },
          existingData
        )
      );
    }
    // }
  };
  const handleUpdateCartItem = async () => {
    handleAddCartItem();
    setValue(1);
    navigate(`${SITE_CONFIG.linkPath}/cart`);
  };

  const handleOnClick = (item) => {
    navigate(`${SITE_CONFIG.linkPath}/product/${item._id}`);
    checkCartItemQuantity();
  };

  const handleDecrease = () => {
    setLocalQuantity((prevQuantity) => {
      let newValue = prevQuantity;
      if (prevQuantity >= 1) {
        newValue -= 1;
        return newValue;
      } else {
        return newValue;
      }
    });
  };
  const handleIncrease = () => {
    setLocalQuantity((prevQuantity) => prevQuantity + 1);
  };

  const getBorderStyle = (imageIndex) => {
    if (selectedImage === imageIndex) {
      return "2px solid #be0500";
    }
    return "1px solid rgb(211, 211, 211)";
  };

  useEffect(() => {
    setSelectedImage(1);
  }, [productId]);

  useEffect(() => {
    const validPrice = productData?.sell_price;
    if (productData?.size === "novariations") {
      setAmount((validPrice * localQuantity).toFixed(2));
    } else if (productData?.size === "slider") {
      setAmount((value * validPrice * localQuantity).toFixed(2));
    } else if (productData?.size === "variations") {
      if (selectedVariationId !== "") {
        setAmount((selectedVariation?.sell_price * localQuantity).toFixed(2));
      } else {
        setAmount((validPrice * localQuantity).toFixed(2));
      }
    }
  }, [value, productData, selectedVariation, localQuantity]);
  useEffect(() => {
    if (localQuantity === 0) {
      if (exisitingCartItem) {
        dispatch(
          newremoveItemFromCart(
            storeSliceData.store?._id,
            user,
            productData?._id,
            selectedVariationId,
            [...cart.product_details]
          )
        );
      }
      setLocalQuantity(1);
    }
  }, [localQuantity]);

  useEffect(() => {
    setSelectedVariation(
      productData?.variations?.find((item) => item._id === selectedVariationId)
    );
  }, [selectedVariationId]);

  useEffect(() => {
    const result = cart?.product_details?.find(
      (item) =>
        item.product === productData?._id &&
        item.variationId === selectedVariationId
    );
    if (result) {
      setExisitingCartItem(result);
      if (variationId) setSelectedVariationId(variationId);
      setItemExists(true);
    } else {
      setExisitingCartItem({});
      setItemExists(false);
    }
  }, [cart, selectedVariationId, productData, variationId]);
  const isFirstRender = useRef(false);

  useEffect(() => {
    if (isFirstRender.current === false) {
      isFirstRender.current = true;
      return;
    }
    navigate(`${SITE_CONFIG.linkPath}`);
  }, [storeSliceData.store?._id]);

  if (Object.keys(productData).length === 0) {
    return (
      <div
        style={{
          color: "red",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        NO PRODUCT FOUND
      </div>
    );
  }

  return (
    <div className="lg:px-[15px] lg:mx-[33px]">
      <div className=" lg:mt-[30px] flex flex-col  bg-white ">
        {/* {-------Product main details------------} */}
        <div className="flex flex-col md:flex-row  ">
          <div className="flex flex-col-reverse md:flex-row  lg:px-[15px]">
            <div
              className=" grid grid-cols-7 md:grid-cols-1 gap-x-1 md:gap-x-0 md:gap-y-1 md:grid-rows-7 md:h-auto w-[490px]   md:w-auto overflow-hidden md:max-h-[490px] ml-[15px] md:ml-0
            mt-[15px] md:mt-0 md:mb-[10px] md:justify-items-end"
              style={{ scrollbarWidth: "thin" }}
            >
              {Array.isArray(validImages) &&
                validImages.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    alt={`Product Image ${index + 1}`}
                    className="mr-[20px] h-[65px] w-[65px] col-span-1 md:mr-0 md:mb-[20px] p-1 bg-cover rounded-md"
                    style={{ border: getBorderStyle(index + 1) }}
                    onClick={() => {
                      handleImageClick(index + 1);
                    }}
                  />
                ))}
            </div>

            <div className="flex flex-col px-[15px] relative ">
              <img
                src={validImages[selectedImage - 1]}
                alt="Product Image"
                className="w-[490px] h-[490px] object-cover"
              />
              {productData?.discount !== 0 &&
                productData?.discount !== null && (
                  <div
                    style={{ color: "rgb(128,128,128)" }}
                    className="absolute top-[20px] left-[20px] flex items-center justify-center p-[5px] "
                  >
                    <img src={discountimg} className="h-16 w-16 relative" />
                    <p className=" absolute flex  flex-col items-center justify-center gap-[2px]  w-[35px]  rounded-md shadow-2xl text-sm shadow-white text-white ">
                      {productData?.discount} %<span>OFF</span>
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div
            style={{
              color: "rgb(33, 37, 41)",
              lineHeight: "30px",
            }}
            className="  flex flex-col text-left  px-[15px] lg:px-[0] text-base mb-[16px]"
          >
            <h1
              style={{ fontSize: "20px" }}
              className="font-bold uppercase mb-[16px] pt-[5px]"
            >
              {productData?.name}
            </h1>

            {/* Conditional message for stock status */}
            <div className="">
              <p
                style={{
                  color: !productData?.in_stock
                    ? "rgb(248,59,83)"
                    : "rgb(0,161,0)",
                  fontSize: "16px",
                }}
                className="font-bold my-[5px]"
              >
                {!productData?.in_stock ? "Out of Stock" : "In Stock"}
              </p>
            </div>

            {(productData?.size === "novariations" ||
              productData?.size === "slider") && (
                <>
                  <div
                    style={{
                      color: "rgb(248,59,83)",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                    className="mb-[10px]"
                  >
                    {productData?.discount !== 0 &&
                      productData?.discount !== null ? (
                      <div>
                        <p className={`mb-2`}>
                          Price:
                          <span className="lg:mx-2 line-through">
                            ${productData?.original_price?.toFixed(2)} /{" "}
                            {productData?.unit}
                          </span>{" "}
                          <span className="lg:ml-2">
                            Price: $
                            {selectedVariationId
                              ? productData?.variations
                                ?.find(
                                  (variation) =>
                                    variation._id === selectedVariationId
                                )
                                ?.sell_price?.toFixed(2)
                              : productData?.sell_price?.toFixed(2)}{" "}
                            / {productData?.unit}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className={`text-red-500 text-lg font-bold mb-2`}>
                        Price: $
                        {selectedVariationId
                          ? productData?.variations
                            ?.find(
                              (variation) =>
                                variation._id === selectedVariationId
                            )
                            ?.sell_price?.toFixed(2)
                          : productData?.sell_price?.toFixed(2)}{" "}
                        / {productData?.unit}
                      </p>
                    )}
                  </div>

                  {productData?.discount !== 0 &&
                    productData?.discount !== null && (
                      <p
                        style={{
                          color: "rgb(248,59,83)",
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                        className="font-semibold mb-[10px]"
                      >
                        You Save :{" "}
                        <span
                          style={{
                            color: "rgb(0,161,0)",
                            marginRight: "10px",
                          }}
                        >
                          {productData?.discount}%
                        </span>{" "}
                        Inclusive of all taxes
                      </p>
                    )}
                </>
              )}

            <div className="flex flex-col items-left lg:w-[420px]   ">
              <div className="relative pt-1 w-full mb-[20px] pr-[20px] ">
                {productData?.size === "novariations" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="controlButton"
                        onClick={handleDecrease}
                      >
                        <FaMinus />
                      </button>
                      <span className="controlCount">{localQuantity}</span>
                      <button
                        className="controlButton"
                        onClick={handleIncrease}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </>
                )}

                {productData?.size === "slider" && (
                  <div className="slider-wrapper ">
                    <div className=" flex justify-between w-[90%] ">
                      {value >= 1 ? <span className="">0</span> : <span></span>}
                      <div
                        className="slider-value"
                        style={{
                          // ! CHECK
                          left: `calc(${((value - -2) * 100) / 19}% - 12px)`,
                        }}
                      >
                        {value} {productData?.unit}
                      </div>
                      {value <= 13 ? (
                        <span className="">15</span>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="15"
                      step="0.1"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="slider-range h-1"
                      style={{
                        "--slider-progress": `${((value - 0) * 100) / 15}%`,
                      }}
                    />
                    <p
                      style={{
                        color: "rgb(0,128,0)",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                      className="font-semibold mb-[20px]"
                    >
                      Amount :{" "}
                      <span
                        style={{
                          color: "rgb(0,161,0)",
                        }}
                        className="font-normal"
                      >
                        {" "}
                        ${(Number(productData?.sell_price) * value).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}

                {productData?.size === "variations" && (
                  <div className="options-wrapper">
                    <div
                      style={{
                        color: "rgb(248,59,83)",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                      className="mb-[10px]"
                    >
                      {/* Check if a variation is selected */}
                      {selectedVariationId ? (
                        // Variation selected, check for discount on variation
                        <div>
                          {productData?.variations?.find(
                            (variation) => variation._id === selectedVariationId
                          )?.discount !== 0 &&
                            productData?.variations?.find(
                              (variation) => variation._id === selectedVariationId
                            )?.discount !== null ? (
                            <p className="mb-2">
                              Price:
                              <span className="lg:mx-2 line-through">
                                $
                                {productData?.variations
                                  ?.find(
                                    (variation) =>
                                      variation._id === selectedVariationId
                                  )
                                  ?.original_price?.toFixed(2)}{" "}
                                / {productData?.unit}
                              </span>{" "}
                              <span className="lg:ml-2">
                                Price: $
                                {productData?.variations
                                  ?.find(
                                    (variation) =>
                                      variation._id === selectedVariationId
                                  )
                                  ?.sell_price?.toFixed(2)}{" "}
                                / {productData?.unit}
                              </span>
                            </p>
                          ) : (
                            <p className="text-red-500 text-lg font-bold mb-2">
                              Price: $
                              {productData?.variations
                                ?.find(
                                  (variation) =>
                                    variation._id === selectedVariationId
                                )
                                ?.sell_price?.toFixed(2)}{" "}
                              / {productData?.unit}
                            </p>
                          )}
                        </div>
                      ) : // No variation selected, check for discount on the normal product price
                        productData?.discount !== 0 &&
                          productData?.discount !== null ? (
                          <div>
                            <p className="mb-2">
                              Price:
                              <span className="lg:mx-2 line-through">
                                ${productData?.original_price?.toFixed(2)} /{" "}
                                {productData?.unit}
                              </span>{" "}
                              <span className="lg:ml-2">
                                Price: ${productData?.sell_price?.toFixed(2)} /{" "}
                                {productData?.unit}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <p className="text-red-500 text-lg font-bold mb-2">
                            Price: ${productData?.sell_price?.toFixed(2)} /{" "}
                            {productData?.unit}
                          </p>
                        )}
                    </div>

                    <select
                      id="underline_select"
                      className="border border-gray-300 text-sm w-full h-8"
                      value={selectedVariationId}
                      onChange={handlesetSelectedVariationId}
                    >
                      <option value={""}>Select Variation</option>
                      {productData?.variations.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item?.name} - ${item?.sell_price.toFixed(2)}
                        </option>
                      ))}
                    </select>

                    <div className="quantity-controls mt-3 justify-start-important">
                      <button
                        className="quantity-controls-button"
                        onClick={handleDecrease}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-controls-count">
                        {localQuantity}
                      </span>
                      <button
                        className="quantity-controls-button"
                        onClick={handleIncrease}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {itemExists && (
              <h2
                style={{ fontSize: "16px", height: "24px" }}
                className="font-bold mb-[20px]"
              >
                Added to The Cart
              </h2>
            )}
            {productData?.in_stock && productData?.sell_price !== "0.00" && (
              <button
                style={{
                  background: "#be0500",
                  padding: "5px",
                  width: "160px",
                }}
                className="flex items-center w-1/2 rounded mb-[10px] text-left"
              >
                {/* Combined Text Label and + Symbol */}
                <span
                  className="text-base text-white flex items-center justify-between pl-[10px]"
                  style={{ width: "160px" }}
                  onClick={
                    itemExists ? handleUpdateCartItem : handleAddCartItem
                  }
                >
                  {itemExists ? (
                    <>Update the Cart</>
                  ) : (
                    <>
                      Add to Cart
                      <div
                        style={{ background: "rgba(255,255,255,0.3)" }}
                        className="flex items-center justify-center w-8 h-6 text-white rounded-full ml-2"
                      >
                        <span className="text-lg font-bold h-7 lg:h-8">+</span>
                      </div>
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* {-------Product description------------} */}
        <div
          style={{
            color: "rgb(33, 37, 41)",
            borderTop: "1px solid rgb(211, 211, 211)",
            borderBottom: "1px solid rgb(211, 211, 211)",
          }}
          className="px-[15px] lg:px-0 py-[20px]"
        >
          <h2
            style={{ fontSize: "16px", height: "24px" }}
            className="font-bold"
          >
            Descriptions
          </h2>
          <p
            style={{ fontSize: "14px", fontWeight: "400" }}
            className="ml-[40px]"
          >
            {productData?.descriptions}
          </p>
        </div>

        {/* {-------You May Also Like -----------} */}
        <div className="relative px-[15px] lg:px-0 py-[20px] mt-6 flex flex-col md:flex-row gap-4 mb-10">
          {/* Grid for larger screens */}
          <div className="hidden lg:flex flex-col w-full">
            <h3 className="text-[16px] h-[24px] font-bold mb-[20px]">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
              {similarProducts.map((item, index) => (
                <Link
                  key={index}
                  onClick={() => handleOnClick(item)}
                  className="relative flex flex-col items-center text-center group mb-7"
                >
                  <img
                    src={`${SITE_CONFIG.imageUrl}/${item.cover}`}
                    alt={item.name}
                    className="w-full h-[190px] object-cover transition-transform duration-300 ease-in-out"
                  />
                  <p
                    className="absolute bottom-0 left-0 w-full text-center items-center uppercase transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 hover:bg-white "
                    style={{
                      height: "15%",
                      color: "rgb(108, 117, 125)",
                      background: "white",
                      fontSize: "16px",
                      fontWeight: "400px",
                    }}
                  >
                    {item.name}
                  </p>
                  {!item.in_stock && (
                    <div
                      style={{ color: "rgb(128,128,128)" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <p className="h-[26px] flex items-center justify-center w-[80px] lg:w-[180px] rounded-md shadow-2xl text-xs shadow-white border border-[rgb(128,128,128)] bg-white">
                        Out of stock
                      </p>
                    </div>
                  )}
                  {item.discount !== 0 && item.discount !== null && (
                    <div
                      style={{ color: "rgb(128,128,128)" }}
                      className=" absolute top-[10px] left-[10px] flex items-center justify-center p-[5px] "
                    >
                      <p className=" h-[22px] flex items-center justify-center gap-[2px]  w-[35px]  rounded-md shadow-2xl text-xs shadow-white text-white border border-[rgb(128,128,128)] bg-orange-500">
                        {item.discount}
                        <span>%</span>
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Carousel for mobile view */}

          <div className="lg:hidden relative">
            <h3 className="text-[16px] h-[24px] font-bold mb-[20px]">
              You May Also Like
            </h3>
            <div className="relative flex items-center">
              <button
                style={{ color: "rgb(222, 226, 230)" }}
                className="absolute left-5 top-1/2 transform -translate-y-1/2  rounded-full z-10"
                onClick={() => handleCategoryPageChange("prev")}
                aria-label="Previous Slide"
              >
                &#10094;
              </button>
              <div
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                ref={containerRef}
              >
                {similarProducts.map((item, index) => (
                  <Link
                    key={index}
                    className="flex-shrink-0 w-[50%] p-2 snap-start"
                    onClick={() => handleOnClick(item)}
                  >
                    <div className="relative">
                      <img
                        src={`${SITE_CONFIG.imageUrl}/${item.cover}`}
                        alt={item.name}
                        className="w-full h-[190px] object-cover transition-transform duration-300 ease-in-out"
                      />
                      {!item.in_stock && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <p className="h-[26px] flex items-center justify-center w-[100px] md:w-[180px] lg:w-[140px] rounded-md shadow-2xl text-xs shadow-white border border-[rgb(128,128,128)] bg-white">
                            Out of stock
                          </p>
                        </div>
                      )}
                      {item.discount !== 0 && item.discount !== null && (
                        <div className="absolute top-[10px] left-[10px] flex items-center justify-center p-[5px]">
                          <p className="h-[22px] flex items-center justify-center gap-[2px] w-[35px] rounded-md shadow-2xl text-xs shadow-white text-white border border-[rgb(128,128,128)] bg-orange-500">
                            {item.discount}
                            <span>%</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <button
                style={{ color: "rgb(222, 226, 230)" }}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 rounded-full z-10"
                onClick={() => handleCategoryPageChange("next")}
                aria-label="Next Slide"
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleProduct;
