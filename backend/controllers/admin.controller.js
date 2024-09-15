import {Resume} from "../models/resume.model.js";
import { User } from "../models/user.model.js"; // Assuming we need user info as well for cross-checks
import {Feedback} from "../models/feedback.model.js"

// Admin controller to get all resumes
export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find()
            .populate({
                path: 'userId',
                select: 'name email' // Select only the name and email fields from the User model
            });

        console.log("Fetched Resumes: ", resumes);

        // Transform the resume data to include user name and email
        const resumeData = resumes.map(resume => ({
            id: resume._id,
            name: resume.userId.name,
            email: resume.userId.email,
            resumeURL: resume.resumeURL,
            status: resume.status,
            feedback: resume.feedback,
            submittedAt: resume.submittedAt,
            reviewedAt: resume.reviewedAt
        }));

        res.status(200).json(resumeData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resumes", error: error.message });
    }
};

// Admin controller to get a specific resume by ID
export const getResumeById = async (req, res) => {
    const { resumeId } = req.params;
    try {
        // Fetch resume by ID and populate userId field with user details
        const resume = await Resume.findById(resumeId).populate('userId', 'name email'); 
        
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        console.log("WWWWWWWWWWWWWW : ", resume);
        
        // Send resume along with user's name and email
        res.status(200).json({
            resume: {
                resumeURL: resume.resumeURL,
                status: resume.status,
                feedback: resume.feedback,
                submittedAt: resume.submittedAt,
                reviewedAt: resume.reviewedAt,
                name: resume.userId.name,
                email: resume.userId.email,

            }
        });
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

        console.log("SAVEDDDDDDDDDDDD", resume);

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


// Admin controller to submit feedback for a resume
export const submitFeedback = async (req, res) => {
    const { resumeId } = req.params;
    const { feedback } = req.body; // Feedback text from admin
    const adminId = req.userId; // Assuming req.user contains the authenticated admin's ID

    try {
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        
        // console.log("hhhhhhhhhhhh : ", resume);
        // console.log("resume id : ", resume._id);
        // console.log("resume id : ", adminId);
        // console.log("resume id : ", feedback);
        
        // Create and save the feedback
        const newFeedback = new Feedback({
            resumeId: resume._id,
            adminId: adminId,
            feedback: feedback
        });
        console.log("new feedback : ", newFeedback);
        
        await newFeedback.save();

        // Update resume's feedback field (if needed)
        resume.feedback = feedback;
        await resume.save();

        res.status(200).json({ message: "Feedback submitted successfully", feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback", error: error.message });
    }
};