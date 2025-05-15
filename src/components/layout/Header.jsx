import React from 'react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="header">
      <div className="wrap">
        <button onClick={onToggleSidebar}>≡</button>
        <h1>Chinese Study</h1>
      </div>
    </header>
  );
}
