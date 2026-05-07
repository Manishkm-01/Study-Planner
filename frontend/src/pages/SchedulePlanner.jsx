import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import html2pdf from 'html2pdf.js';
import './SchedulePlanner.css';

function SchedulePlanner() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !topic) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/schedules/generate', { subject, topic });
      setSchedule(response.data.content || response.data);
    } catch (err) {
      console.error('Schedule generation error', err);
      alert('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('schedule-pdf-content');
    const opt = {
      margin:       1,
      filename:     `${subject}_${topic}_schedule.pdf`.replace(/\s+/g, '_'),
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <section className="schedule-planner glass-panel">
      <h2 className="gradient-text">AI Schedule Planner</h2>
      <form className="planner-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject (e.g., Mathematics)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Topic (e.g., Calculus)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Schedule'}
        </button>
      </form>
      {schedule && (
        <div className="schedule-result">
          <div className="schedule-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
            <h3 style={{ borderBottom: 'none', marginBottom: 0 }}>Generated Schedule</h3>
            <button className="btn btn-success" onClick={handleDownloadPdf}>Download PDF</button>
          </div>
          <div id="schedule-pdf-content" className="markdown-content" style={{ padding: '20px', background: '#1e1e2f', color: '#e2e8f0', borderRadius: '8px' }}>
            <ReactMarkdown 
              remarkPlugins={[remarkMath]} 
              rehypePlugins={[rehypeKatex]}
            >
              {schedule}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}

export default SchedulePlanner;
