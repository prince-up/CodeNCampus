const express = require('express');
const router = express.Router();
const {
  getAllExams,
  createExam,
  updateExam,
  deleteExam,
  getResultsByExam,
  getResultsByStudent,
  saveResults,
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllExams);
router.post('/', authorize('admin'), createExam);
router.put('/:id', authorize('admin'), updateExam);
router.delete('/:id', authorize('admin'), deleteExam);
router.get('/:id/results', getResultsByExam);
router.get('/results/student/:studentId', getResultsByStudent);
router.post('/results', authorize('admin', 'teacher'), saveResults);

module.exports = router;
