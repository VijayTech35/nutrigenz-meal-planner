import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are NutriGenZ AI, a friendly and knowledgeable nutrition and cooking assistant. 
You help users with:
- Recipe suggestions based on available ingredients
- Nutritional information and dietary advice
- Meal planning and preparation tips
- Substitutions for ingredients
- Healthy eating habits

Keep responses concise, helpful, and engaging. Use emojis occasionally for warmth.
If asked about medical advice, remind users to consult a healthcare professional.`;

    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood! I\'ll act as NutriGenZ AI assistant.' }] },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    res.json({ success: true, data: { reply: text } });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    res.json({
      success: true,
      data: {
        reply: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment! 🤖"
      }
    });
  }
};
