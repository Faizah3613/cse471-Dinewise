
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const SaladBuilder = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dietaryGoal, setDietaryGoal] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const dietaryGoals = [
    { value: '', label: 'Choose a goal...' },
    { value: 'high-protein', label: '💪 High Protein' },
    { value: 'low-carb', label: '🥬 Low Carb' },
    { value: 'vegan', label: '🌱 Vegan' },
    { value: 'low-calorie', label: '⚖️ Low Calorie' },
    { value: 'high-fiber', label: '🌾 High Fiber' }
  ];

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/salad/ingredients');
      const data = await response.json();
      if (data.success) {
        setIngredients(data.data);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAiRecommendations = async () => {
    if (!dietaryGoal) return;
    
    try {
      const response = await fetch('http://localhost:5002/api/salad/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal: dietaryGoal })
      });
      const data = await response.json();
      if (data.success) {
        setAiRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    }
  };

  const addToBowl = (ingredient, weight = 50) => {
    const existingItem = selectedItems.find(item => item.ingredientId === ingredient._id);
    
    if (existingItem) {
      setSelectedItems(prev => prev.map(item =>
        item.ingredientId === ingredient._id
          ? { ...item, weightInGrams: item.weightInGrams + weight }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, {
        ingredientId: ingredient._id,
        name: ingredient.name,
        category: ingredient.category,
        weightInGrams: weight,
        pricePerGram: ingredient.pricePerGram
      }]);
    }
  };

  const removeFromBowl = (ingredientId) => {
    setSelectedItems(prev => prev.filter(item => item.ingredientId !== ingredientId));
  };

  const calculateTotalPrice = async () => {
    if (selectedItems.length === 0) {
      setTotalPrice(0);
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/salad/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems.map(item => ({
            ingredientId: item.ingredientId,
            weightInGrams: item.weightInGrams
          }))
        })
      });
      const data = await response.json();
      if (data.success) {
        setTotalPrice(data.totalPrice);
      }
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

// SaladBuilder.jsx - Update the placeSaladOrder function
const placeSaladOrder = async () => {
  if (!tableNumber) {
    toast.error('Please enter a table number');
    return;
  }

  if (selectedItems.length === 0) {
    toast.error('Your salad bowl is empty!');
    return;
  }

  setIsPlacingOrder(true);

  try {
    const orderData = {
      tableNumber: parseInt(tableNumber),
      saladItems: selectedItems,
      totalPrice: totalPrice
    };

    // CHANGE THIS LINE - use the new endpoint
    const response = await fetch('http://localhost:5002/api/orders/salad-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (response.ok) {
      toast.success('Salad order placed successfully! 🎉');
      setSelectedItems([]);
      setTableNumber('');
    } else {
      toast.error(result.message || 'Failed to place order');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Error placing order. Please try again.');
  } finally {
    setIsPlacingOrder(false);
  }
};

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedItems]);

  const categories = {
    greens: '🥬 Greens',
    proteins: '🍗 Proteins',
    veggies: '🥕 Veggies',
    toppings: '🍒 Toppings',
    dressings: '🥣 Dressings'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fresh ingredients...🔃</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Build Your Salad Bowl 🥗</h1>
          <p className="text-lg text-gray-600">Create your perfect custom salad with fresh ingredients</p>
        </div>

        {/* AI Recommendation Section */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">AI Salad Assistant 🤖</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your dietary goal?
              </label>
              <select
                value={dietaryGoal}
                onChange={(e) => setDietaryGoal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {dietaryGoals.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={getAiRecommendations}
              disabled={!dietaryGoal}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Get Recommendations
            </button>
          </div>

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">AI Suggestions for {dietaryGoal}:</h3>
              <div className="flex flex-wrap gap-2">
                {aiRecommendations.slice(0, 6).map(ingredient => (
                  <span
                    key={ingredient._id}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {ingredient.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Choose Your Ingredients</h2>
            
            {Object.entries(categories).map(([categoryKey, categoryLabel]) => {
              const categoryIngredients = ingredients.filter(ing => ing.category === categoryKey);
              
              return (
                <div key={categoryKey} className="mb-8">
                  <h3 className="text-xl font-semibold text-green-600 mb-4">{categoryLabel}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryIngredients.map(ingredient => (
                      <div
                        key={ingredient._id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-800">{ingredient.name}</h4>
                          <span className="text-green-600 font-semibold">
                            ৳{ingredient.pricePerGram}/g
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{ingredient.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {ingredient.tags?.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => addToBowl(ingredient)}
                          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Add to Bowl (+50g)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Salad Bowl Summary */}
          <div className="bg-white rounded-xl p-6 shadow-lg h-fit sticky top-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Your Salad Bowl 🥗</h2>
            
            {/* Table Number Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Number *
              </label>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
                required
              />
            </div>

            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your bowl is empty😥. Add some ingredients!</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {selectedItems.map((item) => (
                    <div key={item.ingredientId} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <button
                          onClick={() => removeFromBowl(item.ingredientId)}
                          className="mr-2 text-red-500 hover:text-red-700 text-lg"
                          title="Remove this ingredient"
                        >
                          ❌
                        </button>
                        <div>
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({item.weightInGrams}g)</span>
                        </div>
                      </div>
                      <span className="text-green-600 font-semibold">
                        ৳{(item.pricePerGram * item.weightInGrams).toFixed(2)}
                      </span>
                    </div>
                    ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold mb-4">
                    <span>Total:</span>
                    <span className="text-green-700">৳{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={placeSaladOrder}
                    disabled={!tableNumber || isPlacingOrder}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isPlacingOrder ? 'Placing Order...' : 'Add to Order'}
                  </button>
                  
                  <button
                    onClick={() => setSelectedItems([])}
                    className="w-full border border-red-300 text-red-600 py-2 rounded-lg mt-2 hover:bg-red-50 transition-colors"
                  >
                    Clear Bowl
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaladBuilder;