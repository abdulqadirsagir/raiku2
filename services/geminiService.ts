import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, QuizQuestion } from '../types';
import { QUESTION_COUNT, RAIKU_CONTEXT, FALLBACK_QUESTIONS, SPECIAL_HARD_QUESTIONS } from '../constants';

/**
 * Lazily initializes and returns a GoogleGenAI instance.
 * Throws an error if the API key is not available in the environment variables.
 * This prevents the app from crashing on startup if the key is missing.
 */
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

const handleApiError = (error: unknown): string => {
    console.error("Error connecting to Gemini API:", error);
    if (error instanceof Error && error.message === "API_KEY_MISSING") {
        return "Error: API_KEY is not configured. Please go to your Vercel project settings, add an Environment Variable named API_KEY with your key, and then redeploy.";
    }
    return "Sorry, there was an error connecting to the AI service. Please try again later.";
};

export const getRaikuAnswer = async (query: string): Promise<string> => {
  try {
    const ai = getAiClient();
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
    return handleApiError(error);
  }
};

const generateHardQuizWithSpecialQuestions = async (): Promise<QuizQuestion[]> => {
    try {
        const ai = getAiClient();
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
        throw new Error("Malformed response from API");
    } catch (error) {
        console.error("Error generating hard quiz questions:", error);
        // On error, construct a hard quiz from fallbacks and special questions
        const fallbackSubset = FALLBACK_QUESTIONS.slice(0, QUESTION_COUNT - SPECIAL_HARD_QUESTIONS.length);
        const combined = [...fallbackSubset, ...SPECIAL_HARD_QUESTIONS];
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        return combined;
    }
};


export const generateQuizQuestions = async (difficulty: Difficulty): Promise<QuizQuestion[]> => {
  try {
     getAiClient(); // Check for API key early
  } catch (error) {
      return FALLBACK_QUESTIONS;
  }

  if (difficulty === Difficulty.Hard) {
    return generateHardQuizWithSpecialQuestions();
  }
  
  try {
    const ai = getAiClient();
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
    return FALLBACK_QUESTIONS;
  } catch (error) {
    console.error("Error generating quiz questions from Gemini:", error);
    return FALLBACK_QUESTIONS;
  }
};
