import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// ✅ Ensure 'uploads/' directory exists before storing files
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// ✅ Validate file type and limit file size
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter(req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
    }
    cb(null, true);
  }
});

// ✅ Handle file upload
router.post('/', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // ✅ Return the correct file URL
    res.json({ photoUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("❌ File upload error:", error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// ✅ Serve uploaded images statically
router.use('/uploads', express.static(uploadDir));

export default router;
