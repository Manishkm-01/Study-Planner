import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import './Leaderboard.css';

function Leaderboard() {
  const [subject, setSubject] = useState('');
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async (subj) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/quizzes/leaderboard/${encodeURIComponent(subj)}`);
      setScores(response.data);
    } catch (err) {
      console.error('Leaderboard fetch error', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject) fetchLeaderboard(subject);
  };

  return (
    <section className="leaderboard-page glass-panel">
      <h2 className="gradient-text">Leaderboard</h2>
      <form className="leaderboard-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject (e.g., Mathematics)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Show Leaderboard'}
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {!loading && scores && scores.length === 0 && subject && (
        <p className="no-data-msg">No scores found for "{subject}". Try another subject!</p>
      )}
      {scores && scores.length > 0 && (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((row, idx) => (
              <tr key={row.id || idx}>
                <td>{idx + 1}</td>
                <td>{row.user?.name || row.user?.email || 'Anonymous'}</td>
                <td>{row.score}</td>
                <td>{row.totalQuestions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Leaderboard;
