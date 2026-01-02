
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
  // Note: Imagen 3 is not currently available in the Google GenAI SDK v1beta
  // Using beautiful, themed SVG placeholders instead
  // These provide a professional, colorful visual experience for the story

  try {
    // Generate a themed placeholder based on the prompt
    return generateThemedPlaceholder(prompt);

  } catch (error: any) {
    console.error("Image generation failed:", error);
    return generateThemedPlaceholder(prompt);
  }
};

// Generate beautiful themed SVG placeholders
const generateThemedPlaceholder = (prompt: string): string => {
  // Extract theme keywords from prompt
  const lowerPrompt = prompt.toLowerCase();

  // Theme detection
  let theme = 'default';
  let colors = ['#667eea', '#764ba2']; // Default purple
  let emoji = '✨';

  if (lowerPrompt.includes('space') || lowerPrompt.includes('avaruus') || lowerPrompt.includes('täht')) {
    theme = 'space';
    colors = ['#0f2027', '#203a43', '#2c5364'];
    emoji = '🚀';
  } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('metsä') || lowerPrompt.includes('puu')) {
    theme = 'forest';
    colors = ['#134e5e', '#71b280'];
    emoji = '🌲';
  } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('meri') || lowerPrompt.includes('vesi')) {
    theme = 'ocean';
    colors = ['#2E3192', '#1BFFFF'];
    emoji = '🌊';
  } else if (lowerPrompt.includes('magic') || lowerPrompt.includes('taika') || lowerPrompt.includes('wizard')) {
    theme = 'magic';
    colors = ['#8E2DE2', '#4A00E0'];
    emoji = '🔮';
  } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('eläin') || lowerPrompt.includes('cat') || lowerPrompt.includes('dog')) {
    theme = 'animal';
    colors = ['#f093fb', '#f5576c'];
    emoji = '🐾';
  } else if (lowerPrompt.includes('castle') || lowerPrompt.includes('linna') || lowerPrompt.includes('princess')) {
    theme = 'castle';
    colors = ['#fa709a', '#fee140'];
    emoji = '🏰';
  } else {
    // Random colorful theme
    const themes = [
      { colors: ['#FF6B9D', '#C44569'], emoji: '💖' },
      { colors: ['#4ECDC4', '#44A08D'], emoji: '🌟' },
      { colors: ['#F7B731', '#F79F1F'], emoji: '☀️' },
      { colors: ['#5F27CD', '#341F97'], emoji: '🎨' },
      { colors: ['#00D2FF', '#3A7BD5'], emoji: '🎪' },
    ];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    colors = randomTheme.colors;
    emoji = randomTheme.emoji;
  }

  // Create a short, clean prompt text
  const shortPrompt = prompt
    .replace(/A beautiful.*?style:\s*/i, '')
    .substring(0, 80);

  // Generate SVG with theme
  const svg = `
    <svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          ${colors.map((color, i) =>
    `<stop offset="${i * (100 / (colors.length - 1))}%" style="stop-color:${color};stop-opacity:1" />`
  ).join('\n          ')}
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#grad)"/>
      
      <!-- Decorative circles -->
      <circle cx="200" cy="200" r="150" fill="white" opacity="0.1"/>
      <circle cx="1400" cy="700" r="200" fill="white" opacity="0.1"/>
      <circle cx="800" cy="450" r="100" fill="white" opacity="0.05"/>
      
      <!-- Emoji decoration -->
      <text x="50%" y="35%" font-size="120" text-anchor="middle" opacity="0.3">${emoji}</text>
      
      <!-- Main text -->
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white" text-anchor="middle" filter="url(#glow)">
        ${shortPrompt}
      </text>
      
      <!-- Subtitle -->
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle" opacity="0.8">
        Taikasatukirja ✨
      </text>
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
