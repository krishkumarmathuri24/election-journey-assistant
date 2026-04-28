import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import './TimelinePage.css';

const TimelinePage = ({ voiceEnabled }) => {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/timeline`)
      .then(res => res.json())
      .then(data => {
        setMilestones(data);
        setLoading(false);
        if (voiceEnabled) {
          const msg = new SpeechSynthesisUtterance("Timeline loaded. There are " + data.length + " key milestones in your election journey.");
          window.speechSynthesis.speak(msg);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [voiceEnabled]);

  if (loading) return <div className="loading-state">Loading timeline...</div>;

  return (
    <div className="timeline-container animate-fade-in">
      <div className="page-header">
        <h2>Your Election <span className="text-gradient">Timeline</span></h2>
        <p>Follow these steps to ensure you're ready for election day.</p>
      </div>

      <div className="timeline">
        {milestones.map((item, index) => (
          <div key={item.id} className={`timeline-item ${item.status}`}>
            <div className="timeline-marker">
              {item.status === 'completed' ? <CheckCircle size={24} /> : 
               item.status === 'current' ? <Clock size={24} /> : 
               <Calendar size={24} />}
            </div>
            
            <div className="timeline-content glass-panel">
              <div className="timeline-date">{item.date}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button 
                className={`action-btn ${item.status}`}
                onClick={() => {
                  if (item.link?.startsWith('http')) {
                    window.open(item.link, '_blank');
                  } else if (item.link?.startsWith('/')) {
                    navigate(item.link);
                  } else {
                    alert(`Action triggered: ${item.action}`);
                  }
                }}
              >
                {item.action} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelinePage;
