import { Router } from "express";
import { uploadFile, upload } from "../controllers/uploadController.js";

const router = Router();

// Removed requireAuth middleware to allow guest access
// Endpoint: POST /api/upload
router.post("/", upload.single("file"), uploadFile);

export default router;
