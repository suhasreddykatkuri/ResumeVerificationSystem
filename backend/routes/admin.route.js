import express from "express";
import {
    getAllResumes,
    getResumeById,
    updateResumeStatus,
    submitFeedback
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Admin views all resumes
router.get("/resumes", verifyToken, getAllResumes);

// Admin views a specific resume
router.get("/resume/:resumeId", verifyToken, getResumeById);

// Admin updates the status of a resume (approve/reject)
router.patch("/resume/:resumeId/status", verifyToken, updateResumeStatus);

// Admin submits feedback for a resume
router.post("/resume/:resumeId/feedback", verifyToken, submitFeedback);

export default router;
