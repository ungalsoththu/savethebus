
import { GoogleGenAI, Type } from "@google/genai";
import { getPromptForEmail, SYSTEM_INSTRUCTION, AIProvider, getRecommendedModel } from "../constants";
import { ObjectionData, GeneratedEmail, GenerationMode } from "../types";
import { BACKUP_TEMPLATES } from "../backupTemplates";
import { OpenRouterService } from "./openrouterService";

/**
 * Get the configured AI provider from environment variables
 */
const getAIProvider = (): AIProvider => {
  const provider = process.env.AI_PROVIDER as AIProvider;
  return provider === 'gemini' || provider === 'openrouter' ? provider : 'openrouter';
};

/**
 * Generate objection email using Gemini API (direct)
 */
const generateWithGemini = async (data: ObjectionData): Promise<GeneratedEmail> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });
  
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
    isOptimized: data.mode === GenerationMode.MANUAL,
    provider: 'gemini'
  };
};

/**
 * Generate objection email using OpenRouter API (via Edge Function proxy)
 */
const generateWithOpenRouter = async (data: ObjectionData): Promise<GeneratedEmail> => {
  const model = process.env.OPENROUTER_MODEL || getRecommendedModel('openrouter');
  const service = new OpenRouterService({ model });
  
  const result = await service.generateObjectionEmail(getPromptForEmail(data));
  
  let finalBody = result.body || "";
  finalBody = finalBody.replace(/\[Your Name\]/gi, data.name);
  finalBody = finalBody.replace(/\[Your Location\]/gi, data.location);

  return {
    subject: result.subject || "Objection to Rule 288-A",
    body: finalBody,
    isOptimized: data.mode === GenerationMode.MANUAL,
    provider: 'openrouter'
  };
};

/**
 * Main function to generate objection email
 * Routes to appropriate AI provider based on configuration
 */
export const generateObjectionEmail = async (data: ObjectionData): Promise<GeneratedEmail> => {
  const provider = getAIProvider();
  
  try {
    if (provider === 'gemini') {
      return await generateWithGemini(data);
    } else {
      return await generateWithOpenRouter(data);
    }
  } catch (error) {
    console.error(`AI Generation failed with ${provider}, falling back to templates:`, error);
    
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
      isOptimized: false,
      provider: 'fallback'
    };
  }
};

/**
 * Get current AI provider configuration
 */
export const getCurrentProvider = (): AIProvider => {
  return getAIProvider();
};

/**
 * Get current model being used
 */
export const getCurrentModel = (): string => {
  const provider = getAIProvider();
  if (provider === 'gemini') {
    return 'gemini-3-flash-preview';
  }
  return process.env.OPENROUTER_MODEL || getRecommendedModel('openrouter');
};

/**
 * Test AI service connection
 */
export const testAIConnection = async (): Promise<{ success: boolean; message: string; provider?: AIProvider; model?: string }> => {
  const provider = getAIProvider();
  
  try {
    if (provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Respond with "OK"',
        config: {
          systemInstruction: 'You are a helpful assistant.',
        },
      });
      
      if (response.text?.includes('OK')) {
        return {
          success: true,
          message: 'Gemini connection successful',
          provider: 'gemini',
          model: 'gemini-3-flash-preview'
        };
      }
    } else {
      const model = process.env.OPENROUTER_MODEL || getRecommendedModel('openrouter');
      const service = new OpenRouterService({ model, maxTokens: 10 });
      const testResult = await service.testConnection();
      
      if (testResult.success) {
        return {
          success: true,
          message: 'OpenRouter connection successful',
          provider: 'openrouter',
          model: testResult.modelUsed || model
        };
      }
    }
    
    return {
      success: false,
      message: 'Unexpected response from AI service',
      provider
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `Connection failed: ${errorMessage}`,
      provider
    };
  }
};
