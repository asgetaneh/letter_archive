const express = require('express');
const router = express.Router();
const RetentionPolicy = require('../models/retentionPolicy');

// GET all policies
router.get('/', async (req, res) => {
  const policies = await RetentionPolicy.find();
  res.json(policies);
});

// POST new policy
router.post('/', async (req, res) => {
  const { type, duration } = req.body;
  const policy = new RetentionPolicy({ type, duration });
  await policy.save();
  res.status(201).json(policy);
});

module.exports = router;
