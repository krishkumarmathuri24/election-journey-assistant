import React, { useState, useEffect } from 'react';
import { Check, Shield, FileText } from 'lucide-react';
import './SimulationPage.css';

const SimulationPage = ({ voiceEnabled }) => {
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (voiceEnabled) {
      if (step === 1) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Welcome to the mock ballot simulation. This is a practice environment. Please select a candidate."));
      } else if (step === 2) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Review your selection. Once submitted, your vote is final."));
      } else if (step === 3) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Your mock vote has been cast. Thank you for practicing your civic duty."));
      }
    }
  }, [step, voiceEnabled]);

  const candidates = [
    { id: 'c1', name: 'Rajesh Kumar', party: 'Development Party (DP)', color: 'var(--accent-primary)' },
    { id: 'c2', name: 'Priya Sharma', party: 'Progressive Front (PF)', color: 'var(--success)' },
    { id: 'c3', name: 'Amit Patel', party: 'Independent', color: 'var(--warning)' }
  ];

  return (
    <div className="sim-container animate-fade-in">
      <div className="page-header text-center">
        <h2>Mock <span className="text-gradient">Ballot</span> Simulation</h2>
        <p>Practice the voting process in a stress-free environment.</p>
      </div>

      <div className="sim-content glass-panel">
        {/* Step Indicators */}
        <div className="sim-steps">
          <div className={`sim-step ${step >= 1 ? 'active' : ''}`}>1. Select</div>
          <div className="step-line"></div>
          <div className={`sim-step ${step >= 2 ? 'active' : ''}`}>2. Review</div>
          <div className="step-line"></div>
          <div className={`sim-step ${step >= 3 ? 'active' : ''}`}>3. Cast</div>
        </div>

        {step === 1 && (
          <div className="sim-step-content animate-fade-in">
            <h3 className="text-center mb-6">Select Your Candidate</h3>
            <div className="candidates-list">
              {candidates.map(candidate => (
                <div 
                  key={candidate.id} 
                  className={`candidate-card ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="candidate-color" style={{ backgroundColor: candidate.color }}></div>
                  <div className="candidate-info">
                    <h4>{candidate.name}</h4>
                    <p>{candidate.party}</p>
                  </div>
                  <div className="checkbox-circle">
                    {selectedCandidate?.id === candidate.id && <Check size={16} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="sim-actions text-center mt-6">
              <button 
                className="primary-btn" 
                disabled={!selectedCandidate}
                onClick={() => setStep(2)}
              >
                Proceed to Review
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="sim-step-content animate-fade-in text-center">
            <Shield size={48} className="mx-auto mb-4 text-accent" />
            <h3 className="mb-6">Review Your Selection</h3>
            <div className="review-box">
              <p className="text-secondary">You are about to cast your vote for:</p>
              <h2 className="mt-2 text-gradient">{selectedCandidate.name}</h2>
              <p className="font-semibold">{selectedCandidate.party}</p>
            </div>
            
            <div className="sim-actions flex-center gap-4 mt-8">
              <button className="secondary-btn" onClick={() => setStep(1)}>Go Back</button>
              <button className="primary-btn pulse-anim" onClick={() => setStep(3)}>Cast Ballot</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="sim-step-content animate-fade-in text-center">
            <div className="success-circle mx-auto mb-6">
              <Check size={48} color="white" />
            </div>
            <h3 className="mb-2">Vote Successfully Cast!</h3>
            <p className="text-secondary max-w-md mx-auto mb-8">
              Congratulations! You've completed the mock voting process. Remember, your actual vote is completely confidential.
            </p>
            <div className="sim-actions">
              <button className="secondary-btn" onClick={() => { setStep(1); setSelectedCandidate(null); }}>
                Restart Simulation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;
