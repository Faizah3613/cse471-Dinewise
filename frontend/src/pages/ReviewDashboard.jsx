// src/pages/ReviewDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const ReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
//   const [userRole, setUserRole] = useState('');
  
  // New review form state
  const [newReview, setNewReview] = useState({
    customerName: '',
    reviewText: '',
    rating: 5,
    category: 'overall'
  });

  // Get auth token function
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  // Check user role from token
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reviews');
      
      if (response.data.reviews) {
        setReviews(response.data.reviews);
        if (response.data.isStaff !== undefined) {
          setIsStaff(response.data.isStaff);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(error.response?.data?.error || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/reviews/stats');
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.customerName.trim() || !newReview.reviewText.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post('/reviews', newReview);

      if (response.status === 201) {
        toast.success('Review submitted successfully!');
        setNewReview({
          customerName: '',
          reviewText: '',
          rating: 5,
          category: 'overall'
        });
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '❓';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'food': return 'bg-yellow-100 text-yellow-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      case 'ambiance': return 'bg-pink-100 text-pink-800';
      case 'overall': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">
            {isStaff ? '📊 Reviews Dashboard (Staff View)' : '💬 Customer Reviews'}
          </h1>
          <p className="text-lg text-gray-600">
            {isStaff 
              ? 'View all customer feedback with AI sentiment analysis'
              : 'Share your dining experience and see what others are saying'}
          </p>
          {isStaff && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
              👨‍🍳 Staff Mode: Sentiment Analysis Active
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Submit Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
                Share Your Experience
              </h2>

              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={newReview.customerName}
                    onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview({...newReview, reviewText: e.target.value})}
                    placeholder="Tell us about your experience..."
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className={`text-2xl ${star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">{newReview.rating}/5</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newReview.category}
                    onChange={(e) => setNewReview({...newReview, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="overall">Overall Experience</option>
                    <option value="food">Food Quality</option>
                    <option value="service">Service</option>
                    <option value="ambiance">Ambiance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Statistics Card */}
            {stats && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
                  Review Statistics
                </h2>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-700">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Reviews</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{stats.averageRating}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  
                  {/* Sentiment stats - ONLY for staff */}
                  {isStaff && stats.sentimentBreakdown && (
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-700 mb-3">Sentiment Analysis</h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-green-600 font-bold">{stats.sentimentBreakdown.positive}</div>
                          <div className="text-xs text-green-600">Positive</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-blue-600 font-bold">{stats.sentimentBreakdown.neutral}</div>
                          <div className="text-xs text-blue-600">Neutral</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                          <div className="text-red-600 font-bold">{stats.sentimentBreakdown.negative}</div>
                          <div className="text-xs text-red-600">Negative</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Reviews Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Customer Reviews ({reviews.length})
                </h2>
                {isStaff && (
                  <span className="text-sm text-indigo-600 font-medium flex items-center">
                    <span className="mr-2">👨‍🍳</span> Staff View: Sentiment Visible
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-600">No reviews yet</p>
                  <p className="text-sm text-gray-500">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{review.customerName}</h3>
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-500">
                              {'★'.repeat(review.rating)}
                              {'☆'.repeat(5 - review.rating)}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">{review.rating}/5</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full mt-1 ${getCategoryColor(review.category)}`}>
                            {review.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-4">{review.reviewText}</p>
                      
                      {isStaff && review.sentiment && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(review.sentiment)}`}>
                              {getSentimentEmoji(review.sentiment)} {review.sentiment}
                            </span>
                            {review.sentimentScore && (
                              <span className="ml-2 text-xs text-gray-500">
                                Score: {(review.sentimentScore * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            🤖 AI Analyzed
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-8 bg-indigo-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            {isStaff ? 'How Reviews Work (Staff View)' : 'How Reviews Work'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl mb-2">✍️</div>
              <h3 className="font-semibold mb-2">1. Share Experience</h3>
              <p className="text-sm text-gray-600">Customers submit honest reviews</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-gray-600">
                {isStaff ? 'Sentiment analysis runs automatically' : 'AI analyzes feedback automatically'}
              </p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">
                {isStaff ? '👨‍🍳' : '👥'}
              </div>
              <h3 className="font-semibold mb-2">
                {isStaff ? '3. Staff Insights' : '3. Community Sharing'}
              </h3>
              <p className="text-sm text-gray-600">
                {isStaff ? 'Staff see sentiment indicators' : 'Everyone sees shared experiences'}
              </p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold mb-2">4. Continuous Improvement</h3>
              <p className="text-sm text-gray-600">Use feedback to enhance experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;