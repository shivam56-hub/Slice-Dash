// JWT Middleware

const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    // console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }
    // Format: Bearer Token
    const token = authHeader.split(" ")[1];
    // console.log("TOKEN:", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token formate.",
      });
    }
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user information in request

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
