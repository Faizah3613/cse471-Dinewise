// src/controllers/sentimentAnalysisController.js
import Feedback from '../models/Feedback.js';
import { analyzeSentiment } from '../services/huggingFaceService.js';

export const analyzeFeedback = async (req, res) => {
  try {
    const { text, userId } = req.body; // Get text and optional userId from request body

    // 1. Validate input
    if (!text) {
      return res.status(400).json({ error: 'Text is required for analysis.' });
    }

    // 2. Call the Google AI Service to analyze the sentiment
    const sentiment = await analyzeSentiment(text);

    // 3. Save the feedback and the result to the database
    const newFeedback = new Feedback({
      text,
      sentiment, // This is the word from Google AI ('positive', etc.)
      user: userId || null, // Save user ID if provided
    });

    await newFeedback.save();

    // 4. Send the result back to the client (your React app)
    res.status(200).json({
      message: 'Analysis complete.',
      feedback: {
        id: newFeedback._id,
        text: newFeedback.text,
        sentiment: newFeedback.sentiment,
      }
    });

  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment. Please try again.' });
  }
};
