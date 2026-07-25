import { Router } from "express";
import { createStudyPlan } from "../controllers/studyController.js";
import { validateGenerateRequest } from "../validators/requestValidator.js";
import { studyPlanLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Removed requireAuth middleware to allow guest access
router.post("/generate", studyPlanLimiter, validateGenerateRequest, createStudyPlan);

export default router;
