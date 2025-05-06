import { useNavigate } from "react-router";
import Button from "../../../components/Button/Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const initializeDate = (date, isStart = true) => {
  if (isStart) {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }
  // console.log(date);

  return date.toISOString();
};

const validateEndBeforeStart = (start, end, resetEnd) => {
  if (end < start) {
    toast.error("End date/time cannot be earlier than start date/time!");
    resetEnd();
  }
};

export const Header = ({
  activeButton,
  setFromDate,
  setToDate,
  fromDate,
  toDate,
  setStartHourlyTime,
  setEndHourlyTime,
}) => {
  const navigate = useNavigate();
  const [filterState, setFilterState] = useState({
    dateFilter: "today",
    startDate: "",
    endDate: "",
    startHourlyTime: "",
    endHourlyTime: "",
  });

  const updateState = (key, value) =>    setFilterState((prev) => ({ ...prev, [key]: value }));
    
  const { dateFilter, startDate, endDate, startHourlyTime, endHourlyTime } =
    filterState;

  const handleBackClick = () => navigate(-1);

  // Handle End Time Change
  const handleEndTimeChange = (e) => {
    if (!startHourlyTime) {
      toast.error("Please select a start time first!");
      updateState("endHourlyTime", "");
    } else {
      updateState("endHourlyTime", e.target.value);
    }
  };

  // Reset state when activeButton changes
  useEffect(() => {
    setFilterState({
      dateFilter: "today",
      startDate: "",
      endDate: "",
      startHourlyTime: "",
      endHourlyTime: "",
    });
  }, [activeButton]);


  useEffect(() => {
    setFilterState((prev)=>{
      return{
      ...prev,
      startHourlyTime: "",
      endHourlyTime: "",
      }
    });
  }, [fromDate]);


  // Update fromDate and toDate based on filters
  useEffect(() => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    if (dateFilter === "yesterday") {
      start.setDate(today.getDate() - 1);
      end = new Date(start);
    } else if (dateFilter === "custom") {
      start = startDate ? new Date(startDate) : today;
      end = endDate ? new Date(endDate) : today;
      if(activeButton==="HOURLY"){
        setStartHourlyTime(start)
        setEndHourlyTime(end)
      }
    }

    if (activeButton !== "HOURLY") {
      initializeDate(start, true); // Start of the day
      initializeDate(end, false); // End of the day
    }

    setFromDate && setFromDate(start);
    setToDate && setToDate(end);
  }, [dateFilter, startDate, endDate, activeButton]);

  // Validate End Date
  useEffect(() => {
    if (startDate && endDate) {
      validateEndBeforeStart(new Date(startDate), new Date(endDate), () =>
        updateState("endDate", "")
      );
    }
  }, [startDate, endDate]);

  // Validate End Time
  useEffect(() => {
    if (startHourlyTime && endHourlyTime) {
      let start = new Date(fromDate);
      let end = new Date(toDate);
      

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        toast.error("Invalid date selected!");
        return;
      }

      if (startHourlyTime) {
        const [startHour, startMinute] = startHourlyTime.split(":").map(Number);
        start.setHours(startHour, startMinute, 0, 0);
      }
      if (endHourlyTime) {
        const [endHour, endMinute] = endHourlyTime.split(":").map(Number);
        end.setHours(endHour, endMinute, 0, 0);
      }

      validateEndBeforeStart(start, end, () =>
        updateState("endHourlyTime", "")
      );

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        toast.error("Invalid start or end time!");
        return;
      }

      setStartHourlyTime && setStartHourlyTime(start.toISOString());
      setEndHourlyTime && setEndHourlyTime(end.toISOString());
    }
  }, [startHourlyTime, endHourlyTime, startDate, endDate]);

  return (
    <>
      <div className="header">
        <div className="heading">
        </div>

        <div className="date flex items-center mb-2">
          {/* Date Filter */}
          <label htmlFor="day" className="mr-2 font-bold">
            Day:
          </label>
          <select
            id="day"
            className="border border-gray-400 rounded-md px-2 py-1 mr-4 text-xl"
            value={dateFilter}
            onChange={(e) => updateState("dateFilter", e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom</option>
          </select>

          {/* Conditional Search Bar */}
          {(activeButton === "ITEMS SALE" || activeButton === "CATEGORY") && (
            <div className="flex items-center">
              <label htmlFor="searchItem" className="mr-2 font-bold">
                Search:
              </label>
              <input
                type="text"
                id="searchItem"
                className="border border-gray-400 rounded-md px-2 py-1 mr-4 text-xl"
                placeholder="Search Product"
              />
            </div>
          )}

          {/* Hourly Time Input */}
          {activeButton === "HOURLY" && dateFilter !== "custom" && (
            <>
              <TimeInput
                label="From"
                value={startHourlyTime}
                onChange={(e) => updateState("startHourlyTime", e.target.value)}
              />
              <TimeInput
                label="To"
                value={endHourlyTime}
                onChange={handleEndTimeChange}
              />
            </>
          )}

          {/* Custom Date Range */}
          {dateFilter === "custom" && (
            <>
              <DateInput
                label="From"
                value={startDate}
                onChange={(e) =>
                  updateState("startDate", e.target.value)
                }
                type={activeButton === "HOURLY" ? "datetime-local" : "date"}
              />
              <DateInput
                label="To"
                value={endDate}
                onChange={(e) =>
                  updateState("endDate", e.target.value)
                }
                type={activeButton === "HOURLY" ? "datetime-local" : "date"}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Reusable Input Components
const TimeInput = ({ label, value, onChange }) => (
  <div className="flex items-center">
    <label className="mr-2 font-bold">{label}:</label>
    <input
      type="time"
      className="border border-gray-400 rounded-md px-2 py-1 mr-4 text-xl"
      value={value}
      onChange={onChange}
    />
  </div>
);

const DateInput = ({ label, value, onChange, type }) => (
  <div className="flex items-center">
    <label className="mr-2 font-bold">{label}:</label>
    <input
      type={type}
      className="border border-gray-400 rounded-md px-2 py-1 mr-4 text-xl"
      value={value}
      onChange={onChange}
    />
  </div>
);
