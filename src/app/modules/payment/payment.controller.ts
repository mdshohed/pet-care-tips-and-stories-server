
import httpStatus from "http-status";
import config from "../../config";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
const stripe = require("stripe")(config.stripe_secret_kay);


const createClientSecret = catchAsync(async (req, res) => {
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

const createPayment = catchAsync(async (req, res) => {
  const user = await PaymentServices.createPayment(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Created Successfully',
    data: user,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const users = await PaymentServices.getAllPaymentsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payments Retrieved Successfully',
    data: users,
  });
});

export const PaymentControllers = {
  createClientSecret,
  getAllPayments,
  createPayment,
};
