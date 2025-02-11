import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";

dotenv.config();
// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());

// Enable CORS for all origins (open access)
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Enable cookies or other credentials if needed
  })
);

// db connection
connectDB();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
