const Goal = require('../models/Goal');
const User = require('../models/User');

// controllers/goalController.js
exports.createGoal = async (req, res) => {
  const { name, goalAmount } = req.body;
  const userId = req.user?.userId;

  if (!name || isNaN(goalAmount)) {
    return res.status(400).json({ error: 'Name and valid goal amount are required' });
  }

  try {
    const newGoal = await Goal.create({
      name,
      goalAmount,
      userId, // ✅ include userId here
    });

    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getGoals = async (req, res) => {
  const userId = req.user?.userId;


  try {
    const goals = await Goal.find({ userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSavedAmount = async (req, res) => {
  const { goalId, amount } = req.body;
  const userId = req.user?.userId;

  if (!goalId || isNaN(amount)) {
    return res.status(400).json({ error: 'Goal ID and valid amount required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    const newSaved = Math.min(goal.saved + amount, goal.goalAmount);
    goal.saved = newSaved;
    await goal.save();

    user.balance -= amount;
    await user.save();

    res.json({
      message: 'Progress updated',
      saved: goal.saved,
      balance: user.balance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


