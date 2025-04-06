import { Request, Response } from 'express';
import { Hackathon } from '../models/Hackathon';

export const hackathonController = {
  // Create a new hackathon
  async createHackathon(req: Request, res: Response) {
    try {
      const hackathonData = {
        ...req.body,
        organizer: req.user._id
      };

      const hackathon = new Hackathon(hackathonData);
      await hackathon.save();

      res.status(201).json({
        message: 'Hackathon created successfully',
        hackathon: await hackathon.populate(['organizer', 'participants.user'])
      });
    } catch (error) {
      console.error('Error creating hackathon:', error);
      res.status(500).json({ message: 'Error creating hackathon' });
    }
  },

  // Get all hackathons (with filters)
  async getHackathons(req: Request, res: Response) {
    try {
      const { status, mode, tech } = req.query;
      let query: any = {};

      if (status) {
        query.status = status;
      }

      if (mode) {
        query.mode = mode;
      }

      if (tech) {
        query.techStack = { $in: [tech] };
      }

      const hackathons = await Hackathon.find(query)
        .populate(['organizer', 'participants.user'])
        .sort({ startDate: 1 });

      res.json({ hackathons });
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      res.status(500).json({ message: 'Error fetching hackathons' });
    }
  },

  // Get featured hackathons
  async getFeaturedHackathons(req: Request, res: Response) {
    try {
      const hackathons = await Hackathon.find({ featured: true })
        .populate(['organizer', 'participants.user'])
        .sort({ startDate: 1 });

      res.json({ hackathons });
    } catch (error) {
      console.error('Error fetching featured hackathons:', error);
      res.status(500).json({ message: 'Error fetching featured hackathons' });
    }
  },

  // Get hackathon by ID
  async getHackathonById(req: Request, res: Response) {
    try {
      const hackathon = await Hackathon.findById(req.params.id)
        .populate(['organizer', 'participants.user']);

      if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
      }

      res.json({ hackathon });
    } catch (error) {
      console.error('Error fetching hackathon:', error);
      res.status(500).json({ message: 'Error fetching hackathon' });
    }
  },

  // Update hackathon
  async updateHackathon(req: Request, res: Response) {
    try {
      const hackathon = await Hackathon.findById(req.params.id);

      if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
      }

      // Check if user is the organizer
      if (hackathon.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this hackathon' });
      }

      const updatedHackathon = await Hackathon.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      ).populate(['organizer', 'participants.user']);

      res.json({
        message: 'Hackathon updated successfully',
        hackathon: updatedHackathon
      });
    } catch (error) {
      console.error('Error updating hackathon:', error);
      res.status(500).json({ message: 'Error updating hackathon' });
    }
  },

  // Delete hackathon
  async deleteHackathon(req: Request, res: Response) {
    try {
      const hackathon = await Hackathon.findById(req.params.id);

      if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
      }

      // Check if user is the organizer
      if (hackathon.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this hackathon' });
      }

      await hackathon.deleteOne();
      res.json({ message: 'Hackathon deleted successfully' });
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      res.status(500).json({ message: 'Error deleting hackathon' });
    }
  },

  // Register for hackathon
  async registerForHackathon(req: Request, res: Response) {
    try {
      const hackathon = await Hackathon.findById(req.params.id);

      if (!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
      }

      // Check if registration is open
      const now = new Date();
      if (now < hackathon.registrationStartDate || now > hackathon.registrationEndDate) {
        return res.status(400).json({ message: 'Registration is not open' });
      }

      // Check if user is already registered
      const isRegistered = hackathon.participants.some(
        participant => participant.user.toString() === req.user._id.toString()
      );

      if (isRegistered) {
        return res.status(400).json({ message: 'Already registered for this hackathon' });
      }

      // Add user to participants
      hackathon.participants.push({
        user: req.user._id,
        team: req.body.team
      });

      await hackathon.save();
      
      const updatedHackathon = await hackathon.populate(['organizer', 'participants.user']);

      res.json({
        message: 'Successfully registered for hackathon',
        hackathon: updatedHackathon
      });
    } catch (error) {
      console.error('Error registering for hackathon:', error);
      res.status(500).json({ message: 'Error registering for hackathon' });
    }
  },

  // Get user's registered hackathons
  async getUserHackathons(req: Request, res: Response) {
    try {
      const hackathons = await Hackathon.find({
        'participants.user': req.user._id
      })
      .populate(['organizer', 'participants.user'])
      .sort({ startDate: 1 });

      res.json({ hackathons });
    } catch (error) {
      console.error('Error fetching user hackathons:', error);
      res.status(500).json({ message: 'Error fetching user hackathons' });
    }
  },

  // Update hackathon status based on dates
  async updateHackathonStatuses() {
    try {
      const now = new Date();

      // Update to 'ongoing' if started
      await Hackathon.updateMany(
        {
          status: 'upcoming',
          startDate: { $lte: now },
          endDate: { $gt: now }
        },
        { status: 'ongoing' }
      );

      // Update to 'completed' if ended
      await Hackathon.updateMany(
        {
          status: 'ongoing',
          endDate: { $lte: now }
        },
        { status: 'completed' }
      );
    } catch (error) {
      console.error('Error updating hackathon statuses:', error);
    }
  }
}; 