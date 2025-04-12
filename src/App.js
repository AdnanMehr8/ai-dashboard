import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import axios from 'axios';
import ChatDashboard from './pages/ChatDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      {token ? (
        <>
          <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
            <button
              onClick={handleLogout}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded transition font-medium"
            >
              Logout
            </button>
          </div>
          <ChatDashboard />
        </>
      ) : (
        <Auth setToken={setToken} />
      )}
    </div>
  );
}

export default App;
