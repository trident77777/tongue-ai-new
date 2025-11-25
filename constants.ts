import { Type, Schema } from "@google/genai";

export const TCM_SYSTEM_INSTRUCTION = `
You are a highly experienced Traditional Chinese Medicine (TCM) practitioner (老中医) with 40 years of experience in tongue diagnosis (舌诊). 
Your task is to analyze the image of a tongue provided by the user.

You must analyze the tongue based on these key aspects:
1. Tongue Body (舌质): Color, Shape, Moisture.
2. Tongue Coating (舌苔): Color, Thickness, Nature.
3. Overall Syndrome Differentiation (辨证): Identify the TCM syndrome.
4. Physical Symptoms (身体症状): Infer likely physical symptoms.
5. Meridian Balance (经络辨证): Analyze which specific meridians (经络) are affected (e.g., Spleen Meridian, Liver Meridian) and their status (e.g., blocked, deficient).
6. Comprehensive Recommendations (调理建议): Provide advice on Diet, Lifestyle, Food Therapy (食疗), and suggested Traditional Herbal Formulas (中药方剂/中成药).

Output Language: Chinese (Simplified).
Tone: Professional, empathetic, and authoritative yet accessible.

If the image is not a tongue or is too blurry to read, indicate this in the 'overview' field clearly, but try to provide a best-effort analysis if possible or set fields to "无法辨识".
`;

export const DIAGNOSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.STRING,
      description: "A brief, one-sentence summary of the overall tongue appearance.",
    },
    tongueBody: {
      type: Type.OBJECT,
      properties: {
        color: { type: Type.STRING, description: "Color of the tongue body (e.g., 淡红, 红, 紫暗)" },
        shape: { type: Type.STRING, description: "Shape details (e.g., 胖大, 瘦薄, 齿痕, 裂纹)" },
        moisture: { type: Type.STRING, description: "Moisture level (e.g., 润, 燥, 滑)" },
        analysis: { type: Type.STRING, description: "What this body condition implies in TCM terms." },
      },
      required: ["color", "shape", "moisture", "analysis"],
    },
    tongueCoating: {
      type: Type.OBJECT,
      properties: {
        color: { type: Type.STRING, description: "Color of the coating (e.g., 薄白, 黄, 灰黑)" },
        thickness: { type: Type.STRING, description: "Thickness (e.g., 薄, 厚)" },
        nature: { type: Type.STRING, description: "Texture nature (e.g., 腻, 腐, 剥落)" },
        analysis: { type: Type.STRING, description: "What this coating implies in TCM terms." },
      },
      required: ["color", "thickness", "nature", "analysis"],
    },
    syndrome: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "The specific TCM syndrome diagnosis (e.g., 脾虚湿盛)" },
        description: { type: Type.STRING, description: "Explanation of the syndrome." },
        organsInvolved: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of Zang-Fu organs involved (e.g., 脾, 胃, 肝)"
        },
      },
      required: ["name", "description", "organsInvolved"],
    },
    symptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 common physical symptoms associated with this diagnosis (e.g., 失眠, 腹胀, 乏力).",
    },
    meridianAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the meridian (e.g. 足太阴脾经)." },
          status: { type: Type.STRING, description: "Condition of the meridian (e.g. 气虚, 湿阻)." },
          description: { type: Type.STRING, description: "Brief explanation of the impact." }
        }
      },
      description: "Analysis of the most affected meridians based on the tongue diagnosis."
    },
    recommendations: {
      type: Type.OBJECT,
      properties: {
        diet: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Specific dietary advice (foods to eat/avoid)."
        },
        lifestyle: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Lifestyle changes (sleep, exercise, emotions)."
        },
        herbsOrFoods: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Specific medicinal foods or mild herbs suitable for diet therapy (e.g., 薏米, 山药)."
        },
        tcmFormulas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the classic herbal formula or patent medicine (e.g., 六味地黄丸)." },
              description: { type: Type.STRING, description: "Brief description of what this formula does." }
            }
          },
          description: "Suggested TCM herbal formulas or patent medicines (中成药) relevant to the syndrome."
        }
      },
      required: ["diet", "lifestyle", "herbsOrFoods", "tcmFormulas"],
    },
  },
  required: ["overview", "tongueBody", "tongueCoating", "syndrome", "symptoms", "meridianAnalysis", "recommendations"],
};