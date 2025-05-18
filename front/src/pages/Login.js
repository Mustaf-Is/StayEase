import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginBackground from '../assets/images/Image.png';
import '../assets/fonts/font.css';
import icon from '../assets/svgs/location.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const authData = { email, password };
      const response = await axios.post('http://localhost:8080/api/auth/login', authData);

      // On success, store token and navigate
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Login successful, token:', token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
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
    <div className="min-h-screen flex flex-col items-center justify-center  bg-gray-100">
      <h2 className="text-2xl flex font-bold text-center text-gray-800 mb-4" style={{letterSpacing: '0.1em', fontSize: '32px' }}>Welcome to<span className='flex px-3 text-3xl' style={{fontFamily: 'Zian'}}>St<div style={{ width: '32px', height: '32px', padding: '1px' }}><img src={icon} alt={'location-icon'} /></div>ye<div style={{ width: '32px', height: '32px', padding: '1px' }}><img src={icon} alt={'location-icon'} /></div>se</span>
      </h2>
      <p className="text-md text-gray-500 mb-4">Sign in and find your perfect stay!</p>
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign in to your account</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
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
        </div>
        <div className="hidden md:block w-1/2">
          <img
            src={loginBackground}
            alt="StayEase Login Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;