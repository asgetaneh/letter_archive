const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoSchema = new Schema({
  type: { type: String, enum: ['memo', 'note', 'circular'], required: true },
  title: String,
  content: String,
  departmentAccess: [String],
  userAccess: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memo', memoSchema);
