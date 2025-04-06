const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Unique filename
  },
});

// File filter (allow only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image files are allowed"), false);
  }
};

// Function to convert image file to Base64
const convertImageToBase64 = (filePath) => {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    return `data:image/${path.extname(filePath).substring(1)};base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error("❌ Error converting image to Base64:", error.message);
    return null;
  }
};

// Set up multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware to process uploaded files and convert to Base64
const processImagesToBase64 = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(); // No files uploaded, continue without modification
  }

  try {
    req.filesBase64 = req.files.map((file) => convertImageToBase64(file.path));
    next();
  } catch (error) {
    return res.status(500).json({ error: "❌ Error processing images" });
  }
};

module.exports = { upload, processImagesToBase64 };
