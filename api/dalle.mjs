// api/dalle.mjs

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


// New API call for DALL-E image generation
const systemPrompt = `
You are an AI assistant specialized in generating creative and vivid image descriptions based on user prompts. Your task is to take the user's input and expand it into a detailed, imaginative description that can be used to generate an image. Focus on visual elements, colors, composition, and mood. Be creative and artistic in your descriptions.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.8,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!completion.data || !completion.data.choices || completion.data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI');
    }

    const imageDescription = completion.data.choices[0].message.content.trim();

    const imageResponse = await openai.createImage({
      prompt: imageDescription,
      n: 1,
      size: "512x512",
    });

    const imageUrl = imageResponse.data.data[0].url;
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return res.status(500).json({ error: 'Error processing your request', details: error.message });
  }
}
