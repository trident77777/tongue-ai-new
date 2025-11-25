import { GoogleGenAI } from "@google/genai";
import { TCM_SYSTEM_INSTRUCTION, DIAGNOSIS_SCHEMA } from "../constants";
import { DiagnosisResult } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const analyzeTongueImage = async (base64Image: string): Promise<DiagnosisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png, API is flexible
              data: base64Image,
            },
          },
          {
            text: "请根据这张图片进行专业的中医舌诊分析。如果图片不是舌头，请在overview中说明。",
          },
        ],
      },
      config: {
        systemInstruction: TCM_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA,
        temperature: 0.5, // Lower temperature for more consistent medical-style analysis
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini.");
    }

    const diagnosis = JSON.parse(text) as DiagnosisResult;
    return diagnosis;

  } catch (error) {
    console.error("Error analyzing tongue image:", error);
    throw error;
  }
};
