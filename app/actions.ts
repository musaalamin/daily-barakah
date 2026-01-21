'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize Google AI with your Secure Key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function analyzeImage(base64Image: string) {
  console.log("Server: Received image for analysis...");

  try {
    // 2. Select the Fast & Smart Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. The Strict Instruction
    const prompt = `
      Act as an expert Plant Pathologist in Northern Nigeria (Zamfara).
      Analyze this plant image.
      1. Identify the Crop Name (e.g., Maize, Rice, Tomato).
      2. Identify the Disease (or say "Healthy").
      3. Provide the Hausa Name for the disease.
      4. Suggest 2 practical treatments available in Nigeria.

      IMPORTANT: Return ONLY raw JSON. No markdown. No backticks.
      Format:
      {
        "crop": "Crop Name",
        "name": "Disease Name",
        "hausa": "Hausa Name",
        "confidence": "95%",
        "treatment": [
          { "title": "Step 1", "desc": "Instruction" },
          { "title": "Step 2", "desc": "Instruction" }
        ]
      }
    `;

    // 4. Send to Google
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // 5. Clean and Parse the Result
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return { success: true, data: data };

  } catch (error: any) {
    console.error("Server AI Error:", error);
    return { success: false, error: error.message };
  }
}