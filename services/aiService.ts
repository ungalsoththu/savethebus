
import { GoogleGenAI, Type } from "@google/genai";
import { getPromptForEmail, SYSTEM_INSTRUCTION } from "../constants";
import { ObjectionData, GeneratedEmail, GenerationMode } from "../types";
import { BACKUP_TEMPLATES } from "../backupTemplates";

export const generateObjectionEmail = async (data: ObjectionData): Promise<GeneratedEmail> => {
  try {
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

    const result = JSON.parse(response.text || "{}");
    
    let finalBody = result.body || "";
    finalBody = finalBody.replace(/\[Your Name\]/gi, data.name);
    finalBody = finalBody.replace(/\[Your Location\]/gi, data.location);

    return {
      subject: result.subject || "Objection to Rule 288-A",
      body: finalBody,
      isOptimized: data.mode === GenerationMode.MANUAL
    };
  } catch (error) {
    console.error("AI Generation failed, falling back to templates:", error);
    
    const langTemplates = BACKUP_TEMPLATES[data.language];
    const fallback = langTemplates['general']; // Default fallback
    
    let fallbackBody = fallback.body
      .replace(/\[Your Name\]/gi, data.name)
      .replace(/\[Your Location\]/gi, data.location);

    if (data.mode === GenerationMode.MANUAL && data.customText) {
      fallbackBody = `Dear Sir/Madam,\n\n${data.customText}\n\nSincerely,\n${data.name}\n${data.location}`;
    }

    return {
      subject: fallback.subject,
      body: fallbackBody,
      isOptimized: false
    };
  }
};
