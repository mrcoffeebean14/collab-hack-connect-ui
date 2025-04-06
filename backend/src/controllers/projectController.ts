import { Request, Response } from 'express';
import { Project } from '../models/Project';

export const projectController = {
  // Create a new project
  async createProject(req: Request, res: Response) {
    try {
      const projectData = {
        ...req.body,
        owner: req.user._id,
        teamMembers: [req.user._id]
      };

      const project = new Project(projectData);
      await project.save();

      res.status(201).json({
        message: 'Project created successfully',
        project: await project.populate(['owner', 'teamMembers'])
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Error creating project' });
    }
  },

  // Get all projects (with filters)
  async getProjects(req: Request, res: Response) {
    try {
      const { status, tech } = req.query;
      let query: any = {};

      if (status) {
        query.status = status;
      }

      if (tech) {
        query.techStack = { $in: [tech] };
      }

      const projects = await Project.find(query)
        .populate(['owner', 'teamMembers'])
        .sort({ createdAt: -1 });

      res.json({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects' });
    }
  },

  // Get user's projects
  async getUserProjects(req: Request, res: Response) {
    try {
      const projects = await Project.find({
        $or: [
          { owner: req.user._id },
          { teamMembers: req.user._id }
        ]
      })
      .populate(['owner', 'teamMembers'])
      .sort({ createdAt: -1 });

      res.json({ projects });
    } catch (error) {
      console.error('Error fetching user projects:', error);
      res.status(500).json({ message: 'Error fetching user projects' });
    }
  },

  // Get project by ID
  async getProjectById(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id)
        .populate(['owner', 'teamMembers', 'collaborationRequests.user']);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json({ project });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Error fetching project' });
    }
  },

  // Update project
  async updateProject(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Check if user is the owner
      if (project.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this project' });
      }

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      ).populate(['owner', 'teamMembers']);

      res.json({
        message: 'Project updated successfully',
        project: updatedProject
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Error updating project' });
    }
  },

  // Delete project
  async deleteProject(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Check if user is the owner
      if (project.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this project' });
      }

      await project.deleteOne();
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Error deleting project' });
    }
  },

  // Request to collaborate
  async requestCollaboration(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Check if user already requested or is already a member
      const isRequested = project.collaborationRequests.some(
        request => request.user.toString() === req.user._id.toString()
      );
      const isMember = project.teamMembers.includes(req.user._id);

      if (isRequested) {
        return res.status(400).json({ message: 'Collaboration already requested' });
      }

      if (isMember) {
        return res.status(400).json({ message: 'Already a team member' });
      }

      project.collaborationRequests.push({
        user: req.user._id,
        status: 'pending'
      });

      await project.save();
      
      const updatedProject = await project.populate(['owner', 'teamMembers', 'collaborationRequests.user']);

      res.json({
        message: 'Collaboration request sent successfully',
        project: updatedProject
      });
    } catch (error) {
      console.error('Error requesting collaboration:', error);
      res.status(500).json({ message: 'Error requesting collaboration' });
    }
  },

  // Handle collaboration request
  async handleCollaborationRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { status } = req.body;

      const project = await Project.findOne({
        'collaborationRequests._id': requestId
      });

      if (!project) {
        return res.status(404).json({ message: 'Project or request not found' });
      }

      // Check if user is the owner
      if (project.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to handle requests' });
      }

      const request = project.collaborationRequests.id(requestId);
      
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      request.status = status;

      if (status === 'accepted') {
        project.teamMembers.push(request.user);
      }

      await project.save();
      
      const updatedProject = await project.populate(['owner', 'teamMembers', 'collaborationRequests.user']);

      res.json({
        message: `Collaboration request ${status}`,
        project: updatedProject
      });
    } catch (error) {
      console.error('Error handling collaboration request:', error);
      res.status(500).json({ message: 'Error handling collaboration request' });
    }
  }
}; 