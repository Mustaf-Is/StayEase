import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use named import

const AddAd = () => {
  const carouselImages = [
    'https://www.vitastudent.com/wp-content/uploads/2024/04/ULTIMATE-V239-VITA-CARDIFF-AUG-20235868_RT-e1713968356133.jpg?w=2048',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://www.vitastudent.com/wp-content/uploads/2024/04/DELUXE-IS-D-132F-IONA-STREET-EDINBURGH-VITA-DEC-20230175.jpg?w=1024',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PROPERTY',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    street: '',
    city: '',
    zipcode: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();


  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % carouselImages.length;
        console.log('Current image index:', newIndex);
        return newIndex;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);



  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setServerError('You must be logged in to create an ad.');
      navigate('/login');
    }
  }, [navigate]);

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
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipcode.trim()) newErrors.zipcode = 'Zipcode is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      const userId = getUserId();
      if (!userId) {
        setServerError('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const adData = {
          ad: {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            pubDate: new Date().toISOString(),
            pricePerDay: parseFloat(formData.pricePerDay),
            pricePerWeek: parseFloat(formData.pricePerWeek),
            pricePerMonth: parseFloat(formData.pricePerMonth),
          },
          address: {
            street: formData.street,
            city: formData.city,
            zipcode: formData.zipcode,
          },
          userId: parseInt(userId),
        };

        const response = await axios.post('http://localhost:8080/api/ads', adData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 201) {
          console.log('Ad created successfully:', response.data);
          navigate('/listings');
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
        {carouselImages.map((image, index) => (
            <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url(${image})` }}
                onError={() => console.log(`Failed to load image ${index}: ${image}`)}
            />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-blue-900/40"></div>
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
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="Urban Loft Apartment"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

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
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="Describe your property or vehicle..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                >
                  <option value="PROPERTY">Property</option>
                  <option value="VEHICLE">Vehicle</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
              </div>

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
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="120.00"
                />
                {errors.pricePerDay && <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>}
              </div>

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
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="700.00"
                />
                {errors.pricePerWeek && <p className="mt-1 text-sm text-red-600">{errors.pricePerWeek}</p>}
              </div>

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
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="2200.00"
                />
                {errors.pricePerMonth && <p className="mt-1 text-sm text-red-600">{errors.pricePerMonth}</p>}
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Street
                </label>
                <input
                    id="street"
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="789 Main Street"
                />
                {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="Chicago"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                  Zipcode
                </label>
                <input
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    value={formData.zipcode}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    placeholder="60601"
                />
                {errors.zipcode && <p className="mt-1 text-sm text-red-600">{errors.zipcode}</p>}
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