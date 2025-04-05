const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const router = express.Router();

// Validation middleware
const projectValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('techStack').isArray().withMessage('Tech stack must be an array'),
  body('githubLink').optional().isURL().withMessage('Invalid GitHub URL')
];

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name username')
      .populate('collaborators', 'name username');
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's projects
router.get('/my-projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('collaborators', 'name username');
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get collaborated projects
router.get('/collaborated', auth, async (req, res) => {
  try {
    const projects = await Project.find({ collaborators: req.user._id })
      .populate('owner', 'name username');
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new project
router.post('/', auth, projectValidation, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user._id
    });
    await project.save();
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Request collaboration
router.post('/:projectId/collaborate', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has already requested
    const existingRequest = project.collaborationRequests.find(
      request => request.user.toString() === req.user._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ error: 'Collaboration request already exists' });
    }

    project.collaborationRequests.push({
      user: req.user._id,
      message: req.body.message || 'Interested in collaborating!'
    });

    await project.save();
    res.json({ message: 'Collaboration request sent' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle collaboration request
router.patch('/:projectId/collaboration-requests/:requestId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify project ownership
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const request = project.collaborationRequests.id(req.params.requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = status;

    if (status === 'accepted') {
      project.collaborators.push(request.user);
    }

    await project.save();
    res.json({ message: `Collaboration request ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update project
router.patch('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    Object.assign(project, req.body);
    await project.save();
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 