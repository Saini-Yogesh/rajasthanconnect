import React, { useState, useRef, useEffect } from 'react';
import { Compass, Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';
import './AiAssistant.css';
import useSEO from '../../hooks/useSEO';

export default function AiAssistant() {
  useSEO({
    title: "AI Travel Assistant - Chat Live",
    description: "Ask anything about Rajasthan's heritage, food recipes, hotel stays, local transportation, or emergency helplines to our virtual travel companion.",
    keywords: "Ask AI Rajasthan, travel assistant chat, digital local guide, chat with travel AI"
  });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `**Khamma Ghani! 🙏** Welcome to RajasthanConnect's Ask AI Assistant.

I am your royal local guide. Ask me anything about:
* Rajput rulers and dynasty wars
* Traditional recipes like *Dal Baati Churma*
* How to dress and behave when visiting sacred temples
* Phrases and translations in Marwari or Mewari dialects

What can I help you explore today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = (e, text = null) => {
    if (e) e.preventDefault();
    const msgText = text || inputMessage;
    if (!msgText.trim()) return;

    const userMsg = { role: 'user', content: msgText };
    setMessages(prev => [...prev, userMsg]);
    if (!text) setInputMessage('');
    setLoading(true);

    const history = [...messages, userMsg];

    fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageHistory: history })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to query AI:', err);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '⚠️ I apologize, my connection to the royal library was temporarily cut off. Please check that the API server is active and try again.' 
        }]);
        setLoading(false);
      });
  };

  const presetQuestions = [
    'How do I say "how much is this" in Marwari?',
    'What is the history of Dal Baati Churma?',
    'What are the dress codes for visiting temples in Rajasthan?',
    'Tell me about Mehrangarh Fort in Jodhpur.'
  ];

  return (
    <div className="chatPage">
      <header className="chatHeader">
        <Sparkles className="headerIcon" size={32} />
        <h1>Ask Rajasthan - AI Assistant</h1>
        <p>Your local guide on dialects, history, etiquette, and gourmet guides.</p>
      </header>

      <section className="chatBody">
        <div className="chatLayout">
          
          {/* Chat Messages Log */}
          <div className="chatWindowCard">
            <div className="messagesLog">
              {messages.map((msg, index) => (
                <div 
                  className={`messageBubbleRow ${msg.role === 'user' ? 'userRow' : 'assistantRow'}`}
                  key={index}
                >
                  <div className="msgAvatar">
                    {msg.role === 'user' ? '👤' : '🐪'}
                  </div>
                  <div className="msgBubble">
                    {/* Render basic markdown manually for formatting */}
                    <div className="markdownContent">
                      {msg.content.split('\n').map((line, lIdx) => {
                        let processed = line;
                        // Bold tags replacement
                        if (processed.includes('**')) {
                          const parts = processed.split('**');
                          return (
                            <p key={lIdx}>
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx}>{p}</strong> : p)}
                            </p>
                          );
                        }
                        // Bullet point formatting
                        if (processed.trim().startsWith('*')) {
                          return <li key={lIdx} style={{ marginLeft: '15px', listStyleType: 'disc' }}>{processed.trim().substring(1).trim()}</li>;
                        }
                        return <p key={lIdx}>{processed}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="messageBubbleRow assistantRow">
                  <div className="msgAvatar">🐪</div>
                  <div className="msgBubble loadingBubble">
                    <LoaderDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Form */}
            <form onSubmit={(e) => handleSendMessage(e)} className="chatForm">
              <input 
                type="text" 
                placeholder="Ask me a question (e.g. translate a phrase, tell me about Mehrangarh)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btnSend" disabled={loading || !inputMessage.trim()} aria-label="Send message">
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Quick-Ask Chips Sidebar */}
          <div className="chipsSidebar">
            <div className="chipsCard">
              <h3><MessageSquare size={16} /> Suggested Queries</h3>
              <p>Click on any prompt below to query the AI guide immediately:</p>
              <div className="chipsList">
                {presetQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    className="presetChip"
                    onClick={(e) => handleSendMessage(null, q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="etiquetteNotice">
              <AlertCircle size={20} className="noticeIcon" />
              <div>
                <h4>General Advisory</h4>
                <p>AI advice should be verified with local tourism police desks or certified hotel staff for real-time ticket schedules.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

function LoaderDots() {
  return (
    <div className="loaderDots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
}
