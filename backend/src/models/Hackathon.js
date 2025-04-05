const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: true
  },
  venue: {
    type: String,
    required: function() {
      return this.mode !== 'online';
    }
  },
  prizes: [{
    rank: String,
    prize: String
  }],
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    teamName: String,
    teamSize: Number,
    projectIdea: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxTeamSize: {
    type: Number,
    required: true
  },
  techStack: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

const Hackathon = mongoose.model('Hackathon', hackathonSchema);
module.exports = Hackathon; 