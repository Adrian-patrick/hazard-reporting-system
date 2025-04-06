import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import {
  createHazard,
  getHazards,
  getHazardById,
  updateHazardStatus,
  getNearbyHazards,
  getHazardStats,
} from "../controllers/hazardController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateHazardInput, validateMongoId } from "../middleware/validationMiddleware.js";

const router = express.Router();

// ✅ Ensure Uploads Directory Exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Function to save Base64 image securely
const saveBase64Image = (base64String) => {
  try {
    const matches = base64String.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!matches) return null;

    const ext = matches[1].toLowerCase(); // Ensure lowercase extension
    const data = matches[2]; // Base64 content

    const allowedFormats = ["png", "jpeg", "jpg"];
    if (!allowedFormats.includes(ext)) return null;

    // Generate unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(data, "base64"));
    return `/uploads/${fileName}`; // Return relative path
  } catch (error) {
    console.error("❌ Error saving Base64 image:", error);
    return null;
  }
};

// ✅ Upload Base64 Image Route
router.post("/upload", protect, async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ message: "❌ No image provided" });

    const imagePath = saveBase64Image(imageBase64);
    if (!imagePath) return res.status(500).json({ message: "❌ Failed to process image" });

    const photoUrl = `${req.protocol}://${req.get("host")}${imagePath}`;
    res.status(200).json({ photoUrl });
  } catch (error) {
    console.error("❌ Image upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Create Hazard Report (Supports Base64 Image)
router.post("/", protect, validateHazardInput, async (req, res, next) => {
  try {
    if (req.body.imageBase64) {
      const imagePath = saveBase64Image(req.body.imageBase64);
      req.body.photoUrl = imagePath
        ? `${req.protocol}://${req.get("host")}${imagePath}`
        : "https://example.com/default-image.jpg"; // Fallback
    }

    createHazard(req, res, next);
  } catch (error) {
    console.error("❌ Error processing hazard report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all hazards
router.get("/", protect, getHazards);

// ✅ Get nearby hazards
router.get("/nearby", protect, getNearbyHazards);

// ✅ Get hazard statistics (Admin/Authority only)
router.get("/stats", protect, authorize("authority", "admin"), getHazardStats);

// ✅ Get a single hazard by ID
router.get("/:id", protect, validateMongoId, getHazardById);

// ✅ Update hazard status (Only Admin/Authority)
router.put("/:id/status", protect, authorize("authority", "admin"), validateMongoId, updateHazardStatus);

// ✅ Chain: Image + Text Classification + Priority Prediction
router.post("/predict/full", protect, async (req, res) => {
  try {
    const { imageUrl, text, locationType, surroundingHazards, timeOfDay } = req.body;

    // 🔍 Step 1: Image Classification
    const imageRes = await axios.post(`${process.env.ML_API_URL}/classify/image`, { imageUrl });
    const hazardType = imageRes.data?.prediction || "Unknown";

    // 🧠 Step 2: Text Classification
    const textRes = await axios.post(`${process.env.ML_API_URL}/classify/text`, { text });
    const refinedHazardType = textRes.data?.prediction || hazardType;

    // 🚦 Step 3: Priority Prediction
    const priorityRes = await axios.post(`${process.env.ML_API_URL}/predict/priority`, {
      hazardType: refinedHazardType,
      locationType,
      surroundingHazards,
      timeOfDay,
    });

    res.json({
      imageClassification: imageRes.data,
      textClassification: textRes.data,
      priorityPrediction: priorityRes.data,
    });
  } catch (error) {
    console.error("❌ Chained Prediction Error:", error.message);
    res.status(500).json({ message: "Prediction chain failed", error: error.message });
  }
});

// ✅ Chatbot Endpoint
router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post(`${process.env.ML_API_URL}/chat/`, { message });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Chatbot Error:", error.message);
    res.status(500).json({ message: "Chatbot response failed", error: error.message });
  }
});

export default router;
