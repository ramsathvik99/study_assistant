import { Router } from "express";
import { createStudyPlan } from "../controllers/studyController.js";
import { studyPlanLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Generate study plan
router.post("/generate", studyPlanLimiter, createStudyPlan);

export default router;
