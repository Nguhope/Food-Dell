import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import upload from "./middleware/upload.js"; // Make sure this handles image uploads
import userRouter from "./routes/userRoute.js";  // Correct import statement
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


// App Configuration

const app = express();
const port = 4000;


// Middleware

app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

/// API Endpoints

// Handle food routes (including food listing, addition, etc.)
app.use("/api/food", foodRouter);

// Serve images from the "uploads" folder at /images route
app.use("/images", express.static("uploads"));

// User API routes
app.use("/api/user", userRouter);  // Corrected the route handling

//Cart Api
app.use("/api/cart",cartRouter)

// Order Api
app.use("/api/order",orderRouter)


// POST route for uploading images (handled by multer)
app.post("/upload", upload, (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  // Return the file path or URL to the client after upload
  const imageUrl = `/images/${req.file.filename}`;
  res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl: imageUrl,
  });
});

// Default Route
app.get("/", (req, res) => {
  res.send("Food-Del API is Working");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
