const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const router = express.Router();

// Validation middleware
const profileValidation = [
  body('bio').optional().trim(),
  body('githubId').optional().trim(),
  body('techBackground').trim().notEmpty().withMessage('Technical background is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('education').optional().isObject().withMessage('Education must be an object'),
  body('experience').optional().isArray().withMessage('Experience must be an array'),
  body('socialLinks').optional().isObject().withMessage('Social links must be an object')
];

// Get current user's profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

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
router.post('/', auth, profileValidation, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      Object.assign(profile, req.body);
      await profile.save();
      res.json({ profile });
    } else {
      // Create
      profile = new Profile({
        user: req.user._id,
        ...req.body
      });
      await profile.save();
      res.status(201).json({ profile });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

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