import mongoose from 'mongoose';

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
      return this.mode === 'offline' || this.mode === 'hybrid';
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationStartDate: {
    type: Date,
    required: true
  },
  registrationEndDate: {
    type: Date,
    required: true
  },
  maxTeamSize: {
    type: Number,
    required: true
  },
  minTeamSize: {
    type: Number,
    required: true,
    default: 1
  },
  prizesPool: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  techStack: [{
    type: String
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    team: {
      type: String
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  }],
  rules: [{
    type: String
  }],
  timeline: [{
    title: String,
    description: String,
    date: Date
  }],
  resources: [{
    title: String,
    link: String,
    type: {
      type: String,
      enum: ['document', 'video', 'other']
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  socialLinks: {
    discord: String,
    telegram: String,
    website: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
hackathonSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add index for better query performance
hackathonSchema.index({ status: 1, startDate: -1 });
hackathonSchema.index({ featured: 1 });

export const Hackathon = mongoose.model('Hackathon', hackathonSchema); 