import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import './ChatbotPage.css';

const ChatbotPage = ({ voiceEnabled }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Election AI Assistant. Ask me anything about registering to vote, finding polling stations, or debunking common myths.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await response.json();
      
      const botMsg = { id: Date.now() + 1, text: data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
      
      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = ["How do I register?", "Where is my polling station?", "Can I vote online?"];

  return (
    <div className="chat-container animate-fade-in">
      <div className="page-header">
        <h2>AI <span className="text-gradient">Assistant</span></h2>
        <p>Get instant answers to your election queries and fact-check information.</p>
      </div>

      <div className="chat-window glass-panel">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
              <div className="chat-avatar">
                {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.sender === 'bot' && msg.id !== 1 && <Sparkles size={14} className="ai-icon" />}
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble-wrapper bot">
              <div className="chat-avatar"><Bot size={20} /></div>
              <div className="chat-bubble bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-replies">
          {quickReplies.map((reply, idx) => (
            <button 
              key={idx} 
              className="quick-reply-btn"
              onClick={() => setInput(reply)}
            >
              {reply}
            </button>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask a question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
