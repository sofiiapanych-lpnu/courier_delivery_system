import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <nav>
        <ul>
          <li><Link to="deliveries">Deliveries</Link></li>
          <li><Link to="users">Users</Link></li>
          <li><Link to="orders">Orders</Link></li>
          <li><Link to="courier-schedules">Courier schedules</Link></li>
          <li><Link to="warehouses">Warehouses</Link></li>
          <li><Link to="vehicles">Vehicles</Link></li>
          <li><Link to="feedbacks">Courier feedbacks</Link></li>
          <li><Link to="reports">Reports</Link></li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default AdminPage;
