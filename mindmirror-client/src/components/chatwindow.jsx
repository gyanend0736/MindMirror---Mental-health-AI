// components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { IoCloseSharp } from "react-icons/io5";

const API_URL = 'https://mindmirror-mental-health-ai-5.onrender.com/api/chat' || 'http://localhost:5000/api/chat'; // IMPORTANT: Use your Flask URL

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm MindMirror AI, your mental wellness companion. How can I support you today?", sender: 'AI' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the latest message whenever messages state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = input.trim();
    // 1. Add user message to state
    setMessages(prev => [...prev, { text: userMessage, sender: 'User' }]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Call the Flask backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      // 3. Add AI response to state
      const aiResponse = data.response || data.error || "Sorry, I couldn't get a response. Try again.";
      setMessages(prev => [...prev, { text: aiResponse, sender: 'AI' }]);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { text: "Connection error. Please check your server.", sender: 'AI' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '90px', // Positioned above the chat button
        right: '20px',
        width: '350px',
        height: '500px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #ddd',
      }}
    >
      {/* --- Chat Header --- */}
      <div 
        style={{
          padding: '12px 15px', 
          backgroundColor: '#6C47FF', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontWeight: 'bold'
        }}
      >
        MindMirror AI Chat
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2em' }}>
          <IoCloseSharp />
        </button>
      </div>

      {/* --- Message Area --- */}
      <div 
        style={{ 
          flexGrow: 1, 
          padding: '15px', 
          overflowY: 'auto',
          backgroundColor: '#f9f9f9'
        }}
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: '10px', 
              display: 'flex', 
              justifyContent: msg.sender === 'User' ? 'flex-end' : 'flex-start'
            }}
          >
            <div 
              style={{
                maxWidth: '80%',
                padding: '10px 12px',
                borderRadius: '15px',
                backgroundColor: msg.sender === 'User' ? '#6C47FF' : '#E0E0E0',
                color: msg.sender === 'User' ? 'white' : '#333',
                wordBreak: 'break-word',
                fontSize: '0.9em'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '15px', backgroundColor: '#E0E0E0', color: '#333', fontSize: '0.9em' }}>
                    *MindMirror is thinking...*
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Input Area --- */}
      <div style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isLoading}
          style={{
            flexGrow: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            marginRight: '10px',
            fontSize: '1em'
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={input.trim() === '' || isLoading}
          style={{
            backgroundColor: '#6C47FF',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '1.5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;