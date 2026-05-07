import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import './QuizGenerator.css';
import './Leaderboard.css';

function QuizGenerator() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!subject || !topic) return;
    setLoading(true);
    setSubmitted(false);
    setScoreResult(null);
    try {
      const response = await axios.post('/api/quizzes/generate', { subject, topic });
      // Expect response.data.questionsJson or raw JSON string
      let questions = [];
      if (response.data.questionsJson) {
        questions = JSON.parse(response.data.questionsJson);
      } else if (typeof response.data === 'string') {
        questions = JSON.parse(response.data);
      } else {
        questions = response.data;
      }
      setQuizData(questions);
      setQuizId(response.data.id);
      setAnswers({});
    } catch (err) {
      console.error('Quiz generation error', err);
      alert('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (qIdx, option) => {
    setAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = async () => {
    const total = quizData.length;
    let score = 0;
    quizData.forEach((q, idx) => {
      if (answers[idx] && answers[idx] === q.answer) score++;
    });
    // send to backend for persistence and leaderboard
    try {
      const response = await axios.post(`/api/quizzes/${quizId}/submit`, {
        score,
        total,
      });
      setScoreResult({ score, total, leaderboardId: response.data.id });
      
      // Fetch leaderboard for the current subject
      console.log("Fetching leaderboard for subject:", subject);
      const lbResponse = await axios.get(`/api/quizzes/leaderboard/${encodeURIComponent(subject)}`);
      console.log("Leaderboard data:", lbResponse.data);
      setLeaderboard(lbResponse.data);
    } catch (e) {
      console.error('Submit score error', e);
    }
    setSubmitted(true);
  };

  return (
    <section className="quiz-generator glass-panel">
      <h2 className="gradient-text">AI Quiz Generator</h2>
      <form className="quiz-form" onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="Subject (e.g., Physics)"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Topic (e.g., Optics)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </form>

      {quizData.length > 0 && (
        <div className="quiz-content">
          {quizData.map((q, idx) => (
            <div key={idx} className="question-card glass-panel">
              <p className="question-text"><strong>{idx + 1}. {q.question}</strong></p>
              <ul className="options-list">
                {q.options.map((opt, oIdx) => {
                  let optionClass = "";
                  if (submitted) {
                    if (opt === q.answer) {
                      optionClass = "correct-answer";
                    } else if (answers[idx] === opt) {
                      optionClass = "incorrect-answer";
                    }
                  }
                  
                  return (
                    <li key={oIdx}>
                      <label className={optionClass}>
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleChange(idx, opt)}
                          disabled={submitted}
                        />
                        <span className="option-text">{opt}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {submitted && q.explanation && (
                <div className="explanation-box">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
          {!submitted && (
            <button className="btn btn-success" onClick={handleSubmit}>Submit Answers</button>
          )}
          {submitted && scoreResult && (
            <div className="score-result glass-panel">
              <h3>Your Score: {scoreResult.score} / {scoreResult.total}</h3>
            </div>
          )}
          {submitted && leaderboard.length > 0 && (
            <div className="leaderboard-section">
              <h3>Leaderboard for {subject}</h3>
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
                  {leaderboard.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{row.user?.email || 'Anonymous'}</td>
                      <td>{row.score}</td>
                      <td>{row.totalQuestions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default QuizGenerator;
