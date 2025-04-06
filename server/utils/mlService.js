import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

const ML_MODEL_API_URL = "http://localhost:5000/predict_priority";  // ✅ FastAPI ML API

export const predictHazardPriority = async (hazardData, imageFile) => {
  try {
    console.log("🔹 Sending data to ML model for prediction:", hazardData);

    const formData = new FormData();
    formData.append("description", hazardData.description);

    // ✅ Check if image file exists before attaching
    if (imageFile?.path && fs.existsSync(imageFile.path)) {
      formData.append("file", fs.createReadStream(imageFile.path));
    } else {
      console.warn("⚠️ No valid image file provided. Sending request without an image.");
    }

    const response = await axios.post(ML_MODEL_API_URL, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 5000,  // ✅ Add timeout to prevent hanging requests
    });

    console.log("✅ ML Prediction Response:", response.data);
    return response.data.predicted_priority || "Low";  // ✅ Default to "Low" if API fails
  } catch (error) {
    console.error("❌ ML Model API Error:", error.response?.data || error.message);
    return "Low";
  }
};
