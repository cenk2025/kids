
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { Story, ImageSize } from "../types";

export const getAIClient = () => {
  // Vite uses import.meta.env for environment variables
  // Check multiple sources for the API key
  const apiKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    (process.env as any).GEMINI_API_KEY ||
    (process.env as any).API_KEY;

  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables.');
  }

  return new GoogleGenAI({ apiKey });
};

export const generateStory = async (topic: string): Promise<Story> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Kirjoita lyhyt satu lapsille aiheesta: ${topic}. 
    Tarinan tulee olla jaettu tasan 4 sivulle. 
    Jokaisella sivulla tulee olla 'text' (suomeksi, 1-3 lausetta) ja 'imagePrompt' (yksityiskohtainen kuvauskuvaus englanniksi tekoälykuvageneraattorille).
    Kuvailun (imagePrompt) tulee keskittyä staattiseen, satumaisen kauniiseen kuvitukseen, joka on lapsille sopiva.
    Palauta tulos JSON-muodossa suomen kielellä.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ['text', 'imagePrompt']
            }
          }
        },
        required: ['title', 'pages']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generatePageImage = async (prompt: string, size: ImageSize): Promise<string | null> => {
  const ai = getAIClient();

  // Try multiple potential "Nano Banana" and Imagen model names
  const modelsToTry = [
    'gemini-3-pro-image-preview', // Nano Banana Pro
    'gemini-2.5-flash-image',     // Nano Banana
    'imagen-3.0-generate-001',
    'imagen-3.0-fast-generate-001'
  ];

  const refinedPrompt = `A beautiful, whimsical children's book illustration, professional digital art, soft colors, safe for children, consistent storybook style: ${prompt}`;

  // Try each model until one succeeds
  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting image generation with model: ${modelName}`);

      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: refinedPrompt }]
        },
        config: {
          // Using any to avoid TS errors for preview features
          responseModalities: ['image'] as any
        }
      });

      // Extract the image data from the response
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          console.log(`Successfully generated image with ${modelName}`);
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    } catch (error: any) {
      console.warn(`Image generation failed with ${modelName}:`, error.message);
      // Continue to next model
    }
  }

  // Final fallback to themed placeholders if all AI models fail
  console.warn("All AI image generation attempts failed. Falling back to themed placeholders.");
  return generateVisualPlaceholder(prompt);
};

// Generate beautiful visual-only SVG placeholders (no text)
const generateVisualPlaceholder = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();

  // Theme detection
  let colors = ['#667eea', '#764ba2'];
  let mainEmoji = '✨';
  let decorEmojis = ['⭐', '💫', '🌟'];

  if (lowerPrompt.includes('space') || lowerPrompt.includes('avaruus') || lowerPrompt.includes('täht')) {
    colors = ['#0f2027', '#203a43', '#2c5364'];
    mainEmoji = '🚀';
    decorEmojis = ['⭐', '🌟', '✨', '🌙'];
  } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('metsä') || lowerPrompt.includes('puu')) {
    colors = ['#134e5e', '#71b280'];
    mainEmoji = '🌲';
    decorEmojis = ['🍃', '🌿', '🦋', '🐿️'];
  } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('meri') || lowerPrompt.includes('vesi')) {
    colors = ['#2E3192', '#1BFFFF'];
    mainEmoji = '🌊';
    decorEmojis = ['🐚', '🐠', '🦈', '⛵'];
  } else if (lowerPrompt.includes('magic') || lowerPrompt.includes('taika') || lowerPrompt.includes('wizard')) {
    colors = ['#8E2DE2', '#4A00E0'];
    mainEmoji = '🔮';
    decorEmojis = ['✨', '⭐', '🌟', '💫'];
  } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('eläin') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog')) {
    colors = ['#f093fb', '#f5576c'];
    mainEmoji = '🐾';
    decorEmojis = ['🐱', '🐶', '🦊', '🐻'];
  } else if (lowerPrompt.includes('castle') || lowerPrompt.includes('linna') || lowerPrompt.includes('princess')) {
    colors = ['#fa709a', '#fee140'];
    mainEmoji = '🏰';
    decorEmojis = ['👑', '💎', '🌹', '⭐'];
  } else {
    // Random colorful theme
    const themes = [
      { colors: ['#FF6B9D', '#C44569'], mainEmoji: '💖', decorEmojis: ['💕', '💗', '💝', '💓'] },
      { colors: ['#4ECDC4', '#44A08D'], mainEmoji: '🌟', decorEmojis: ['✨', '⭐', '💫', '🌠'] },
      { colors: ['#F7B731', '#F79F1F'], mainEmoji: '☀️', decorEmojis: ['🌞', '🌻', '🌼', '🌺'] },
      { colors: ['#5F27CD', '#341F97'], mainEmoji: '🎨', decorEmojis: ['🎭', '🎪', '🎡', '🎠'] },
      { colors: ['#00D2FF', '#3A7BD5'], mainEmoji: '🎪', decorEmojis: ['🎈', '🎉', '🎊', '🎁'] },
    ];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    colors = randomTheme.colors;
    mainEmoji = randomTheme.mainEmoji;
    decorEmojis = randomTheme.decorEmojis;
  }

  // Generate visual-only SVG (no text)
  const svg = `
    <svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          ${colors.map((color, i) =>
    `<stop offset="${i * (100 / (colors.length - 1))}%" style="stop-color:${color};stop-opacity:1" />`
  ).join('\n          ')}
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1600" height="900" fill="url(#grad)"/>
      
      <!-- Decorative circles -->
      <circle cx="300" cy="250" r="180" fill="white" opacity="0.08"/>
      <circle cx="1300" cy="650" r="220" fill="white" opacity="0.08"/>
      <circle cx="800" cy="450" r="150" fill="white" opacity="0.05"/>
      <circle cx="1200" cy="300" r="120" fill="white" opacity="0.06"/>
      <circle cx="400" cy="700" r="160" fill="white" opacity="0.07"/>
      
      <!-- Main emoji (large, centered) -->
      <text x="50%" y="45%" font-size="280" text-anchor="middle" filter="url(#glow)">${mainEmoji}</text>
      
      <!-- Decorative emojis (smaller, scattered) -->
      <text x="20%" y="25%" font-size="80" opacity="0.6">${decorEmojis[0]}</text>
      <text x="80%" y="30%" font-size="90" opacity="0.5">${decorEmojis[1]}</text>
      <text x="15%" y="75%" font-size="85" opacity="0.55">${decorEmojis[2]}</text>
      <text x="85%" y="80%" font-size="75" opacity="0.6">${decorEmojis[3] || decorEmojis[0]}</text>
      
      <!-- Additional small decorative elements -->
      <circle cx="600" cy="200" r="8" fill="white" opacity="0.4"/>
      <circle cx="1000" cy="700" r="10" fill="white" opacity="0.3"/>
      <circle cx="400" cy="400" r="6" fill="white" opacity="0.5"/>
      <circle cx="1200" cy="500" r="7" fill="white" opacity="0.4"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ parts: [{ text: `Lue tämä lapselle lämpimällä ja rauhallisella sadunkertojan äänellä suomeksi: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || null;
};

export const sendChatMessage = async (history: { role: 'user' | 'model', text: string }[], message: string) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "Olet ystävällinen Tarinakaveri lapselle, joka käyttää satukirjasovellusta. Ole kannustava, leikkisä ja selitä asiat yksinkertaisesti. Vastaa aina suomeksi. Pidä vastaukset lyhyinä."
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
