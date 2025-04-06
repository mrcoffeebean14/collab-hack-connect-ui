import express from 'express';
import { projectController } from '../controllers/projectController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Protected routes (require authentication)
router.use(isAuthenticated);

// Create a new project
router.post('/', projectController.createProject);

// Get all projects (with filters)
router.get('/', projectController.getProjects);

// Get user's projects
router.get('/my-projects', projectController.getUserProjects);

// Get project by ID
router.get('/:id', projectController.getProjectById);

// Update project
router.put('/:id', projectController.updateProject);

// Delete project
router.delete('/:id', projectController.deleteProject);

// Request to collaborate
router.post('/:id/collaborate', projectController.requestCollaboration);

// Handle collaboration request
router.put('/collaboration-requests/:requestId', projectController.handleCollaborationRequest);

export default router; 