// lib/geminiService.js
import axios from 'axios';

export async function generateGeminiResponse(prompt, context = '') {
  try {
    const response = await axios.post('/api/generate', {
      prompt,
      context,
      images: [] // no images for text-only
    });

    return response.data.result;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export async function generateMultimodalResponse(prompt, images) {
  try {
    const response = await axios.post('/api/generate', {
      prompt,
      images,
      context: '' // optional or include if needed
    });

    return response.data.result;
  } catch (error) {
    console.error('Error generating multimodal response:', error);
    throw error;
  }
}
