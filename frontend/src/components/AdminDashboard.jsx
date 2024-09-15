import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Adjust the path as needed
import '../Static/adminDashboard.css'; // Importing the custom CSS

const AdminDashboard = () => {
  // Using Zustand functions and state directly
  const { fetchAllResumes, resumes = [], isLoading, error, logout } = useAuthStore(state => ({
    fetchAllResumes: state.fetchAllResumes,
    resumes: state.resumes,
    isLoading: state.isLoading,
    error: state.error
  }));

  useEffect(() => {
    // Fetch resumes when the component mounts
    const getResumes = async () => {
      try {
        await fetchAllResumes();
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    getResumes();
  }, [fetchAllResumes]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-heading">Admin Dashboard</h1>
      <table className="resume-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Resume Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resumes.length > 0 ? (
            resumes.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.name}</td>
                <td>{resume.email}</td>
                <td>
                  <span className={`status-badge ${resume.status}`}>
                    {resume.status}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/user/${resume.id}`}>
                    <button className="view-profile-btn">View Profile</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-resumes">No resumes available</td>
            </tr>
          )}
        </tbody>
      </table>
      
    </div>
  );
};

export default AdminDashboard;
