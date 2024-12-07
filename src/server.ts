import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer"; // Import multer
import path from "path";

// Routes
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import bookingRoutes from "./routes/bookingRoutes";

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes); // Attach multer to handle file upload
app.use("/api/bookings", bookingRoutes);

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
