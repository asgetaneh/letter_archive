const mongoose = require('mongoose');

const userGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  roles: [{ type: String }], // roles like ['admin', 'staff', 'head']
}, { timestamps: true });

module.exports = mongoose.model('UserGroup', userGroupSchema);
