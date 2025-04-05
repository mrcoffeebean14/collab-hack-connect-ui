const Hackathon = require('../models/Hackathon');

exports.createHackathon = async (req, res) => {
  try {
    console.log('Received hackathon request:', req.body);
    console.log('User ID:', req.user._id);

    const {
      title,
      description,
      startDate,
      endDate,
      mode,
      venue,
      maxTeamSize,
      registrationDeadline,
      techStack,
      prizes
    } = req.body;

    const userId = req.user._id;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate required fields
    if (!title || !description || !startDate || !endDate || !mode || !maxTeamSize || !registrationDeadline) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: {
          title: !title,
          description: !description,
          startDate: !startDate,
          endDate: !endDate,
          mode: !mode,
          maxTeamSize: !maxTeamSize,
          registrationDeadline: !registrationDeadline
        }
      });
    }

    // Create new hackathon
    const hackathon = new Hackathon({
      title,
      description,
      startDate,
      endDate,
      organizer: userId,
      mode,
      venue: mode !== 'online' ? venue : undefined,
      maxTeamSize,
      registrationDeadline,
      techStack,
      prizes
    });

    await hackathon.save();
    console.log('Hackathon created successfully:', hackathon._id);

    return res.status(201).json({ hackathon });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.message
      });
    }
    res.status(500).json({ 
      message: 'Error creating hackathon',
      error: error.message
    });
  }
};

exports.getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate('organizer', 'name username')
      .sort({ createdAt: -1 });
    
    res.json({ hackathons });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({ 
      message: 'Error fetching hackathons',
      error: error.message
    });
  }
};

exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizer', 'name username')
      .populate('registrations.user', 'name username');
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    res.json({ hackathon });
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    res.status(500).json({ 
      message: 'Error fetching hackathon',
      error: error.message
    });
  }
};

exports.registerForHackathon = async (req, res) => {
  try {
    const { teamName, teamSize, projectIdea } = req.body;
    const hackathonId = req.params.id;
    const userId = req.user._id;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user is already registered
    const existingRegistration = hackathon.registrations.find(
      reg => reg.user.toString() === userId.toString()
    );

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this hackathon' });
    }

    // Add registration
    hackathon.registrations.push({
      user: userId,
      teamName,
      teamSize,
      projectIdea,
      status: 'pending'
    });

    await hackathon.save();
    res.json({ message: 'Successfully registered for hackathon' });
  } catch (error) {
    console.error('Error registering for hackathon:', error);
    res.status(500).json({ 
      message: 'Error registering for hackathon',
      error: error.message
    });
  }
}; 