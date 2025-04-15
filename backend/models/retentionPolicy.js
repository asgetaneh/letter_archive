const mongoose = require('mongoose');

const RetentionPolicySchema = new mongoose.Schema({
  type: { type: String, required: true },
  duration: { type: Number, required: true } // in days
});

module.exports = mongoose.model('RetentionPolicy', RetentionPolicySchema);
