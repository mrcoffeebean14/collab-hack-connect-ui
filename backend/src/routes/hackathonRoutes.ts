import express, { Request, Response, NextFunction } from 'express';
import { hackathonController } from '../controllers/hackathonController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.getHackathons(req, res).catch(next);
});

router.get('/featured', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.getFeaturedHackathons(req, res).catch(next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.getHackathonById(req, res).catch(next);
});

// Protected routes (require authentication)
router.use(isAuthenticated);

// Create a new hackathon
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.createHackathon(req, res).catch(next);
});

// Update hackathon
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.updateHackathon(req, res).catch(next);
});

// Delete hackathon
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.deleteHackathon(req, res).catch(next);
});

// Register for hackathon
router.post('/:id/register', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.registerForHackathon(req, res).catch(next);
});

// Get user's registered hackathons
router.get('/my-hackathons', (req: Request, res: Response, next: NextFunction) => {
  hackathonController.getUserHackathons(req, res).catch(next);
});

export default router; 