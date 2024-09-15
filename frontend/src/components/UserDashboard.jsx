import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useAuthStore } from '../store/authStore'; // Adjust the path to your useAuthStore
import '../Static/userDashboard.css'; // Import CSS for styling

const UserDashboard = () => {
  const userId = 1; // Replace with dynamic user ID (you can get it from authentication context)
  const [resume, setResume] = useState(null); // Current resume file
  const [resumeName, setResumeName] = useState(''); // Current resume file name
  const [resumeStatus, setResumeStatus] = useState('Pending'); // Resume status
  const [feedbackList, setFeedbackList] = useState([]); // List to store feedback
  const [uploadError, setUploadError] = useState(null); // Error message
  const [successMessage, setSuccessMessage] = useState(null); // Success message
  const [showResume, setShowResume] = useState(false); // State to control resume visibility
  const [resumeId, setResumeId] = useState(null); // ID of the uploaded resume

  const { logout, getResumeStatusAndFeedback, uploadResume, deleteResume } = useAuthStore((state) => ({
    logout: state.logout,
    getResumeStatusAndFeedback: state.getResumeStatusAndFeedback,
    uploadResume: state.uploadResume,
    deleteResume: state.deleteResume
  }));

  // Fetch user resume data and feedback
  useEffect(() => {
    // Fetch user resume details
    const fetchUserResume = async () => {
      try {
        const response = await fetch(`/api/user/resumes`); // Fetch user's resumes
        const data = await response.json();
        if (data.length > 0) {
          const userResume = data[0]; // Assuming the user has at least one resume
          setResumeId(userResume._id); // Set resume ID
          setResumeStatus(userResume.status);
          setResumeName(userResume.title); // Assuming title as the file name
          if (userResume.resumeURL) {
            const res = await fetch(userResume.resumeURL);
            const blob = await res.blob();
            setResume(blob);
          }
          // Fetch feedback
          const feedbackResponse = await getResumeStatusAndFeedback(userResume._id);
          setFeedbackList(feedbackResponse.feedback);
        }
      } catch (error) {
        console.error('Error fetching user resume:', error);
      }
    };

    fetchUserResume();
  }, [getResumeStatusAndFeedback]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setResume(file);
      setResumeName(file.name); // Update the resume name
      setUploadError(null);
      setSuccessMessage('Resume uploaded successfully!');
      try {
        await uploadResume(fileURL, file.name); // Upload resume
        // Fetch new resume data
        const response = await fetch(`/api/user/resumes`);
        const data = await response.json();
        if (data.length > 0) {
          const userResume = data[0]; // Assuming the user has at least one resume
          setResumeId(userResume._id);
          setResumeStatus(userResume.status);
          setFeedbackList(userResume.feedback || []);
        }
      } catch (error) {
        setUploadError('Error uploading resume.');
        console.error('Error uploading resume:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (resumeId) {
      try {
        await deleteResume(resumeId);
        setResume(null);
        setResumeName('');
        setResumeStatus('Pending');
        setSuccessMessage('Resume deleted successfully!');
        setFeedbackList([]);
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const handleToggleResume = () => {
    setShowResume((prev) => !prev); // Toggle resume visibility
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>

      {/* Upload Resume */}
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Resume</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept=".pdf, .doc, .docx"
          />
        </Form.Group>
      </Form>

      {/* Display current resume */}
      {resume && (
        <div className="resume-info">
          <h3>Current Resume</h3>
          <p>File Name: {resumeName}</p>
          <Button variant="danger" onClick={handleDelete}>
            Delete Resume
          </Button>
        </div>
      )}

      {/* View Resume Button */}
      {resume && (
        <div className="view-resume-button">
          <Button variant="primary" onClick={handleToggleResume}>
            {showResume ? 'Hide Resume' : 'View Resume'}
          </Button>
          {showResume && (
            <iframe
              src={URL.createObjectURL(resume)}
              title="Resume Preview"
              className="resume-preview"
            />
          )}
        </div>
      )}

      {/* Status Message */}
      {/* {uploadError && <Alert variant="danger" className="status-message">{uploadError}</Alert>} */}
      {successMessage && <Alert variant="success" className="status-message">{successMessage}</Alert>}

      {/* View Status */}
      <div className="status-message">
        <h4>Resume Status</h4>
        <p>Status: {resumeStatus}</p>
      </div>

      {/* Display Feedback */}
      <div className="feedback">
        <h4>Feedback</h4>
        {feedbackList.length > 0 ? (
          <ul>
            {feedbackList.map((feedback, index) => (
              <li key={index}>{feedback}</li>
            ))}
          </ul>
        ) : (
          <p>No feedback provided yet.</p>
        )}
      </div>

      {/* Logout Button */}
      <div className="logout-button">
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;
