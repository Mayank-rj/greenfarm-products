import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "./OrderDetails.css";
import "jspdf-autotable";
import SITE_CONFIG from "../../../controller";
import logoBase64 from "../../assets/logoBase64";
import { getOrderByUserid } from "../../api/getOrderbyUserId";
import { fetchUserById } from "../../api/fetchUserById";
import { fetchStore } from "../../api/fetchStore";
import { fetchProductBySidnId } from "../../api/fetchProductBySidnId";
import { getOrderById } from "../../api/getOrderById";
import { fetchUserByAuthId } from "../../api/fetchUserByauthId";

export default function OrderDetails() {
  const { imageUrl } = SITE_CONFIG;
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const orderDetailsFromStore = useSelector((state) => state.orderDetails);
  const [productDetails, setProductDetails] = useState([]);
  const storeSliceData = useSelector((state) => state.storeData);
  const [viewOrder, setViewOrder1] = useState(null);

  const [displayName, setDisplayName] = useState({
    first_name: "",
    last_name: "",
  });
  const id = localStorage.getItem("User");


  const getSingleUser = async () => {
    try {
    const response = await fetchUserByAuthId(id);

    setDisplayName({
      first_name: response.data.first_name,
      last_name: response.data.last_name,
    });
  }
  catch (error) {
    // console.log(error)//
    console.log(error.response.data.message);
    console.log(typeof error.response.data.message || "An error occurred");
    //  setError(error.response.data.message || "An error occurred");
    localStorage.removeItem("AuthToken");
    localStorage.removeItem("User");
    navigate("/home", { state: "Login is required" });
  }
  };

  const [storeData, setStoreData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetchStore();

      setStoreData(response);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
      getSingleUser();
  }, [id]);

  // useEffect(() => {
  //   const fetchProductDataforCart = async () => {
  //     const productDetail = JSON.parse(viewOrder.product_details);
  //     const productDataPromises = productDetail.map(async (product) => {
  //       const fetchProduct = await fetchProductBySidnId(
  //         viewOrder.store_id,
  //         product.id,
  //       );

  //       return {
  //         ...product,
  //         product: fetchProduct[0]
  //       };
  //     });
  //     const productData = await Promise.all(productDataPromises);

  //     // let updatedCart = { ...cart, product_details: productData };

  //     setProductDetails(productData)
  //     // setCartData(updatedCart)
  //   }
  //   // fetchProductDataforCart();
  // }, [viewOrder])

  useEffect(() => {
    const fetchOrderById = async (orderId) => {
      try {
        const response = await getOrderById(orderId);
        //console.log(response);
        if (response && response.data) {
          setViewOrder1(response.data);
          const Productdetailsdata = JSON.parse(
            response?.data?.product_details
          );
          //console.log(Productdetailsdata);
          setProductDetails(Productdetailsdata);
        } else {
          console.log("No data found in the response");
        }
      } catch (error) {
        console.log("Error fetching order:", error);
      }
    };

    {
      orderId && fetchOrderById(orderId);
    }
  }, [orderId]);
  //console.log();

  useEffect(() => {
    if (viewOrder && viewOrder._id === orderId) {
      setOrder(viewOrder);
    } else {
      // Fetch order details from an API or some other source if not found in store
      // Example API call:
      // fetchOrderDetails(orderId).then(data => setOrder(data));
    }
  }, [orderId, viewOrder]);

  if (!order) {
    return (
      <div className="text-center text-gray-500">
        No order details available.
      </div>
    );
  }

  let orderType;
  let displayAddress;

  if (order.address === ", , ") {
    const store = storeData.find((store) => {
      return store.id == order.store_id;
    });
    displayAddress = store ? store.address : "Address not found";
    orderType = "Pickup";
  } else {
    displayAddress = order.address;
    orderType = "Delivery";
  }

  // Parse product details from JSON string
  // const productDetails = JSON.parse(order.product_details);

  // const totalItems = productDetails.length; // Number of products

  const generatePDF = async (data, order, orderType, displayAddress) => {
    //console.log(data, order, orderType, displayAddress);

    const doc = new jsPDF();

    function formatDateTime(dateTimeString) {
      const date = new Date(dateTimeString);

      // Define options for date and time formatting
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour time
      };

      // Format the date and time
      return date.toLocaleString("en-GB", options);
    }

    function formatDateOnly(dateTimeString) {
      const date = new Date(dateTimeString);

      // Define options for date formatting (only year, month, and day)
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      // Format and return only the date
      return date.toLocaleDateString("en-GB", options);
    }
    const orderdatetime = formatDateTime(order.date_time);
    const orderdate = formatDateOnly(order.date_time);
    const fontRegular = "helvetica";
    const fontBold = "helvetica";

    // Function to add rounded image
    // Function to add rounded image
    // Function to add rounded image without border
    const addRoundedImage = (base64Image, x, y, width, height, radius) => {
      // Set the background color for the rounded rect
      doc.setFillColor(255, 255, 255); // White background

      // Draw the rounded rectangle (background) but do not fill it with a border
      doc.roundedRect(x, y, width, height, radius, radius, "F"); // 'F' for fill only, no border

      // Add the image on top of the rounded rectangle
      doc.addImage(base64Image, "JPEG", x, y, width, height);
    };

    // Example usage of the function
    const paddingBottom = 10; // 10px padding from the bottom
    const paddingAboveLine = 0; // 5px padding above the line

    // Add logo
    addRoundedImage(logoBase64, 20, 10, 45, 17, 0);

    // Add system name and payslip month title
    doc.setFont(fontBold, "bold");
    doc.setFontSize(16);
    doc.text("Green farm products", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.text(`Invoice Details`, 105, 30, null, null, "center");

    // Draw a line across the X-axis (full width) with padding above
    doc.setLineWidth(0.5); // Set the line thickness
    const lineY = 40 + paddingAboveLine; // Adjust the Y-coordinate with padding
    doc.line(10, lineY, 200, lineY); // Draw the line (from x=10 to x=200 at the new y position)

    doc.setFontSize(10);
    doc.setFont(fontBold);

    // Add Order and Invoice Details (with equal padding for both sides)
    const pageWidth = 210;
    const leftPadding = 15;
    const rightPadding = pageWidth - leftPadding; // 190mm

    doc.text(`Order ID: ${order.order_number}`, leftPadding, 50); // Left-aligned
    // doc.text(`Invoice Number:${order.order_number}`, rightPadding, 50, {
    //   align: "right",
    // }); // Right-aligned with padding

    doc.setFont(fontRegular);
    doc.text(`Order Date: ${orderdate}`, leftPadding, 55); // Left-aligned
    doc.text(`Order Type: ${orderType}`, leftPadding, 60); // Right-aligned with padding
    // doc.text(`Invoice Details: ${order.order_number}`, rightPadding, 55, {
    //   align: "right",
    // }); /
    // doc.text(`Invoice Date:  ${order.date_time}`, rightPadding, 60, {
    //   align: "right",
    // }); // Right-aligned with padding

    // "Sold By" section
    if (orderType !== "Pickup") {
      doc.setFont(fontBold);
      doc.text("Address :", leftPadding, 70);

      doc.setFont(fontRegular);
      const wrappedAddress = doc.splitTextToSize(displayAddress, 180);
      doc.text(wrappedAddress, leftPadding, 75);
    } else {
      doc.setFont(fontBold);
      doc.text("Store Name :", leftPadding, 70);

      doc.setFont(fontRegular);
      const wrappedStoreName = doc.splitTextToSize(
        storeSliceData.store?.name,
        180
      );
      doc.text(wrappedStoreName, leftPadding, 75);
    }

    // // "Billing Address" section (aligned to the right)
    // doc.setFont(fontBold);
    // doc.text("Billing Address :", rightPadding, 70, { align: "right" });
    // doc.setFont(fontRegular);
    // doc.text(
    //   "Kashish\n" +
    //     "House No. 5, Block No. 3, Dakshinpuri Ext,\n" +
    //     "Dr Ambedkar Nagar, New Delhi\n" +
    //     "NEW DELHI, DELHI, 110062\n" +
    //     "IN\n" +
    //     "State/UT Code: 07",
    //   rightPadding,
    //   75,
    //   { align: "right" }
    // );

    // Draw a table layout for the details, removed unnecessary columns

    const tableData = data.map((item, index) => {
      const weight = item.weight || 0;
      const quantity = item.quantity || 0;
      const price = item.price || 0;
      const discount = item.product.discount || 0;
      const qtyDisplay = quantity;
      const weightDisplay = weight > 0 ? `${weight} ` : `-`;

      const totalAmount = price.toFixed(2);
      if (item.product.size === "variations" && item.variationId !== "") {
        // const totalAmount = weight > 0
        //   ? (weight * quantity * price).toFixed(2)
        //   : (quantity * price).toFixed(2);
        return [
          index + 1,
          `${item.product.name} - ${
            item.product.variations.find(
              (iitem) => iitem._id === item.variationId
            )?.name
          }` || "N/A",
          qtyDisplay,
          weightDisplay,
          item.product.variations
            .find((iitem) => iitem._id === item.variationId)
            ?.discount.toFixed(2) || 0,
          `${
            item.product.variations
              .find((iitem) => iitem._id === item.variationId)
              ?.sell_price.toFixed(2) || 0
          } / ${item.product.unit}`,
          totalAmount,
        ];
      } else {
        return [
          index + 1,
          item.product.name || "N/A",
          qtyDisplay,
          weightDisplay,
          discount.toFixed(2),
          `${item?.product?.sell_price.toFixed(2) || 0} / ${item.product.unit}`,
          totalAmount,
        ];
      }
    });

    const headers = [
      [
        "Sl. No",
        "Product",
        "Quantity",
        "Weight",
        "Discount (%)",
        "Price ($)",
        "Total Amount",
      ],
    ];

    // Generate Invoice Table
    doc.autoTable({
      startY: 90, // Adjusted to fit below the "Sold By" and "Billing Address"
      head: headers,
      body: tableData,
      columnStyles: {
        0: { cellWidth: 20 }, // Sl. No
        1: { cellWidth: 50 }, // Description
        2: { cellWidth: 20 }, // Unit Price
        3: { cellWidth: 15 }, // Unit Price
        4: { cellWidth: 25 }, // Discount
        5: { cellWidth: 25 }, // Qty
        6: { cellWidth: 25 }, // Total Amount
      },
      styles: {
        fontSize: 10,
        lineColor: [0, 0, 0], // Border color (black)
        lineWidth: 0.3, // Border width
        backgroundColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [185, 28, 28], // Background color for headers (red)
        textColor: [255, 255, 255], // Text color for contrast (white)
        lineColor: [0, 0, 0], // Border color for headers
        lineWidth: 0.3, // Border width for headers
      },
    });

    // Define margins and padding
    const rightMargin = 190; // Adjust as needed for your page width

    // Set font size and add "TOTAL PAID:" line
    doc.setFontSize(12);

    // SubTotal
    doc.text(
      "SubTotal :",
      rightMargin - 25,
      doc.autoTable.previous.finalY + 10,
      { align: "right" }
    );
    doc.text(
      `${
        "$" +
        (order.grand_total + order.discount - order.delivery_charge).toFixed(2)
      }`,
      rightMargin,
      doc.autoTable.previous.finalY + 10,
      {
        align: "right",
      }
    );

    // Discount
    doc.text(
      "Discount :",
      rightMargin - 25,
      doc.autoTable.previous.finalY + 15,
      { align: "right" }
    );
    doc.text(
      `${"$" + order.discount.toFixed(2)}`,
      rightMargin,
      doc.autoTable.previous.finalY + 15,
      {
        align: "right",
      }
    );

    // Delivery Charge
    if (orderType !== "Pickup") {
      doc.text(
        "Delivery Charge :",
        rightMargin - 25,
        doc.autoTable.previous.finalY + 20,
        { align: "right" }
      );
      doc.text(
        `${"$" + order.delivery_charge.toFixed(2)}`,
        rightMargin,
        doc.autoTable.previous.finalY + 20,
        {
          align: "right",
        }
      );
    }

    // Total Paid
    doc.text(
      "Total Paid :",
      rightMargin - 25,
      doc.autoTable.previous.finalY + 30,
      { align: "right" }
    );
    doc.text(
      `${"$" + order.grand_total.toFixed(2)}`,
      rightMargin,
      doc.autoTable.previous.finalY + 30,
      {
        align: "right",
      }
    );

    // Define payment table headers and data
    const paymentTableHeaders = [
      [
        "Date & Time",
        "Invoice Value",
        "Mode of Payment",
        "Payment Transaction ID",
      ],
    ];

    const paymentTableData = [
      [
        `${orderdatetime}`,
        `${order.grand_total.toFixed(2)}`,
        `${order.payment_mode}`,
        `${order.unique_id}`,
      ],
    ];

    // Generate Payment Table
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 40, // Start Y position for the payment table
      head: paymentTableHeaders,
      body: paymentTableData,
      columnStyles: {
        0: { cellWidth: 45 }, // Adjust column widths as needed
        1: { cellWidth: 25 }, // Adjust column widths as needed
        2: { cellWidth: 35 }, // Adjust column widths as needed
        3: { cellWidth: 75 }, // Adjust column widths as needed
      },
      styles: {
        fontSize: 10,
        lineColor: [0, 0, 0], // Border color (black)
        lineWidth: 0.3, // Border width
      },
      headStyles: {
        fillColor: [185, 28, 28], // Background color for headers (red)
        textColor: [255, 255, 255], // Text color for contrast (white)
        lineColor: [0, 0, 0], // Border color for headers
        lineWidth: 0.3, // Border width for headers
      },
    });

    // Footer Text
    doc.text(
      "Whether tax is payable under reverse charge - No",
      20,
      doc.autoTable.previous.finalY + 20
    ); // Adjusted to place after the table

    // Signature
    doc.text("Authorized Signatory", 150, doc.autoTable.previous.finalY + 50);

    // Save the PDF
    doc.save("Invoice.pdf");
  };

  const formatText = (text) => {
    const words = text.split(" ");
    const formattedText = [];
    for (let i = 0; i < words.length; i += 50) {
      formattedText.push(words.slice(i, i + 50).join(" "));
    }
    return formattedText.map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  // console.log(order);

  // Pickup Date Formatting
  const pickupDate = new Date(order?.pickup_date);

  // Format the date as MM/DD/YYYY
  const formattedPickupDate = `${String(pickupDate.getDate()).padStart(
    2,
    "0"
  )}/${String(pickupDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${pickupDate.getFullYear()}`;

  // Order Date Formatting
  const orderDate = new Date(order?.date_time);
  const formattedOrderDate = `${String(orderDate.getDate()).padStart(
    2,
    "0"
  )}/${String(orderDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${orderDate.getFullYear()}`;

  return (
    <section className="h-100 bg-gray-100 py-5">
      <h1 className="flex justify-center text-3xl text-red-600 font-semibold mb-4">
        Order Details
      </h1>
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-full">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <p className="text-lg font-semibold text-[#B91C1C] mb-2 sm:mb-0">
                  Invoice
                </p>
                <button
                  className="font-bold mb-2 md:mb-0 shadow-md border w-40 h-9"
                  onClick={() =>
                    generatePDF(
                      productDetails,
                      order,
                      orderType,
                      displayAddress
                    )
                  }
                >
                  Download Invoice
                </button>
              </div>
              <div className="m-5 w-[45%] custom-width">
                <b>Bill to: </b>
                {displayName.first_name} {displayName.last_name}
                <br />
                <p>
                  <b>Order Type:</b> {orderType}
                </p>
                <p
                  style={{
                    display: "block",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "50ch", // Restrict the line width to approximately 50 characters
                  }}
                >
                  {orderType !== "Pickup" ? (
                    <>
                      <b>Address:</b> {displayAddress}
                    </>
                  ) : (
                    <>
                      <p>
                        <b>Store Name:</b> {storeSliceData.store?._id}
                      </p>
                      <p>
                        <b>Pickup Date:</b> {formattedPickupDate}
                      </p>
                    </>
                  )}
                </p>
              </div>
              {productDetails.map((product, index) => (
                // Mobile View
                <div
                  key={index}
                  className="border md:hidden shadow-sm mb-4 p-1 rounded-md"
                >
                  <div className="block ">
                    <div className="flex flex-row justify-around overflow-hidden">
                      <div className="w-1/2 p-1">
                        <img
                          src={`${imageUrl}/${product.product.cover}`}
                          alt={product.name}
                          className="rounded-md "
                        />
                      </div>
                      <div className="p-1 w-1/2">
                        <p className="text-sm font-semibold ">
                          {product.product.size === "variations" &&
                          product.variationId !== ""
                            ? `${product.product.name} - ${
                                product.product.variations.find(
                                  (item) => item._id === product.variationId
                                )?.name
                              }`
                            : product.product?.name}
                        </p>
                        <p className="">
                          <span className="font-bold">Qty- </span>
                          {product.weight > 0
                            ? `${product.quantity}`
                            : `${product.quantity}`}
                        </p>
                        <p className="">
                          <span className="font-bold">Weight- </span>
                          {product.weight > 0 ? `${product.weight} ` : `-`}
                        </p>

                        <p className="flex-1 text-start">
                          <span className="font-bold">Price- $</span>
                          {product.product.size === "variations" &&
                          product.variationId !== ""
                            ? product.product.variations
                                .find(
                                  (item) => item._id === product.variationId
                                )
                                ?.sell_price.toFixed(2)
                            : product?.product?.sell_price.toFixed(2)}
                          /{product.product.unit}
                        </p>
                        <p className="font-semibold">
                          <span className="font-bold">Subprice- $</span>
                          {product.weight
                            ? (
                                product.weight *
                                product.quantity *
                                (product.product.size === "variations" &&
                                product.variationId !== ""
                                  ? product.product.variations.find(
                                      (item) => item._id === product.variationId
                                    )?.sell_price
                                  : product.product.sell_price)
                              ).toFixed(2)
                            : (
                                product.quantity *
                                (product.product.size === "variations" &&
                                product.variationId !== ""
                                  ? product.product.variations.find(
                                      (item) => item._id === product.variationId
                                    )?.sell_price
                                  : product.product.sell_price)
                              ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border hidden md:block shadow-sm mb-4 p-1 rounded-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm text-gray-600">
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Qty</th>
                        <th className="px-4 py-2">Weight</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Discount</th>
                        <th className="px-4 py-2">Subprice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDetails.map((product, index) => (
                        <tr key={index} className="">
                          {/* Image Column */}
                          <td className="px-4 py-2">
                            <img
                              src={`${imageUrl}/${product.product.cover}`}
                              alt={product.name}
                              className="rounded-md h-[80px] w-[120px]"
                            />
                          </td>

                          {/* Name Column */}
                          <td className="px-4 py-2 capitalize">
                            <span>
                              {product.product.size === "variations" &&
                              product.variationId !== ""
                                ? `${product.product.name} - ${
                                    product.product.variations.find(
                                      (item) => item._id === product.variationId
                                    )?.name
                                  }`
                                : product.product?.name}
                            </span>
                          </td>

                          {/* Qty Column */}
                          <td className="px-4 py-2 ">
                            {product.weight > 0
                              ? `${product.quantity}`
                              : `${product.quantity}`}
                          </td>
                          {/* Weight Column */}
                          <td className="px-4 py-2 ">
                            {product.weight > 0 ? `${product.weight}` : `-`}
                          </td>
                          {/* Price Column */}
                          <td className="px-4 py-2">
                            {/* <span>{product.product?.original_price?.toFixed(2)}/{product.product.unit}</span> */}
                            <span>
                              $
                              {product.product.size === "variations" &&
                              product.variationId !== ""
                                ? product.product.variations
                                    .find(
                                      (item) => item._id === product.variationId
                                    )
                                    ?.sell_price.toFixed(2)
                                : product?.product?.sell_price.toFixed(2)}
                              /{product.product.unit}
                            </span>
                          </td>

                          {/* Discount Column */}
                          <td className="px-4 py-2 ">
                            {product.product.size === "variations" &&
                            product.variationId !== ""
                              ? product.product.variations
                                  .find(
                                    (item) => item._id === product.variationId
                                  )
                                  ?.discount.toFixed(2)
                              : product.product?.discount?.toFixed(2) || 0}{" "}
                            %
                          </td>

                          {/* Subprice Column */}
                          <td className="px-4 py-2 ">
                            ${" "}
                            {product.weight
                              ? (
                                  product.weight *
                                  product.quantity *
                                  (product.product.size === "variations" &&
                                  product.variationId !== ""
                                    ? product.product.variations.find(
                                        (item) =>
                                          item._id === product.variationId
                                      )?.sell_price
                                    : product.product.sell_price)
                                ).toFixed(2)
                              : (
                                  product.quantity *
                                  (product.product.size === "variations" &&
                                  product.variationId !== ""
                                    ? product.product.variations.find(
                                        (item) =>
                                          item._id === product.variationId
                                      )?.sell_price
                                    : product.product.sell_price)
                                ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap justify-between pt-2">
                <div className="flex-1 min-w-[200px] px-2">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <p className="text-gray-600">Notes: {order.notes}</p>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <p className="text-gray-600">
                      Order Id: {order.order_number}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between">
                    <p className="text-gray-600">
                      Order Date: {formattedOrderDate}
                    </p>
                  </div>
                </div>

                {/* <div className="flex min-w-[200px] px-2"> */}

                <div className="flex flex-row mb-2 mt-1">
                  <div className="flex flex-col items-end mr-4">
                    <span className="font-bold">SubTotal</span>
                    <span className="font-bold">Discount</span>
                    {orderType !== "Pickup" && (
                      <span className="font-bold">Delivery Charges</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="text-gray-600">
                      $
                      {(
                        order.grand_total +
                        order.discount -
                        order.delivery_charge
                      ).toFixed(2)}
                    </p>
                    <p className="text-gray-600">
                      ${order.discount.toFixed(2)}
                    </p>
                    {orderType !== "Pickup" && (
                      <p className="text-gray-600">
                        ${order.delivery_charge.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 bg-[#B91C1C] rounded-b-lg">
              <h5 className="text-white text-lg font-semibold text-right">
                Total:{" "}
                <span className="text-2xl">
                  ${order.grand_total.toFixed(2)}
                </span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
