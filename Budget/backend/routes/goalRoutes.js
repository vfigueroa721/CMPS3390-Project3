const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  updateSavedAmount,
  deleteGoal
} = require('../controllers/goalController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, createGoal);
router.get('/', authenticate, getGoals);
router.put('/save', authenticate, updateSavedAmount);
router.delete('/:goalId', authenticate, deleteGoal); // ✅ Delete route

module.exports = router;
