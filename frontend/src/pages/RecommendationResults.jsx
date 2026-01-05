import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const RecommendationResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const weatherMap = {
    hot: { label: '☀️ Hot Weather', color: 'text-orange-600' },
    cold: { label: '❄️ Cold Weather', color: 'text-blue-600' },
    rainy: { label: '🌧️ Rainy Weather', color: 'text-purple-600' }
  };

  const timeMap = {
    breakfast: { label: '🍳 Breakfast', color: 'text-amber-600' },
    lunch: { label: '🍔 Lunch', color: 'text-green-600' },
    dinner: { label: '🍽️ Dinner', color: 'text-red-600' },
    dessert: { label: '🍰 Dessert', color: 'text-pink-600' }
  };

  const moodMap = {
    comfort: { label: '💖 Comfort Food', color: 'text-rose-600' },
    light: { label: '🥗 Light Meal', color: 'text-emerald-600' },
    spicy: { label: '🌶️ Spicy', color: 'text-red-600' },
    popular: { label: '🔥 Popular', color: 'text-orange-600' }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [searchParams]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/recommendations?${searchParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCriteria = () => {
    const criteria = [];
    const weather = searchParams.get('weather');
    const time = searchParams.get('time');
    const mood = searchParams.get('mood');

    if (weather && weatherMap[weather]) criteria.push(weatherMap[weather].label);
    if (time && timeMap[time]) criteria.push(timeMap[time].label);
    if (mood && moodMap[mood]) criteria.push(moodMap[mood].label);

    return criteria.join(' • ');
  };

  if (loading) {
    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your perfect recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/ai-recommendations')}
              className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4"
            >
              ← Back to Filters
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Recommended For You</h1>
            <p className="text-gray-600">
              {getSelectedCriteria() || 'Popular choices'}
            </p>
          </div>

          {/* Results Grid */}
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No recommendations found</h2>
              <p className="text-gray-500">Try adjusting your filters for better results</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Showing {recommendations.length} perfect match{recommendations.length !== 1 ? 'es' : ''}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-6">
                      {/* Placeholder for image - you can add actual images later */}
                      <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-rose-600">${(item.price / 100).toFixed(2)}</span>
                        <span className="text-sm text-gray-500">{item.category}</span>
                      </div>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults;