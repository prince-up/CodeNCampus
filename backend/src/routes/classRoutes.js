const express = require('express');
const router = express.Router();
const { getAllClasses, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllClasses);
router.post('/', authorize('admin'), createClass);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);

module.exports = router;
