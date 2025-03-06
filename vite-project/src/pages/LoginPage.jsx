import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      console.log('Login successful:', response.data);
      // Set login status in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      // Show success toast message
      toast.success('Login successful!');
      // Navigate to the dashboard upon successful login
      navigate('/image');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.error || error.message);
      // Show error toast message
      toast.error(error.response?.data?.error || 'Error logging in');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-10 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Welcome back!</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="text-white block mb-2">Your email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Your email address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="text-white block mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-white text-black font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sign in
          </button>
        </form>
        <button className="w-full py-2 px-4 mt-4 bg-black text-white font-bold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;