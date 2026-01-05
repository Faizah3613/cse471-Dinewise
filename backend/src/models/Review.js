// src/models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  sentimentScore: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['food', 'service', 'ambiance', 'overall', 'other'],
    default: 'overall'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Review', reviewSchema);