const express = require('express');
const router = express.Router();
const { getUserBalance } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/balance', authenticate, getUserBalance);

module.exports = router;
