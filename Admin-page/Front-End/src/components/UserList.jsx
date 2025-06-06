import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css"; // Add this to use the styles below

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://u-design-os78dni1q-sibushorans-projects.vercel.app/api/users");
        setUsers(response.data);
      } catch (error) {
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      {error && <p className="error-text">{error}</p>}
      {users.length === 0 ? (
        <p className="empty-text">No users found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
