const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    trim: true
  },
  githubId: {
    type: String,
    trim: true
  },
  techBackground: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  education: {
    institution: String,
    degree: String,
    field: String,
    graduationYear: Number
  },
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  socialLinks: {
    linkedin: String,
    twitter: String,
    portfolio: String
  },
  achievements: [{
    title: String,
    description: String,
    year: Number
  }]
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile; 