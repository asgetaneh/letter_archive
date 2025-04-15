const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');

// Assign roles to a user
router.post('/assign', async (req, res) => {
  const { userId, roleIds } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.roles = roleIds;
    await user.save();

    res.json({ message: 'Roles assigned successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user with roles
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('roles');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
