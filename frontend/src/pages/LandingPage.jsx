import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <section className="landing">
      <div className="hero">
        <h1>Study Planner</h1>
        <p>Plan your studies, generate quizzes, and track your progress.</p>
        <div className="cta-buttons">
          <Link to="/auth" className="btn primary">Get Started</Link>
        </div>
      </div>
      <div className="features">
        <div className="feature-card">
          <h2>Smart Schedule</h2>
          <p>AI‑generated study plans tailored to any subject and topic.</p>
        </div>
        <div className="feature-card">
          <h2>Instant Quiz</h2>
          <p>Create quizzes on‑the‑fly and challenge yourself.</p>
        </div>
        <div className="feature-card">
          <h2>Leaderboard</h2>
          <p>Compete with peers and see where you rank.</p>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
