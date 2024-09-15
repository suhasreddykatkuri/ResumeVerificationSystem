import React from 'react';
import { Link } from 'react-router-dom';
import userList from '../userData.json';  // Import user list

const AdminDashboard = () => {
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
          {userList.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.resumeStatus}</td>
              <td>
                <Link to={`/admin/user/${user.id}`}>
                  <button>View Profile</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;