const express = require('express');
const router = express.Router();
const { getUserBalance, setUserBalance } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/balance', authenticate, getUserBalance);
router.put('/balance', authenticate, setUserBalance);

module.exports = router;
