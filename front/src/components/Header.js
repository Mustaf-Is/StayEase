import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/fonts/font.css';
import icon from '../assets/svgs/location.svg';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <Link to="/" className="text-3xl flex font-extrabold text-gray-800 tracking-tight" style={{ fontFamily: 'Zian, sans-serif', letterSpacing: '0.1em', fontSize: '32px' }}>
                St<div style={{ width: '32px', height: '32px', padding: '1px' }}><img src={icon} alt={'location-icon'} /></div>ye<div style={{ width: '32px', height: '32px', padding: '1px' }}><img src={icon} alt={'location-icon'} /></div>se
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <button
                  className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                    to="/"
                    className="relative text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                >
                  Home
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {isAuthenticated ? (
                    <>
                      <Link
                          to="/create"
                          className="relative text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                      >
                        Create
                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="relative text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                      >
                        Log Out
                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                    </>
                ) : (
                    <>
                      <Link
                          to="/login"
                          className="relative text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                      >
                        Log In
                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link
                          to="/signup"
                          className="text-lg font-medium bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                      >
                        Sign Up
                      </Link>
                    </>
                )}
              </div>
            </div>
          </div>

          {isMenuOpen && (
              <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg">
                <div className="flex flex-col items-center space-y-4 py-4">
                  <Link
                      to="/"
                      className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  {isAuthenticated ? (
                      <>
                        <Link
                            to="/create"
                            className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          Create
                        </Link>
                        <button
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                          Log Out
                        </button>
                      </>
                  ) : (
                      <>
                        <Link
                            to="/login"
                            className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-lg font-medium bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                  )}
                </div>
              </div>
          )}
        </div>
      </header>
  );
};

export default Header;