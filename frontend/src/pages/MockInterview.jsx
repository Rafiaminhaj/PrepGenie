import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from '../lib/api';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaUserCircle, FaRobot, FaPaperPlane } from 'react-icons/fa';

const MockInterview = () => {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Generate a unique session ID for the interview
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    
    // Initial greeting from AI
    setMessages([
      {
        sender: 'ai',
        text: "Hello! I'm your AI Mock Interviewer for the Java Backend Developer role. Are you ready to begin the interview?",
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/interview/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          message: userMsg
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting. Let's try that again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 mt-20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Mock Interview
          </h1>
          <p className="text-gray-400 mt-2">Java Backend Developer Role</p>
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-[#1a1d27] rounded-xl border border-gray-700/50 shadow-2xl flex flex-col overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {msg.sender === 'user' ? <FaUserCircle size={24} /> : <FaRobot size={24} />}
                </div>
                
                <div className={`max-w-[75%] p-4 rounded-2xl leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50 rounded-tr-sm' 
                    : 'bg-gray-800/50 border border-gray-700 rounded-tl-sm text-gray-200'
                }`}>
                  {/* Basic text rendering, could be upgraded to markdown later */}
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-400">
                  <FaRobot size={24} />
                </div>
                <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-700 rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#14161e] border-t border-gray-700/50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your answer..."
                disabled={isLoading}
                className="flex-1 bg-[#1a1d27] text-white px-5 py-3 rounded-full border border-gray-700 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button 
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <FaPaperPlane className="-ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
