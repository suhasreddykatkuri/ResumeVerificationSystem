import {Resume} from "../models/resume.model.js";
import { User } from "../models/user.model.js"; // Assuming we need user info as well for cross-checks

// Admin controller to get all resumes
export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find(); // Fetch all resumes
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resumes", error: error.message });
    }
};

// Admin controller to get a specific resume by ID
export const getResumeById = async (req, res) => {
    const { resumeId } = req.params;
    try {
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resume", error: error.message });
    }
};

// Admin controller to update the status of a resume (approve/reject)
export const updateResumeStatus = async (req, res) => {
    const { resumeId } = req.params;
    const { status, feedback } = req.body; // Assuming admin will provide status and feedback

    try {
        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Update the resume's status (approve/reject)
        resume.status = status;
        if (feedback) {
            resume.feedback = feedback; // Admin can provide optional feedback
        }

        await resume.save();

        // Notify user about the status change (if required)
        const user = await User.findById(resume.userId);
        if (user) {
            // Code to send notification (email or in-app notification)
            // Example: Notification.send(user.email, `Your resume has been ${status}`);
        }

        res.status(200).json({ message: `Resume ${status} successfully`, resume });
    } catch (error) {
        res.status(500).json({ message: "Error updating resume status", error: error.message });
    }
};
