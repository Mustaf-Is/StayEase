import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdDetail = () => {
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdById = async () => {
            const token = localStorage.getItem('token');
            console.log('Retrieved token from localStorage:', token);

            if (!token) {
                setError('You must be logged in to view ad details.');
                navigate('/login');
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token.trim()}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };
            console.log(`Sending GET request to fetch ad with ID ${id} with config:`, config);

            try {
                const response = await axios.get(`http://localhost:8080/api/ads/${id}`, config);
                console.log('Ad API response:', response.data);
                setAd(response.data);
                setLoading(false);
            } catch (err) {
                console.error(`Error fetching ad with ID ${id}:`, err);
                if (err.response) {
                    console.log('Response status:', err.response.status);
                    console.log('Response headers:', err.response.headers);
                    console.log('Response data:', err.response.data);
                    if (err.response.status === 401) {
                        setError('Unauthorized. Please log in again. The token may have expired or be invalid.');
                        localStorage.removeItem('token');
                        navigate('/login');
                    } else if (err.response.status === 403) {
                        setError('Forbidden: You do not have permission to view this ad. ' +
                            (err.response.data?.message || 'Check server logs for JwtAuthenticationFilter and Spring Security output. ' +
                                'Decode the token at https://jwt.io to verify roles (e.g., ["ROLE_USER"]) and expiration.'));
                    } else if (err.response.status === 404) {
                        setError('Ad not found.');
                    } else {
                        setError('Failed to fetch ad: ' + (err.response.data?.message || err.message));
                    }
                } else {
                    setError('Network error: ' + err.message);
                }
                setLoading(false);
            }
        };

        fetchAdById().catch(err => {
            console.error('Unhandled error in fetchAdById:', err);
            setError('An unexpected error occurred while fetching the ad.');
            setLoading(false);
        });
    }, [id, navigate]);

    const handleThumbnailClick = (index) => {
        setFeaturedImageIndex(index);
    };

    const openGallery = () => {
        if (ad?.imageUrls?.length > 0) {
            setSelectedImage(ad.imageUrls[featuredImageIndex]);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    // Determine how many thumbnails to show (max 5)
    const maxThumbnails = 5;
    const hasMoreImages = ad.imageUrls && ad.imageUrls.length > maxThumbnails;
    const thumbnailsToShow = hasMoreImages ? maxThumbnails - 1 : Math.min(ad.imageUrls?.length || 0, maxThumbnails);
    const additionalImagesCount = ad.imageUrls ? ad.imageUrls.length - maxThumbnails + 1 : 0;

    return (
        <div className="container w-4/5 mx-auto p-4">
            <button
                className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => navigate('/listings')}
            >
                Back to Listings
            </button>
            <h1 className="text-3xl font-bold mb-6">{ad.title}</h1>
            <div className="border rounded-lg overflow-hidden shadow-lg p-3">
                <div className="grid gap-4">
                    {ad.imageUrls && ad.imageUrls.length > 0 ? (
                        <>
                            {/* Featured image */}
                            <div>
                                <img
                                    src={ad.imageUrls[featuredImageIndex]}
                                    alt={`${ad.title} featured image`}
                                    className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px] cursor-pointer"
                                    onClick={openGallery}
                                    onError={(e) => {
                                        console.error(`Failed to load featured image at ${ad.imageUrls[featuredImageIndex]}:`, e);
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/800x480?text=Image+Not+Found';
                                    }}
                                />
                            </div>

                            {/* Thumbnails row */}
                            <div className="grid grid-cols-5 gap-4">
                                {ad.imageUrls.slice(0, thumbnailsToShow).map((url, index) => (
                                    <div key={index}>
                                        <img
                                            src={url}
                                            alt={`${ad.title} thumbnail ${index + 1}`}
                                            className={`object-cover object-center h-20 max-w-full rounded-lg cursor-pointer ${
                                                index === featuredImageIndex ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                            onClick={() => handleThumbnailClick(index)}
                                            onError={(e) => {
                                                console.error(`Failed to load thumbnail at ${url}:`, e);
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/100?text=Thumbnail+Not+Found';
                                            }}
                                        />
                                    </div>
                                ))}

                                {/* "More photos" thumbnail */}
                                {hasMoreImages && (
                                    <div>
                                        <div
                                            className="relative h-20 cursor-pointer"
                                            onClick={openGallery}
                                        >
                                            <img
                                                src={ad.imageUrls[maxThumbnails - 1]}
                                                alt={`${ad.title} more photos`}
                                                className="object-cover object-center h-20 w-full max-w-full rounded-lg"
                                                onError={(e) => {
                                                    console.error(`Failed to load more photos thumbnail:`, e);
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/100?text=More+Photos';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                <span className="text-white font-semibold">+{additionalImagesCount} photos</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No images available</span>
                        </div>
                    )}
                </div>

                {/* Image gallery modal */}
                {selectedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedImage(null);
                    }}>
                        <div className="bg-white p-4 rounded-lg relative max-w-4xl w-full">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                                onClick={() => setSelectedImage(null)}
                            >
                                ×
                            </button>
                            <h2 className="text-xl font-bold mb-2">{ad.title}</h2>
                            <img
                                src={selectedImage}
                                alt={`${ad.title} selected image`}
                                className="w-full h-auto max-h-[60vh] object-contain mb-4 rounded"
                                onError={(e) => {
                                    console.error(`Failed to load selected image at ${selectedImage}:`, e);
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                }}
                            />
                            <div className="grid grid-cols-6 gap-2 overflow-x-auto">
                                {ad.imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`${ad.title} thumbnail ${index + 1}`}
                                        className={`h-16 w-full object-cover rounded cursor-pointer ${
                                            url === selectedImage ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                        onClick={() => setSelectedImage(url)}
                                        onError={(e) => {
                                            console.error(`Failed to load gallery thumbnail at ${url}:`, e);
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/50?text=Thumbnail+Not+Found';
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-gray-600 mt-4 mb-2">{ad.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                    {ad.street}, {ad.city}, {ad.zipcode}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    Posted: {new Date(ad.pubDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">Type: {ad.type}</p>
                <div className="mb-2">
                    <span>Price: </span>
                    <span className="font-bold">${ad.pricePerDay}/day</span> |
                    <span className="font-bold">${ad.pricePerWeek}/week</span> |
                    <span className="font-bold">${ad.pricePerMonth}/month</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Posted by User ID: {ad.userId}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Reserve
                </button>
            </div>
        </div>
    );
};

export default AdDetail;
