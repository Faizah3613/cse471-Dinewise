
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, ArcElement, CategoryScale, LinearScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Navbar from "../components/Navbar";
import ProtectedRoute from '../components/ProtectedRoute';
import { API_URL } from '../config';

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale, ChartDataLabels);

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [ingredientName, setIngredientName] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState("");

  // Fetch ingredient data from backend
  useEffect(() => {
    fetch(`${API_URL}/api/inventory/ingredients`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    }) // Correct backend URL
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.ingredients && Array.isArray(data.ingredients)) {
        setIngredients(data.ingredients);
      } else {
        console.error("Invalid data format: Expected an array of ingredients inside 'ingredients' key");
      }
    })
    .catch((error) => {
      console.error("Error fetching ingredient data:", error);
    });
}, []);

  const handleAddIngredient = () => {
    // Validate input fields
    if (!ingredientName || !quantityToAdd || isNaN(quantityToAdd) || quantityToAdd <= 0) {
      alert("Please provide valid ingredient name and quantity.");
      return;
    }

    const token = localStorage.getItem('token');
  
    // Send the data to the backend to update the stock
    fetch(`${API_URL}/api/inventory/ingredients/addStock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: ingredientName,  // Correct key name (not ingredientId)
        quantityToAdd: parseInt(quantityToAdd), // Ensure it's a number
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ingredient) {
          window.location.reload();
          setIngredients((prevIngredients) => [...prevIngredients, data.ingredient]);  // Add ingredient to list
          setShowForm(false);  // Hide form after submit
          setIngredientName("");  // Reset input fields
          setQuantityToAdd("");
        } else {
          console.error("Error adding ingredient:", data.message);
          alert(data.message || "Error adding ingredient");
        }
      })
      .catch((error) => {
        console.error("Error adding ingredient:", error);
      });
  };
  

  // Generate dynamic colors for each item
  const getColor = (index) => {
    const colors = [
      "rgba(255, 99, 132, 0.5)",  // Red
      "rgba(54, 162, 235, 0.5)",  // Blue
      "rgba(255, 206, 86, 0.5)",  // Yellow
      "rgba(75, 192, 192, 0.5)",  // Green
      "rgba(153, 102, 255, 0.5)", // Purple
      "rgba(255, 159, 64, 0.5)",  // Orange
    ];
    return colors[index % colors.length];  // Loop through the colors if more than 6 ingredients
  };

  // Chart data with labels inside slices
  const data = {
    labels: ingredients.map((item) => item.name),
    datasets: [
      {
        label: "Ingredient Stock Levels",
        data: ingredients.map((item) => item.stock),
        backgroundColor: ingredients.map((_, index) => getColor(index)),  // Assign dynamic colors
        borderColor: ingredients.map(
          (stock) => (stock < 10 ? "rgba(255, 99, 132, 0.5)" : "rgba(75, 192, 192, 1)")
        ),
        borderWidth: 1,
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,  // Disable the labels inside the doughnut slices
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const stock = tooltipItem.raw;
            const status = stock < 10 ? 'Low Stock' : 'Sufficient Stock';
            return `${tooltipItem.label}: ${stock} (${status})`;
          },
        },
      },
      legend: {
        position: 'bottom',  // Position the legend below the chart
        labels: {
          font: {
            size: 12,  // Adjust font size for better visibility
          },
          usePointStyle: true,  // Use point style for the legend items
        },
      },
    },
};
  
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <div className="min-h-screen bg-rose-50">
        <Navbar />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-4">Ingredient Stock Levels</h1>

          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto justify-center:center">
            <Doughnut data={data} options={options} />
          </div>

          {/* Plus Button to Open Form */}
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Ingredient"}
          </button>

          {/* Form to Add Ingredient */}
          {showForm && (
            <div className="mt-4 p-6 border border-gray-300 rounded-lg">
              <h2 className="text-xl font-medium">Add Ingredient</h2>
              <div className="mt-4">
                <label className="block">Ingredient Name:</label>
                <input
                  type="text"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mt-4">
                <label className="block">Quantity to Add:</label>
                <input
                  type="number"
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(e.target.value)}
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mt-4">
                <button
                  onClick={handleAddIngredient}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          )}

        {/* Display Stock Alerts */}
        <div className="mt-6">
          <h2 className="text-xl font-medium">Stock Alerts</h2>
          <ul className="list-disc pl-5 mt-2">
            {ingredients.filter(item => item.stock < item.threshold).map(item => (
              <li key={item._id} className="text-red-500">
                {item.name} is below the threshold! Current stock: {item.stock}.
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);
};

export default Inventory;
