import fs from 'fs';
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function testTTS() {
  const text = "Xin chào, đây là hệ thống kiểm tra giọng nói.";
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!inlineData?.data) {
      console.error("No audio returned from Gemini API");
      return;
    }

    console.log("Returned mimeType:", inlineData.mimeType);
    console.log("Audio base64 length:", inlineData.data.length);
  } catch (err) {
    console.error("Gemini Error:", err);
  }
}

testTTS();
