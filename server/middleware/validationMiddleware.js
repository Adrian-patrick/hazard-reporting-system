import mongoose from 'mongoose';

// Validate hazard input
export const validateHazardInput = (req, res, next) => {
    const { title, description, type, severity, location, images } = req.body;

    if (!title || title.length < 5) {
        return res.status(400).json({ error: "Title must be at least 5 characters long." });
    }
    if (!description || description.length < 10) {
        return res.status(400).json({ error: "Description must be at least 10 characters long." });
    }
    if (!type) {
        return res.status(400).json({ error: "Hazard type is required." });
    }
    if (!severity) {
        return res.status(400).json({ error: "Hazard severity is required." });
    }
    if (!location || !location.latitude || !location.longitude) {
        return res.status(400).json({ error: "Valid location (latitude & longitude) is required." });
    }

    // ✅ If images is missing or empty, set a default placeholder image
    if (!images || !Array.isArray(images) || images.length === 0) {
        req.body.images = ["https://example.com/default-image.jpg"];
    }

    next();
};

// Validate MongoDB ObjectId
export const validateMongoId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid hazard ID." });
    }
    next();
};
