import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js"; // Ensure the correct path

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  console.log("🔍 Incoming Authorization Header:", token); // Debugging log

  if (token && token.startsWith("Bearer ")) {
    try {
      token = token.split(" ")[1]; // Extract token
      console.log("🔹 Extracted Token:", token);

      // Ensure JWT_SECRET is available
      if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in environment variables");
      }

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decoded);

      // Fetch user from database
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.error("❌ User Not Found in Database.");
        return res.status(401).json({ message: "Unauthorized: User no longer exists." });
      }

      next();
    } catch (error) {
      console.error("❌ JWT Verification Error:", error.message);
      return res.status(401).json({ message: "❌ Unauthorized: Invalid or Expired Token" });
    }
  } else {
    console.error("🚨 No Token Provided");
    return res.status(401).json({ message: "🚨 Access Denied: No token provided. Please log in." });
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "❌ Forbidden: You do not have permission." });
    }
    next();
  };
};

export { protect, authorize };
