
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
const stripe = require("stripe")(config.stripe_secret_kay);


const createPayment = catchAsync(async (req, res) => {
  const { price } = req.body;
  // console.log("value", price*1000);
  
  const amount = price*100; 
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: [
      'card'
    ],    
  });
  console.log("data", paymentIntent.client_secret);
  
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

export const StripeControllers = {
  createPayment
};
