import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [activeTab, setActiveTab] = useState('user');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const userData = {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const response = await axios.post('http://localhost:8080/api/auth/register', userData);

        if (response.status === 200) {
          console.log('User registered successfully:', response.data);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error registering user:', error);
        if (error.response) {
          setServerError(
              error.response.data.message || 'Registration failed. Email or username may already be in use.'
          );
        } else {
          setServerError('Network error. Please try again later.');
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const getFormLabels = () => {
    return activeTab === 'user'
        ? {
          fullNameLabel: 'Full Name',
          fullNamePlaceholder: 'John Doe',
          usernameLabel: 'Username',
          usernamePlaceholder: 'johndoe123',
          emailLabel: 'Email address',
          emailPlaceholder: 'you@example.com',
          passwordLabel: 'Password',
          confirmPasswordLabel: 'Confirm Password',
        }
        : {
          fullNameLabel: 'Company Name',
          fullNamePlaceholder: 'StayEase Inc.',
          usernameLabel: 'Company Username',
          usernamePlaceholder: 'stayeasecorp123',
          emailLabel: 'Company Email',
          emailPlaceholder: 'info@stayease.com',
          passwordLabel: 'Company Password',
          confirmPasswordLabel: 'Confirm Company Password',
        };
  };

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Register for free
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Log in
              </Link>
            </p>
            <p className="mt-4 text-center text-lg text-black-600 " style={{color: '#60A5FA'}}>
              Register as:
            </p>
          </div>
          {serverError && <div className="text-center text-sm text-red-600">{serverError}</div>}
          <div className="flex justify-center">
            <button
                className={`px-7 py-2 font-semibold ${activeTab === 'user' ? 'text-blue-600 bg-gray-50' : 'text-gray-600'}`}
                onClick={() => {
                  setActiveTab('user');
                  setFormData((prev) => ({ ...prev, role: 'CUSTOMER' }));
                }}
            >
              User
            </button>
            <button
                className={`px-5 py-2 font-semibold ${activeTab === 'company' ? 'text-blue-600 bg-gray-50' : 'text-gray-600'}`}
                onClick={() => {
                  setActiveTab('company');
                  setFormData((prev) => ({ ...prev, role: 'COMPANY' }));
                }}
            >
              Company
            </button>
          </div>
          <form className="space-y-4 bg-gray-50 px-5 py-5" onSubmit={handleSubmit} style={{borderRadius: '10px', marginTop: '0px'}}>
            <div className="space-y-4 transition-opacity duration-300">
              <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 py-2"
                >
                  {getFormLabels().fullNameLabel}
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={getFormLabels().fullNamePlaceholder}
                />
                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 py-2"
                >
                  {getFormLabels().usernameLabel}
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={getFormLabels().usernamePlaceholder}
                />
                {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 py-2"
                >
                  {getFormLabels().emailLabel}
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={getFormLabels().emailPlaceholder}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 py-2"
                >
                  {getFormLabels().passwordLabel}
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 py-2"
                >
                  {getFormLabels().confirmPasswordLabel}
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default SignUp;