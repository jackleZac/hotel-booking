// src/server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
