const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  const { name, goalAmount } = req.body;
  const userId = req.userId; // we'll get it from JWT later!

  try {
    const goal = await Goal.create({
      userId,
      name,
      goalAmount,
      savedAmount: 0,
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGoals = async (req, res) => {
  const userId = req.userId;

  try {
    const goals = await Goal.find({ userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSavedAmount = async (req, res) => {
  const { goalId, amountToAdd } = req.body;
  const userId = req.userId;

  try {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    goal.savedAmount += amountToAdd;
    await goal.save();

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
