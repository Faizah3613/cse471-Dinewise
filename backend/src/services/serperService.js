import axios from 'axios';

export const analyzeSentiment = async (text) => {
  try {
    console.log("Analyzing with Serper:", text);
    
    // Create a better search query for sentiment analysis
    const searchQuery = `sentiment of restaurant review "${text}" - is it positive negative or neutral?`;
    
    const response = await axios.post(
      'https://google.serper.dev/search',
      {
        q: searchQuery,
        gl: 'us',
        hl: 'en',
        num: 5  // Get more results for better analysis
      },
      {
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    // Use improved sentiment extraction
    const sentiment = extractSentiment(text, response.data);
    console.log("Final sentiment:", sentiment);
    
    return sentiment;

  } catch (error) {
    console.error("Error calling Serper API:", error.message);
    return enhancedFallbackAnalysis(text);
  }
};

// Improved sentiment extraction
const extractSentiment = (originalText, data) => {
  const lowerText = originalText.toLowerCase();
  
  // 1. First, analyze the original text directly (most important)
  const directAnalysis = analyzeTextDirectly(lowerText);
  if (directAnalysis !== 'neutral') return directAnalysis;
  
  // 2. Then check search results for confirmation
  const resultsAnalysis = analyzeSearchResults(data);
  return resultsAnalysis !== 'neutral' ? resultsAnalysis : 'neutral';
};

// Analyze the actual text content
const analyzeTextDirectly = (text) => {
  // Strong indicators
  const strongPositive = ['excellent', 'amazing', 'wonderful', 'love', 'best', 'delicious', 'perfect', 'fantastic', 'awesome'];
  const strongNegative = ['terrible', 'awful', 'horrible', 'disgusting', 'worst', 'hate', 'disappointed', 'disappointing', 'poor'];
  
  // Moderate indicators  
  const moderatePositive = ['good', 'great', 'nice', 'enjoyed', 'happy', 'satisfied', 'fresh', 'clean'];
  const moderateNegative = ['bad', 'cold', 'expensive', 'slow', 'rude', 'dirty', 'overpriced'];
  
  let score = 0;
  
  // Score the text
  strongPositive.forEach(word => text.includes(word) && (score += 3));
  strongNegative.forEach(word => text.includes(word) && (score -= 3));
  moderatePositive.forEach(word => text.includes(word) && (score += 1));
  moderateNegative.forEach(word => text.includes(word) && (score -= 1));
  
  // Negation handling (e.g., "not good")
  if ((text.includes('not good') || text.includes('not great') || text.includes('not delicious')) && score > 0) {
    score = -Math.abs(score);
  }
  
  if (score > 1) return 'positive';
  if (score < -1) return 'negative';
  return 'neutral';
};

// Analyze search results
const analyzeSearchResults = (data) => {
  let positiveScore = 0;
  let negativeScore = 0;
  
  if (data.organic) {
    data.organic.forEach(result => {
      const content = (result.snippet || result.title || '').toLowerCase();
      
      // Look for sentiment clues in search results
      if (content.includes('positive review') || content.includes('good rating') || 
          content.includes('highly recommend') || content.includes('excellent service')) {
        positiveScore += 2;
      }
      if (content.includes('negative review') || content.includes('bad rating') || 
          content.includes('complaint') || content.includes('poor service')) {
        negativeScore += 2;
      }
      
      // Also count sentiment words
      if (content.includes('positive') || content.includes('good')) positiveScore++;
      if (content.includes('negative') || content.includes('bad')) negativeScore++;
    });
  }
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

// Enhanced fallback
const enhancedFallbackAnalysis = (text) => {
  const lowerText = text.toLowerCase();
  
  // Simple but effective keyword analysis
  const positivePatterns = [
    /\b(excellent|amazing|wonderful|love|best|delicious|perfect|fantastic|awesome)\b/,
    /\b(good|great|nice|enjoyed|happy|satisfied)\b/,
    /\b(fresh|clean|friendly|fast|quick)\b/
  ];
  
  const negativePatterns = [
    /\b(terrible|awful|horrible|disgusting|worst|hate)\b/,
    /\b(bad|poor|disappointed|disappointing)\b/,
    /\b(cold|expensive|slow|rude|dirty|overpriced)\b/
  ];
  
  let score = 0;
  
  positivePatterns.forEach((pattern, index) => {
    if (pattern.test(lowerText)) score += (3 - index); // Weighted scoring
  });
  
  negativePatterns.forEach((pattern, index) => {
    if (pattern.test(lowerText)) score -= (3 - index); // Weighted scoring
  });
  
  // Handle negations
  if (lowerText.includes('not ') && score !== 0) {
    score = -score; // Reverse sentiment for negations
  }
  
  if (score > 2) return 'positive';
  if (score < -2) return 'negative';
  return 'neutral';
};