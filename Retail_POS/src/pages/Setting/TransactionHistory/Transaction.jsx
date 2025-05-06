import { useNavigate } from "react-router";
import { Header } from "./Header";
import { ShowTransaction } from "./ShowTransaction";
import { useState, useEffect } from "react";
import Button from "../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";
import SettingsPin from "../SettingsPin";
import SITE_CONFIG from "../../../../controller";
import { fetchTransactionsByDate } from "../../../api/fetchTransactionsByDate";

function Transaction() {
  const [modalOpen, setModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState(new Date().setHours(0, 0, 0, 0));
  const [toDate, setToDate] = useState(new Date());
  const [selectedDetail, setSelectedDetail] = useState("");
  const [filteredtransaction, setFilteredtransaction] = useState([]);
  const [activeButton, setActiveButton] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.settingsAuth.isAuthenticated);
  const posData = useSelector(state => state.posData);

  const navigate = useNavigate();
  const store_id = posData?.store?._id;

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetchTransactionsByDate(fromDate, toDate, store_id);
      if (response) {
        setTransaction(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transactions when dates or store_id changes
  useEffect(() => {
    if (store_id) {
      fetchTransactions();
    }
  }, [fromDate, toDate, store_id]);

  // Filter transactions whenever the transaction array or dates change
  useEffect(() => {
    if (!isLoading && transaction.length > 0) {
      const filtered = transaction.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);



        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredtransaction(filtered);
    } else {
      setFilteredtransaction(transaction);
    }
  }, [transaction, fromDate, toDate, isLoading]);

  const handleBackButton = () => {
    navigate(`/${SITE_CONFIG.basePath}/setting`);
  };

  const handleRowClick = (detail) => {
    setSelectedDetail(detail);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDetail(null);
  };

  if (!isAuthenticated) {
    return <SettingsPin />;
  }



  return (
    <>
      <div className="w-full relative px-10 py-2 h-[100vh] bg-[#4B5563]">
        <h1 className="text-3xl font-semibold text-center text-white">
          TRANSACTIONS
        </h1>
        <Button
          item="Back To POS Settings"
          handleClick={handleBackButton}
          className="z-50"
        />
        <div className="h-[84vh] flex items-center justify-center">
          <div className="bg-white w-[90%] h-[95%] rounded-md mr-8 p-4">
            <Header
              activeButton={activeButton}
              setFromDate={setFromDate}
              setToDate={setToDate}
              fromDate={fromDate}
              toDate={toDate}
              setStartHourlyTime={(time) => { }}
              setEndHourlyTime={(time) => { }}
            />
            <div className="overflow-auto" style={{ maxHeight: "65vh" }}>
              {isLoading ? (
                <div className="w-full h-32 flex items-center justify-center">
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : (
                <table className="min-w-full bg-white">
                  <thead className="sticky top-0 z-10 bg-white h-15 shadow-md">
                    <tr className="border-b-2 border-gray-300 text-black">
                      <th className="w-1/7 px-4 py-4 font-bold border-none text-left text-sm leading-4 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="w-1/7 px-4 font-bold border-none text-left text-sm leading-4 uppercase tracking-wider">
                        POS ID
                      </th>
                      <th className="w-1/3 px-4 font-bold border-none text-left text-sm leading-4 uppercase tracking-wider">
                        REFERENCE ID
                      </th>
                      <th className="w-1/5 px-3 font-bold border-none text-left text-sm leading-4 uppercase tracking-wider">
                        DATE
                      </th>
                      <th className="w-1/5 px-3 font-bold border-none text-left text-sm leading-4 uppercase tracking-wider">
                        AMOUNT
                      </th>
                      <th className="w-1/6 px-3 font-bold border-none text-left text-sm leading-4 uppercase tracking-wider">
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredtransaction.map((item, index) => (
                      <tr
                        className={`hover:bg-gray-100 border-b border-gray-300 transition-all ease-in-out duration-300 cursor-pointer text-gray-700 ${index === transaction.length - 1 && "border-none"
                          }`}
                        key={index}
                        onClick={() => handleRowClick(item)}
                      >
                        <td className="px-4 py-4 font-semibold border-none text-left">
                          {index + 1}
                        </td>
                        <td className="px-4 border-none font-semibold text-left">
                          {item.pos_id}
                        </td>
                        <td className="px-4 border-none text-left font-semibold">
                          {item.ref_id}
                        </td>
                        <td className="px-4 border-none text-left font-semibold">
                          {new Intl.DateTimeFormat(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true, // AM/PM format
                          }).format(new Date(item.date))}
                        </td>
                        <td className="px-4 border-none text-left font-semibold">
                          $ {Number(item.amount).toFixed(2)}
                        </td>
                        <td className="px-4 border-none text-left font-bold">
                          {item.status ? (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-green-500"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faCircleXmark}
                              className="text-red-500"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <ShowTransaction
          isOpen={modalOpen}
          onClose={closeModal}
          details={selectedDetail}
        />
      </div>
    </>
  );
}

export default Transaction;