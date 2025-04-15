const mongoose = require('mongoose');

const OutboxLetterSchema = new mongoose.Schema({
  recipient: String,
  subject: String,
  referenceNumber: String,
  department: String,
  dateSent: { type: Date, default: Date.now },
  dispatchMethod: String,
  attachment: String, // path to file
  status: { type: String, default: 'sent' }
});

module.exports = mongoose.model('OutboxLetter', OutboxLetterSchema);
