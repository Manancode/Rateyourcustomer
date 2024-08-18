
import { Router } from 'express';
import { createCustomers, getCustomers } from '../controllers/customercontroller.js';
import { authenticate, cacheMiddleware } from '../middleware/authenticate.js';
import { createRating, getRatings } from '../controllers/ratingcontroller.js';
import { createEventLog, createWebhook, deleteWebhook, getEventLogs, getWebhooks } from '../controllers/create-webhook.js';
import { createDefaultRatingCategories, updateRatingCategoryWeightage } from '../controllers/ratingCategoryController.js';
import { getApiKeys } from '../controllers/apikeyscontroller.js';
import { POST } from '../api/webhook/triggering/route.js';




const router = Router();

router.get('/customer-ratings', authenticate, cacheMiddleware,getRatings);
router.post('/customer-ratings', authenticate, createRating);
router.get('/customer', authenticate,cacheMiddleware , getCustomers);
router.post('/customer', authenticate, createCustomers);
router.post('/create-webhook', authenticate, createWebhook);
router.get('/get-webhook',authenticate ,cacheMiddleware , getWebhooks);
router.delete('/delete-webhook/:id' , authenticate , deleteWebhook)
router.post('/rating-categories', authenticate, createDefaultRatingCategories);
router.put('/rating-categories/weightage', authenticate, updateRatingCategoryWeightage);
router.post('/webhook-event', authenticate, POST);
router.post('/api-keys',authenticate , getApiKeys)
router.post('/create-event-log' ,authenticate , getEventLogs)
router.get('/get-event-logs' , authenticate , createEventLog)
// router.get('/customer/:id/analysis') 


export default router;
