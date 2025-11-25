import { GoogleGenAI } from "@google/genai";
import { TCM_SYSTEM_INSTRUCTION, DIAGNOSIS_SCHEMA } from "./constants";
import { DiagnosisResult } from "./types";

// 1. 获取 Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeTongueImage = async (base64Image: string): Promise<DiagnosisResult> => {
  // 调试弹窗：确认 Key 依然正常
  // alert(`API Key状态: ${apiKey ? "已获取" : "丢失"}`); 

  if (!apiKey) {
    alert("错误：API Key 丢失，请检查 Vercel 设置。");
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    // 【关键修改】这里改成了 gemini-1.5-flash (注意是横杠！)
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', 
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "请根据这张图片进行专业的中医舌诊分析。如果图片不是舌头，请在overview中说明。" },
        ],
      },
      config: {
        systemInstruction: TCM_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA,
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Gemini 返回了空内容");

    return JSON.parse(text) as DiagnosisResult;

  } catch (error: any) {
    // 依然保留报错弹窗，以防万一
    alert(`分析出错: ${error.message || JSON.stringify(error)}`);
    console.error("详细错误:", error);
    throw error;
  }
};
