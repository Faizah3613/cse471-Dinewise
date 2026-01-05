// import { GoogleGenerativeAI } from "@google/generative-ai";

// let genAI = null;

// const initializeAI = () => {
//   const apiKey = process.env.GOOGLE_AI_API_KEY;
//   if (!apiKey) {
//     throw new Error("Google AI API key is not configured.");
//   }
//   genAI = new GoogleGenerativeAI(apiKey);
// };

// export const analyzeSentiment = async (text) => {
//   if (!genAI) {
//     initializeAI();
//   }

//   try {
//     // Use the new model name: gemini-2.0-flash
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
//     const prompt = `Analyze the sentiment of the following restaurant feedback. Only respond with a single word: either "positive", "neutral", or "negative". Here is the feedback: ${text}`;
    
//     console.log("Sending to Google AI:", prompt);
    
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const sentiment = response.text().trim().toLowerCase();
    
//     console.log("Raw response from Google AI:", response.text());
//     console.log("Final sentiment:", sentiment);
    
//     return sentiment;

//   } catch (error) {
//     console.error("Error calling Google AI API:", error);
//     return 'neutral';
//   }
// };