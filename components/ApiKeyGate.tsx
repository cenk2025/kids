
import React, { useState, useEffect } from 'react';

interface ApiKeyGateProps {
  children: React.ReactNode;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const result = await (window as any).aistudio.hasSelectedApiKey();
    setHasKey(result);
  };

  const handleOpenSelect = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  if (hasKey === null) return null;

  if (!hasKey) {
    return (
      <div className="fixed inset-0 bg-pink-50 flex items-center justify-center p-6 z-50">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border-4 border-pink-200">
          <div className="text-6xl mb-4">🔑</div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Avaa taika!</h2>
          <p className="text-gray-600 mb-6">
            Luodaksesi upeita kuvituksia, sinun on valittava API-avain maksullisesta Google Cloud -projektista.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="text-pink-500 underline text-sm mb-6 block"
          >
            Lue lisää laskutuksesta ja projektin asetuksista
          </a>
          <button
            onClick={handleOpenSelect}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            Valitse API-avaimeni
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiKeyGate;
