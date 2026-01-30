
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionType, Difficulty, Quiz } from "../types";

export const generateQuiz = async (
  lectureText: string,
  numQuestions: number,
  difficulty: Difficulty,
  types: QuestionType[],
  courseLevel: string
): Promise<Partial<Quiz>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a high-level university assessment generator. 
Your task is to generate quiz questions STRICTLY from the lecture material provided.
- Do NOT introduce external knowledge.
- Do NOT rephrase content beyond what is necessary for clarity.
- Every question MUST be answerable directly from the lecture note.
- If content is insufficient, return a message saying "INSUFFICIENT MATERIAL TO GENERATE QUALITY QUESTIONS" in the quiz_title.
- Use clear academic language suited for the specified course level (${courseLevel}).`;

  const prompt = `Analyze this lecture note and generate exactly ${numQuestions} questions.
Difficulty Level: ${difficulty}
Allowed Question Types: ${types.join(', ')}
Course Level: ${courseLevel}

Lecture Note:
"""
${lectureText}
"""`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          quiz_title: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                type: { 
                  type: Type.STRING,
                  enum: ["MCQ", "TrueFalse", "ShortAnswer"]
                },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                correct_answer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "type", "correct_answer", "explanation"]
            }
          }
        },
        required: ["quiz_title", "questions"]
      }
    }
  });

  const result = JSON.parse(response.text);
  
  if (result.quiz_title === "INSUFFICIENT MATERIAL TO GENERATE QUALITY QUESTIONS") {
    throw new Error("The lecture material provided is insufficient to generate quality questions for the requested parameters.");
  }

  return {
    title: result.quiz_title,
    questions: result.questions.map((q: any, idx: number) => ({
      ...q,
      id: `q-${Date.now()}-${idx}`
    }))
  };
};
