import { useEffect, useRef } from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import { AiOutlineSearch } from "react-icons/ai";
import {
  FaUser,
  FaShoppingCart,
  FaHome,
  FaLocationArrow,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { MdArrowDropDown, MdEmail } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import SITE_CONFIG from "../../controller";
import Login from "./Login/Login";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "./PopUp/PopUp";
import { setSubcategory } from "../slices/subcategoryslice";
import { fetchStore } from "../api/fetchStore";
import { fetchProductBysid } from "../api/fetchProductBysid";
import { fetchSubCatBySidnCid } from "../api/fetchSubCatBySidnCid";
import { fetchMenu } from "../api/fetchMenu";
import { token } from "../api/verifytoken";
import { fetchCartDetails } from "../slices/cart/cartActions";
import { selectNewCartItemCount } from "../slices/cart/newcartReducer";
import { getStoreById } from "../api/getStoreById";
import { removeStoreSliceData, setStoreSliceData } from "../slices/storedata";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [islogin, setIslogin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openStoreDropdown, setOpenStoreDropdown] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [titles, setTitles] = useState({});
  const [storeData, setStoreData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const cartItemCount = useSelector(selectNewCartItemCount);
  const storeSliceData = useSelector((state) => state.storeData);
  const [dropdowns, setDropdowns] = useState([]);

  let auth = localStorage.getItem("AuthToken");
  let user = localStorage.getItem("User");

  useEffect(() => {
    if (auth && user) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  }, []);

  const handleDropdownToggle = () => {
    let localAuthToken = localStorage.getItem("AuthToken");
    if (localAuthToken) {
      setIsDropdownOpen(!isDropdownOpen);
    }
    else {
      setIslogin(false);
      localStorage.removeItem("AuthToken");
      localStorage.removeItem("User");
    }
  };
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleNavigation = (path) => {
    // if (islogin) {
    navigate(path);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    // } else {
    // setOpenLogin(true);
    // }
  };
  const localStoreId = localStorage.getItem("localStoreId");

  const handleStoreChange = (data) => {
    localStorage.setItem("localStoreId", data._id);
    dispatch(setStoreSliceData({ ...data }));
    setOpenStoreDropdown(false);
    // navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await fetchStore();
        setStoreData(storeResponse);
        if (storeSliceData.store?._id) {
          const categoriesResponse = await fetchMenu(storeSliceData.store?._id);

          const categories = categoriesResponse[0]?.subMenu;

          const subcategoryPromises = categories?.map((category) =>
            fetchSubCatBySidnCid(category._id, storeSliceData.store?._id)
          );
          if (subcategoryPromises) {
            const subcategoryResponses = await Promise.all(subcategoryPromises);

            const dropdownsData = [];

            categories.forEach((category, index) => {
              const subcategories = subcategoryResponses[index].filter(
                (item) => item.status === "active"
              );
              dropdownsData.push({
                id: category._id,
                title: category.name,
                items: subcategories.map((sub) => ({
                  text: sub.name,
                  index: sub._id,
                  href: `${SITE_CONFIG.linkPath}/catalogue?cid=${category._id}&subcid=${sub._id}`,
                })),
              });
            });
            setDropdowns(dropdownsData);

            const initialTitles = {};
            dropdownsData.forEach((dropdown) => {
              initialTitles[dropdown.id] = dropdown.title;
            });
            // console.log(initialTitles);
            setTitles(initialTitles);
          }
        } else {
          setDropdowns([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    // if(storeSliceData.store?._id){
    fetchData();
    // }
  }, [storeSliceData.store?._id, location]);

  const handleLinkClick = (event, item, dropdownId, categoryName) => {
    event.preventDefault();
    dispatch(
      setSubcategory({
        id: item.index,
        category: categoryName,
      })
    );
    setOpenDropdown(null);
    navigate(item.href, {
      state: {
        itemData: item,
        dropdownId,
        categoryName,
      },
    });
  };

  useEffect(() => {
    if (storeSliceData.store?._id) {
      if (user) {
        dispatch(fetchCartDetails(storeSliceData.store?._id, user));
      } else {
        dispatch(fetchCartDetails(storeSliceData.store?._id, null));
      }
    }
  }, [storeSliceData.store?._id, user]);

  const Dropdown = ({ items, dropdownId, categoryName }) => (
    <div className="absolute right-0 min-w-48 mt-2 z-50 origin-top-right bg-black text-white text-sm font-thin">
      {items.map((item, index) => (
        <div
          key={index}
          className="block p-2 text-white hover:bg-[rgb(117,117,117)]"
          onClick={(e) => handleLinkClick(e, item, dropdownId, categoryName)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );

  const activeStore = storeData.filter((method) => method.status === "active");
  const StoreDropDown = () => (
    <div className="absolute right-0 min-w-48 mt-2 z-50 origin-top-right bg-black text-white text-sm font-thin">
      {activeStore &&
        activeStore.map((item, index) => (
          <Link
            key={index}
            className="block p-2 text-white"
            onClick={() => handleStoreChange(item)}
          >
            {item.name}
          </Link>
        ))}
    </div>
  );
  const handleLogin = () => {
    setOpenLogin(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("AuthToken");
    localStorage.removeItem("User");
    navigate(`${SITE_CONFIG.linkPath}/home`);
    window.location.reload();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchProductBysid(storeSliceData.store?._id);
        if (response) {
          setAllProducts(response.filter((item) => item.status === "active"));

          setFilteredData(response.filter((item) => item.status === "active"));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    if (storeSliceData.store?._id) {
      fetchProducts();
    }
  }, [storeSliceData.store?._id]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(allProducts);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const properties = [
      "name",
      "type",
      "brand",
      "category",
      "author",
      "description",
      "gender",
    ];

    const newFilteredData = allProducts.filter((item) =>
      properties.some(
        (prop) =>
          item[prop] && item[prop].toLowerCase().includes(searchTermLower)
      )
    );
    setFilteredData(newFilteredData);
  }, [searchTerm, allProducts]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOnClick = (products) => {
    // localStorage.setItem("productData", JSON.stringify(products));
    // console.log(products);

    setIsVisible(false);
    setSearchTerm("");
    navigate(`${SITE_CONFIG.linkPath}/product/${products._id}`);
  };

  const handlePrivatePage = (e) => {
    if (islogin) {
      navigate(`${SITE_CONFIG.linkPath}/${e.target.name}`);
    } else {
      setOpenLogin(true);
    }
    setIsMenuOpen(false);
  };

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef([]);
  const dropdownRef3 = useRef(null);
  const dropdownOptionsRef = useRef(null);
  const searchRef = useRef(null);

  const handleClickOutsideOrScroll = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideOrScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOrScroll);
    };
  }, []);

  const searchBarClose = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", searchBarClose);

    return () => {
      document.removeEventListener("mousedown", searchBarClose);
    };
  }, []);

  const handleClickOutsideOrScroll2 = (event) => {
    const isClickInsideDropdowns = dropdownRef2.current.some((ref) =>
      ref?.contains(event.target)
    );

    if (!isClickInsideDropdowns) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideOrScroll2);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOrScroll2);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      dropdownRef3.current &&
      !dropdownRef3.current.contains(event.target) &&
      dropdownOptionsRef.current &&
      !dropdownOptionsRef.current.contains(event.target)
    ) {
      setOpenStoreDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      // Get the token from localStorage
      if (auth) {
        try {
          await token(auth); // Call the token verification function
          // console.log("Token verified successfully.");
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("authToken"); // Clear token if invalid
          handleLogout();
        }
      } else {
        setIslogin(false);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    const store_id = localStorage.getItem("localStoreId");
    if (store_id) {
      const fetchStoreById = async () => {
        try {
          const response = await getStoreById(store_id);
          dispatch(setStoreSliceData({ ...response }));
        } catch (error) {
          // console.log(error)
          dispatch(removeStoreSliceData());
          localStorage.removeItem("localStoreId");
        }
      };

      fetchStoreById();
    }
  }, []);

  return (
    <>
      {!localStoreId && (
        <PopUp storeData={activeStore} handleStoreChange={handleStoreChange} />
      )}

      <Login
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        setIslogin={setIslogin}
      />

      <nav
        style={{ background: "#b91C1C" }}
        className=" no-scrollbar  lg:bg-gray-100 fixed z-30 w-full "
      >
        <div className="lg:bg-gray-100  h-[58px] lg:h-[70px] mx-auto flex items-center justify-between lg:justify-evenly px-[12px] lg:px-[40px] gap-20  ">
          {/* Toggle Icon for Mobile View */}
          <button
            className="lg:hidden p-2 text-white lg:text-black"
            onClick={handleMenuToggle}
          >
            <MdMenu className="text-xl" />
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-0 left-0 w-full h-screen p-[20px] z-10  bg-gray-100 shadow-lg divide-y divide-gray-200">
              <div className="text-base ">
                <button
                  className=" text-gray-600 hover:text-gray-800 h-[20px] w-[20px] mb-[20px]"
                  onClick={handleMenuToggle}
                >
                  <RxCross1 className="text-xl" />
                </button>
                <Link
                  to={`${SITE_CONFIG.linkPath}/home`}
                  className=" flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome />
                  Home
                </Link>
                {/* <Link
                  name="profile"
                  className=" flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={handlePrivatePage}
                >
                  <MdAccountCircle />
                  Profile
                </Link> */}
                <Link
                  to={`${SITE_CONFIG.linkPath}/orders`}
                  name="orders"
                  className="flex items-center gap-2 p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={handlePrivatePage}
                >
                  <FaClipboardList />
                  Orders
                </Link>
                <Link
                  to={`${SITE_CONFIG.linkPath}/address`}
                  name="address"
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={handlePrivatePage}
                >
                  <FaLocationArrow />
                  Address
                </Link>
                {/* <Link
                  to="/"
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaLanguage />
                  Language
                </Link> */}
                <Link
                  to={`${SITE_CONFIG.linkPath}/contact`}
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MdEmail />
                  Contact Us
                </Link>
                {/* <Link
                  to="/"
                  className="flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <RiInformation2Fill />
                  About
                </Link> */}

                {islogin ? (
                  <Link
                    className="cursor-pointer flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    Logout
                  </Link>
                ) : (
                  <Link
                    className="cursor-pointer flex items-center gap-2  p-[10px] text-gray-800 hover:bg-gray-200"
                    onClick={handleLogin}
                  >
                    <FaUser />
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 ">
            <Link to={`${SITE_CONFIG.linkPath}/home`}>
              <img
                src={logo}
                alt="Logo"
                className="h-[38px] lg:h-[60px] lg:pl-[55px]"
              />
            </Link>
          </div>

          {/* Search Form */}
          <div className="flex-grow h-[40px] hidden lg:flex lg:justify-center ">
            <form ref={searchRef} className="relative">
              <input
                type="search"
                placeholder="Search for products"
                className="form-input block min-w-[420px] px-3 py-1 h-[40px] rounded-md placeholder-gray-500 sm:text-sm pr-10" // Add padding to accommodate the icon
                value={searchTerm}
                onChange={handleSearch}
                onClick={() => setIsVisible(true)}
              />
              <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchTerm.length > 0 && isVisible && (
                <div className="absolute top-10 -left-3 w-[350px] bg-white sm:w-[400px] md:w-[600px] overflow-y-auto max-h-[500px] z-50 shadow-2xl border-spacing-8">
                  <div className="space-y-0">
                    {filteredData.length === 0 ? (
                      <h6 className="flex justify-start gap-2 items-center text-sm max-h-[500px] p-2 px-4 border-b border-gray-200">
                        Product Not Found
                      </h6>
                    ) : (
                      filteredData.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleOnClick(product)}
                          className="block cursor-pointer"
                        >
                          <div className="flex justify-start gap-2 items-center max-h-[500px] p-2 px-4 border-b border-gray-200">
                            <img
                              src={`${SITE_CONFIG.imageUrl}${product.cover}`}
                              alt={product.name}
                              className="w-4 h-4"
                            />
                            <p className="text-sm">
                              {product.name.slice(0, 35)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Account and Cart Links */}
          <div className="flex items-center  text-sm font-normal text-black gap-1 ">
            <div className="relative">
              <button type="button" className="inline-flex items-center gap-2 ">
                {islogin ? (
                  <a
                    className="inline-flex items-center gap-2"
                    onClick={handleDropdownToggle}
                  >
                    <FaUser
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`${SITE_CONFIG.linkPath}/profile`);
                      }}
                      className="text-base text-white inline lg:hidden"
                    />
                    <FaUser className=" text-black lg:text-black hidden lg:inline" />
                    <p className="hidden lg:inline">Account</p>
                    <MdArrowDropDown className=" hidden lg:inline" />
                  </a>
                ) : (
                  <a
                    className="inline-flex items-center gap-2  lg:text-black"
                    onClick={handleLogin}
                  >
                    <FaUser
                      onClick={handleLogin}
                      className="text-base text-white inline lg:hidden"
                    />
                    <FaUser className="text-black lg:text-black hidden lg:inline" />
                    <p className="hidden lg:inline">Login/Register</p>
                  </a>
                )}
              </button>

              {/* Dropdown Menu */}
              {islogin && (
                <div
                  ref={dropdownRef}
                  className={`absolute right-0 w-48 mt-2 z-10 origin-top-right bg-black divide-y shadow-lg ring-1 ring-black ring-opacity-5 text-white ${isDropdownOpen ? "block" : "hidden"
                    }`}
                >
                  <div className="p-1">
                    <div
                      onClick={() =>
                        handleNavigation(`${SITE_CONFIG.basePath}/profile`)
                      }
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Settings
                    </div>
                    <div
                      onClick={() =>
                        handleNavigation(`${SITE_CONFIG.basePath}/orders`)
                      }
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Orders
                    </div>
                    <hr className="my-1 border-gray-200" />
                    <div
                      onClick={() =>
                        handleNavigation(`${SITE_CONFIG.basePath}/address`)
                      }
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Address
                    </div>
                    <a
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    >
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Button for big screens (bove 1024px) */}
            <Link to={`${SITE_CONFIG.linkPath}/cart`} className="lg:pr-[40px]">
              <button className="hidden lg:inline-flex items-center gap-2 text-black relative p-2  ">
                <span>
                  <FaShoppingCart />
                </span>
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute top-0 left-0 bg-red-500 text-light rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Button for small screens (below 1024px) */}
            <Link to={`${SITE_CONFIG.linkPath}/cart`}>
              <button className="inline-flex  lg:hidden items-center relative text-white">
                <span className="text-base ">
                  <FaShoppingCart />
                </span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-black text-white rounded-full text-xs w-[14px] h-[14px] flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        {/* Search the products for mobile view */}
        <div className="bg-white  h-[40px]  text-base lg:hidden text-black">
          <form className="relative">
            <input
              type="search"
              placeholder="Search for products"
              className="form-input block min-w-[460px] px-3 py-1 h-[40px] rounded-md placeholder-gray-500 sm:text-sm pr-8"
              value={searchTerm}
              onChange={handleSearch}
              onClick={() => setIsVisible(true)}
            />
            <AiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

            {searchTerm.length > 0 && isVisible && (
              <div className=" absolute top-10  w-[360px] bg-white sm:w-[400px] md:w-[600px] overflow-y-auto max-h-[600px] z-50 shadow-2xl border-spacing-8">
                <div className="space-y-0">
                  {filteredData.length === 0 ? (
                    <h6 className="flex justify-start gap-2 items-center text-sm max-h-[500px] p-2 px-4 border-b border-gray-200">
                      Product Not Found
                    </h6>
                  ) : (
                    filteredData.map((products) => (
                      <div
                        key={products._id}
                        onClick={() => handleOnClick(products)}
                        className="block cursor-pointer"
                      >
                        <div className="flex justify-start gap-2 items-center max-h-[500px] p-2 px-4 border-b border-gray-200">
                          <img
                            src={`${SITE_CONFIG.imageUrl}${products.cover}`}
                            alt={products.name}
                            className="w-4 h-4"
                          />
                          <p className="text-sm">
                            {products.name.slice(0, 35)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* store selection */}
        <div
          className="hidden bg-gray-100 lg:bg-custom-red h-[50px] w-[100vw] relative  lg:grid grid-cols-12 text-white mx-auto  text-base px-[40px]" /*onClick={()=> setOpenStoreDropdown(false)}*/
        >
          <div className="col-span-3 flex items-center justify-center">
            <div className="relative " ref={dropdownRef3}>
              <button
                className="flex items-center gap-2 text-sm font-thin"
                onClick={() => setOpenStoreDropdown((prev) => !prev)}
              >
                <FaLocationDot />
                {!storeSliceData.isEmpty
                  ? storeSliceData.store?.name?.slice(0, 40)
                  : "Select Store"}
                <MdArrowDropDown />
              </button>
              {openStoreDropdown && (
                <div
                  className="absolute w-[300px] mt-2 z-50 origin-top-right bg-black text-white text-sm font-thin"
                  onClick={(e) => e.stopPropagation()}
                  ref={dropdownRef3}
                >
                  {activeStore &&
                    activeStore.map((item, index) => (
                      <Link
                        key={index}
                        className="block p-2 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          handleStoreChange(item);
                          //setOpenStoreDropdown(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-9 grid grid-cols-5 place-content-center">
            {dropdowns &&
              dropdowns.map((dropdown, index) => (
                <div
                  key={index}
                  className="relative "
                  ref={(el) => (dropdownRef2.current[index] = el)}
                >
                  <button
                    className="flex items-center gap-2 text-sm font-thin"
                    onClick={() =>
                      setOpenDropdown(index === openDropdown ? null : index)
                    }
                  >
                    {titles[dropdown.id]}
                    <MdArrowDropDown />
                  </button>
                  {openDropdown === index && (
                    <Dropdown
                      items={dropdown.items}
                      dropdownId={dropdown.id}
                      categoryName={dropdown.id}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="lg:hidden bg-stone-300 lg:bg-custom-red h-[40px] relative mx-auto px-[10px] py-[5px] text-base items-center justify-between text-gray-500">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center text-md font-bold"
              onClick={() => setOpenStoreDropdown((prev) => !prev)}
            >
              <FaLocationDot />
              {!storeSliceData.isEmpty
                ? storeSliceData.store?.name?.slice(0, 40)
                : "Select Store"}
              <MdArrowDropDown />
            </button>
            {openStoreDropdown && (
              <div
                ref={dropdownOptionsRef}
                className="absolute right-0 min-w-48 mt-2 z-50 origin-top-right bg-black text-white text-sm font-thin"
              >
                {activeStore &&
                  activeStore.map((item, index) => (
                    <Link
                      key={index}
                      className="block p-2 text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStoreChange(item);
                        setOpenStoreDropdown(false); // Close dropdown after selection
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
