import { NavLink } from "react-router-dom";
import SITE_CONFIG from "../../controller";

const ProfileSidebarMenu = () => {
  return (
    <div
      style={{
        fontSize: "16opx",
        fontWeight: "400px",
        color: "rgb(128, 128, 128)",
      }}
      className="hidden lg:flex flex-col w-1/4 py-4 "
    >
      <h2 className="text-lg font-bold mb-[16px]">Activity</h2>
      <ul style={{ fontSize: "14px" }} className="text-gray-700 w-full">
        <li className="mb-2 w-full">
          <NavLink
            to={`${SITE_CONFIG.linkPath}/orders`}
            className={({ isActive }) =>
              `font-semibold py-[8px] block w-full text-left ${
                isActive
                  ? "text-red-600 border-l-2 font-bold border-red-600 pl-2 bg-[rgba(195,217,208,0.5)]"
                  : ""
              }`
            }
          >
            Order History
          </NavLink>
        </li>

        <li className="mb-2 w-full">
          <NavLink
            to={`${SITE_CONFIG.linkPath}/address`}
            className={({ isActive }) =>
              `font-semibold py-[8px] block w-full text-left ${
                isActive
                  ? "text-red-600 border-l-2 font-bold border-red-600 pl-2 bg-[rgba(195,217,208,0.5)]"
                  : ""
              }`
            }
          >
            My Addresses
          </NavLink>
        </li>
        <li className="mb-2 w-full">
          <NavLink
            to={`${SITE_CONFIG.linkPath}/profile`}
            className={({ isActive }) =>
              `font-semibold py-[8px] block w-full text-left ${
                isActive
                  ? "text-red-600 border-l-2 font-bold border-red-600 pl-2 bg-[rgba(195,217,208,0.5)]"
                  : ""
              }`
            }
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default ProfileSidebarMenu;
