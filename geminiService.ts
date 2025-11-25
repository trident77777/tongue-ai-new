import { TCM_SYSTEM_INSTRUCTION, DIAGNOSIS_SCHEMA } from "./constants";
import { DiagnosisResult } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeTongueImage = async (base64Image: string): Promise<DiagnosisResult> => {
  // 1. 检查 Key
  if (!apiKey) {
    alert("错误：API Key 未配置！");
    throw new Error("API Key is missing");
  }

  // 2. 准备数据
  const cleanBase64 = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;

  // 【核心修改】这里改成了 gemini-1.5-flash-001 (最稳定的特定版本)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

  // 3. 准备请求体 (使用标准的驼峰命名 camelCase，防止解析错误)
  const payload = {
    contents: [{
      parts: [
        { text: "请根据这张图片进行专业的中医舌诊分析。如果图片不是舌头，请在overview中说明。" },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64
          }
        }
      ]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: DIAGNOSIS_SCHEMA, 
      temperature: 0.5
    },
    systemInstruction: {
        parts: [{ text: TCM_SYSTEM_INSTRUCTION }]
    }
  };

  try {
    // 4. 发送请求
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // 5. 处理错误
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || response.statusText;
      // 弹窗显示具体的 API 错误
      alert(`Google API 报错: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // 6. 解析结果
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("API 返回了空内容");
    }

    return JSON.parse(text) as DiagnosisResult;

  } catch (error: any) {
    console.error("Fetch Error:", error);
    if (!error.message.includes("Google API 报错")) {
        alert(`网络或解析错误: ${error.message}`);
    }
    throw error;
  }
};
