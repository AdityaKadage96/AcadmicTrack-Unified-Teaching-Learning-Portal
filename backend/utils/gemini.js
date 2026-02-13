import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuizFromText = async (lectureText) => {

const model = genAI.getGenerativeModel({
  model:"gemini-1.5-flash"
});

const prompt = `
Create 5 multiple choice questions from the following lecture.

Return ONLY JSON in this format:

{
 "questions":[
   {
     "question":"...",
     "options":["A","B","C","D"],
     "answer":"correct option"
   }
 ]
}

Lecture:
${lectureText}
`;

const result = await model.generateContent(prompt);

const response = result.response.text();

return JSON.parse(response);
};
