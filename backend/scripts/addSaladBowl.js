// addSaladBowl.js
import mongoose from 'mongoose';
import MenuItem from '../src/models/MenuItem.js';
import dotenv from 'dotenv';

const dbURI = process.env.MONGO_URI;
dotenv.config();
const saladBowl = {
  name: 'Custom Salad Bowl',
  description: 'Build your own salad with fresh ingredients',
  price: 0,
  category: 'kitchen',
  tags: ['healthy', 'customizable', 'salad'],
  ingredients: []
};

mongoose.connect(dbURI)
.then(async () => {
  const existing = await MenuItem.findOne({ name: 'Custom Salad Bowl' });
  if (!existing) {
    await MenuItem.create(saladBowl);
    console.log('Salad bowl menu item added');
  }
  mongoose.disconnect();
});