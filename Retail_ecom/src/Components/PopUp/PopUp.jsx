import { useState } from "react";
import "./PopUp.css";
import { NavLink } from "react-router-dom";
import SITE_CONFIG from "../../../controller";

function PopUp({ storeData, handleStoreChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSelectStore = (store) => {    
    handleStoreChange(store);
    closePopup();
  };
  
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={closePopup}
        className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50"
      ></div>

      <div className="fixed top-[10%] left-1/2 transform -translate-x-1/2 shadow-md bg-white popupWidth max-w-2xl z-50">
        <p className="ml-4 mt-2 mb-2 text-gray-500">Choose the Nearest Store</p>
        <hr />
        <div className="flex flex-col md:flex-row justify-center gap-6 p-4">
          {storeData &&
            storeData.map((store) => (
              <div
                key={store._id}
                onClick={() => handleSelectStore(store)}
                className="bg-white border border-gray-300 p-4 w-full md:w-60 relative group"
              >
                <NavLink className="mb-4">
                  <img
                    src={`${SITE_CONFIG.imageUrl}${store.cover}`}
                    alt={store.name}
                    className="w-full h-32 object-contain rounded-lg"
                  />
                </NavLink>
                <div className="text-center">
                  <p className="text-sm text-[#6c757d]">{store.name}</p>
                  <p className="text-sm text-[#6c757d]">{store.address}</p>
                  <button
                    onClick={() => handleSelectStore(store)}
                    className="btan addcart w-1/2 h-8"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default PopUp;
