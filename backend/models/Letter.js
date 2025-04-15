// models/Letter.js
const mongoose = require('mongoose');

const LetterSchema = new mongoose.Schema({
  type: { type: String, enum: ['incoming', 'outgoing'], required: true },
  subject: String,
  referenceNumber: {
    type: String,
    required: [true, "Reference Number is required"],
    unique: true,
    validate: {
      validator: v => v && v.trim().length > 0,
      message: "Reference Number cannot be empty"
    }
  },
  sender: String,
  recipient: String,
  department: String,
  content: String,
  dateReceived: Date,
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  deadline: Date,
  filePath: String, // Uploaded file path
}, { timestamps: true });
LetterSchema.index({ subject: 'text', referenceNumber: 'text', content: 'text' });


module.exports = mongoose.model('Letter', LetterSchema);
