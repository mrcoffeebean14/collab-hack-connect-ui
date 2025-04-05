const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const hackathonController = require('../controllers/hackathonController');

// Create a new hackathon
router.post('/', auth, hackathonController.createHackathon);

// Get all hackathons
router.get('/', auth, hackathonController.getAllHackathons);

// Get hackathon by ID
router.get('/:id', auth, hackathonController.getHackathonById);

// Register for a hackathon
router.post('/:id/register', auth, hackathonController.registerForHackathon);

module.exports = router; 