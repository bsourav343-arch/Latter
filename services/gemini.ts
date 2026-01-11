
import { GoogleGenAI, Type } from "@google/genai";
import { AppLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartCaption = async (imageUrl: string, lang: AppLanguage = 'en'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: `Generate a short, trendy social media caption for this image in ${lang === 'bn' ? 'Bengali' : lang === 'hi' ? 'Hindi' : 'English'}. Make it catchy and relevant.` },
          { inlineData: { mimeType: 'image/jpeg', data: imageUrl.split(',')[1] } }
        ]
      }
    });
    return response.text || "New adventure!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Beautiful moment!";
  }
};

export const getSmartReply = async (context: string, lang: AppLanguage = 'en'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is chatting in a social app. Context: "${context}". Suggest a friendly reply in ${lang === 'bn' ? 'Bengali Unicode' : lang === 'hi' ? 'Hindi' : 'English'}. Return only the reply text.`,
    });
    return response.text || (lang === 'bn' ? "ঠিক আছে" : "Okay");
  } catch (error) {
    return "OK";
  }
};

export const translateText = async (text: string, targetLang: AppLanguage): Promise<string> => {
  const langNames = {
    en: "English",
    bn: "Bengali",
    hi: "Hindi"
  };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following text into ${langNames[targetLang]}. Return only the translated text without any extra notes. Text: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};
