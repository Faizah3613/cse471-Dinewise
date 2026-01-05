

import mongoose from 'mongoose';

// Define the MenuItem schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Dish name
  description: { type: String }, // Optional: Description of the dish
  price: { type: Number, required: true }, // Price of the dish
  category: { type: String, enum: ['kitchen', 'bar'], required: true }, // Category for routing
  ingredients: [
    {
      ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }, // Reference to Ingredient model
      quantity: { type: Number, required: true }, // Quantity used for this ingredient in the menu item
      unit: { type: String, required: true }, // Unit of measurement (e.g., g, pcs, etc.)
    }
  ],
  tags: [{
    type: String,
    enum: [
      'breakfast', 'lunch', 'dinner', 'dessert',
      'hot-weather', 'cold-weather', 'rainy-weather',
      'spicy', 'comfort-food', 'light-meal', 'popular'
    ]
  }]
});

export default mongoose.model('MenuItem', menuItemSchema);
