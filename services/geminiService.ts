
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { Story, ImageSize } from "../types";

export const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStory = async (topic: string): Promise<Story> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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
  // Käytetään Pro-mallia vain jos käyttäjä haluaa 2K tai 4K, muuten Flash-malli on varmempi lupien suhteen
  const modelName = (size === ImageSize.SIZE_2K || size === ImageSize.SIZE_4K) 
    ? 'gemini-3-pro-image-preview' 
    : 'gemini-2.5-flash-image';

  try {
    const refinedPrompt = `A beautiful, whimsical children's book illustration, professional digital art, soft colors, safe for children, consistent storybook style: ${prompt}`;
    
    const config: any = {
      imageConfig: {
        aspectRatio: "16:9"
      }
    };

    if (modelName === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = size;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: refinedPrompt }]
      },
      config
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image generation failed:", error);
    const errorMsg = error.message?.toLowerCase() || "";
    if (
      errorMsg.includes("permission") || 
      errorMsg.includes("403") || 
      errorMsg.includes("requested entity was not found")
    ) {
      throw new Error("KEY_PERMISSION_REQUIRED");
    }
    throw error;
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
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

export const sendChatMessage = async (history: {role: 'user'|'model', text: string}[], message: string) => {
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
