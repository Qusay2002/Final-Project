import React from 'react';

const ProfilePage = ({ user, onLogout }) => {
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      {}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
