// import mongoose from 'mongoose';

// const ingredientSchema = new mongoose.Schema({
//   name: { type: String, required: true },  // Ingredient name
//   stock: { type: Number, required: true },  // Stock level
//   unit: { type: String, required: true },  // Unit of measurement (e.g., g, pcs)
//   threshold: { type: Number, required: true },  // Minimum stock before alert
// });

// export default mongoose.model('Ingredient', ingredientSchema);


import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
    // Ingredient name
  stock: { type: Number, required: true, min: 0 },  // Stock level must be >= 0
  unit: { type: String, required: true },  // Unit of measurement (e.g., g, pcs)
  threshold: { type: Number, required: true, min: 0 },  // Minimum stock before alert
}, { timestamps: true });  // Add createdAt and updatedAt fields

export default mongoose.model('Ingredient', ingredientSchema);