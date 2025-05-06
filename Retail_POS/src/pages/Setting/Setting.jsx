import Button from "../../components/Button/Button";
import { useNavigate } from "react-router";
import {
  faCogs,
  faHistory,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { resetAuth } from "../../feature/settingsAuth";
import SettingsPin from "./SettingsPin";

function Setting() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state)=> state.settingsAuth.isAuthenticated)
  const buttonLabels = [
    { label: "About POS", route: "about", icon: faInfoCircle },
    { label: "Transaction History", route: "transaction", icon: faHistory },
    { label: "Terminal Setting", route: "terminal", icon: faCogs },
  ];

  useEffect(()=> {
    dispatch(resetAuth())
  }, [dispatch])

  if (!isAuthenticated) {
    return (
      <SettingsPin />
    );
  }

  return (
    <div className="h-screen bg-gray-600 flex flex-col items-center justify-center">
      {/* Back to POS button */}
      <div className="absolute top-4 left-4">
        <Button
          item="Back To POS"
          handleClick={() => navigate("/retailpos")} // Navigate to the POS page
        />
      </div>

      <h1 className="text-white text-3xl font-bold mb-8">POS Settings</h1>

      {/* Main Buttons */}
      <div className="bg-gray-400 p-8 rounded-lg shadow-lg space-y-4">
        {buttonLabels.map((button, index) => (
          <Button
            key={index}
            item={button.label}
            handleClick={() => navigate(button.route)} // Navigate to the corresponding route
            icon={button.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default Setting;
