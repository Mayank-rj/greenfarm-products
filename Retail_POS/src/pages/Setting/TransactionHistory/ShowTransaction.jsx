import { sendMessage } from "../../../app/driverConnection";
import { restCatogeryBgBtn } from "../../../assets/btn-bg";
import Button from "../../../components/Button/Button";
import success from "/images/approve.png"
import failed from "/images/decline.png"

export const ShowTransaction = ({ isOpen, onClose, details }) => {
  // console.log(details.transaction_receipt);
  
  const handleClick = async () => {
    
          
          if (details.transaction_receipt) {
            // console.log("hii");
            
            sendMessage({
              command: "merchant_receipt",
              data: details.transaction_receipt,
            });
          }
        
  }
  return (
    isOpen && (
      <>
        <div className="fixed bg-black/50  inset-0 flex items-center justify-center z-20">
          <div className="flex flex-row h-[72vh] w-[50%]">
            <div className="bg-white opacity-100 relative p-6 h-full border w-[60%] overflow-y-auto rounded-md">
              <div className="flex justify-center mb-3">
                <img
                  src={details.status ? success : failed}
                  alt={
                    details.status
                      ? "Transaction Successful"
                      : "Transaction Failed"
                  }
                  height={"50px"}
                  width={"50px"}
                />
              </div>

              <p className="font-bold mb-2 text-center">
                {" "}
                Transaction {details.status ? "Success" : "Failed"}
              </p>
              <hr />
              <div className="mt-4 mb-4">
                <p className="my-3">
                  <strong>POS Reference ID:</strong> {details.ref_id}
                </p>
                <p className="my-3">
                  <strong>POS ID: </strong>&nbsp; {details.pos_id}
                </p>
                <p className="my-3">
                  <b>Date: </b>&nbsp;{new Date(details.date).toLocaleString()}{" "}
                </p>
              </div>
              <hr />
              <div className="mt-4 font-bold text-center">
                <p className="">Order Summary</p>
                <p>$ {details.amount}</p>
              </div>
              <div className="flex justify-between mt-4">
                <p>Subtotal</p>
                <p>$ {details.amount}</p>
              </div>
              <div className="flex bottom-3 flex-row justify-center mt-3 px-8 gap-4">
                <button
                  className="button-1 w-full mt-4"
                  style={{ margin: "5px 0" }}
                  onClick={onClose}
                >
                  <span className="button-1-shadow"></span>
                  <span
                    className="button-1-edge"
                    style={restCatogeryBgBtn[4]}
                  ></span>
                  <span className="button-1-front text bg-[#700FA0] text-white">
                    CLOSE
                  </span>
                </button>
                <button
                  className="button-1 w-full mt-4"
                  style={{ margin: "5px 0" }}
                  onClick={handleClick}
                >
                  <span className="button-1-shadow"></span>
                  <span
                    className="button-1-edge"
                    style={restCatogeryBgBtn[5]}
                  ></span>
                  <span className="button-1-front text bg-[#2196F3] text-white">
                    PRINT
                  </span>
                </button>

              </div>
            </div>
            <div className="bg-white border rounded-md w-[40%] px-[10%] py-[5%] overflow-y-auto text-xs ">
              <div className="">
                <pre className="mx-auto"> {details.transaction_receipt}</pre>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};
