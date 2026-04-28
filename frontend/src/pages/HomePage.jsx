import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Globe, Users } from 'lucide-react';
import './HomePage.css';

const HomePage = ({ voiceEnabled }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (voiceEnabled) {
      const msg = new SpeechSynthesisUtterance("Welcome to Election Journey Assistant. Understand your election journey. Get started by clicking the button below.");
      window.speechSynthesis.speak(msg);
    }
  }, [voiceEnabled]);

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section">
        <h1 className="hero-title">
          Understand Your <br />
          <span className="text-gradient">Election Journey</span>
        </h1>
        <p className="hero-subtitle">
          Empowering citizens to participate in the democratic process with clear, accessible, and interactive guidance.
        </p>
        <button className="primary-btn" onClick={() => navigate('/timeline')}>
          Start Your Journey <ChevronRight size={20} />
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-card glass-panel">
          <div className="feature-icon bg-accent">
            <Globe size={24} />
          </div>
          <h3>Accessible to All</h3>
          <p>Multilingual support, high contrast mode, and voice narration for inclusive access.</p>
        </div>
        
        <div className="feature-card glass-panel">
          <div className="feature-icon bg-success">
            <ShieldCheck size={24} />
          </div>
          <h3>Combat Misinformation</h3>
          <p>AI-powered fact-checking and myth-busting to ensure you have reliable info.</p>
        </div>

        <div className="feature-card glass-panel">
          <div className="feature-icon bg-warning">
            <Users size={24} />
          </div>
          <h3>Gamified Learning</h3>
          <p>Earn badges and track progress while learning about your civic duties.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
