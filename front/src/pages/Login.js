import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');

    try {
      // Prepare request payload
      const authData = { email, password };

      // Send POST request to login endpoint
      const response = await axios.post('http://localhost:8080/api/auth/login', authData);

      // On success, store token and navigate
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Login successful, token:', token);
      navigate('/'); // Adjust to your protected route
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 401 || error.response.status === 400) {
          setError('Invalid email or password');
        } else {
          setError(error.response.data.message || 'Invalid credentials.');
        }
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-auto my-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Stayease Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
            />
          </div>
          <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
  );
};

export default Login;