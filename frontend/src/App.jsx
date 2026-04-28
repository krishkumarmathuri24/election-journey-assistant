import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Map as MapIcon, MessageSquare, Award, CheckSquare, Clock, Volume2, BookOpen } from 'lucide-react';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import ChatbotPage from './pages/ChatbotPage';
import MapPage from './pages/MapPage';
import GamificationPage from './pages/GamificationPage';
import SimulationPage from './pages/SimulationPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      const msg = new SpeechSynthesisUtterance("Voice narration enabled");
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <Router>
      <div className={`app-container ${highContrast ? 'high-contrast' : ''}`}>
        <nav className="glass-panel sidebar">
          <div className="sidebar-header">
            <h2>Election<span className="text-gradient">Journey</span></h2>
          </div>
          
          <div className="nav-links">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Home size={20} /> <span>Home</span>
            </NavLink>
            <NavLink to="/timeline" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Clock size={20} /> <span>Timeline</span>
            </NavLink>
            <NavLink to="/map" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <MapIcon size={20} /> <span>Polling Map</span>
            </NavLink>
            <NavLink to="/chat" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <MessageSquare size={20} /> <span>AI Assistant</span>
            </NavLink>
            <NavLink to="/quiz" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Award size={20} /> <span>Learn & Earn</span>
            </NavLink>
            <NavLink to="/simulate" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <CheckSquare size={20} /> <span>Mock Ballot</span>
            </NavLink>
            <NavLink to="/history" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <BookOpen size={20} /> <span>History</span>
            </NavLink>
          </div>

          <div className="accessibility-controls">
            <h4>Accessibility</h4>
            <button 
              className={`acc-btn ${highContrast ? 'active' : ''}`}
              onClick={() => setHighContrast(!highContrast)}
              aria-label="Toggle high contrast mode"
            >
              High Contrast
            </button>
            <button 
              className={`acc-btn ${voiceEnabled ? 'active' : ''}`}
              onClick={toggleVoice}
              aria-label="Toggle voice narration"
            >
              <Volume2 size={16} /> Voice Narration
            </button>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage voiceEnabled={voiceEnabled} />} />
            <Route path="/timeline" element={<TimelinePage voiceEnabled={voiceEnabled} />} />
            <Route path="/map" element={<MapPage voiceEnabled={voiceEnabled} />} />
            <Route path="/chat" element={<ChatbotPage voiceEnabled={voiceEnabled} />} />
            <Route path="/quiz" element={<GamificationPage voiceEnabled={voiceEnabled} />} />
            <Route path="/simulate" element={<SimulationPage voiceEnabled={voiceEnabled} />} />
            <Route path="/history" element={<HistoryPage voiceEnabled={voiceEnabled} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
