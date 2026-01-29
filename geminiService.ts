
import { GoogleGenAI, Type } from "@google/genai";
import { EyeCareTip } from "./types";

const getAIClient = () => {
  try {
    const apiKey = (window as any).process?.env?.API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : null);
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    return null;
  }
};

export const fetchEyeCareTip = async (): Promise<EyeCareTip> => {
  const fallbackTip: EyeCareTip = {
    title: "Look Away",
    tip: "Focus on something 20 feet away to relax your eye muscles.",
    category: "exercise"
  };

  try {
    const ai = getAIClient();
    if (!ai) return fallbackTip;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a unique, short, and helpful eye care tip for someone staring at a computer screen. Keep it encouraging and under 20 words.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tip: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              description: "One of: exercise, hydration, ergonomics, general"
            }
          },
          required: ["title", "tip", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) return fallbackTip;
    return JSON.parse(text) as EyeCareTip;
  } catch (error) {
    return fallbackTip;
  }
};
