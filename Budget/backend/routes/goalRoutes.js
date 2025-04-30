const express = require('express');
const router = express.Router();
const { createGoal, getGoals, updateSavedAmount } = require('../controllers/goalController');
const { authenticate } = require('../middleware/authMiddleware'); // we'll make this next!

router.post('/', authenticate, createGoal);
router.get('/', authenticate, getGoals);
router.put('/save', authenticate, updateSavedAmount);

module.exports = router;
