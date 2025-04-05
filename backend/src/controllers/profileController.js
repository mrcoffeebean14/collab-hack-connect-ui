const Profile = require('../models/Profile');
const User = require('../models/User');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    console.log('Received profile request:', req.body);
    console.log('User ID:', req.user._id);

    const { bio, githubId, technicalBackground, skills } = req.body;
    const userId = req.user._id;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate required fields
    if (!bio || !githubId || !technicalBackground || !skills) {
      console.error('Missing required fields:', { bio, githubId, technicalBackground, skills });
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: {
          bio: !bio,
          githubId: !githubId,
          technicalBackground: !technicalBackground,
          skills: !skills
        }
      });
    }

    // Check if profile exists
    let profile = await Profile.findOne({ user: userId });
    console.log('Existing profile:', profile);

    if (profile) {
      console.log('Updating existing profile');
      // Update existing profile
      profile.bio = bio;
      profile.githubId = githubId;
      profile.techBackground = technicalBackground;
      profile.skills = skills;
      await profile.save();
      console.log('Profile updated successfully');
      return res.json({ profile });
    } else {
      console.log('Creating new profile');
      // Create new profile
      profile = new Profile({
        user: userId,
        bio,
        githubId,
        techBackground: technicalBackground,
        skills
      });

      await profile.save();
      console.log('Profile created successfully');

      // Update user's hasProfile flag
      await User.findByIdAndUpdate(userId, { hasProfile: true });
      console.log('User profile flag updated');

      return res.status(201).json({ profile });
    }
  } catch (error) {
    console.error('Detailed error in profile controller:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.message
      });
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ 
        message: 'Profile already exists for this user'
      });
    }
    res.status(500).json({ 
      message: 'Error saving profile',
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user._id);
    const userId = req.user._id;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const profile = await Profile.findOne({ user: userId });
    console.log('Found profile:', profile);

    if (!profile) {
      console.log('Profile not found');
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message
    });
  }
}; 