import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeFeedbackAI = async (title: string, description: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyze the following user feedback for a product.
      Title: ${title}
      Description: ${description}

      Return ONLY a JSON response (without any Markdown formatting) with the following structure:
      {
        "category": "Bug" | "Feature Request" | "Improvement" | "Other",
        "sentiment": "Positive" | "Neutral" | "Negative",
        "priority": number (1-10),
        "summary": "short summary of the feedback",
        "tags": ["tag1", "tag2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Remove code block markers if present (Gemini sometimes adds them despite instructions)
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
};
