// components/AdminLayout.js

import React from 'react';
import styles from '../utility/styles/AdminLayout.module.css'; // Import your CSS module
import Link from 'next/link';

const AdminLayout = ({ children }) => {
  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebar}>
        {/* Sidebar content goes here */}
        <ul>
          <li>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/connection">
              Connection
            </Link>
          </li>
          <li>
            <Link href="/pipeline">
              Pipeline
            </Link>
          </li>
          <li>
            <Link href="/pipeline-step">
            Pipeline Steps
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.mainContent}>
        {/* Main content goes here */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
