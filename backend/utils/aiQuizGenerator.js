// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const generateQuizFromAI = async ({ topic }) => {
//   try {

//     // ⭐ USE LATEST WORKING MODEL
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash"
//     });

//     const prompt = `
// Generate 5 multiple choice questions about "${topic}"

// RETURN ONLY VALID JSON.

// FORMAT:

// [
//  {
//    "questionText": "",
//    "options": ["A","B","C","D"],
//    "correctAnswer": ""
//  }
// ]
// `;

//     const result = await model.generateContent(prompt);

//     const text = result.response.text();

//     return text;

//   } catch (error) {

//     console.error("Gemini Error:", error);
//     throw new Error("AI quiz generation failed");
//   }
// };


//----------------------------------version 2-------------

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const generateQuizFromAI = async ({ topic }) => {

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // ⭐ Latest + FAST
      contents: `
Generate 5 multiple choice questions about:

${topic}

Return ONLY valid JSON:

[
 {
   "questionText": "",
   "options": ["A","B","C","D"],
   "correctAnswer": "",
   "explanation":""
 }
]
`
    });

    return response.text;

  } catch (error) {

    console.log("🔥 GEMINI REAL ERROR:", error);

    throw new Error("AI quiz generation failed");
  }
};
