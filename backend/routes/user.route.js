import express from "express";
import {
    uploadResume,
    getUserResumes,
    getResumeStatusAndFeedback,
    updateResume,
    deleteResume
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// User uploads their resume
router.post("/resume", verifyToken, uploadResume);

// User views all their resumes
router.get("/resumes", verifyToken, getUserResumes);

// User views the status and feedback of a resume
router.get("/resume/:resumeId/status", verifyToken, getResumeStatusAndFeedback);

// User updates their resume
router.put("/resume/:resumeId", verifyToken, updateResume);

// User deletes their resume
router.delete("/resume/:resumeId", verifyToken, deleteResume);

export default router;
