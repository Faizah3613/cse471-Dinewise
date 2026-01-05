import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_URL } from '../config'; 

const SentimentAnalysis = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  const analyzeSentiment = async () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter some feedback text');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch(`${API_URL}/api/sentiment/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: feedbackText,
          userId: localStorage.getItem('userId') // Optional: if you have user auth
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisResult(data.feedback);
        setRecentAnalyses(prev => [data.feedback, ...prev.slice(0, 4)]); // Keep last 5
        toast.success('Analysis complete!');
        setFeedbackText(''); // Clear input after successful analysis
      } else {
        toast.error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast.error('Failed to analyze sentiment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">
            Customer Feedback Analysis 🤖
          </h1>
          <p className="text-lg text-gray-600">
            Analyze customer feedback sentiment using Google AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
              Analyze Feedback
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Feedback Text
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter customer feedback here..."
                rows="6"
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isAnalyzing}
              />
            </div>

            <button
              onClick={analyzeSentiment}
              disabled={isAnalyzing || !feedbackText.trim()}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </>
              ) : (
                'Analyze Sentiment'
              )}
            </button>

            {analysisResult && (
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-indigo-200">
                <h3 className="font-semibold text-gray-700 mb-2">Last Analysis:</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysisResult.sentiment)}`}>
                    {getSentimentEmoji(analysisResult.sentiment)} {analysisResult.sentiment}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Results & History Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
              Analysis History
            </h2>

            {recentAnalyses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>No analyses yet</p>
                <p className="text-sm">Analyze some feedback to see results here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAnalyses.map((analysis, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysis.sentiment)}`}>
                        {getSentimentEmoji(analysis.sentiment)} {analysis.sentiment}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      "{analysis.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Summary */}
            {recentAnalyses.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Summary</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-green-600 font-bold">
                      {recentAnalyses.filter(a => a.sentiment === 'positive').length}
                    </div>
                    <div className="text-xs text-green-600">Positive</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-blue-600 font-bold">
                      {recentAnalyses.filter(a => a.sentiment === 'neutral').length}
                    </div>
                    <div className="text-xs text-blue-600">Neutral</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-red-600 font-bold">
                      {recentAnalyses.filter(a => a.sentiment === 'negative').length}
                    </div>
                    <div className="text-xs text-red-600">Negative</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Quick Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { text: "The food was amazing! Service was excellent.", label: "Positive" },
              { text: "Average experience. Nothing special.", label: "Neutral" },
              { text: "Terrible service and cold food. Very disappointed.", label: "Negative" }
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setFeedbackText(example.text)}
                className="p-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{example.label}:</span>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{example.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-8 bg-indigo-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold mb-2">1. Enter Feedback</h3>
              <p className="text-sm text-gray-600">Type or paste customer feedback</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-gray-600">Google AI analyzes sentiment</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">3. Get Results</h3>
              <p className="text-sm text-gray-600">See positive/neutral/negative results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;