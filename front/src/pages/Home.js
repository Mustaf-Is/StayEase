import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const heroImages = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-cycle images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [heroImages.length]);

  const featuredListings = [
    {
      id: 1,
      title: 'Cozy Beachfront Cottage',
      description: 'Relax in this charming cottage with stunning ocean views.',
      price: 150,
      image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      location: 'Malibu, CA',
    },
    {
      id: 2,
      title: 'Modern Downtown Loft',
      description: 'Experience city living in this stylish, centrally located loft.',
      price: 200,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'New York, NY',
    },
    {
      id: 3,
      title: 'Rustic Mountain Cabin',
      description: 'Escape to this serene cabin surrounded by nature.',
      price: 120,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Aspen, CO',
    },
  ];

  return (
    <div className="bg-gray-100">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Stay with StayEase</h1>
            <p className="text-lg md:text-xl mb-6">Discover unique accommodations for your next adventure.</p>
            <Link
              to="/listings"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-blue-700 transition"
            >
              Browse Listings
            </Link>
          </div>
        </div>
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-gray-400'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{listing.location}</p>
                  <p className="text-gray-500 text-sm mt-2">{listing.description}</p>
                  <p className="text-blue-600 font-semibold mt-4">${listing.price}/night</p>
                  <Link
                    to={`/listings/${listing.id}`}
                    className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-lg mb-6">Join StayEase today and start exploring accommodations that suit your style.</p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-600 py-3 px-6 rounded-md text-lg font-medium hover:bg-gray-100 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;