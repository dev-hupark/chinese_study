import React from 'react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="header">
      <h1>Chinese Study</h1>
      <button onClick={onToggleSidebar}>≡</button>
    </header>
  );
}
