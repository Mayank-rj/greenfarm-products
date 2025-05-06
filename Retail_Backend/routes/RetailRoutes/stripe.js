const express = require("express");
const order = require("../../models/order");
const router = express.Router();

const stripe=require("stripe")(process.env.STRIPE_SECRET)

router.post("/",async(req,res)=>{
    const {product,orderDetail}=req.body;
    
    
    const newOrder = await order.create(orderDetail);
    console.log("stripe data" ,newOrder._id);
    const lineitems = product.product_details.map((item) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: item.product.name,
            images: [`http://43.204.248.180/images/${item.product.cover}`] 
 
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.quantity,
      }));

    const session =await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineitems,
        mode:"payment",
        success_url:"http://43.204.248.180/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url:"http://43.204.248.180/failed?session_id={CHECKOUT_SESSION_ID}",
        metadata: {
            orderDetail:JSON.stringify(newOrder._id), 
          },
    })
    res.json({id:session.id})
})


router.get("/fetchsession", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
      res.json({ session });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;