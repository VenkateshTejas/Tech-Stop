import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./service/db/connect.js";
import "express-async-errors";
import errorHandlerMiddleware from "./service/middleware/error-handler.js";
import notFound from "./service/middleware/not-found.js";
import authRoute from "./service/routes/auth/authRoute.js";
import adminProductRoute from "./service/routes/admin/productRoute.js";
import adminOrdersRoute from "./service/routes/admin/order-routes.js";
import commonFeatureRoute from "./service/routes/common/feature-routes.js";
import shopProductsRoute from "./service/routes/shop/productsRoute.js";
import shopCartRoute from "./service/routes/shop/cartRoute.js";
import shopAddressRoute from "./service/routes/shop/addressRoute.js";
import shopOrderRoute from "./service/routes/shop/orderRoutes.js";
import shopProductReviewRoute from "./service/routes/shop/productReviewRoute.js";
import shopProductsSearchRoute from "./service/routes/shop/searchRoute.js";
dotenv.config();

import fileUpload from "express-fileupload";
// USE v2
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

// To provide access of this Server to the cross platform, in this case it is the frontend webpage that works on port 5173
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
// To parse incoming cookie from the HTTP requests
app.use(cookieParser());
// To Parse JSON data coming from the req.body
app.use(express.json());
// We are using cloudinary over here in this project to upload image files to the server, as here we are setting this in such manner that once the file gets uploaded to the cloudinary then the local file will automatically gets deleted
app.use(fileUpload({ useTempFiles: true }));

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// user's authentication Route
app.use("/api/v1/auth", authRoute);
// adminProductRoute
app.use("/api/v1/admin/products", adminProductRoute);
// Admin Orders management route
app.use("/api/v1/admin/orders", adminOrdersRoute);

// Common route to handle the featured products slider
app.use("/api/v1/common/feature", commonFeatureRoute);

// Shop Routes
// Products route for shop
app.use("/api/v1/shop/products", shopProductsRoute);
// Cart route for shop
app.use("/api/v1/shop/cart", shopCartRoute);
// User's address route for shop
app.use("/api/v1/shop/address", shopAddressRoute);
// Order routes for shop
app.use("/api/v1/shop/order", shopOrderRoute);
// Product Review Routes for shop
app.use("/api/v1/shop/review", shopProductReviewRoute);
// Shop Route for searching products in shop
app.use("/api/v1/shop/search", shopProductsSearchRoute);

// Error Handler Middleware that sends the custom Error message
app.use(errorHandlerMiddleware);
// To handle unwanted access to the route that doesnt exist
app.use(notFound);

// PORT set to 8000 if not found in env file
const PORT = process.env.PORT || 8000;
const start = async () => {
  try {
    // Connect with the DB and then start the server
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
