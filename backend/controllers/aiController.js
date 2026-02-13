// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";
// import Course from "../models/courseModel.js";
// dotenv.config();


// export const searchWithAi = async (req,res) => {
     
//     try {
//          const { input } = req.body;
     
//     if (!input) {
//       return res.status(400).json({ message: "Search query is required" });
//     }
//  // case-insensitive
//     const ai = new GoogleGenAI({});
// const prompt=`You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

// - App Development  
// - AI/ML  
// - AI Tools  
// - Data Science  
// - Data Analytics  
// - Ethical Hacking  
// - UI UX Designing  
// - Web Development  
// - Others  
// - Beginner  
// - Intermediate  
// - Advanced  

// Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

// Query: ${input}
// `

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents:prompt,
//   });
//   const keyword=response.text



//     const courses = await Course.find({
//       isPublished: true,
//      $or: [
//     { title: { $regex: input, $options: 'i' } },
//     { subTitle: { $regex: input, $options: 'i' } },
//     { description: { $regex: input, $options: 'i' } },
//     { category: { $regex: input, $options: 'i' } },
//     { level: { $regex: input, $options: 'i' } }
//   ]
//     });

//     if(courses.length>0){
//     return res.status(200).json(courses);
//     }else{
//        const courses = await Course.find({
//       isPublished: true,
//      $or: [
//     { title: { $regex: keyword, $options: 'i' } },
//     { subTitle: { $regex: keyword, $options: 'i' } },
//     { description: { $regex: keyword, $options: 'i' } },
//     { category: { $regex: keyword, $options: 'i' } },
//     { level: { $regex: keyword, $options: 'i' } }
//   ]
//     });
//        return res.status(200).json(courses);
//     }


//     } catch (error) {
//         console.log(error)
//     }
// }

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export const aiChat = async (req, res) => {
//   try {
//     const { message } = req.body;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a helpful LMS tutor for students." },
//         { role: "user", content: message }
//       ]
//     });

//     res.json({ reply: completion.choices[0].message.content });
//   } catch (err) {
//     res.status(500).json({ message: "AI error" });
//   }
// };

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const aiChat = async (req, res) => {
//   try {

//     const { message } = req.body;

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//     });

//     const result = await model.generateContent(message);
//     const reply = result.response.text();

//     res.json({ reply });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "AI error"
//     });
//   }
// };

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });


// export const aiChat = async (req, res) => {
//   try {

//     const { message } = req.body;

//     const model = genAI.getGenerativeModel({

//       model: "gemini-pro"

//       //model: "gemini-1.5-flash-latest",
//     });

//     const result = await model.generateContent(message);
//     const reply = result.response.text();

//     res.json({ reply });

//   } catch (error) {
//     console.log("Gemini Error:", error);

//     res.status(500).json({
//       message: "AI error"
//     });
//   }
// };


//-------------------------------version 3--

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const generateQuizFromAI = async ({ topic }) => {

  try {

    const prompt = `
Generate 5 MCQs about "${topic}"

Return ONLY JSON:

[
{
"questionText":"",
"options":["","","",""],
"correctAnswer":""
}
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt
    });

    return response.text;

  } catch (error) {

    console.log("🔥 GEMINI REAL ERROR:", error);

    // ⭐ FALLBACK (VERY SMART FOR COLLEGE PROJECT)
    return JSON.stringify([
      {
        questionText: `What is ${topic}?`,
        options: ["Concept", "Animal", "City", "Game"],
        correctAnswer: "Concept"
      }
    ]);
  }
};
