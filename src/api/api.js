import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",

//   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000
});

// Add interceptor to attach token dynamically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
     
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/'; 
      }
      
    
      if (error.code === 'ERR_NETWORK') {
        console.log('Network error - server might be down or unreachable');
      }
      
      return Promise.reject(error);
    }
  );
  