
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    // Make an API call to validate login credentials
    const response = await fetch('http://localhost:5002/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.token) {
      // Save the JWT token to localStorage upon successful login
      localStorage.setItem('token', data.token);

      // Redirect to the homepage after login
      navigate('/');  // Redirect to the homepage
    } else {
      // Show an alert if login failed
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {/* Header with "Dinewise" */}
        <h1 className="text-4xl font-bold text-center text-gray-700">Welcome to Dinewise</h1>
        
        {/* Welcome Message */}
        <p className="text-lg text-center text-gray-600 mt-2 mb-6">Your one-stop platform to explore delicious food.</p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button type="submit" className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300">
            Login
          </button>
        </form>

        {/* Create an account link */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;