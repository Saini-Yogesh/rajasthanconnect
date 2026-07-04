import React, { useState, useRef, useEffect } from 'react';
import { Compass, Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';
import { MarkdownContent } from '../../utils/markdown.jsx';
import './AiAssistant.css';
import useSEO from '../../hooks/useSEO';
import { LIST_SEO } from '../../utils/seo';

export default function AiAssistant() {
  useSEO(LIST_SEO.aiAssistant);

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
  const messagesLogRef = useRef(null);
  const prevMessageCountRef = useRef(messages.length);

  const scrollChatToBottom = (behavior = 'smooth') => {
    const log = messagesLogRef.current;
    if (!log) return;
    log.scrollTo({ top: log.scrollHeight, behavior });
  };

  useEffect(() => {
    // Scroll only inside the chat container — never the whole page
    if (messages.length > prevMessageCountRef.current) {
      scrollChatToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (loading) {
      scrollChatToBottom();
    }
  }, [loading]);

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
        const reply = data.reply || '**Khamma Ghani! 🙏** I could not process that right now. Please try again in a moment.';
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      })
      .catch(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '**Khamma Ghani! 🙏** I am briefly unavailable. Please try again in a moment.' 
        }]);
      })
      .finally(() => setLoading(false));
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
            <div className="messagesLog" ref={messagesLogRef}>
              {messages.map((msg, index) => (
                <div 
                  className={`messageBubbleRow ${msg.role === 'user' ? 'userRow' : 'assistantRow'}`}
                  key={index}
                >
                  <div className="msgAvatar">
                    {msg.role === 'user' ? '👤' : '🐪'}
                  </div>
                  <div className="msgBubble">
                    <MarkdownContent content={msg.content} />
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
