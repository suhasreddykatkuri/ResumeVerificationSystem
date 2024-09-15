import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Adjust import path as needed

const UserProfile = () => {
    const { id } = useParams(); // Get user ID from URL
    const { fetchUserProfile, updateResumeStatus, userProfile, error, isLoading } = useAuthStore((state) => ({
        fetchUserProfile: state.fetchUserProfile,
        updateResumeStatus: state.updateResumeStatus,
        userProfile: state.userProfile,
        error: state.error,
        isLoading: state.isLoading,
    }));

    const [status, setStatus] = useState(userProfile?.resume?.status || ''); // Local state for status

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
            await updateResumeStatus(id, newStatus, ''); // Update the status on the backend
            setStatus(newStatus); // Update local state
        } catch (error) {
            // Error handling is managed by the store
        }
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
        <div>
            <h1>User Profile</h1>
            <p><strong>Name:</strong> {userProfile.resume.name}</p>
            <p><strong>Email:</strong> {userProfile.resume.email}</p>
            <p><strong>Resume Status:</strong> {status}</p>
            <button onClick={handleStatusToggle}>
                {status === 'approved' ? 'reject' : 'approve'}
            </button>
        </div>
    );
};

export default UserProfile;
