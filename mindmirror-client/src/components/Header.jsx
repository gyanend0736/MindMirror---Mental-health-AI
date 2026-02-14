import React from 'react';
import { Link } from 'react-router-dom';
import './component.css'; // Assuming you have a CSS file for styles
const Header = () => {
  return (
    <header >
      <h1>🧠 MindMirror</h1>
      <nav>
        <Link to="/" className="nav-option">Home</Link>
        <Link to="/journal" className="nav-option">Journal</Link>
        <Link to="/dashboard" className="nav-option">Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
