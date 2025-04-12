import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserAvatar } from '../components/UserAvatar';
import { AIAvatar } from '../components/AIAvatar';
import { api } from '../api/api';


const ChatDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

    // First useEffect to initialize authentication
    useEffect(() => {
      const initializeAuth = async () => {
        try {
          // Make sure token is set in api headers
          const token = localStorage.getItem('token');
          if (token) {
            api.defaults.headers.common['x-auth-token'] = token;
            // Check that auth is working with a simple request
            await api.get('/api/health');
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Handle initialization error (maybe redirect to login)
        }
      };
  
      initializeAuth();
    }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchChatHistory();
    }
  }, [isInitialized]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      console.log('Sending token:', localStorage.getItem('token'));
      const response = await api.get('/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/message', { message: newMessage });
      
      // Add AI response to chat
      const aiMessage = {
        content: response.data.message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        content: 'Sorry, there was an error processing your request.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await api.delete('/api/messages');
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-6  text-white">
        {/* <h1 className="text-xl text-black font-semibold">Chat</h1> */}
        <button
          onClick={clearChat}
          className="bg-indigo-600 hover:bg-opacity-30 text-white px-4 py-2 rounded transition"
        >
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-thumb-rounded">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 italic">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.sender === 'user' ? <UserAvatar /> : <AIAvatar />}
              <div className={`max-w-[70%]`}>
                <div
                  className={`p-3 rounded-xl leading-relaxed break-words ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.sender === 'user' ? 'text-right' : ''
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start mb-4">
            <AIAvatar />
            <div className="max-w-[70%]">
              <div className="p-3 border border-gray-200 bg-white rounded-xl flex items-center justify-center min-w-[60px] min-h-[32px]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-ping" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-ping delay-200" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-ping delay-400" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex sticky bottom-0 items-center p-4 bg-white border-t border-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-base focus:outline-none focus:border-indigo-600 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className={`w-10 h-10 ml-2 flex justify-center items-center rounded-full ${
            isLoading || !newMessage.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatDashboard;