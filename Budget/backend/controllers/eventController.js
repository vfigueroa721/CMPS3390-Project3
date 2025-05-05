const Event = require('../models/Event');

// GET all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create event
exports.createEvent = async (req, res) => {
  const { date, name, amount } = req.body;

  if (!date || !name || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const newEvent = new Event({ date, name, amount });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
