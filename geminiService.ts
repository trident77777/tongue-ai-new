import { TCM_SYSTEM_INSTRUCTION, DIAGNOSIS_SCHEMA } from "./constants";
import { DiagnosisResult } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeTongueImage = async (base64Image: string): Promise<DiagnosisResult> => {
  // 1. 检查 Key
  if (!apiKey) {
    alert("错误：API Key 未配置！");
    throw new Error("API Key is missing");
  }

  // 2. 准备数据 (去掉 base64 头部，如果有的话)
  const cleanBase64 = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;

  // 3. 直接构建请求 URL (使用官方 REST API，绕过 SDK 问题)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // 4. 准备请求体
  const payload = {
    contents: [{
      parts: [
        { text: "请根据这张图片进行专业的中医舌诊分析。如果图片不是舌头，请在overview中说明。" },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: cleanBase64
          }
        }
      ]
    }],
    generationConfig: {
      response_mime_type: "application/json",
      response_schema: DIAGNOSIS_SCHEMA, // 确保 constants.ts 里的 Schema 格式正确
      temperature: 0.5
    },
    systemInstruction: {
        parts: [{ text: TCM_SYSTEM_INSTRUCTION }]
    }
  };

  try {
    // 5. 发送请求 (Native Fetch)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // 6. 处理错误
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || response.statusText;
      alert(`API 请求失败: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // 7. 解析结果
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("API 返回了空内容");
    }

    return JSON.parse(text) as DiagnosisResult;

  } catch (error: any) {
    console.error("Fetch Error:", error);
    // 如果不是上面已经 alert 过的错误，这里再弹一次
    if (!error.message.includes("API 请求失败")) {
        alert(`网络或解析错误: ${error.message}`);
    }
    throw error;
  }
};
