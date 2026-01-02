
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
  // Gemini API does not support image generation via generateContent
  // Using Unsplash API for beautiful, free stock photos instead

  try {
    // Extract keywords from the prompt for better image search
    const keywords = prompt
      .replace(/A beautiful.*?style:\s*/i, '')
      .split(',')[0]
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(',');

    // Use Unsplash Source API (no API key required for basic usage)
    // This provides random beautiful images based on keywords
    const unsplashUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(keywords)},children,illustration,fantasy`;

    // Fetch the image
    const response = await fetch(unsplashUrl);

    if (response.ok) {
      // Convert to base64 for consistent handling
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }

    // Fallback: Return a colorful placeholder with the prompt text
    return generatePlaceholderImage(prompt);

  } catch (error: any) {
    console.error("Image generation failed:", error);
    // Return placeholder instead of failing
    return generatePlaceholderImage(prompt);
  }
};

// Helper function to generate a colorful SVG placeholder
const generatePlaceholderImage = (prompt: string): string => {
  const colors = [
    ['#FF6B9D', '#C44569'],
    ['#4ECDC4', '#44A08D'],
    ['#F7B731', '#F79F1F'],
    ['#5F27CD', '#341F97'],
    ['#00D2FF', '#3A7BD5'],
  ];

  const colorPair = colors[Math.floor(Math.random() * colors.length)];
  const shortPrompt = prompt.substring(0, 100);

  const svg = `
    <svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorPair[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorPair[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" opacity="0.9">
        ✨ ${shortPrompt} ✨
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
