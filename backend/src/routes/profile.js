const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const router = express.Router();

// Validation middleware
const profileValidation = [
  body('bio').trim().notEmpty().withMessage('Bio is required'),
  body('githubId').trim().notEmpty().withMessage('GitHub ID is required'),
  body('technicalBackground').trim().notEmpty().withMessage('Technical background is required'),
  body('skills').isArray().withMessage('Skills must be an array')
];

// Get current user's profile
router.get('/', auth, profileController.getProfile);

// Get user profile by ID
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'name username');
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or update profile
router.post('/', auth, profileValidation, profileController.createOrUpdateProfile);

// Add experience
router.post('/experience', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.experience.unshift(req.body);
    await profile.save();
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete experience
router.delete('/experience/:expId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.experience = profile.experience.filter(
      exp => exp._id.toString() !== req.params.expId
    );
    
    await profile.save();
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add achievement
router.post('/achievements', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.achievements.unshift(req.body);
    await profile.save();
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete achievement
router.delete('/achievements/:achievementId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.achievements = profile.achievements.filter(
      achievement => achievement._id.toString() !== req.params.achievementId
    );
    
    await profile.save();
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 