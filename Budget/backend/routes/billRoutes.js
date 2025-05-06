const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const { authenticate } = require('../middleware/authMiddleware');

// GET all bills
router.get('/', authenticate, billController.getBills);

// POST new bill
router.post('/', authenticate, billController.createBill);

// PUT update bill
router.put('/:id', authenticate, billController.updateBill);

// PATCH add to bill
router.patch('/:id/add', authenticate, billController.addToBill);

// DELETE bill
router.delete('/:id', authenticate, billController.deleteBill);

module.exports = router;
