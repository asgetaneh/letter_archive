// routes/letters.js
const express = require('express');
const multer = require('multer');
const Letter = require('../models/Letter');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });
const letterController = require('../controllers/letterController');

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

router.post('/api/inbox', upload.single('file'), async (req, res) => {
  try {
    const { subject, referenceNumber, sender, department, dateReceived, deadline } = req.body;
    const file = req.file;

    console.log('Received data:', req.body); // Log the received data
    console.log('Received file:', file); // Log the file info

    // Validate required fields
    const requiredFields = ['subject', 'referenceNumber', 'sender', 'department', 'dateReceived', 'deadline'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields 
      });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newLetter = new Letter({
      type: 'incoming',
      subject,
      referenceNumber,
      sender,
      department,
      dateReceived,
      deadline,
      status: 'pending',
      filePath: file.path,
    });
    if (!req.body.referenceNumber?.trim()) {
      return res.status(400).json({ message: "Reference Number is required" });
    }
    const savedLetter = await newLetter.save();
    res.status(201).json(savedLetter);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ 
      message: 'Error saving letter',
      error: error.message 
    });
  }
});

router.get('/api/letters/search', async (req, res) => {
  const { query, from, to, department, type, ref, page = 1, limit = 20 } = req.query;
  const filters = {};

  if (from && to) {
    filters.dateReceived = {
      $gte: new Date(from),
      $lte: new Date(to)
    };
  }
  if (department) filters.department = department;
  if (type) filters.type = type;
  if (ref) filters.referenceNumber = { $regex: ref, $options: 'i' };

  const searchQuery = query ? { $text: { $search: query } } : {};
  const finalQuery = { ...filters, ...searchQuery };

  const letters = await Letter.find(finalQuery)
    .sort({ dateReceived: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(letters);
});


router.post('/api/letters', letterController.createLetter);
router.get('/api/letters', letterController.getAllLetters);

module.exports = router;
