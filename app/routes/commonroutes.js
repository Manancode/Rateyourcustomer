// only subscribed users can access getratings and createratings
import { Router } from 'express';
import { createCustomers, getCustomers } from '../controllers/customercontroller.js';
import { authenticate } from '../middleware/authenticate.js';
import { createRating, getRatings } from '../controllers/ratingcontroller.js';


const router = Router();

router.get('/customer-ratings', authenticate, getRatings);
router.post('/customer-ratings', authenticate, createRating);
router.get('/customer', authenticate, getCustomers);
router.post('/customer', authenticate, createCustomers);
export default router;
