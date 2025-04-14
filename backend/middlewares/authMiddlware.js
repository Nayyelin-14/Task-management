const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      next();
    } else {
      res.status(400).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({
      message: "Token required",
      error: error.message,
    });
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized role access" });
    }
    console.log("sdfasdfid", req.user._id);
    next();
  };
};

const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(400)
      .json({ message: "Not authorized, only admin can asscess this" });
  }
};

module.exports = { protect, adminOnly, allowRoles };
