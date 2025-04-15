const express = require('express');
const router = express.Router();
const multer = require('multer');
const OutboxLetter = require('../models/OutboxLetter');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create Outgoing Letter
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const newLetter = new OutboxLetter({
      recipient: req.body.recipient,
      subject: req.body.subject,
      referenceNumber: req.body.referenceNumber,
      department: req.body.department,
      dateSent: req.body.dateSent,
      dispatchMethod: req.body.dispatchMethod,
      attachment: req.file?.filename,
      status: req.body.status || 'sent'
    });

    await newLetter.save();
    res.status(201).json(newLetter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Get all outgoing letters
router.get('/', async (req, res) => {
    try {
      const letters = await OutboxLetter.find().sort({ dateSent: -1 });
      res.json(letters);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // In your Express route for file downloads
  router.get('/uploads/:filename', (req, res) => {
  const file = `${__dirname}/uploads/${req.params.filename}`;
  res.download(file); // This sets proper headers for download
});
  

module.exports = router;
