// FIX: Import 'Type' for responseSchema and update to follow JSON response best practices.
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from '../contexts/LanguageContext';

const languageMap = {
    en: 'English',
    zh: 'Chinese',
    id: 'Indonesian',
};

export const batchTranslate = async (texts: string[], targetLanguage: Language): Promise<string[]> => {
    if (texts.length === 0) {
        return [];
    }

    // FIX: Initialize GoogleGenAI with 'process.env.API_KEY' inside the function to ensure up-to-date key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLangName = languageMap[targetLanguage];

    const prompt = `Translate the following Indonesian texts to ${targetLangName}. Return the result as a JSON array of strings, with each string being a translation of the corresponding text in the input. The order must be preserved. Do not add any extra explanations or formatting.

Input Texts:
${JSON.stringify(texts)}

JSON Output:`;

    try {
        // FIX: Use 'gemini-3-flash-preview' for basic text tasks like translation.
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            // FIX: Use responseSchema for more reliable JSON output as per guidelines.
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
            },
        });
        
        const responseText = response.text.trim();
        
        // Clean the response to ensure it's valid JSON
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const translatedTexts: string[] = JSON.parse(jsonString);

        if (translatedTexts.length !== texts.length) {
            throw new Error("Translation returned a different number of items.");
        }

        return translatedTexts;
    } catch (error) {
        console.error("Error parsing translation response:", error);
        console.error("Raw Gemini response:", (error as any)?.response?.text);
        // Fallback to original text in case of error
        return texts;
    }
};