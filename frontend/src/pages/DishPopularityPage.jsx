

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FaHamburger, FaPizzaSlice, FaAppleAlt, FaFish } from 'react-icons/fa';
import { GiFrenchFries, GiSlicedMushroom, GiChickenLeg, GiHamburger, GiCutLemon, GiWatermelon, GiFruitBowl  } from 'react-icons/gi';
import { CiBowlNoodles } from "react-icons/ci";
import { IoFastFoodOutline } from "react-icons/io5";
import { PiHamburgerFill } from "react-icons/pi";
import { LuSalad } from "react-icons/lu";
import { TbMeat } from "react-icons/tb";
import { LiaBaconSolid } from "react-icons/lia";
import { RiDrinks2Fill } from "react-icons/ri";
import { API_URL } from '../config';




const DishPopularityPage = () => {
  const [popularDishes, setPopularDishes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishPopularity = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/analytics/dish-popularity`);
        
        // Transform data to match expected frontend structure
        const transformedData = response.data.map(item => ({
          name: item._id,               // Map _id to name
          totalQuantity: item.totalQuantity,
        //   category: item.category || "Uncategorized"
        }));
        
        setPopularDishes(transformedData);
      } catch (err) {
        console.error("Error fetching dish popularity:", err);
        setError('Failed to load dish popularity data');
      } finally {
        setLoading(false);
      }
    };

    fetchDishPopularity();
  }, []);

  // Get appropriate icon based on dish name
  const getDishIcon = (name) => {
    // if (!name) return <FaPizzaSlice size={50} className="text-gray-500" />;
    
    const lowerName = name.toLowerCase();
    if (lowerName.includes("salad")) return <LuSalad size={50} className="text-green-700" />;
    if (lowerName.includes("pizza")) return <FaPizzaSlice size={50} className="text-red-500" />;
    if (lowerName.includes("mushroom")) return <GiSlicedMushroom size={50} className="text-yellow-400" />;
    if (lowerName.includes("bacon")) return <LiaBaconSolid size={50} className="text-red-900" />;
    if (lowerName.includes("double")) return <GiHamburger size={50} className="text-yellow-700" />;
    if (lowerName.includes("cheeseburger")) return <PiHamburgerFill size={50} className="text-yellow-800" />;
    if (lowerName.includes("combo")) return <IoFastFoodOutline size={50} className="text-cyan-900" />;
    if (lowerName.includes("burger")) return <FaHamburger size={50} className="text-yellow-500" />;
    if (lowerName.includes("fish")) return <FaFish size={50} className="text-blue-500" />;
    if (lowerName.includes("fries")) return <GiFrenchFries size={50} className="text-yellow-600" />;
    if (lowerName.includes("nuggets")) return <TbMeat size={50} className="text-yellow-800" />;
    if (lowerName.includes("chicken")) return <GiChickenLeg size={50} className="text-orange-500" />;
    if (lowerName.includes("spaghetti")) return <CiBowlNoodles size={50} className="text-orange-400" />;
    if (lowerName.includes("juice") || lowerName.includes("drink")) return <RiDrinks2Fill size={50} className="text-blue-700" />;
    if (lowerName.includes("lemonade")) return <GiCutLemon size={50} className="text-yellow-300" />;
    if (lowerName.includes("watermelon")) return <GiWatermelon size={50} className="text-red-400" />;
    if (lowerName.includes("fruit")) return <GiFruitBowl size={50} className="text-pink-400" />;
    
    return <FaPizzaSlice size={50} className="text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-red-500">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-white mb-6">Top 5 Popular Dishes</h1>

        {error && (
          <div className="bg-red-100 p-4 rounded mb-4 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white">Loading dishes...</div>
        ) : popularDishes.length === 0 ? (
          <div className="text-center text-white">
            No popular dishes found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDishes.map((dish) => (
              <div
                key={dish.name}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  {getDishIcon(dish.name)}
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800">
                  {dish.name}
                </h3>
                <p className="text-center text-xl font-bold mt-4">
                  Sold: {dish.totalQuantity}
                </p>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {dish.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DishPopularityPage;

