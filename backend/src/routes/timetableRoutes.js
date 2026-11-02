const express = require('express');
const router = express.Router();
const { getTimetable, saveTimetable, deleteTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/:cls/:section', getTimetable);
router.post('/', authorize('admin'), saveTimetable);
router.delete('/:id', authorize('admin'), deleteTimetable);

module.exports = router;
