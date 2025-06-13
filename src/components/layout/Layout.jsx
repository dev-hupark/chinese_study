'use client';

import { useState } from 'react';
import Header from './Header';
import Menu from './Menu';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="layout">
      <Header onToggleMenu={toggleMenu} />
      <div className="body">
        {isMenuOpen &&
          <Menu
            onToggleMenu={toggleMenu}
          />
        }
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
