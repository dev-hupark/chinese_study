'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="body">
        {isSidebarOpen && <Sidebar />}
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
