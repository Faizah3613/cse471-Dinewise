// src/routes/reviewRoutes.js
import express from 'express';
import { 
  createReview, 
  getAllReviews, 
  getReviewStats 
} from '../controllers/reviewController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// In reviewRoutes.js
router.post('/', protectRoute(['customer']),createReview); // Anyone can submit
router.get('/', getAllReviews); // Anyone can view  
router.get('/stats', getReviewStats);
export default router;