import SITE_CONFIG from "../../controller";

export const adminEmail = (orderDetail, userprofile, store) => {
  if (!orderDetail) {
    console.error("Order details are missing");
    return;
  }

  return {
    // to:["pos.sendemail@gmail.com", "surajjohal1@yahoo.com.au"], // Hotel admin email
    to: ["mayank.kumar.rajoria@gmail.com"],
    subject: `New Order Received - ${orderDetail.order_number}`,
    html: `
      <h1>New Order Received</h1>
      <p>Dear Admin,</p>
      <p>A new order has been placed by ${userprofile.first_name} ${userprofile.last_name}.</p>
      
      <h2>Order Details</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tbody>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Web Order Number:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${orderDetail.order_number}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Order Time:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${new Date(orderDetail.date_time).toLocaleString()}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Customer Name:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${userprofile.first_name} ${userprofile.last_name}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Customer Number:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${userprofile.mobile}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Customer Email:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${userprofile.email}</td></tr>
        </tbody>
      </table>

      <h2>Order Summary</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color:rgb(185, 28, 28); color:white;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Image</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetail?.product_details &&
      JSON.parse(orderDetail?.product_details)
        ?.map(
          (item) => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.product.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><img src="${SITE_CONFIG.imageUrl}/${item.product.cover}" alt="${item.product.name}" style="width: 80px; height: auto;" /></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${item.price}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `
        )
        .join("")
      }
        </tbody>
      </table>
      <h3>${orderDetail.deliverytype === "delivery" ? `<p>Delivery Charge: $${orderDetail.delivery_charge}</p>` : ""}</h3>
      <h3>Total Amount: $${orderDetail.grand_total}</h3>
       <p>Remark: ${orderDetail.notes || "No additional remark"}</p>
        ${orderDetail.deliverytype === "delivery"
        ? `<p>Delivery Address: ${orderDetail.address}</p>`
        : `
            <p>Pickup Address: ${store?.address || "Not Available"}</p>
            <p>Pickup Date: ${new Date(orderDetail.date_time).toISOString().split("T")[0]}</p>
          `
      }
      <p>Please process this order at the earliest convenience.</p>
      <p>Thank you!</p>

      <hr>
      <table style="width: 100%; margin-top: 20px;">
        <tr>
          <td style="width: 150px;"><img src=${SITE_CONFIG.imageUrl}/${store?.cover} alt=${store?.name} style="width: 100px; height: auto;" /></td>
          <td>
            <p><strong>${store?.name}</strong></p>
            <p>${store?.address}</p>
            <p>Contact: ${store?.mobile}</p>
            <p>Website: <a href="https://greenfarmstore.com" target="_blank">greenfarmstore.com</a></p>
          </td>
        </tr>
      </table>
    `,
  };
};
