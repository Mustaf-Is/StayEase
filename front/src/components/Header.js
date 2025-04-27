import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                StayEase
              </Link>
            </div>
            {/* User Profile/Login */}
            <div className="flex items-center space-x-4">
              <button className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <Link
                  to="/"
                  className="hidden md:block text-gray-600 hover:text-blue-600 transition"
              >
                Home
              </Link>
              <Link
                  to="/create"
                  className="hidden md:block text-gray-600 hover:text-blue-600 transition"
              >
                Create
              </Link>
              {isAuthenticated ? (
                  <button
                      onClick={handleLogout}
                      className="hidden md:block text-gray-600 hover:text-blue-600 transition"
                  >
                    Log Out
                  </button>
              ) : (
                  <>
                    <Link
                        to="/login"
                        className="hidden md:block text-gray-600 hover:text-blue-600 transition"
                    >
                      Log In
                    </Link>
                    <Link
                        to="/signup"
                        className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                      Sign Up
                    </Link>
                  </>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;