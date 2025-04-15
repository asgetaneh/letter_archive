const Letter = require('../models/Letter');

// Create a new letter
exports.createLetter = async (req, res) => {
  try {
    const letter = new Letter(req.body);
    await letter.save();
    res.status(201).json(letter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all letters
exports.getAllLetters = async (req, res) => {
  try {
    const letters = await Letter.find();
    res.status(200).json(letters);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
