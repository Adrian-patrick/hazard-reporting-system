import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import hazardRoutes from "./routes/hazardRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import Hazard from "./models/hazardModel.js";
import logger from "./utils/logger.js";

dotenv.config();
connectDB();

const app = express();
app.use("/uploads", express.static("uploads"));

// ✅ Security
app.use(helmet());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// ✅ Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// ✅ Ensure Upload Folder
const __dirname = path.resolve();
const uploadPath = path.join(__dirname, "/uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/hazards", hazardRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ ML Integration for hazard classification
app.post("/api/hazards", upload.single("image"), async (req, res) => {
  try {
    const { description, latitude, longitude, address, type, timeOfDay } = req.body;
    let image_base64 = null;

    if (req.file) {
      const imagePath = path.join(uploadPath, req.file.filename);
      image_base64 = fs.readFileSync(imagePath, { encoding: "base64" });
    }

    // Step 1: Text Classification
    let predictedClass = null;
    if (description) {
      const { data } = await axios.post(`${process.env.ML_API_URL}/classify/text/`, {
        text: description,
      });
      predictedClass = data?.predicted_class || null;
    }

    // Step 2: Image Classification
    let predictedImageClass = null;
    if (image_base64) {
      const { data } = await axios.post(`${process.env.ML_API_URL}/classify/image/`, {
        image_base64,
      });
      predictedImageClass = data?.predicted_class || null;
    }

    // Step 3: Hazard Priority Prediction
    const priorityResponse = await axios.post(`${process.env.ML_API_URL}/priority/`, {
      type: predictedClass || predictedImageClass || type,
      location_type: "urban", // You can update this dynamically
      surrounding_hazards_count: 2,
      time_of_day: timeOfDay || "morning",
    });

    const priorityScore = priorityResponse.data?.priority_score || null;

    // Create and Save Hazard
    const hazardReport = new Hazard({
      description,
      type: predictedClass || predictedImageClass || type,
      predictedClass,
      predictedImageClass,
      priorityScore,
      location: {
        latitude,
        longitude,
        address,
      },
      image: req.file ? `/uploads/${req.file.filename}` : null,
      timestamp: new Date(),
    });

    await hazardReport.save();
    res.status(201).json({ message: "Hazard report created", hazardReport });
  } catch (error) {
    logger.error("❌ Error in hazard classification:", error.message);
    res.status(500).json({ message: "Error creating hazard report", error: error.message });
  }
});

// ✅ Custom Middleware
app.use(notFound);
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error("💥 Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});
