import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav>
      <div className="container nav-container">
        <Link to="/" className="logo gradient-text">Study Planner</Link>
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/leaderboard">Leaderboard</Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '2rem', padding: '0.5rem 1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <Link to="/auth" className="btn btn-primary" style={{ marginLeft: '2rem', padding: '0.5rem 1.2rem' }}>Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
