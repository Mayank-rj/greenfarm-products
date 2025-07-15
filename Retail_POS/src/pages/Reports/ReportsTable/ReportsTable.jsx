import React, { useEffect } from "react";
import { showExcelDetail } from "../../../feature/excelDataSlice";
import { useDispatch } from "react-redux";
import { addzprintData } from "../../../feature/zprintDataSlice";
import { useOutletContext } from "react-router";

const ReportsTable = ({ groupedData, type }) => {
  console.log(groupedData);
  const dispatch = useDispatch();
  const { startDate, endDate, startHourlyTime, endHourlyTime } =
    useOutletContext();
  const calculateData = (mode) => {
    const filteredData = groupedData.filter(
      (data) => data.payment_mode === mode
    );
    console.log("filteredData", filteredData);
    const totalAmount = filteredData.reduce(
      (acc, curr) => acc + curr.sub_total,
      0
    );
    const totalDiscount = filteredData.reduce(
      (acc, curr) => acc + curr.discount,
      0
    );
    const netAmount = totalAmount - totalDiscount;
    return {
      count: filteredData.length,
      totalAmount: totalAmount.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      netAmount: netAmount.toFixed(2),
    };
  };

  // console.log(showExcelDetail);

  const calculateTotal = () => {
    const totalAmount = groupedData.reduce(
      (acc, curr) => acc + curr.sub_total,
      0
    );
    const totalDiscount = groupedData.reduce(
      (acc, curr) => acc + curr.discount,
      0
    );
    const netAmount = totalAmount - totalDiscount;
    return {
      count: groupedData.length,
      totalAmount: totalAmount.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      netAmount: netAmount.toFixed(2),
    };
  };

  const eftposData = calculateData("eftpos");
  const cashData = calculateData("cash");
  const splitPaymentData = calculateData("split payment");
  // const weborderdata =calculateData("STRIPE")
  const allData = calculateTotal();

  const excelInfo = [
    {
      INSTORE: "EFTPOS",
      "SALES COUNT": eftposData.count,
      "TOTAL AMOUNT": eftposData.totalAmount,
      DISCOUNT: eftposData.totalDiscount,
      SURCHARGE: 0,
      PAID: (
        eftposData.totalAmount - parseFloat(eftposData.totalDiscount)
      ).toFixed(2),
    },
    {
      INSTORE: "CASH",
      "SALES COUNT": cashData.count,
      "TOTAL AMOUNT": cashData.totalAmount,
      DISCOUNT: cashData.totalDiscount,
      SURCHARGE: 0,
      PAID: (cashData.totalAmount - parseFloat(cashData.totalDiscount)).toFixed(
        2
      ),
    },
    {
      INSTORE: "SPLIT PAYMENT",
      "SALES COUNT": splitPaymentData.count,
      "TOTAL AMOUNT": splitPaymentData.totalAmount,
      DISCOUNT: splitPaymentData.totalDiscount,
      SURCHARGE: 0,
      PAID: (
        splitPaymentData.totalAmount -
        parseFloat(splitPaymentData.totalDiscount)
      ).toFixed(2),
    },
    // {
    //   INSTORE: 'WEB ORDER',
    //   'SALES COUNT': weborderdata.count,
    //   'TOTAL AMOUNT': weborderdata.totalAmount,
    //   DISCOUNT: weborderdata.totalDiscount,
    //   SURCHARGE: 0,
    //   PAID: (weborderdata.totalAmount - parseFloat(weborderdata.totalDiscount)).toFixed(2)
    // },
    {
      INSTORE: "TOTAL AMOUNT",
      "SALES COUNT": groupedData.length,
      "TOTAL AMOUNT": 0 + allData.totalAmount,
      DISCOUNT: (0 + parseFloat(allData.totalDiscount)).toFixed(2),
      SURCHARGE: 0,
      PAID: (
        0 +
        (parseFloat(allData.totalAmount) - parseFloat(allData.totalDiscount))
      ).toFixed(2),
    },
  ];

  const name = localStorage.getItem("activeButton");
  // console.log(excelInfo);

  useEffect(() => {
    if (groupedData.length) {
      const d = new Date();
      let text = d.toLocaleString();
      // console.log("Dispatching excelInfo:", excelInfo); // Debug log
      dispatch(showExcelDetail({ data: excelInfo, name: `${name}  ${text}` }));
    }
  }, [groupedData]);
  
  useEffect(() => {
    // console.log("hello");
    console.log(startHourlyTime, endHourlyTime);

    dispatch(
      addzprintData({
        type: type,
        from: new Date(
          name === "HOURLY" ? startHourlyTime : startDate
        ).toLocaleString(),
        to: new Date(
          name === "HOURLY" ? endHourlyTime : endDate
        ).toLocaleString(),
        eftposData,
        cashData,
        splitPaymentData,
        allData,
      })
    );
    // dispatch(
    //   addzprintData({
    //     type: 'dailySummary',
    //     // from: currentDate,
    //     // to: endDate,
    //     // cashSalesCount: cashData.length > 0 ? cashData.length : 0,
    //     // cashSubAmount: cashData.length > 0 ? cashTotalAmount : 0,
    //     // cashDiscount: cashData.length > 0 ? cashDiscount : 0,
    //     // cashSurcharge: 0,
    //     // cashTotal:
    //     //   cashData.length > 0 ? (cashTotalAmount - parseFloat(cashDiscount)).toFixed(2) : 0,

    //     // eftposSalesCount: eftposData.length > 0 ? eftposData.length : 0,
    //     // eftposSubAmount: eftposData.length > 0 ? eftposTotalAmount : 0,
    //     // eftposDiscount: eftposData.length > 0 ? eftposDiscount : 0,
    //     // eftposSurcharge: 0,
    //     // eftposTotal:
    //     //   eftposData.length > 0 ? (eftposTotalAmount - parseFloat(eftposDiscount)).toFixed(2) : 0,

    //     // splitSalesCount: splitPaymentData.length > 0 ? splitPaymentData.length : 0,
    //     // splitSubAmount: splitPaymentData.length > 0 ? splitTotalAmount : 0,
    //     // splitDiscount: splitPaymentData.length > 0 ? splitDiscount : 0,
    //     // splitSurcharge: 0,
    //     // splitTotal:splitPaymentData.length > 0 ? splitTotalAmount  : 0,

    //     // totalSalesCount: data.length > 0 ? data.length : 0,
    //     // totalSubAmount: data.length > 0 ? totalAmount.toFixed(2) : 0,
    //     // totalDiscount: data.length > 0 ? parseFloat(discount).toFixed(2) : 0,
    //     // totalSurcharge: 0,
    //     // totalTotal: data.length > 0 ? (totalAmount - parseFloat(discount)).toFixed(2) : 0
    // })
    // )
  }, [groupedData, dispatch]);

  return (
    <div className="table">
      <table id="my-table">
        <thead>
          <tr>
            <th>Payment Mode</th>
            <th>Count</th>
            <th>Total Amount</th>
            <th>Discount</th>
            <th>Net Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                background: "rgba(153, 139, 139, 0.5)",
                fontSize: "2vw",
              }}
            >
              EFTPOS
            </td>
          </tr>
          <tr>
            <td>{"INSTORE"}</td>
            <td>{eftposData.count}</td>
            <td>{eftposData.totalAmount}</td>
            <td>{eftposData.totalDiscount}</td>
            <td>{eftposData.netAmount}</td>
          </tr>
          <tr>
            <td
              style={{
                background: "rgba(153, 139, 139, 0.5)",
                fontSize: "2vw",
              }}
            >
              {"CASH"}
            </td>
          </tr>
          <tr>
            <td>{"INSTORE"}</td>
            <td>{cashData.count}</td>
            <td>{cashData.totalAmount}</td>
            <td>{cashData.totalDiscount}</td>
            <td>{cashData.netAmount}</td>
          </tr>
          <tr>
            <td
              style={{
                background: "rgba(153, 139, 139, 0.5)",
                fontSize: "2vw",
              }}
            >
              SPLIT
            </td>
          </tr>
          <tr>
            <td>{"INSTORE"}</td>
            <td>{splitPaymentData.count}</td>
            <td>{splitPaymentData.totalAmount}</td>
            <td>{splitPaymentData.totalDiscount}</td>
            <td>{splitPaymentData.netAmount}</td>
          </tr>
          {/* <tr>
            <td style={{ background: 'rgba(153, 139, 139, 0.5)', fontSize: '2vw' }}>WEB</td>
          </tr>
          <tr>
            <td>{"ONLINE"}</td>
            <td>{weborderdata.count}</td>
            <td>{weborderdata.totalAmount}</td>
            <td>{weborderdata.totalDiscount}</td>
            <td>{weborderdata.netAmount}</td>
          </tr> */}
          <tr>
            <td
              style={{
                background: "rgba(153, 139, 139, 0.5)",
                fontSize: "2vw",
              }}
            >
              ALL
            </td>
          </tr>
          <tr>
            <td>{"INSTORE"}</td>
            <td>{allData.count}</td>
            <td>{allData.totalAmount}</td>
            <td>{allData.totalDiscount}</td>
            <td>{allData.netAmount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
