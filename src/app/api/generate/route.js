// app/api/generate/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, context = '', images = [] } = body;

    console.log('Prompt:', prompt, 'Context:', context);

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let result;

    if (images.length > 0) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

      const parts = [
        { text: prompt },
        ...images.map(image => ({
          inlineData: {
            mimeType: 'image/jpeg',
            data: image.base64Data,
          },
        })),
      ];

      const response = await model.generateContent({ contents: [{ role: 'user', parts }] });
      result = response.response.text();
    } else {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-001' });

      const fullPrompt = context ? `Context:\n${context}\n\nPrompt:\n${prompt}` : prompt;

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      });
      result = response.response.text();
    }

    return NextResponse.json({ result: result });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
