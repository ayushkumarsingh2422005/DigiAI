// pages/api/generate.js
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, context = '', images = [] } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    let result;

    if (images.length > 0) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-vision' });

      const parts = [
        { text: prompt },
        ...images.map(image => ({
          inlineData: {
            mimeType: 'image/jpeg',
            data: image.base64Data
          }
        }))
      ];

      const response = await model.generateContent(parts);
      result = await response.response.text();
    } else {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const fullPrompt = context ? `Context:\n${context}\n\nPrompt:\n${prompt}` : prompt;

      const response = await model.generateContent(fullPrompt);
      result = await response.response.text();
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Error generating response' });
  }
}
