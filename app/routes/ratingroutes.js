// only subscribed users can access getratings and createratings
import { Router } from 'express';

import { authenticate } from '../middleware/authenticate.js';
import { createRating, getRatings } from '../controllers/ratingcontroller.js';


const router = Router();

router.get('/customer-ratings', authenticate, getRatings);
router.post('/customer-ratings', authenticate, createRating);

export default router;
