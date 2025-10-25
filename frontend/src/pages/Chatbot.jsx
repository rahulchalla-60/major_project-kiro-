import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your agricultural assistant. I can help you with crop prices, farming advice, and market insights. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What's the current wheat price?",
    "Show me top performing crops",
    "Weather forecast for farming",
    "Best time to sell paddy?",
    "Market trends this month"
  ];

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost')) {
      return "I can help you with current crop prices! Our system tracks real-time prices for 23+ crops including wheat, rice, cotton, and more. Would you like me to show you specific crop prices or market trends?";
    }
    
    if (message.includes('weather') || message.includes('forecast')) {
      return "Weather is crucial for farming decisions! I can provide weather forecasts, rainfall predictions, and their impact on crop prices. Check our Weather Prediction section for detailed forecasts.";
    }
    
    if (message.includes('top') || message.includes('best') || message.includes('perform')) {
      return "Based on our latest analysis, the top performing crops this month show strong growth potential. I recommend checking our Market Analysis dashboard for detailed performance metrics and growth predictions.";
    }
    
    if (message.includes('sell') || message.includes('when')) {
      return "Timing is everything in agriculture! Our price prediction models can help you identify the best selling periods. Generally, consider market trends, seasonal patterns, and upcoming demand cycles.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello there! I'm here to help with all your agricultural queries. You can ask me about crop prices, market trends, weather forecasts, or farming advice. What would you like to know?";
    }
    
    return "That's an interesting question! While I'm still learning, I can help you with crop prices, market analysis, and farming insights. Try asking about specific crops, prices, or check our dashboard for detailed analytics.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>🤖 Agricultural Assistant</h1>
        <p>Get instant help with crop prices, farming advice, and market insights</p>
      </div>

      <div className="chat-interface">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
              <div className="message-avatar">
                {message.sender === 'bot' ? '🤖' : '👤'}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="message-avatar">🤖</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-questions">
          <h3>Quick Questions:</h3>
          <div className="quick-buttons">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-button"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about crop prices, farming advice, or market trends..."
              className="message-input"
              rows="1"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="send-button"
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;