'use client';
import { X, Download, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useRef } from 'react';

export default function DailyPopup({ onClose, quote, hijriDate, gregorianDate, prayerTimes, ramadanStatus, locationName }) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = `Barakah-Insight-${gregorianDate}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) { console.error('Download failed', err); }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-sm relative">
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
        
        <div ref={cardRef} className="bg-[#FAF9F6] rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-[#1B4332]">
           {/* Texture Overlay */}
           <div className="absolute inset-0 opacity-10" style={{ 
               backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")`,
               backgroundSize: '200px'
           }}></div>

           {/* Header */}
           <div className="bg-[#1B4332] h-40 relative flex flex-col items-center justify-center text-white p-6 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/30 blur-[50px] rounded-full"></div>
              <div className="relative z-10 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 mb-2">Daily Insight</p>
                  <h2 className="text-2xl font-serif font-bold text-white mb-1">{ramadanStatus}</h2>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-300 font-medium opacity-80">
                     <span>{gregorianDate}</span> <span className="text-yellow-500">•</span> <span>{hijriDate}</span>
                  </div>
              </div>
           </div>

           {/* Body */}
           <div className="p-8 text-center relative z-20">
              <div className="w-12 h-12 bg-white text-[#1B4332] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-[#FAF9F6] -mt-12 relative z-20">
                  <Sparkles size={20} />
              </div>
              <p className="font-serif text-3xl text-[#1B4332] leading-loose mb-6 dir-rtl drop-shadow-sm">{quote?.arabic || "Loading..."}</p>
              <p className="text-gray-600 font-medium text-sm italic mb-6 leading-relaxed">"{quote?.english || "..."}"</p>
              <div className="inline-block bg-[#1B4332]/5 text-[#1B4332] text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest border border-[#1B4332]/10">
                  {quote?.ref || "Daily Barakah"}
              </div>
           </div>

           {/* Prayer Times Strip (NOW ROBUST) */}
           <div className="bg-[#1B4332] p-5 flex justify-between text-center border-t-4 border-yellow-600">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
                  <div key={p}>
                      <span className="text-[9px] text-green-200/60 uppercase block mb-1 tracking-widest">{p}</span>
                      <span className="text-xs font-bold text-white">
                        {prayerTimes ? prayerTimes[p] : "--:--"}
                      </span>
                  </div>
              ))}
           </div>
           
           {/* Footer */}
           <div className="bg-[#0f281e] text-white/60 text-[9px] p-3 text-center uppercase tracking-widest border-t border-white/5">
              Wonder Sight Gallery • {locationName || "Locating..."}
           </div>
        </div>

        <button onClick={handleDownload} className="w-full mt-6 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-all active:scale-95">
            <Download size={20} /> Save to Gallery
        </button>
      </div>
    </div>
  );
}