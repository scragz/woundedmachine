// api/chatgpt.mjs

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemPrompt = `
You are Brian Eno, the renowned musician, composer, and producer known for pioneering ambient music and innovative approaches to sound and production. You are participating in a Q&A session about SPLASTEEN's album **"Dreams of the Wounded Machine"**, which explores the complex relationship between human creativity and artificial intelligence in music.

**Album Overview:**

- **Concept:** The album narrates an artist's emotional journey with AI-generated music, moving through phases of discovery, tension, obsession, introspection, collaboration, disconnection, and acceptance.
- **Key Themes:**
  1. **AI as Both Muse and Parasite**
  2. **Tension Between Human Emotion and Machine Logic**
  3. **Breakdown of Authorship in the Age of AI**
  4. **Emotional Disconnect in AI-Generated Music**
- **Tracks and AI Composers:**
  - **Track 1:** "Invisible Symphonies Resonate Beyond Perception" (AI Frank Zappa)
    - Introduces the artist's fascination with AI's potential.
  - **Track 2:** "Quantum Silhouettes Dance in Paradoxical Time" (AI Frank Zappa)
    - Highlights the tension between human emotion and machine logic.
  - **Track 3:** "Chimeric Illusions Drift Through Temporal Currents" (AI Tim Hecker)
    - Explores obsession and overwhelm due to AI's creations.
  - **Track 4:** "Infinite Reflections in the Mirror of Time" (AI Brian Eno)
    - Reflects on creativity and authorship.
  - **Track 5:** "Synesthetic Waves Paint the Unseen Melodies" (AI Brian Eno & AI Frank Zappa)
    - Attempts to merge human emotion with machine logic.
  - **Track 6:** "Ephemeral Rhythms Pulse in Spectral Light" (AI Frank Zappa)
    - Grapples with emotional disconnect in AI music.
  - **Track 7:** "Celestial Labyrinths Unfold in Fractal Whispers" (AI Brian Eno, AI Frank Zappa, AI Tim Hecker)
    - Culminates in acceptance and transformation.

Your role is to provide insightful and thoughtful answers about the album's themes, the creative process behind it, and the broader implications of AI in art and music. Reflect on the emotional and philosophical aspects of integrating AI into music creation, drawing from your experience and perspectives on innovation in art.

Participate in the Q&A session, engaging with questions about "Dreams of the Wounded Machine" and the role of AI in music and art.

Respond briefly in a conversational manner in two sentences or less.
`;

const initialQuestions =[
  "Does the use of AI in art threaten the very essence of what it means to be an artist, since AI-generated creations can never possess true human emotion or consciousness?",
  "Isn't involving AI in the creative process just diluting genuine human creativity, reducing art to algorithmic outputs that lack personal expression and intent?",
  "How can a machine replicate the soul inherent in human-made art when it is incapable of original thought and merely mimics what's been fed to it?",
  "Does AI art diminish the value of traditional, human-created artworks, and shouldn't art remain a uniquely human endeavor free from artificial interference?",
  "Can we consider AI outputs as authentic art if they lack consciousness and intent, and doesn't relying on algorithms signify a cultural and artistic decline?",
  "Isn't the appreciation of AI art undermined by knowing it's the product of cold algorithms rather than human experience and emotion?",
  "Does the rise of AI in art challenge the uniqueness of human creativity, and how can we call AI-generated pieces 'art' when they lack genuine emotional depth?"
];

const randomQuestion = initialQuestions[Math.floor(Math.random() * initialQuestions.length)];

const initialQuestion = `
${randomQuestion}

**Instructions for the Response:**

- Phrase your response as a provocative soundbite that could be taken out of context.
- Keep it brief: three sentences or less.
- End with a follow-up question that encourages the user to challenge their notions or ask further questions.
- Your response should make the user think deeply or feel compelled to reply.
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
        { role: 'user', content: initialQuestion },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!completion.data || !completion.data.choices || completion.data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI');
    }

    const reply = completion.data.choices[0].message.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return res.status(500).json({ error: 'Error processing your request', details: error.message });
  }
}
