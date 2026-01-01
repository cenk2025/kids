
import React, { useState, useCallback } from 'react';
import { generateStory, generatePageImage, generateSpeech } from './services/geminiService';
import { Story, ImageSize } from './types';
import ApiKeyGate from './components/ApiKeyGate';
import ChatBot from './components/ChatBot';
import AudioPlayer from './components/AudioPlayer';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const startNewStory = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setLoadingStep('Taikapölyä kerätään...');
    try {
      const newStory = await generateStory(topic);
      setStory(newStory);
      setCurrentPage(0);
      await loadPageAssets(newStory, 0);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPageAssets = async (currentStory: Story, pageIdx: number) => {
    const page = currentStory.pages[pageIdx];
    if (page.imageUrl && page.audioData) return;

    setLoadingStep(`Piirretään sivua ${pageIdx + 1}...`);
    try {
      if (!page.imageUrl) {
        const url = await generatePageImage(page.imagePrompt, imageSize);
        if (url) {
          const updatedStory = { ...currentStory };
          updatedStory.pages[pageIdx].imageUrl = url;
          setStory(updatedStory);
        }
      }
      
      setLoadingStep(`Luetaan sivua ${pageIdx + 1}...`);
      if (!page.audioData) {
        const audio = await generateSpeech(page.text);
        if (audio) {
          const updatedStory = { ...currentStory };
          updatedStory.pages[pageIdx].audioData = audio;
          setStory(updatedStory);
        }
      }
    } catch (err: any) {
      handleError(err);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err.message === "KEY_PERMISSION_REQUIRED") {
      const retry = confirm("Käyttöoikeus evätty (403). Tämä johtuu yleensä siitä, että API-avain ei ole maksullisesta projektista. Haluatko valita uuden API-avaimen?");
      if (retry) {
        (window as any).aistudio.openSelectKey().then(() => {
          window.location.reload();
        });
      }
    } else {
      alert("Hups! Jotain meni vikaan. Kokeillaanpa uudelleen.");
    }
  };

  const handleNext = async () => {
    if (!story || currentPage >= story.pages.length - 1) return;
    const nextIdx = currentPage + 1;
    setCurrentPage(nextIdx);
    if (!story.pages[nextIdx].imageUrl) {
      setIsLoading(true);
      await loadPageAssets(story, nextIdx);
      setIsLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const playNarration = () => {
    setIsPlayingAudio(true);
  };

  const downloadPDF = async () => {
    if (!story) return;
    
    const missingImages = story.pages.some(p => !p.imageUrl);
    if (missingImages) {
      const confirmLoad = confirm("Kaikkia kuvia ei ole vielä piirretty. Haluatko ladata kirjan vain valmiilla sivuilla?");
      if (!confirmLoad) return;
    }

    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(236, 72, 153);
      doc.text(story.title, pageWidth / 2, 60, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text("Luotu DreamWeaver Taikasatukirjalla", pageWidth / 2, 80, { align: 'center' });

      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];
        doc.addPage();

        if (page.imageUrl) {
          try {
            const imgHeight = contentWidth * (9 / 16);
            doc.addImage(page.imageUrl, 'PNG', margin, 30, contentWidth, imgHeight);
          } catch (e) {
            console.error("Kuvan lisäys PDF:ään epäonnistui", e);
          }
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(18);
        doc.setTextColor(40);
        
        const textLines = doc.splitTextToSize(page.text, contentWidth);
        doc.text(textLines, margin, contentWidth * (9 / 16) + 50);

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Sivu ${i + 1} / ${story.pages.length}`, pageWidth / 2, 280, { align: 'center' });
      }

      const filename = `${story.title.replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF-virhe:", err);
      alert("Kirjan luominen epäonnistui. Kokeile ladata sivu uudelleen.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading && !story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6 text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-8 border-pink-200 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl">✨</div>
        </div>
        <h2 className="text-3xl font-bold text-pink-600 mb-2">Luodaan taikaa...</h2>
        <p className="text-pink-400 italic text-xl">{loadingStep}</p>
      </div>
    );
  }

  const isLastPage = story && currentPage === story.pages.length - 1;

  return (
    <ApiKeyGate>
      <div className="min-h-screen pb-24">
        <header className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStory(null)}>
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
              <i className="fas fa-magic"></i>
            </div>
            <h1 className="text-2xl font-black text-gray-800 hidden sm:block">DreamWeaver</h1>
          </div>
          
          <div className="flex items-center gap-3">
             {story && (
               <button 
                 onClick={downloadPDF}
                 disabled={isDownloading}
                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
               >
                 <i className={`fas ${isDownloading ? 'fa-spinner fa-spin' : 'fa-file-pdf'}`}></i>
                 <span>Lataa PDF</span>
               </button>
             )}
             <button 
              onClick={() => setTopic('') || setStory(null)} 
              className="bg-pink-100 text-pink-500 hover:bg-pink-200 px-4 py-2 rounded-2xl text-sm font-bold transition-all shadow-sm"
             >
               Uusi tarina
             </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 md:p-8">
          {!story ? (
            <div className="mt-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold text-pink-600 leading-tight">
                  Mille seikkailulle lähdemme tänään?
                </h2>
                <p className="text-2xl text-gray-500 font-medium">
                  Kirjoita muutama sana, niin kudon sinulle taianomaisen tarinan!
                </p>
              </div>

              <div className="max-w-lg mx-auto relative group">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Esim. Pieni lohikäärme avaruudessa..."
                  className="w-full bg-white border-4 border-pink-100 rounded-[2.5rem] px-8 py-7 text-2xl shadow-2xl focus:ring-8 focus:ring-pink-50 outline-none transition-all placeholder:text-gray-300"
                  onKeyPress={(e) => e.key === 'Enter' && startNewStory()}
                />
                <button
                  onClick={startNewStory}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all shadow-xl hover:scale-110 active:scale-95"
                >
                  <i className="fas fa-play text-xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {[
                  { label: 'Avaruusmerirosvot', icon: '🚀' },
                  { label: 'Rohkeat kissat', icon: '🐱' },
                  { label: 'Puhuvat puut', icon: '🌳' },
                  { label: 'Taikakengät', icon: '✨' }
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setTopic(s.label)}
                    className="bg-white p-6 rounded-3xl shadow-lg border-4 border-transparent hover:border-pink-200 hover:-translate-y-2 transition-all text-gray-600 font-bold flex flex-col items-center gap-3"
                  >
                    <span className="text-4xl">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-pink-600 drop-shadow-sm">{story.title}</h2>
                <p className="text-pink-300 text-xl font-bold uppercase tracking-widest">SIVU {currentPage + 1} / {story.pages.length}</p>
              </div>

              <div className="relative aspect-video bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-[12px] border-white group">
                {story.pages[currentPage].imageUrl ? (
                  <img
                    src={story.pages[currentPage].imageUrl}
                    alt="Tarinan kuvitus"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-pink-50">
                    <div className="animate-bounce text-pink-300 text-6xl mb-4">🎨</div>
                    <p className="text-pink-400 font-bold text-xl italic">Piirretään kuvaa...</p>
                  </div>
                )}
                
                {story.pages[currentPage].audioData && (
                  <button
                    onClick={playNarration}
                    disabled={isPlayingAudio}
                    className="absolute bottom-8 right-8 bg-white/95 hover:bg-white text-pink-500 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-90 disabled:opacity-50"
                  >
                    <i className={`fas ${isPlayingAudio ? 'fa-volume-up' : 'fa-play'}`}></i>
                  </button>
                )}

                {isPlayingAudio && story.pages[currentPage].audioData && (
                  <AudioPlayer 
                    base64Data={story.pages[currentPage].audioData!} 
                    onEnded={() => setIsPlayingAudio(false)} 
                  />
                )}
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-pink-100 min-h-[160px] flex items-center justify-center text-center">
                <p className="text-3xl md:text-4xl text-gray-700 leading-snug font-semibold">
                  {story.pages[currentPage].text}
                </p>
              </div>

              {isLastPage && (
                <div className="flex flex-col items-center gap-4 py-8 bg-green-50 rounded-[3rem] border-4 border-dashed border-green-200">
                  <h3 className="text-2xl font-bold text-green-700">Tarina loppui! 🎉</h3>
                  <button
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-3xl text-xl font-black flex items-center gap-4 shadow-xl transition-all active:scale-95"
                  >
                    <i className={`fas ${isDownloading ? 'fa-spinner fa-spin' : 'fa-cloud-download-alt'}`}></i>
                    TALLENNA KIRJANI PDF-MUODOSSA
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center px-6">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="bg-white text-pink-500 disabled:text-gray-200 px-6 py-4 rounded-2xl font-black shadow-md hover:shadow-lg transition-all disabled:shadow-none"
                >
                  <i className="fas fa-arrow-left mr-2"></i> EDELLINEN
                </button>
                
                <div className="flex gap-3">
                  {story.pages.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full transition-all duration-500 ${
                        i === currentPage ? 'w-12 bg-pink-500' : 'w-3 bg-pink-100'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === story.pages.length - 1 || isLoading}
                  className="bg-pink-500 text-white disabled:bg-gray-100 disabled:text-gray-300 px-6 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                   {isLoading ? 'PIIRETÄÄN...' : 'SEURAAVA'} <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          )}
        </main>

        <ChatBot />
      </div>
    </ApiKeyGate>
  );
};

export default App;
