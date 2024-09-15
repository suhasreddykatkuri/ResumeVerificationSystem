import {Resume} from "../models/resume.model.js";

// Controller to upload a resume
export const uploadResume = async (req, res) => {
    const { title, description, resumeURL } = req.body;
    try {
        const newResume = new Resume({
            title,
            description,
            resumeURL,
            userId: req.userId, // Assuming req.userId is populated by verifyToken middleware
            status: "pending" // By default, new resumes will be in 'Pending' status
        });

        await newResume.save();
        res.status(201).json({ message: "Resume uploaded successfully", resume: newResume });
    } catch (error) {
        res.status(500).json({ message: "Error uploading resume", error: error.message });
    }
};

// Controller to get all resumes uploaded by the user
export const getUserResumes = async (req, res) => {
    try {
        const userResumes = await Resume.find({ userId: req.userId }); // Fetch resumes uploaded by the user
        res.status(200).json(userResumes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resumes", error: error.message });
    }
};

// Controller to get the status and feedback of a specific resume
export const getResumeStatusAndFeedback = async (req, res) => {
    const { resumeId } = req.params;
    try {
        // Fetch the resume document from the database based on resumeId and userId
        const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
        
        // Check if the resume was found
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        // Return the status and feedback of the resume
        res.status(200).json({
            status: resume.status,
            feedback: resume.feedback || "No feedback provided"
        });
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        res.status(500).json({ message: "Error fetching resume status", error: error.message });
    }
};

// Controller to update a resume (title, description, fileUrl)
export const updateResume = async (req, res) => {
    const { resumeId } = req.params;
    const { title, description, fileUrl } = req.body;

    try {
        const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Update the resume details
        resume.title = title || resume.title;
        resume.description = description || resume.description;
        resume.fileUrl = fileUrl || resume.fileUrl;

        await resume.save();
        res.status(200).json({ message: "Resume updated successfully", resume });
    } catch (error) {
        res.status(500).json({ message: "Error updating resume", error: error.message });
    }
};

// Controller to delete a resume
export const deleteResume = async (req, res) => {
    const { resumeId } = req.params;

    try {
        const resume = await Resume.findOneAndDelete({ _id: resumeId, userId: req.userId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting resume", error: error.message });
    }
};
