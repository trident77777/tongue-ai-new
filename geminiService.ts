import { GoogleGenAI } from "@google/genai";
import { TCM_SYSTEM_INSTRUCTION, DIAGNOSIS_SCHEMA } from "./constants";
import { DiagnosisResult } from "./types";

// 1. 获取 Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeTongueImage = async (base64Image: string): Promise<DiagnosisResult> => {
  // 【诊断弹窗 1】: 看看 Key 到底有没有读到
  // 如果弹窗显示 "API Key状态: undefined"，那就是 Key 没填对！
  alert(`API Key状态: ${apiKey ? "已获取 (长度 " + apiKey.length + ")" : "undefined (未获取!)"}`);

  if (!apiKey) {
    alert("错误：没有检测到 API Key！请检查 Vercel 环境变量设置。");
    throw new Error("API Key is missing");
  }

  // 2. 初始化 (使用你原本的 SDK)
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    // 3. 调用模型 (确保使用 1.5-flash)
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image, // SDK 会自动处理 base64
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
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini 返回了空内容");
    }

    const diagnosis = JSON.parse(text) as DiagnosisResult;
    return diagnosis;

  } catch (error: any) {
    // 【诊断弹窗 2】: 如果 Google 拒绝了，看看具体原因
    // 比如 "Model not found" 或者 "API key not valid"
    alert(`分析出错: ${error.message || JSON.stringify(error)}`);
    console.error("详细错误:", error);
    throw error;
  }
};
