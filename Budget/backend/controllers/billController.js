const Bill = require('../models/Bill');

// Get all bills for a user
exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.userId });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new bill
exports.createBill = async (req, res) => {
  const { name, amount } = req.body;
  try {
    const newBill = await Bill.create({
      userId: req.user.userId,
      name,
      amount,
      added: 0
    });
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing bill
exports.updateBill = async (req, res) => {
  const { id } = req.params;
  const { name, amount } = req.body;

  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      { name, amount },
      { new: true }
    );
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add money to a bill
exports.addToBill = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });

    bill.added = Math.min(bill.added + amount, bill.amount);
    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a bill
exports.deleteBill = async (req, res) => {
  const { id } = req.params;

  try {
    await Bill.findByIdAndDelete(id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
