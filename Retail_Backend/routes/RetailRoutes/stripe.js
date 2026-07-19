const express = require("express");
const order = require("../../models/order");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/", async (req, res) => {
  const { product, orderDetail } = req.body;
  const newOrder = await order.create(orderDetail);
  console.log("stripe data", process.env.STRIPE_SECRET);
  console.log(orderDetail);

  // Define your discount and delivery charges
  const discountAmount = orderDetail.discount || 0; // Assuming discount is sent in the orderDetail
  const deliveryCharge = orderDetail.delivery_charge || 0; // Assuming delivery charge is sent in the orderDetail
  console.log(deliveryCharge);
  const lineitems = product.product_details.map((item) => ({
    price_data: {
      currency: "aud",
      product_data: {
        name: item.product.name,
        images: [`http://13.203.57.229/images/${item.product.cover}`],
      },
      unit_amount: Math.round(
        item.product.size === "slider"
          ? item.product.sell_price.toFixed(2) * item.weight * 100
          : item.product.sell_price * 100
      ),
    },
    quantity: item.quantity,
  }));

  // Add discount line item (if applicable)
  if (discountAmount > 0) {
    lineitems.push({
      price_data: {
        currency: "aud",
        product_data: {
          name: "Discount",
        },
        unit_amount: -Math.round(discountAmount * 100), // Negative value for discount
      },
      quantity: 1,
    });
  }

  // Add delivery charge line item
  if (deliveryCharge > 0) {
    lineitems.push({
      price_data: {
        currency: "aud",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: Math.round(deliveryCharge * 100), // Positive value for delivery
      },
      quantity: 1,
    });
  }

  lineitems.map((item) => console.log("lineItems ", item));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineitems,
    mode: "payment",
    // success_url:"https://www.greenfarmmeatnswhalal.com.au/success?session_id={CHECKOUT_SESSION_ID}",
    success_url:
      "http://13.201.57.251/success?session_id={CHECKOUT_SESSION_ID}",
    // cancel_url:"https://www.greenfarmmeatnswhalal.com.au/failed?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://13.201.57.251/failed?session_id={CHECKOUT_SESSION_ID}",
    metadata: {
      orderDetail: JSON.stringify(newOrder._id),
    },
  });

  res.json({ id: session.id });
});

router.get("/fetchsession", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    res.json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
