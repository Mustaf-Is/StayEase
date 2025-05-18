import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            const token = localStorage.getItem('token');
            console.log('Retrieved token from localStorage:', token);

            if (!token) {
                setError('You must be logged in to view listings.');
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token.trim()}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };
            console.log('Sending GET request with config:', config);

            try {
                const response = await axios.get('http://localhost:8080/api/ads', config);
                console.log('API response:', response);
                setListings(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching listings:', err);
                if (err.response) {
                    console.log('Response status:', err.response.status);
                    console.log('Response headers:', err.response.headers);
                    console.log('Response data:', err.response.data);
                    if (err.response.status === 401) {
                        setError('Unauthorized. Please log in again. The token may have expired or be invalid.');
                        localStorage.removeItem('token');
                        navigate('/login');
                    } else if (err.response.status === 403) {
                        setError('Forbidden: You do not have permission to view listings. ' +
                            (err.response.data?.message || 'Check server logs for JwtAuthenticationFilter and Spring Security output. ' +
                            'Decode the token at https://jwt.io to verify roles (e.g., ["ROLE_USER"]) and expiration.'));
                    } else {
                        setError('Failed to fetch listings: ' + (err.response.data?.message || err.message));
                    }
                } else {
                    setError('Network error: ' + err.message);
                }
                setLoading(false);
            }
        };

        fetchListings().catch(err => {
            console.error('Unhandled error in fetchListings:', err);
            setError('An unexpected error occurred while fetching listings.');
            setLoading(false);
        });
    }, [navigate]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Available Listings</h1>
            {listings.length === 0 ? (
                <div className="text-center py-10">No listings available at this time.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div key={listing.id} className="border rounded-lg overflow-hidden shadow-lg">
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-2 p-2">
                                    {listing.imageUrls && listing.imageUrls.length > 0 ? (
                                        listing.imageUrls.slice(0, 4).map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`${listing.title} image ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                        ))
                                    ) : (
                                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center col-span-2">
                                            <span className="text-gray-500">No images available</span>
                                        </div>
                                    )}
                                </div>
                                {listing.imageUrls && listing.imageUrls.length > 4 && (
                                    <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                        +{listing.imageUrls.length - 4} photos
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h2
                                    className="text-xl font-semibold cursor-pointer hover:underline"
                                    onClick={() => navigate(`/listings/${listing.id}`)}
                                >
                                    {listing.title}
                                </h2>
                                <p className="text-gray-600">{listing.description}</p>
                                <p className="text-sm text-gray-500">
                                    {listing.street}, {listing.city}, {listing.zipcode}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Posted: {new Date(listing.pubDate).toLocaleDateString()}
                                </p>
                                <div className="mt-2">
                                    <span>Price: </span>
                                    <span className="font-bold">${listing.pricePerDay}/day</span> |
                                    <span className="font-bold">${listing.pricePerWeek}/week</span> |
                                    <span className="font-bold">${listing.pricePerMonth}/month</span>
                                </div>
                                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Reserve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Listings;