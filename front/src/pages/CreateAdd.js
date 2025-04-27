import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddAd = () => {
  const carouselImages = [
    'https://images.unsplash.com/photo-1497366754035-f6157f2cf32f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Cozy accommodation
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Modern apartment
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Luxury house
    'https://images.unsplash.com/photo-1602342655668-7d4b26102ad8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Car
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Airbnb', // Default value
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Auto-cycle images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [carouselImages.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.pricePerDay || formData.pricePerDay <= 0)
      newErrors.pricePerDay = 'Price per day must be a positive number';
    if (!formData.pricePerWeek || formData.pricePerWeek <= 0)
      newErrors.pricePerWeek = 'Price per week must be a positive number';
    if (!formData.pricePerMonth || formData.pricePerMonth <= 0)
      newErrors.pricePerMonth = 'Price per month must be a positive number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Prepare data for the backend
        const adData = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          price: {
            perDay: parseFloat(formData.pricePerDay),
            perWeek: parseFloat(formData.pricePerWeek),
            perMonth: parseFloat(formData.pricePerMonth),
          },
          address: formData.address,
          // Assuming userId is obtained from auth context or session
          userId: 1, // Replace with actual user ID from auth
        };

        // Make API call to the backend
        const response = await axios.post('http://localhost:8080/api/ads', adData);

        if (response.status === 201) {
          console.log('Ad created successfully:', response.data);
          navigate('/listings'); // Redirect to listings page
        }
      } catch (error) {
        console.error('Error creating ad:', error);
        if (error.response) {
          setServerError(error.response.data.message || 'Failed to create ad. Please try again.');
        } else {
          setServerError('Network error. Please try again later.');
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Carousel */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-blue-900/40"></div>
      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentImageIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
      {/* Form */}
      <div className="relative max-w-lg w-full space-y-8 bg-white/95 p-8 rounded-2xl shadow-2xl backdrop-blur-sm transform transition-all duration-500 animate-fade-in z-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create a New Ad</h2>
          <p className="mt-2 text-sm text-gray-600">
            Share your property or vehicle with StayEase users
          </p>
        </div>
        {serverError && (
          <div className="text-center text-sm text-red-600 bg-red-100 p-2 rounded-md">{serverError}</div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md group"
                placeholder="Cozy Beachfront Cottage"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md group"
                placeholder="Describe your property or vehicle..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md group"
              >
                <option value="Airbnb">Airbnb</option>
                <option value="Rent a Car">Rent a Car</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            {/* Price Per Day */}
            <div>
              <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
                Price Per Day ($)
              </label>
              <input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md group"
                placeholder="50.00"
              />
              {errors.pricePerDay && <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>}
            </div>

            {/* Price Per Week */}
            <div>
              <label htmlFor="pricePerWeek" className="block text-sm font-medium text-gray-700">
                Price Per Week ($)
              </label>
              <input
                id="pricePerWeek"
                name="pricePerWeek"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerWeek}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md group"
                placeholder="300.00"
              />
              {errors.pricePerWeek && <p className="mt-1 text-sm text-red-600">{errors.pricePerWeek}</p>}
            </div>

            {/* Price Per Month */}
            <div>
              <label htmlFor="pricePerMonth" className="block text-sm font-medium text-gray-700">
                Price Per Month ($)
              </label>
              <input
                id="pricePerMonth"
                name="pricePerMonth"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerMonth}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md group"
                placeholder="1000.00"
              />
              {errors.pricePerMonth && <p className="mt-1 text-sm text-red-600">{errors.pricePerMonth}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md group"
                placeholder="123 Main St, City, Country"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg"
            >
              Create Ad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAd;