import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Adjust the path as needed

const AdminDashboard = () => {
  // Using Zustand functions and state directly
  const { fetchAllResumes, resumes = [], isLoading, error } = useAuthStore(state => ({
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
    <div>
      <h1>Admin Dashboard</h1>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
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
                <td>{resume.status}</td>
                <td>
                  <Link to={`/admin/user/${resume.id}`}>
                    <button>View Profile</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No resumes available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
