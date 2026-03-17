import React, { useState, useRef, useEffect } from 'react';
import api from '../../utils/api';
import './AIChatWidget.css';

// Suggested questions shown when chat is empty
const SUGGESTED = [
  'What fertilizer is best for rice?',
  'How to improve soil health naturally?',
  'When should I apply NPK fertilizer?',
  'What causes yellow leaves in wheat?',
  'Best organic fertilizer for vegetables?',
];

// Format AI reply — convert markdown-like text to readable format
const formatReply = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
};

const AIChatWidget = () => {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (!hasGreeted) {
        setMessages([{
          role: 'assistant',
          content: "👋 Hi! I'm **Flexi**, your AI farming assistant. Ask me anything about fertilizers, crops, soil health, or farming tips!\n\nHow can I help you today?",
          time: new Date()
        }]);
        setHasGreeted(true);
      }
    }
  }, [open, hasGreeted]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    setError('');

    const newMessages = [
      ...messages,
      { role: 'user', content: userMsg, time: new Date() }
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Only send text content to backend (not time)
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.post('/api/ai/chat', {
        message: userMsg,
        history
      });

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: res.data.reply, time: new Date() }
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${msg}`, time: new Date(), isError: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! 🌱 Ask me anything about farming, fertilizers, or crop care.",
      time: new Date()
    }]);
    setError('');
  };

  const formatTime = (date) =>
    date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="ai-chat">
          {/* Header */}
          <div className="ai-chat__header">
            <div className="ai-chat__header-info">
              <div className="ai-chat__avatar">🌿</div>
              <div>
                <div className="ai-chat__name">Flexi</div>
                <div className="ai-chat__status">
                  <span className="ai-chat__status-dot" />
                  AI Farming Assistant
                </div>
              </div>
            </div>
            <div className="ai-chat__header-actions">
              <button onClick={clearChat} title="Clear chat" className="ai-chat__icon-btn">🗑️</button>
              <button onClick={() => setOpen(false)} title="Close" className="ai-chat__icon-btn">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chat__msg ai-chat__msg--${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="ai-chat__msg-avatar">🌿</div>
                )}
                <div className="ai-chat__msg-bubble">
                  <div
                    className="ai-chat__msg-text"
                    dangerouslySetInnerHTML={{ __html: formatReply(msg.content) }}
                  />
                  <div className="ai-chat__msg-time">{formatTime(msg.time)}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="ai-chat__msg ai-chat__msg--assistant">
                <div className="ai-chat__msg-avatar">🌿</div>
                <div className="ai-chat__msg-bubble">
                  <div className="ai-chat__typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            {/* Suggested questions — show only at start */}
            {messages.length === 1 && !loading && (
              <div className="ai-chat__suggestions">
                <p>Try asking:</p>
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} className="ai-chat__suggestion">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat__input-area">
            <div className="ai-chat__input-row">
              <textarea
                ref={inputRef}
                className="ai-chat__input"
                placeholder="Ask about fertilizers, crops, soil..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                maxLength={500}
                disabled={loading}
              />
              <button
                className="ai-chat__send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                title="Send message"
              >
                {loading ? '⏳' : '➤'}
              </button>
            </div>
            <div className="ai-chat__footer-note">
              Powered by Google Gemini AI · Free farming assistant
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`ai-chat__fab ${open ? 'ai-chat__fab--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Open AI farming assistant"
      >
        {open ? (
          <span className="ai-chat__fab-icon">✕</span>
        ) : (
          <>
            <span className="ai-chat__fab-icon">🌿</span>
            <span className="ai-chat__fab-label">Ask Flexi</span>
            <span className="ai-chat__fab-ping" />
          </>
        )}
      </button>
    </>
  );
};

export default AIChatWidget;
