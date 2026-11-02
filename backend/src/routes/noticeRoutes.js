const express = require('express');
const router = express.Router();
const { getAllNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllNotices);
router.post('/', authorize('admin'), createNotice);
router.put('/:id', authorize('admin'), updateNotice);
router.delete('/:id', authorize('admin'), deleteNotice);

module.exports = router;
