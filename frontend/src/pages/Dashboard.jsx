import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <section className="dashboard glass-panel">
      <h2 className="gradient-text">Your Dashboard</h2>
      <div className="dashboard-options">
        <Link to="/schedule" className="option-card">
          <h3>Schedule Planner</h3>
          <p>Create AI-generated study schedules.</p>
        </Link>
        <Link to="/quiz" className="option-card">
          <h3>Quiz Generator</h3>
          <p>Generate quizzes and test your knowledge.</p>
        </Link>
        <Link to="/leaderboard" className="option-card">
          <h3>Leaderboard</h3>
          <p>See how you rank against other learners.</p>
        </Link>
      </div>
    </section>
  );
}

export default Dashboard;

