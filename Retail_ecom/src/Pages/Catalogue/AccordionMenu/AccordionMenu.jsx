import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./AccordionMenu.css";
import axios from "axios";
import SITE_CONFIG from "../../../../controller";
import { useDispatch, useSelector } from "react-redux";
import { setSubcategory } from "../../../slices/subcategoryslice";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategory } from "../../../api/fetchCategory";
import { fetchSubCatBySidnCid } from "../../../api/fetchSubCatBySidnCid";

const AccordionMenu = ({
  activeSubcategoryid,
  subcategory,
  setSubcategoryProduct,
  activecategoryid,
  setActiveSubcategoryid,
  setActivecategoryid,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const dispatch = useDispatch();

  const storeSliceData = useSelector((state) => state.storeData);

  useEffect(() => {
    if (subcategory) {
      setActiveSubcategoryid(subcategory.id);
      setActivecategoryid(subcategory.category);
      // console.log(subcategory);
    }
  }, [subcategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetchCategory();
      return response.filter((banner) => banner.status === "active");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (category) => {
    try {
      // console.log(category)
      const response = await fetchSubCatBySidnCid(
        category,
        storeSliceData.store?._id
      );
      return response.filter((banner) => banner.status === "active");
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const buildMenuItems = async () => {
    try {
      const categories = await fetchCategories();
      if (!categories) return;

      const items = await Promise.all(
        categories.map(async (category) => {
          const subcategories = await fetchSubcategories(category._id);
          return {
            category: category,
            subcategories:
              subcategories?.map((sub) => ({ name: sub.name, data: sub })) ||
              [],
          };
        })
      );

      setMenuItems(items);
    } catch (err) {
      console.error(err);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (storeSliceData.store?._id) {
      buildMenuItems();
    }
  }, [storeSliceData.store?._id]);

  const handleCategoryClick = (category) => {
    // if (activecategoryid === category) {
    //   // setActivecategoryid(null); // Close the menu
    //   // navigate(`${SITE_CONFIG.linkPath}/catalogue`);
    // } else {
    setActivecategoryid(category); // Open the menu
    navigate(`${SITE_CONFIG.linkPath}/catalogue?cid=${category}`);
    // }
  };

  const handleSubcategoryClick = async (subcategoryData) => {
    dispatch(
      setSubcategory({
        id: subcategoryData._id,
        category: subcategoryData.category,
      })
    );
  };


  return (
    <div className="accordion-menu">
      <h2>Categories</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <div
              onClick={() => handleCategoryClick(item.category._id)}
              className={`menu-item ${activecategoryid === item.category._id ? "active" : ""
                }`}
            >
              {item.subcategories.length > 0 &&
                (activecategoryid === item.category._id ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                ))}
              <Link
                // to={`${SITE_CONFIG.linkPath}/catalogue?cid=${item.category._id}`}
                key={item.category._id}
              >
                {" "}
                {item.category.name}
              </Link>
            </div>
            {activecategoryid === item.category._id &&
              item.subcategories.length > 0 && (
                <ul className="submenu">
                  {item.subcategories.map((subcategory, subIndex) => (
                    <Link
                      to={`${SITE_CONFIG.linkPath}/catalogue?cid=${activecategoryid}&subcid=${subcategory.data._id}`}
                      key={subIndex}
                    >
                      <li
                        onClick={() => handleSubcategoryClick(subcategory.data)}
                        className={
                          activeSubcategoryid === subcategory.data._id
                            ? "active"
                            : ""
                        }
                      >
                        {subcategory.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccordionMenu;
