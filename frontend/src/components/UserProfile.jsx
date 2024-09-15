import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Adjust import path as needed
import '../Static/userProfile.css'; // Import CSS for styling

const UserProfile = () => {
    const { id } = useParams(); // Get user ID from URL
    const navigate = useNavigate(); // For navigating back
    const { fetchUserProfile, updateResumeStatus, submitFeedback, userProfile, error, isLoading } = useAuthStore((state) => ({
        fetchUserProfile: state.fetchUserProfile,
        updateResumeStatus: state.updateResumeStatus,
        submitFeedback: state.submitFeedback,
        userProfile: state.userProfile,
        error: state.error,
        isLoading: state.isLoading,
    }));

    const [status, setStatus] = useState(userProfile?.resume?.status || ''); // Local state for status
    const [feedback, setFeedback] = useState(''); // Local state for feedback

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profile = await fetchUserProfile(id); // Fetch the user profile using the store's function
                setStatus(profile.resume.status); // Set the initial status
            } catch (error) {
                // Error handling is managed by the store
            }
        };

        getUserProfile();
    }, [id, fetchUserProfile]);

    const handleStatusToggle = async () => {
        const newStatus = status === 'approved' ? 'rejected' : 'approved'; // Toggle status
        try {
            await updateResumeStatus(id, newStatus, feedback); // Update the status and feedback on the backend
            setStatus(newStatus); // Update local state
        } catch (error) {
            // Error handling is managed by the store
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            await submitFeedback(id, feedback); // Submit feedback
            alert('Feedback submitted successfully');
        } catch (error) {
            // Error handling is managed by the store
        }
    };

    // Back button click handler
    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userProfile) {
        return <div>User not found</div>;
    }

    return (
        <div className="user-profile">
            <button className="back-button" onClick={handleBackClick}>← Back</button>
            <h1>User Profile</h1>
            <p><strong>Name:</strong> {userProfile.resume.name}</p>
            <p><strong>Email:</strong> {userProfile.resume.email}</p>
            <p><strong>Resume Status:</strong> 
                <span className={`resume-status ${status}`}>{status}</span>
            </p>

            <div className="feedback-section">
                <label htmlFor="feedback">Feedback:</label>
                <br />
                <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback here"
                /><br />
                <button className="submit-feedback-button" onClick={handleSubmitFeedback}>
                    Submit Feedback
                </button>
            </div>

            <button 
                className={`status-button ${status === 'approved' ? 'reject-button' : 'approve-button'}`} 
                onClick={handleStatusToggle}
            >
                {status === 'approved' ? 'Reject' : 'Approve'}
            </button>
        </div>
    );
};

export default UserProfile;
