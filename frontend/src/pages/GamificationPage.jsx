import React, { useState, useEffect } from 'react';
import { Award, Star, CheckCircle, XCircle } from 'lucide-react';
import './GamificationPage.css';

const GamificationPage = ({ voiceEnabled }) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [unaskedQuestions, setUnaskedQuestions] = useState([]);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // Load total points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('election_total_points');
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints, 10));
    }
  }, []);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/quiz`)
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data);
        
        // Shuffle all questions completely
        const shuffled = data.sort(() => 0.5 - Math.random());
        
        // Pick the first one as current, and save the rest as unasked
        setCurrentQuestionData(shuffled[0]);
        setUnaskedQuestions(shuffled.slice(1));
        
        if (voiceEnabled) {
          const msg = new SpeechSynthesisUtterance("Welcome to the endless Learn and Earn quiz. Answer questions to earn your civic badges.");
          window.speechSynthesis.speak(msg);
        }
      })
      .catch(err => console.error(err));
  }, [voiceEnabled]);

  if (!currentQuestionData) return <div className="loading-state">Loading endless quiz...</div>;

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent multiple clicks
    setSelectedOption(option);
    
    const correct = option === currentQuestionData.answer;
    setIsCorrect(correct);
    if (correct) {
      const newTotal = totalPoints + 100;
      setTotalPoints(newTotal);
      localStorage.setItem('election_total_points', newTotal.toString());
      
      if (voiceEnabled) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Correct! " + currentQuestionData.explanation));
      }
    } else {
      if (voiceEnabled) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Incorrect. " + currentQuestionData.explanation));
      }
    }
  };

  const nextQuestion = () => {
    if (unaskedQuestions.length > 0) {
      // Pop the next unique question from the unasked list
      setCurrentQuestionData(unaskedQuestions[0]);
      setUnaskedQuestions(unaskedQuestions.slice(1));
    } else {
      // If the user somehow answers EVERY single question in the database, reshuffle the entire database and start over
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      setCurrentQuestionData(shuffled[0]);
      setUnaskedQuestions(shuffled.slice(1));
    }
    
    setQuestionCount(questionCount + 1);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="quiz-container animate-fade-in">
      <div className="page-header">
        <h2>Learn & <span className="text-gradient">Earn</span></h2>
        <p>Test your election knowledge and earn civic badges.</p>
      </div>

      <div className="quiz-layout">
        <div className="dashboard glass-panel">
          <h3>Your Progress</h3>
          <div className="score-card">
            <Star className="text-warning" size={32} />
            <div className="score-info">
              <span className="score-value">{totalPoints}</span>
              <span className="score-label">Total Points</span>
            </div>
          </div>
          
          <h4>Badges</h4>
          <div className="badges-grid">
            <div className={`badge-item ${totalPoints >= 100 ? 'earned' : 'locked'}`}>
              <Award size={24} />
              <span>Voter Intern</span>
            </div>
            <div className={`badge-item ${totalPoints >= 500 ? 'earned' : 'locked'}`}>
              <Award size={24} />
              <span>Civic Scholar</span>
            </div>
            <div className={`badge-item ${totalPoints >= 1000 ? 'earned' : 'locked'}`}>
              <Award size={24} />
              <span>Democracy Champion</span>
            </div>
          </div>
        </div>

        <div className="quiz-area glass-panel">
            <div className="question-card">
              <div className="question-header">
                <span>Endless Mode - Question {questionCount}</span>
              </div>
              <h3>{currentQuestionData.question}</h3>
              
              <div className="options-grid">
                {currentQuestionData.options.map((option, idx) => {
                  let optionClass = "";
                  if (selectedOption) {
                    if (option === currentQuestionData.answer) {
                      optionClass = "correct";
                    } else if (option === selectedOption) {
                      optionClass = "incorrect";
                    }
                  }
                  
                  return (
                    <button 
                      key={idx}
                      className={`option-btn ${optionClass}`}
                      onClick={() => handleOptionClick(option)}
                      disabled={!!selectedOption}
                    >
                      {option}
                      {optionClass === "correct" && <CheckCircle size={18} />}
                      {optionClass === "incorrect" && <XCircle size={18} />}
                    </button>
                  );
                })}
              </div>

              {selectedOption && (
                <div className={`explanation ${isCorrect ? 'success' : 'error'} animate-fade-in`}>
                  <p>{currentQuestionData.explanation}</p>
                  <button className="next-btn" onClick={nextQuestion}>
                    Next Random Question
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
