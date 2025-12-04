import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateChristmasBlessing = async (userWish: string): Promise<string> => {
  if (!apiKey) {
    return "May your holidays be filled with golden moments and emerald dreams. (API Key Missing)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a very short, sophisticated, and poetic Christmas blessing (maximum 20 words) inspired by this wish: "${userWish}". 
      Tone: Luxurious, Magical, Warm. 
      Output ONLY the blessing text.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Minimize latency
        temperature: 0.8,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating blessing:", error);
    return "The stars align to grant your heart's deepest desires this season.";
  }
};