
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messages, input);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Hups, nyt taisi tulla pieni virhe. Kokeilepa kysyä uudelleen!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-3xl shadow-2xl flex flex-col border-4 border-blue-200 overflow-hidden">
          <div className="bg-blue-400 p-4 text-white flex justify-between items-center">
            <span className="font-bold flex items-center gap-2">
              <i className="fas fa-robot"></i> Tarinakaveri
            </span>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-10 italic">Moi! Voit kysyä minulta mitä vain tarinasta.</p>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-blue-100 text-blue-800 rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none animate-pulse text-gray-400">
                  Mietin...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Kirjoita kysymys..."
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-400 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-500"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-110 transition-transform float-animation"
        >
          <i className="fas fa-comment-dots"></i>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
