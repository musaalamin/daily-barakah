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
    // FIX 1: Changed 'grid' to 'flex' with overflow-auto to prevent cutting off on small screens
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500 overflow-y-auto">
      
      {/* FIX 2: Added 'my-auto' to center vertically but allow scroll if needed */}
      <div className="w-full max-w-sm relative my-auto">
        
        {/* FIX 3: Adjusted Close Button position to be safer */}
        <button onClick={onClose} className="absolute -top-10 right-0 z-50 bg-white/10 rounded-full p-1 text-white hover:bg-white/20 transition-all">
            <X size={24} />
        </button>
        
        <div ref={cardRef} className="bg-[#FAF9F6] rounded-[1.5rem] overflow-hidden shadow-2xl relative border-2 border-[#1B4332]">
           {/* Texture Overlay */}
           <div className="absolute inset-0 opacity-10" style={{ 
               backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")`,
               backgroundSize: '200px'
           }}></div>

           {/* Header - Reduced Height (h-40 -> py-6) */}
           <div className="bg-[#1B4332] py-6 relative flex flex-col items-center justify-center text-white px-4 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/30 blur-[50px] rounded-full"></div>
              <div className="relative z-10 text-center">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-yellow-500 mb-1">Daily Insight</p>
                  <h2 className="text-xl font-serif font-bold text-white mb-1">{ramadanStatus}</h2>
                  <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-medium opacity-80">
                      <span>{gregorianDate}</span> <span className="text-yellow-500">•</span> <span>{hijriDate}</span>
                  </div>
              </div>
           </div>

           {/* Body - Reduced Padding (p-8 -> p-5) */}
           <div className="p-5 text-center relative z-20">
              <div className="w-10 h-10 bg-white text-[#1B4332] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-[#FAF9F6] -mt-10 relative z-20">
                  <Sparkles size={18} />
              </div>
              
              {/* Reduced Font Size slightly for safety */}
              <p className="font-serif text-2xl text-[#1B4332] leading-loose mb-4 dir-rtl drop-shadow-sm px-2">
                  {quote?.arabic || "Loading..."}
              </p>
              
              <p className="text-gray-600 font-medium text-xs italic mb-4 leading-relaxed px-4">
                  "{quote?.english || "..."}"
              </p>
              
              <div className="inline-block bg-[#1B4332]/5 text-[#1B4332] text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-[#1B4332]/10">
                  {quote?.ref || "Daily Barakah"}
              </div>
           </div>

           {/* Prayer Times Strip - Compact (p-5 -> p-3) */}
           <div className="bg-[#1B4332] p-3 flex justify-between text-center border-t-2 border-yellow-600">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
                  <div key={p}>
                      <span className="text-[8px] text-green-200/60 uppercase block mb-0.5 tracking-widest">{p}</span>
                      <span className="text-[10px] font-bold text-white">
                        {prayerTimes ? prayerTimes[p] : "--:--"}
                      </span>
                  </div>
              ))}
           </div>
           
           {/* Footer */}
           <div className="bg-[#0f281e] text-white/60 text-[8px] p-2 text-center uppercase tracking-widest border-t border-white/5">
              Wonder Sight Gallery • {locationName || "Locating..."}
           </div>
        </div>

        <button onClick={handleDownload} className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all active:scale-95 text-sm">
            <Download size={18} /> Save to Gallery
        </button>
      </div>
    </div>
  );
}