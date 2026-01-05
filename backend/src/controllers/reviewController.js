// src/controllers/reviewController.js
import Review from '../models/Review.js';
import { analyzeSentiment } from '../services/huggingFaceService.js';
import jwt from 'jsonwebtoken'; // Add this import

export const createReview = async (req, res) => {
  try {
    const { customerName, reviewText, rating, category } = req.body;

    if (!customerName || !reviewText) {
      return res.status(400).json({ 
        error: 'Customer name and review text are required.' 
      });
    }

    // Analyze sentiment
    const sentiment = await analyzeSentiment(reviewText);

    // Create new review
    const newReview = new Review({
      customerName,
      reviewText,
      rating: rating || 5,
      category: category || 'overall',
      sentiment,
      sentimentScore: 0.8
    });

    await newReview.save();

    res.status(201).json({
      message: 'Review submitted successfully!',
      review: {
        id: newReview._id,
        customerName: newReview.customerName,
        reviewText: newReview.reviewText,
        rating: newReview.rating,
        category: newReview.category,
        createdAt: newReview.createdAt,
        // Don't include sentiment in response to customers
      }
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      error: 'Failed to submit review. Please try again.' 
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isVisible: true })
      .sort({ createdAt: -1 })
      .select('-__v -updatedAt -isVisible');

    // Check if user is staff by verifying JWT token
    let isStaff = false;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);
        isStaff = decoded.role === 'staff' || decoded.role === 'admin';
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }

    const reviewsWithSentiment = reviews.map(review => {
      const reviewObj = review.toObject();
      
      // Remove sensitive data for non-staff
      if (!isStaff) {
        delete reviewObj.sentiment;
        delete reviewObj.sentimentScore;
      }
      
      return reviewObj;
    });

    res.status(200).json({
      reviews: reviewsWithSentiment,
      isStaff // Send staff status to frontend
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reviews. Please try again.' 
    });
  }
};

export const getReviewStats = async (req, res) => {
  try {
    const reviews = await Review.find({ isVisible: true });
    
    // Check if user is staff
    let isStaff = false;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);
        isStaff = decoded.role === 'staff' || decoded.role === 'admin';
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }

    const stats = {
      total: reviews.length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0,
      categoryBreakdown: {
        food: reviews.filter(r => r.category === 'food').length,
        service: reviews.filter(r => r.category === 'service').length,
        ambiance: reviews.filter(r => r.category === 'ambiance').length,
        overall: reviews.filter(r => r.category === 'overall').length,
        other: reviews.filter(r => r.category === 'other').length
      }
    };

    // Only include sentiment breakdown for staff
    if (isStaff) {
      stats.sentimentBreakdown = {
        positive: reviews.filter(r => r.sentiment === 'positive').length,
        neutral: reviews.filter(r => r.sentiment === 'neutral').length,
        negative: reviews.filter(r => r.sentiment === 'negative').length
      };
    }

    res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch review statistics.' 
    });
  }
};