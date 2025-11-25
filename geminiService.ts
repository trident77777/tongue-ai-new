import { TCM_SYSTEM_INSTRUCTION, DIAGNOSIS_SCHEMA } from "./constants";
import { DiagnosisResult } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeTongueImage = async (base64Image: string): Promise<DiagnosisResult> => {
  if (!apiKey) {
    alert("错误：API Key 未配置！");
    throw new Error("API Key is missing");
  }

  // ==========================================
  // 🕵️‍♂️ 第一步：先问问 Google 到底有哪些模型可用？
  // ==========================================
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResp = await fetch(listUrl);
    const listData = await listResp.json();
    
    if (listData.models) {
      // 过滤出名字里带 "gemini" 的模型
      const modelNames = listData.models
        .map((m: any) => m.name.replace('models/', '')) // 去掉前缀
        .filter((n: string) => n.includes('gemini'));
      
      // 🚨【关键弹窗】🚨 
      // 请把这个弹窗里的内容拍照或复制告诉我！
      alert(`【侦探报告】你的 API Key 可用的模型有：\n${modelNames.join('\n')}`);
    } else {
      alert(`【侦探报告】获取模型列表失败: ${JSON.stringify(listData)}`);
    }
  } catch (e: any) {
    alert(`【侦探报告】连列表都拉不到，可能是网络或Key的问题: ${e.message}`);
  }

  // ==========================================
  // 🕵️‍♂️ 第二步：尝试使用列表里的第一个 1.5 模型
  // ==========================================
  
  // 这里我们暂时还是用 gemini-1.5-flash 试最后一次，
  // 但重点是上面的弹窗会告诉我们真正的答案。
  const targetModel = 'gemini-1.5-flash'; 

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

  const cleanBase64 = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

  const payload = {
    contents: [{
      parts: [
        { text: "请根据这张图片进行专业的中医舌诊分析。如果图片不是舌头，请在overview中说明。" },
        { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
      ]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: DIAGNOSIS_SCHEMA,
      temperature: 0.5
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || response.statusText);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("API 返回空内容");

    return JSON.parse(text) as DiagnosisResult;

  } catch (error: any) {
    // 如果上面的弹窗已经出来了，这个报错就不重要了，我们主要看那个列表
    if (!error.message.includes("侦探报告")) {
       alert(`分析尝试失败: ${error.message}`);
    }
    throw error;
  }
};
