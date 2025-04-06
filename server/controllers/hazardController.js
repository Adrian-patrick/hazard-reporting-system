import asyncHandler from "express-async-handler";
import axios from "axios";
import path from "path";
import fs from "fs";
import Hazard from "../models/hazardModel.js";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const ML_BASE_URL =;

// 🔧 Logger utility
const logStep = (icon, message, data = null) => {
  console.log(`[0] ${icon} ${message}`);
  if (data) console.dir(data, { depth: null });
};

// 🔹 Text Classification
const classifyText = async (description) => {
  try {
    logStep("📡", "Sending data to ML model for text classification...");

    const formData = new URLSearchParams();
    formData.append("description", description);

    const response = await axios.post(`${ML_BASE_URL}/classify/text/`, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    logStep("✅", "ML Model Text Response:", response.data);
    return response.data.predicted_class;
  } catch (err) {
    console.error("❌ Text classification error:", err.message);
    return null;
  }
};

// 🔹 Image Classification (using base64)
const classifyImage = async (imagePath) => {
  try {
    logStep("📡", "Reading image and sending to ML model (base64)...");

    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    const response = await axios.post(`${ML_BASE_URL}/classify/image/`, {
      image_base64: imageBase64,
    });

    logStep("✅", "ML Model Image Response:", response.data);
    return response.data.predicted_class;
  } catch (err) {
    console.error("❌ Image classification error:", err.message);
    return null;
  }
};

// 🔹 Priority Prediction
const predictHazardPriority = async (hazardData) => {
  try {
    logStep("📡", "Sending data to ML model for priority prediction...");

    const formData = new URLSearchParams();
    formData.append("lat", parseFloat(hazardData.location.latitude).toString());
    formData.append("lon", parseFloat(hazardData.location.longitude).toString());

    const response = await axios.post(`${ML_BASE_URL}/priority/`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 5000,
    });

    logStep("✅", "ML Model Priority Response:", response.data);
    return response.data.priority || "Low";
  } catch (error) {
    console.error("❌ ML Model API Error:", error.response?.data || error.message);
    return "Low";
  }
};

// 🔸 Create Hazard Report
const createHazard = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized. Please log in." });

  const { title, description, type, severity, location } = req.body;

  if (!title || !description || !severity || !location?.latitude || !location?.longitude) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // 📸 Handle image uploads
  let images = [];
  const serverBaseUrl = process.env.SERVER_BASE_URL || "http://localhost:5000";

  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => {
      const publicUrl = `${serverBaseUrl}/uploads/${file.filename}`;
      logStep("🖼️", "Constructed public image URL:", publicUrl);
      return publicUrl;
    });
  } else {
    logStep("⚠️", "No images provided.");
    images = [];
  }

  // 🧠 ML: Text Classification
  const predictedTextType = await classifyText(description);

  // 🧠 ML: Image Classification (using first uploaded image)
  let predictedImageType = null;
  if (req.files && req.files.length > 0) {
    const firstImagePath = req.files[0].path;
    predictedImageType = await classifyImage(firstImagePath);
  } else {
    logStep("⚠️", "No image provided — skipping image classification.");
  }

  // 🎯 Final Type Selection
  const finalType = predictedTextType || predictedImageType || type;

  // 🔮 ML: Predict Priority
  const predictedPriority = await predictHazardPriority({
    title,
    description,
    type: finalType,
    severity,
    location,
    images,
  });

  // 💾 Save to MongoDB
  const hazard = await Hazard.create({
    title,
    description,
    type: finalType,
    severity,
    location: {
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      address: location.address || "Unknown Address",
    },
    images,
    reportedBy: req.user._id,
    status: "reported",
    predictedPriority,
  });

  res.status(201).json({ message: "Hazard reported successfully", hazard });
});

// 🔸 Get All Hazards
const getHazards = asyncHandler(async (req, res) => {
  const hazards = await Hazard.find().populate("reportedBy", "name email");
  res.json(hazards);
});

// 🔸 Get Hazard By ID
const getHazardById = asyncHandler(async (req, res) => {
  const hazard = await Hazard.findById(req.params.id).populate("reportedBy", "name email");
  if (!hazard) return res.status(404).json({ error: "Hazard not found" });
  res.json(hazard);
});

// 🔸 Get Nearby Hazards
const getNearbyHazards = asyncHandler(async (req, res) => {
  let { latitude, longitude, radius = 5 } = req.query;

  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);
  radius = parseFloat(radius) * 1000;

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid latitude or longitude values." });
  }

  const hazards = await Hazard.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius / 6378100],
      },
    },
  }).populate("reportedBy", "name");

  res.json(hazards);
});

// 🔸 Update Hazard Status
const updateHazardStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["reported", "in-progress", "resolved", "dismissed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const hazard = await Hazard.findById(req.params.id);
  if (!hazard) return res.status(404).json({ error: "Hazard not found" });

  hazard.status = status;
  await hazard.save();

  res.json({ message: "Hazard status updated", hazard });
});

// 🔸 Get Hazard Stats
const getHazardStats = asyncHandler(async (req, res) => {
  const totalHazards = await Hazard.countDocuments();
  const hazardByType = await Hazard.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);

  res.json({ totalHazards, hazardByType });
});

// ✅ Export Controllers
export {
  createHazard,
  getHazards,
  getHazardById,
  getNearbyHazards,
  updateHazardStatus,
  getHazardStats,
};
