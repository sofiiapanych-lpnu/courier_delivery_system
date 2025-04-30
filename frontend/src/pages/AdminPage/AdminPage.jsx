import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <Outlet />
    </div>
  );
};

export default AdminPage;
