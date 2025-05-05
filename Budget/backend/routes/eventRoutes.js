const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', getEvents);         // GET /api/events
router.post('/', createEvent);      // POST /api/events
router.delete('/:id', deleteEvent); // DELETE /api/events/:id

module.exports = router;
