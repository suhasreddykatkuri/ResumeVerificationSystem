import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import userList from '../userData.json'; // Import JSON data

const UserDashboard = () => {
  const userId = 1; // Replace with dynamic user ID
  const [resume, setResume] = useState(null); // Current resume file
  const [resumeName, setResumeName] = useState(''); // Current resume file name
  const [resumeStatus, setResumeStatus] = useState('Pending'); // Resume status
  const [uploadError, setUploadError] = useState(null); // Error message
  const [successMessage, setSuccessMessage] = useState(null); // Success message
  const [showResume, setShowResume] = useState(false); // State to control resume visibility
  const [users, setUsers] = useState(userList); // Simulated user data

  useEffect(() => {
    // Fetch user data from the JSON file (simulated)
    const user = users.find((u) => u.id === userId);
    if (user) {
      setResumeStatus(user.resumeStatus);
      if (user.resumeLink) {
        fetch(user.resumeLink)
          .then((res) => res.blob())
          .then((blob) => {
            setResume(blob);
            setResumeName(user.resumeName || 'Resume.pdf'); // Set the resume name
          });
      }
    }
  }, [userId, users]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setResume(file);
      setResumeName(file.name); // Update the resume name
      setUploadError(null);
      setSuccessMessage('Resume uploaded successfully!');
      // Simulate saving to JSON data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, resumeStatus: 'Pending', resumeLink: fileURL, resumeName: file.name }
            : user
        )
      );
    }
  };

  const handleDelete = () => {
    setResume(null);
    setResumeName(''); // Clear the resume name
    setSuccessMessage('Resume deleted successfully!');
    setResumeStatus('Pending');
    // Update JSON data simulation
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, resumeStatus: 'Pending', resumeLink: null, resumeName: '' }
          : user
      )
    );
  };

  const handleToggleResume = () => {
    setShowResume((prev) => !prev); // Toggle resume visibility
  };

  return (
    <div style={{ padding: '20px' }}>
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
        <div style={{ marginTop: '20px' }}>
          <h3>Current Resume</h3>
          <p>File Name: {resumeName}</p>
          <Button variant="danger" onClick={handleDelete}>
            Delete Resume
          </Button>
        </div>
      )}

      {/* View Resume Button */}
      {resume && (
        <div style={{ marginTop: '20px' }}>
          <Button
            variant="primary"
            onClick={handleToggleResume}
          >
            {showResume ? 'Hide Resume' : 'View Resume'}
          </Button>
          {showResume && (
            <iframe
              src={URL.createObjectURL(resume)}
              title="Resume Preview"
              style={{ width: '100%', height: '500px', border: '1px solid black', marginTop: '10px' }}
            />
          )}
        </div>
      )}

      {/* Status Message */}
      {uploadError && <Alert variant="danger">{uploadError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* View Status */}
      <div style={{ marginTop: '20px' }}>
        <h4>Resume Status</h4>
        <p>Status: {resumeStatus}</p>
      </div>
    </div>
  );
};

export default UserDashboard;