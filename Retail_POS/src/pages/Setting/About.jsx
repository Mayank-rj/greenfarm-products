// import React from "react";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { BiRefresh } from "react-icons/bi"; // Import a refresh icon
import { useNavigate } from "react-router";
// import { FaFileDownload } from "react-icons/fa";
// import { useSelector } from "react-redux";
import SITE_CONFIG from "../../../controller";
import Button from "../../components/Button/Button";
import { faDownload, faSync } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import SettingsPin from "./SettingsPin";
import { retrieveLogs } from "../../utils/db";

const About = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.settingsAuth.isAuthenticated)
  const date = new Date().getFullYear()
  const handleBackButton = () => {
    navigate(`/${SITE_CONFIG.basePath}/setting`);
  };

  const handleRefreshButton = () => {
    window.location.reload();
  };
  //   const handleRetrieveLogs = async () => {
  //     // Call retrieveLogs when the button is clicked
  //     await retrieveLogs();
  //   };

  // Logging messages
  const handleRetrieveLogs = async () => {
    // Call retrieveLogs when the button is clicked
    console.log("Clicked!!")
    await retrieveLogs();
  };

  if (!isAuthenticated) {
    return (
      <SettingsPin />
    );
  }
  return (
    <div className="h-screen bg-gray-600 flex flex-col items-center justify-center p-6">
      {/* Back Button in Top Left */}
      <div className="absolute top-4 left-4">
        <Button
          item="Back To POS Settings"
          handleClick={handleBackButton}
        />
      </div>

      {/* Refresh Button in Top Right */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          item="Refresh POS"
          icon={faSync}
          handleClick={handleRefreshButton}
        />
        <Button
          handleClick={handleRetrieveLogs}
          item="Download Logs"
          icon={faDownload}
        />
      </div>

      {/* Content in Center */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6 text-white">POS System Information</h1>

        <p className="text-white font-bold mb-4">Version: {SITE_CONFIG.POS_VERSION}</p>
        <p className="text-white font-bold mb-4">Date: 2025-01-27</p>
        <p className="text-white font-bold mb-4">Name: GREENFARM PRODUCTS</p>

        <p className="text-white font-bold mt-8">
          © {date} Green Farm. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default About;
