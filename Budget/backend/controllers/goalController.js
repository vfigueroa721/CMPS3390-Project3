const Goal = require('../models/Goal');
const User = require('../models/User');

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
      userId,
      saved: 0,
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

  try {
    const goal = await Goal.findOne({ _id: goalId, userId });
    const user = await User.findById(userId);

    if (!goal || !user) {
      return res.status(404).json({ error: 'Goal or user not found' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    goal.saved += amount;
    user.balance -= amount;

    await goal.save();
    await user.save();

    res.json({ saved: goal.saved, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  const { goalId } = req.params;
  const userId = req.user?.userId;

  try {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found or not authorized' });
    }

    const savedAmount = goal.saved || 0;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.balance += savedAmount;
    await user.save();
    await goal.deleteOne();

    res.status(200).json({
      message: 'Goal deleted and saved amount restored to balance.',
      updatedBalance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


