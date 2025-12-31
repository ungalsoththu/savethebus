
import { GoogleGenAI, Type } from "@google/genai";
import { getPromptForEmail, SYSTEM_INSTRUCTION } from "../constants";
import { ObjectionData, GeneratedEmail } from "../types";

export const generateObjectionEmail = async (data: ObjectionData): Promise<GeneratedEmail> => {
  // Use gemini-3-flash-preview for high speed and reliable JSON output
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: getPromptForEmail(data),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING }
        },
        required: ["subject", "body"]
      }
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      isOptimized: !!data.customText
    } as GeneratedEmail;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("AI could not finalize the letter. Please try again.");
  }
};
