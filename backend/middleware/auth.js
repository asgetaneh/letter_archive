const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).send('Access denied');
  next();
};

module.exports = { auth, authorizeRoles };
