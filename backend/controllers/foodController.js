// import foodModel from "../models/foodModel.js";
// import fs from 'fs'

// // all food list
// const listFood = async (req, res) => {
//     try {
//         const foods = await foodModel.find({})
//         res.json({ success: true, data: foods })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }

// }

// // add food
// const addFood = async (req, res) => {

//     let image_filename = `${req.file.filename}`

//     const food = new foodModel({
//         name: req.body.name,
//         description: req.body.description,
//         price: req.body.price,
//         category:req.body.category,
//         image: image_filename,
//     })
//     try {
//         await food.save();
//         res.json({ success: true, message: "Food Added" })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }

// // delete food
// const removeFood = async (req, res) => {
//     try {

//         const food = await foodModel.findById(req.body.id);
//         fs.unlink(`uploads/${food.image}`, () => { })

//         await foodModel.findByIdAndDelete(req.body.id)
//         res.json({ success: true, message: "Food Removed" })

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }

// }

// export { listFood, addFood, removeFood }
import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// List all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// Add food
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "food", // Upload images inside the 'food' folder in Cloudinary
    });

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    // Create food item
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: cloudinaryResponse.secure_url, // Store Cloudinary URL
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully", data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// Delete food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Extract Cloudinary public_id from image URL
    const publicId = food.image.split("/").pop().split(".")[0];

    // Remove image from Cloudinary
    await cloudinary.uploader.destroy(`food/${publicId}`);

    // Remove food entry from database
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { listFood, addFood, removeFood };
