import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// We use a try-catch pattern during initialization to handle environments without the key gracefully
let ai: GoogleGenAI | null = null;
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.warn("Gemini API Key not found or invalid. Falling back to local mock mode.");
}

/**
 * Generates a response from the bot.
 * Tries to use Gemini API first. If unavailable or fails, falls back to a local mock response.
 */
export const getBotResponse = async (userMessage: string): Promise<string> => {
  // 1. Try Gemini API if available
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
          systemInstruction: "You are a helpful, friendly, and concise chat assistant. Keep responses brief and conversational.",
        }
      });
      
      if (response.text) {
        return response.text;
      }
    } catch (error) {
      console.error("Gemini API call failed, falling back to mock.", error);
    }
  }

  // 2. Fallback: Local Mock Response (Simulates a backend-less environment)
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        `That's interesting! You said: "${userMessage}"`,
        "I'm a simple frontend bot. I can't think deeply without an API key, but I'm listening!",
        "Could you tell me more about that?",
        "I agree completely.",
        "That's a great point.",
        `Echo: ${userMessage}`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, 600 + Math.random() * 1000); // Simulate network latency
  });
};