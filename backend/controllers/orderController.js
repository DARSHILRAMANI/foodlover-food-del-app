import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import mongoose from "mongoose";

// Placing User Order for Frontend

const placeOrder = async (req, res) => {
  try {
    // Create a new order using the order model
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Update the user's cart data after the order is placed
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Convert the saved order's ObjectId to a string
    const objectIdString = savedOrder._id.toString();
    // Logs the order's ObjectId as a string

    // Return success response with the orderId as a string
    res.json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.log(error);
    // Return error response if something goes wrong
    res.json({ success: false, message: "Error" });
  }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  console.log(req.body);
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.body;

//   try {
//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       res.json({ success: true, message: "Paid" });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.json({ success: false, message: "Not Paid" });
//     }
//   } catch (error) {
//     res.json({ success: false, message: "Not  Verified" });
//   }
// };

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  console.log(success);
  try {
    if (!success) {
      await orderModel.findByIdAndDelete(orderId);
    }
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    res.json({ success: true, message: "Paid" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder };
