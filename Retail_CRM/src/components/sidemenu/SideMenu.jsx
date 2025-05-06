import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  MdClose,
  MdMenu,
  MdOutlineCategory,
  MdDisplaySettings,
  MdOutlineStorefront,
} from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { CgProfile, CgDisplayFullwidth, CgWebsite } from "react-icons/cg";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";
import { FaClipboardList, FaDisplay } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { TiPinOutline } from "react-icons/ti";
import { TfiTruck, TfiMoney } from "react-icons/tfi";
import { SlBadge } from "react-icons/sl";
import { PiUserRectangleFill } from "react-icons/pi";
import { TbCategory } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../utils/context/AuthContext";
import { LuClipboardList } from "react-icons/lu";

const menuItems = [
  {
    label: "Statistics",
    icon: <VscGraph style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/home",
  },
  {
    label: "Products",
    icon: <AiOutlineShoppingCart style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/products",
  },
  {
    label: "Orders",
    icon: <LuClipboardList style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/orders",
  },
  {
    label: "Categories",
    icon: <MdOutlineCategory style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/categories",
  },
  {
    label: "Subcategories",
    icon: <TbCategory style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/subcategories",
  },
  {
    label: "Drivers",
    icon: <TfiTruck style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/drivers",
  },
  {
    label: "Stores",
    icon: <MdOutlineStorefront style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/stores",
  },
  //   { label: 'Payments', icon: <TfiMoney />, path:'/retailcrm/admin/' },
  {
    label: "Banners",
    icon: <CgDisplayFullwidth style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/banners",
  },
  {
    label: "Coupons",
    icon: <SlBadge style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/coupons",
  },
  {
    label: "Policy Pages",
    icon: <CgWebsite style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/policypages",
  },
  {
    label: "Users",
    icon: <CgProfile style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/users",
  },
  {
    label: "Administrator",
    icon: <PiUserRectangleFill style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/adminusers",
  },
  {
    label: "Manage Sub Menu",
    icon: <CgMenuGridO style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/submenu",
  },
  {
    label: "POS Configuration",
    icon: <IoSettingsOutline style={{ fontSize: 25 }} />,
    path: "/retailcrm/admin/posconfigurations",
  },
];

const SideMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const handleDrawerClose = () => {
    toggleSidebarVisibility();
  };
  const toggleSidebarVisibility = () => {
    setOpen(!open); // Toggle sidebarOpen state
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <ListItemButton
        key={item.path}
        onClick={(event) => {
          localStorage.removeItem("selectedDate");
          navigate(`${item.path}`);
        }}
        selected={location.pathname === item.path}
        sx={{ paddingRight: open ? "20px" : 0, paddingLeft: open ? "20px" : 0 }}
      >
        <ListItemIcon sx={{ justifyContent: "center" }}>
          {item.icon}
        </ListItemIcon>
        {open ? <ListItemText primary={item.label} /> : null}
      </ListItemButton>
    ));
  };
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      hidden={!isAuthenticated}
      onClose={handleDrawerClose}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "#fafafa",
          position: "fixed",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: open ? "0" : "10px",
          backgroundColor: "#fafafa",
          transition: "padding 0.3s ease, background-color 0.3s ease", // Add transition for padding and backgroundColor
        }}
      >
        {open ? (
          <IconButton onClick={handleDrawerClose}>
            <MdClose />
          </IconButton>
        ) : (
          <IconButton onClick={toggleSidebarVisibility}>
            <MdMenu style={{ fontSize: 25 }} />
          </IconButton>
        )}
      </Box>

      <List>
        {/* Main section */}
        {open ? (
          <ListItem>
            <ListItemIcon sx={{ color: "blue" }}>
              <TiPinOutline style={{ color: "blue", fontWeight: "bold" }} />
            </ListItemIcon>
            <ListItemText primary="MAIN" />
          </ListItem>
        ) : null}
        {renderMenuItems(menuItems.slice(0, 7))}

        <Divider />

        {/* Manage section */}
        {open ? (
          <ListItem>
            <ListItemIcon sx={{ color: "blue" }}>
              <TiPinOutline style={{ color: "blue", fontWeight: "bold" }} />
            </ListItemIcon>
            <ListItemText primary="MANAGE" />
          </ListItem>
        ) : null}
        {renderMenuItems(menuItems.slice(7))}
      </List>
    </Drawer>
  );
};

export default SideMenu;
