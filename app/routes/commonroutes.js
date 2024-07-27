// only subscribed users can access getratings and createratings
import { Router } from 'express';
import { createCustomers, getCustomers } from '../controllers/customercontroller.js';
import { authenticate } from '../middleware/authenticate.js';
import { createRating, getRatings } from '../controllers/ratingcontroller.js';
import { createWebhook } from '../controllers/create-webhook.js';
import { createDefaultRatingCategories, updateRatingCategoryWeightage } from '../controllers/ratingCategoryController.js';
import { handleWebhookEvent } from '../controllers/webhookEventController.js';

const router = Router();

router.get('/customer-ratings', authenticate, getRatings);
router.post('/customer-ratings', authenticate, createRating);
router.get('/customer', authenticate, getCustomers);
router.post('/customer', authenticate, createCustomers);
router.post('/create-webhook', authenticate, createWebhook);
router.post('/rating-categories', authenticate, createDefaultRatingCategories);
router.put('/rating-categories/weightage', authenticate, updateRatingCategoryWeightage);
router.post('/webhook-event', authenticate, handleWebhookEvent);

export default router;
