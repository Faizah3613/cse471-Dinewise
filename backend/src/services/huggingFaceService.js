// import axios from 'axios';

// export const analyzeSentiment = async (text) => {
//   try {
//     console.log("🔍 Analyzing with Hugging Face:", text);
    
//     // Use this specific model - it's reliable and fast
//     const model = "bhadresh-savani/distilbert-base-uncased-emotion";
    
//     const response = await axios.post(
//       `https://api-inference.huggingface.co/models/${model}`,
//       { 
//         inputs: text
//       },
//       { 
//         headers: { 
//           Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 15000 // 15 second timeout
//       }
//     );

//     // Response format: [{label: 'joy', score: 0.95}, {label: 'anger', score: 0.03}, ...]
//     const emotions = response.data[0];
    
//     // Get emotion with highest confidence
//     let highestScore = 0;
//     let topEmotion = 'neutral';
    
//     emotions.forEach(emotion => {
//       if (emotion.score > highestScore) {
//         highestScore = emotion.score;
//         topEmotion = emotion.label;
//       }
//     });
    
//     console.log(`📊 Detected: ${topEmotion} (${(highestScore * 100).toFixed(1)}%)`);
    
//     // Convert emotion to sentiment
//     const sentiment = getSentimentFromEmotion(topEmotion);
//     console.log(`🎯 Final sentiment: ${sentiment}`);
    
//     return sentiment;
    
//   } catch (error) {
//     console.error("❌ Hugging Face API error:", error.response?.data?.error || error.message);
    
//     // Use fallback analysis
//     return fallbackSentimentAnalysis(text);
//   }
// };

// // Convert emotion to positive/neutral/negative
// const getSentimentFromEmotion = (emotion) => {
//   // This model returns: sadness, joy, love, anger, fear, surprise
//   const positiveEmotions = ['joy', 'love', 'surprise'];
//   const negativeEmotions = ['sadness', 'anger', 'fear'];
  
//   if (positiveEmotions.includes(emotion)) return 'positive';
//   if (negativeEmotions.includes(emotion)) return 'negative';
//   return 'neutral';
// };

// // Reliable fallback analysis
// const fallbackSentimentAnalysis = (text) => {
//   const lowerText = text.toLowerCase();
  
//   // More comprehensive keyword matching
//   const positiveKeywords = [
//     'good', 'great', 'excellent', 'amazing', 'wonderful', 
//     'delicious', 'love', 'best', 'nice', 'happy', 'satisfied',
//     'fresh', 'clean', 'friendly', 'fast', 'perfect', 'awesome'
//   ];
  
//   const negativeKeywords = [
//     'bad', 'terrible', 'awful', 'horrible', 'disgusting',
//     'worst', 'hate', 'disappointed', 'poor', 'cold', 'expensive',
//     'slow', 'rude', 'dirty', 'overpriced', 'mediocre'
//   ];
  
//   let positiveCount = 0;
//   let negativeCount = 0;
  
//   positiveKeywords.forEach(word => {
//     if (lowerText.includes(word)) positiveCount++;
//   });
  
//   negativeKeywords.forEach(word => {
//     if (lowerText.includes(word)) negativeCount++;
//   });
  
//   // Handle intensifiers
//   if (lowerText.includes('very good') || lowerText.includes('so good')) positiveCount += 2;
//   if (lowerText.includes('very bad') || lowerText.includes('so bad')) negativeCount += 2;
  
//   if (positiveCount > negativeCount) return 'positive';
//   if (negativeCount > positiveCount) return 'negative';
//   return 'neutral';
// };

// 2nd one

// import axios from 'axios';

// export const analyzeSentiment = async (text) => {
//   try {
//     console.log("🔍 Analyzing with Hugging Face:", text);
    
//     // NEW ENDPOINT
//     const response = await axios.post(
//       'https://router.huggingface.co/hf-inference/models/bhadresh-savani/distilbert-base-uncased-emotion',
//       { 
//         inputs: text
//       },
//       { 
//         headers: { 
//           Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 15000
//       }
//     );

//     const emotions = response.data[0];
    
//     let highestScore = 0;
//     let topEmotion = 'neutral';
    
//     emotions.forEach(emotion => {
//       if (emotion.score > highestScore) {
//         highestScore = emotion.score;
//         topEmotion = emotion.label;
//       }
//     });
    
//     console.log(`📊 Detected: ${topEmotion} (${(highestScore * 100).toFixed(1)}%)`);
    
//     const sentiment = getSentimentFromEmotion(topEmotion);
//     console.log(`🎯 Final sentiment: ${sentiment}`);
    
//     return sentiment;
    
//   } catch (error) {
//     console.error("❌ Hugging Face API error:", error.response?.data || error.message);
    
//     // Try alternative endpoint if first fails
//     return await tryAlternativeEndpoint(text);
//   }
// };

// // Try alternative endpoint
// const tryAlternativeEndpoint = async (text) => {
//   try {
//     console.log("Trying alternative endpoint...");
    
//     const response = await axios.post(
//       'https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion',
//       { 
//         inputs: text
//       },
//       { 
//         headers: { 
//           Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
    
//     const emotions = response.data[0];
//     const topEmotion = emotions.reduce((max, current) => 
//       current.score > max.score ? current : max
//     ).label;
    
//     return getSentimentFromEmotion(topEmotion);
    
//   } catch (altError) {
//     console.error("Alternative endpoint also failed");
//     return fallbackSentimentAnalysis(text);
//   }
// };

// const getSentimentFromEmotion = (emotion) => {
//   const positiveEmotions = ['joy', 'love', 'surprise'];
//   const negativeEmotions = ['sadness', 'anger', 'fear'];
  
//   if (positiveEmotions.includes(emotion)) return 'positive';
//   if (negativeEmotions.includes(emotion)) return 'negative';
//   return 'neutral';
// };

// const fallbackSentimentAnalysis = (text) => {
//   const lowerText = text.toLowerCase();
  
//   if (lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('excellent')) return 'positive';
//   if (lowerText.includes('bad') || lowerText.includes('terrible') || lowerText.includes('disgusting')) return 'negative';
//   return 'neutral';
// };


// 3rd
import axios from 'axios';

// Using a model specifically trained for 3-way (Pos/Neu/Neg) sentiment
const MODEL_URL = 'https://router.huggingface.co/hf-inference/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student';

export const analyzeSentiment = async (text) => {
  try {
    console.log("🔍 Analyzing with Hugging Face:", text);
    
    const response = await axios.post(
      MODEL_URL,
      { inputs: text },
      { 
        headers: { 
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    // The API returns: [[{label: 'positive', score: 0.9}, {label: 'neutral', score: 0.05}, ...]]
    const results = response.data[0];
    
    // Pick the one with the highest score
    const topResult = results.reduce((max, current) => 
      current.score > max.score ? current : max
    );
    
    // The labels from this model are already 'positive', 'neutral', 'negative'
    const sentiment = topResult.label.toLowerCase();
    
    console.log(`📊 Result: ${sentiment} (${(topResult.score * 100).toFixed(1)}%)`);
    return sentiment;
    
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return fallbackSentimentAnalysis(text);
  }
};

const fallbackSentimentAnalysis = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('good') || lowerText.includes('amazing')) return 'positive';
  if (lowerText.includes('bad') || lowerText.includes('terrible')) return 'negative';
  return 'neutral';
};