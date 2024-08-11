
import { Router } from 'express';
import { createCustomers, getCustomers } from '../controllers/customercontroller.js';
import { authenticate } from '../middleware/authenticate.js';
import { createRating, getRatings } from '../controllers/ratingcontroller.js';
import { createWebhook, deleteWebhook, getWebhooks } from '../controllers/create-webhook.js';
import { createDefaultRatingCategories, updateRatingCategoryWeightage } from '../controllers/ratingCategoryController.js';
import { handleWebhookEvent } from '../api/webhook/events/index.js';
import { getApiKeys } from '../controllers/apikeyscontroller.js';




const router = Router();

router.get('/customer-ratings', authenticate, getRatings);
router.post('/customer-ratings', authenticate, createRating);
router.get('/customer', authenticate, getCustomers);
router.post('/customer', authenticate, createCustomers);
router.post('/create-webhook', authenticate, createWebhook);
router.get('/get-webhook',authenticate , getWebhooks);
router.delete('/delete-webhook/:id' , authenticate , deleteWebhook)
router.post('/rating-categories', authenticate, createDefaultRatingCategories);
router.put('/rating-categories/weightage', authenticate, updateRatingCategoryWeightage);
router.post('/webhook-event', authenticate, handleWebhookEvent);
router.post('/api-keys', getApiKeys)


export default router;
