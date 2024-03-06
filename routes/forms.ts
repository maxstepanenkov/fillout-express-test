import express, { NextFunction, Request, Response } from 'express';
import { getAnswers } from '../controllers/form.controller';

const router = express.Router();

router.get('/:formId/filteredResponses', getAnswers);

export default router;
