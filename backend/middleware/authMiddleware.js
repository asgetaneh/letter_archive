const jwt = require('jsonwebtoken');
const User = require('../models/User');

const admin = require("firebase-admin");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user data to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;

