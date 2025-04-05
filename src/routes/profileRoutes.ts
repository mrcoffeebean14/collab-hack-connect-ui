import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createOrUpdateProfile, getProfile } from '../controllers/profileController';

const router = express.Router();

// Apply authentication middleware to all profile routes
router.use(authenticateToken);

// Profile routes
router.post('/', async (req: Request, res: Response) => {
  await createOrUpdateProfile(req, res);
});

router.get('/', async (req: Request, res: Response) => {
  await getProfile(req, res);
});

export default router; 