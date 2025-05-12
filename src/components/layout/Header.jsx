import React from 'react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="header">
      <button onClick={onToggleSidebar}>≡</button>
      <h1>Chinese Study</h1>
    </header>
  );
}
