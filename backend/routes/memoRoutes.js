const express = require('express');
const router = express.Router();
const Memo = require('../models/Memo');
const authenticate = require('../middleware/authMiddleware'); // assumes user added to req.user

// POST: Create Memo
router.post('/api/memos', authenticate, async (req, res) => {
  const { type, title, content, departmentAccess, userAccess } = req.body;

  const memo = new Memo({
    type,
    title,
    content,
    departmentAccess,
    userAccess,
    createdBy: req.user._id
  });

  await memo.save();
  res.status(201).json(memo);
});

// GET: List Memos the User Can Access
router.get('/api/memos', authenticate, async (req, res) => {
  const { _id, department } = req.user;
  console.log('user', _id, department);
  const memos = await Memo.find().sort({ userAccess: -1 });
  //const memos = await Memo.find().sort({ userAccess: -1 });
  // const memos = await Memo.find({
  //   $or: [
  //     { userAccess: _id } 
  //   ]
  // }).sort({ createdAt: -1 });

  res.json(memos);
});

// GET: Memo by ID with Access Control
router.get('/api/memos/:id', authenticate, async (req, res) => {
  const memo = await Memo.findById(req.params.id);
  if (!memo) return res.status(404).json({ message: 'Memo not found' });

  const user = req.user;
  const hasAccess = memo.userAccess.includes(user._id) || memo.departmentAccess.includes(user.department);

  if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

  res.json(memo);
});

module.exports = router;
