import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, QuizQuestion } from '../types';
import { QUESTION_COUNT, RAIKU_CONTEXT, FALLBACK_QUESTIONS, SPECIAL_HARD_QUESTIONS } from '../constants';

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getRaikuAnswer = async (query: string): Promise<string> => {
  if (!API_KEY) return "API_KEY is not configured. Please set it up in your environment variables.";
  try {
    const prompt = `You are an expert on Raiku. Based on the following context, answer the user's query. Your answer must be concise and under 200 characters. If the answer is not in the context, say you cannot find an answer.
    
    Context:
    ${RAIKU_CONTEXT}
    
    User Query: "${query}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error fetching answer from Gemini:", error);
    return "Sorry, I'm having trouble connecting to the network right now.";
  }
};

const generateHardQuizWithSpecialQuestions = async (): Promise<QuizQuestion[]> => {
    if (!API_KEY) return FALLBACK_QUESTIONS;
    try {
        const questionsToGenerate = QUESTION_COUNT - SPECIAL_HARD_QUESTIONS.length;
        const prompt = `Generate ${questionsToGenerate} quiz questions about Raiku based on the provided context. The difficulty level should be 'Hard'. For each question, provide a question text, an array of 4 multiple-choice options, and the 0-based index of the correct answer.
        
        Context:
        ${RAIKU_CONTEXT}
        
        Return the result as a JSON array of objects.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswerIndex: { type: Type.INTEGER },
                        },
                        required: ["question", "options", "correctAnswerIndex"],
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const generatedQuestions = JSON.parse(jsonString);

        if (generatedQuestions && generatedQuestions.length === questionsToGenerate) {
            const combined = [...generatedQuestions, ...SPECIAL_HARD_QUESTIONS];
            // Fisher-Yates shuffle
            for (let i = combined.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [combined[i], combined[j]] = [combined[j], combined[i]];
            }
            return combined;
        }
         // Fallback if API response is malformed
        const fallbackSubset = FALLBACK_QUESTIONS.slice(0, questionsToGenerate);
        const combined = [...fallbackSubset, ...SPECIAL_HARD_QUESTIONS];
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        return combined;
    } catch (error) {
        console.error("Error generating hard quiz questions:", error);
        const questionsToGenerate = QUESTION_COUNT - SPECIAL_HARD_QUESTIONS.length;
        const fallbackSubset = FALLBACK_QUESTIONS.slice(0, questionsToGenerate);
        const combined = [...fallbackSubset, ...SPECIAL_HARD_QUESTIONS];
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        return combined;
    }
};


export const generateQuizQuestions = async (difficulty: Difficulty): Promise<QuizQuestion[]> => {
  if (!API_KEY) return FALLBACK_QUESTIONS;
  if (difficulty === Difficulty.Hard) {
    return generateHardQuizWithSpecialQuestions();
  }
  
  try {
    const prompt = `Generate ${QUESTION_COUNT} quiz questions about Raiku based on the provided context. The difficulty level should be '${difficulty}'. For each question, provide a question text, an array of 4 multiple-choice options, and the 0-based index of the correct answer.
    
    Context:
    ${RAIKU_CONTEXT}
    
    Return the result as a JSON array of objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
            },
            required: ["question", "options", "correctAnswerIndex"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const questions = JSON.parse(jsonString);
    if (questions && questions.length === QUESTION_COUNT) {
        return questions;
    }
    // Fallback if the response is not as expected
    return FALLBACK_QUESTIONS;
  } catch (error) {
    console.error("Error generating quiz questions from Gemini:", error);
    // Return fallback questions on API error
    return FALLBACK_QUESTIONS;
  }
};