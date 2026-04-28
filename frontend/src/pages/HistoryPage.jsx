import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Calendar, Users, MapPin, Activity } from 'lucide-react';
import './HistoryPage.css';

const HistoryPage = ({ voiceEnabled }) => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/history`)
      .then(res => res.json())
      .then(data => {
        setHistoryData(data);
        setFilteredData(data);
        setIsLoading(false);
        if (voiceEnabled) {
          const msg = new SpeechSynthesisUtterance("Welcome to the Election History section. Browse past Indian elections.");
          window.speechSynthesis.speak(msg);
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [voiceEnabled]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredData(historyData);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = historyData.filter(election => 
      election.year.toString().includes(lowerTerm) ||
      election.type.toLowerCase().includes(lowerTerm) ||
      election.winner.toLowerCase().includes(lowerTerm) ||
      election.description.toLowerCase().includes(lowerTerm)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="history-container animate-fade-in">
      <div className="page-header">
        <h2>Election <span className="text-gradient">History</span></h2>
        <p>Explore the complete archive of past Indian Elections.</p>
      </div>

      <div className="search-section glass-panel">
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by Year, Winner, or Election Type (e.g., '1951', 'Lok Sabha', 'Congress')"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading historical records...</div>
      ) : (
        <div className="history-grid">
          {filteredData.length > 0 ? (
            filteredData.map((election, index) => (
              <div key={index} className="history-card glass-panel animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="history-card-header">
                  <h3>{election.year} {election.type}</h3>
                  <span className={`status-badge ${election.type.includes('Lok Sabha') ? 'national' : 'state'}`}>
                    {election.type}
                  </span>
                </div>
                
                <p className="history-desc">{election.description}</p>
                
                <div className="history-details">
                  <div className="detail-item">
                    <Award className="detail-icon text-warning" size={16} />
                    <span><strong>Winner:</strong> {election.winner}</span>
                  </div>
                  <div className="detail-item">
                    <Users className="detail-icon text-accent" size={16} />
                    <span><strong>Turnout:</strong> {election.turnout}%</span>
                  </div>
                  <div className="detail-item">
                    <MapPin className="detail-icon text-primary" size={16} />
                    <span><strong>Total Seats:</strong> {election.seats}</span>
                  </div>
                  {election.primeMinister && (
                    <div className="detail-item">
                      <Activity className="detail-icon text-success" size={16} />
                      <span><strong>Prime Minister Elected:</strong> {election.primeMinister}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results glass-panel">
              <BookOpen size={48} className="text-muted" />
              <h3>No elections found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Added Award icon import since it was missing in the top import list, though we used it in the UI.
import { Award } from 'lucide-react';

export default HistoryPage;
