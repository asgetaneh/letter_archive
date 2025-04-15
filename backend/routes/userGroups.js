const express = require('express');
const router = express.Router();
const UserGroup = require('../models/UserGroup');

// GET all user groups
router.get('/', async (req, res) => {
  try {
    const groups = await UserGroup.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE user group
router.post('/', async (req, res) => {
  const { name, roles } = req.body;
  try {
    const group = new UserGroup({ name, roles });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE user group
router.put('/:id', async (req, res) => {
  try {
    const group = await UserGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE user group
router.delete('/:id', async (req, res) => {
  try {
    await UserGroup.findByIdAndDelete(req.params.id);
    res.json({ message: 'User group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
