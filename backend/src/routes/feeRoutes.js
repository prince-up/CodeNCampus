const express = require('express');
const router = express.Router();
const {
  getAllFees,
  createFee,
  updateFee,
  getFeesByStudent,
  getFeeCollection,
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('admin'), getAllFees);
router.post('/', authorize('admin'), createFee);
router.put('/:id', authorize('admin'), updateFee);
router.get('/collection', authorize('admin'), getFeeCollection);
router.get('/student/:studentId', getFeesByStudent);

module.exports = router;
