const express = require("express");
const admin = require("../config/firebaseAdmin"); // Ensure correct import
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Endpoint to get all Firebase Auth users
router.get("/api/firebase-users", async (req, res) => {
  try {
    console.log("Fetching Firebase Users...");
    let usersList = [];
    let nextPageToken = undefined;

    do {
      const listUsers = await admin.auth().listUsers(1000, nextPageToken);
      usersList = usersList.concat(listUsers.users);
      nextPageToken = listUsers.pageToken;
    } while (nextPageToken);

    const users = usersList.map((user) => ({
      uid: user.uid,
      email: user.email || "No Email",
      displayName: user.displayName || "No Name",
    }));

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});
// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  await user.save();
  res.send('User registered');
});

// Login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('User not found');

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send('Wrong password');

  const token = jwt.sign({ id: user._id }, 'secret');
  res.json({ token });
});

// List Users
router.get('/', auth, authorizeRoles('admin'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Change Role
router.put('/role/:id', auth, authorizeRoles('admin'), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
  res.send('Role updated');
});

module.exports = router;
