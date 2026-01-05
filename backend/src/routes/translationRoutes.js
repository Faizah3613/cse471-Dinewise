import express from 'express';
import { translateMenu } from '../controllers/translationController.js';

const router = express.Router();

// GET /api/translation/menu?lang=es
router.get('/menu', translateMenu);

export default router;