'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Repeat, ChevronDown, AlignJustify, List } from 'lucide-react';
import { RECITERS } from '../data/quranData';

export default function QuranReader({ 
  activeSurah, ayahs, pages, currentPage, setCurrentPage, 
  activeReciter, onReciterChange, onBack, onSurahChange, audioState, isDark
}) {
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [viewMode, setViewMode] = useState('mushaf'); 
  
  // SWIPE STATE
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  
  const { isPlaying, setRepeatMode, repeatMode, currentIndex, playAyah } = audioState;

  useEffect(() => {
    if (currentIndex !== null && ayahs[currentIndex]) {
      const p = ayahs[currentIndex].page;
      if (p !== currentPage) setCurrentPage(p);
    }
  }, [currentIndex]);

  const handleNextPage = () => {
    const lastPageOfSurah = ayahs[ayahs.length - 1]?.page;
    if (currentPage >= lastPageOfSurah) { if (activeSurah.id < 114) onSurahChange(activeSurah.id + 1); } 
    else { setCurrentPage(p => p + 1); }
  };

  const handlePrevPage = () => {
    const firstPageOfSurah = ayahs[0]?.page;
    if (currentPage <= firstPageOfSurah) { if (activeSurah.id > 1) onSurahChange(activeSurah.id - 1); } 
    else { setCurrentPage(p => p - 1); }
  };

  // SWIPE LOGIC
  const onTouchStart = (e) => { touchStartX.current = e.targetTouches[0].clientX; touchEndX.current = null; };
  const onTouchMove = (e) => { touchEndX.current = e.targetTouches[0].clientX; };
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) handleNextPage();
    else if (distance < -50) handlePrevPage();
  };

  const cycleRepeat = () => {
    const modes = ['off', 'ayah', 'page', 'surah'];
    const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(next);
  };

  // BISMILLAH HEADER COMPONENT
  const BismillahHeader = () => {
      // Surah 9 (At-Tawbah) does not have Bismillah
      if (activeSurah.id === 9 || activeSurah.id === 1) return null; 
      
      // Only show on the FIRST page of the Surah
      const firstPageOfSurah = ayahs[0]?.page;
      if (currentPage !== firstPageOfSurah) return null;

      return (
          <div className="text-center mb-6 mt-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/27/Basmala.svg" 
                alt="Bismillah" 
                className={`h-12 mx-auto opacity-80 ${isDark ? 'invert' : ''}`}
              />
          </div>
      );
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-black text-white' : 'bg-[#FAF9F6] text-gray-900'}`}>
      
      {/* HEADER */}
      <div className={`${isDark ? 'bg-gray-900 border-b border-gray-800' : 'bg-[#1B4332]'} text-white pt-12 pb-4 px-4 shadow-lg shrink-0 z-20`}>
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
               <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ChevronLeft size={20}/></button>
               <button onClick={() => setViewMode(viewMode === 'mushaf' ? 'list' : 'mushaf')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 flex items-center gap-2 text-xs font-bold">
                 {viewMode === 'mushaf' ? <List size={18}/> : <AlignJustify size={18}/>}
                 {viewMode === 'mushaf' ? "Trans" : "Mushaf"}
               </button>
           </div>
           <div className="flex flex-col items-end">
              <h2 className="font-bold text-xl font-serif">{activeSurah.name_simple}</h2>
              <div className="relative mt-1">
                  <button onClick={() => setShowReciterMenu(!showReciterMenu)} className="text-[10px] bg-black/20 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black/40">
                    {activeReciter.name.split(' ')[0]} <ChevronDown size={10} />
                  </button>
                  {showReciterMenu && (
                    <div className="absolute top-8 right-0 bg-white text-black rounded-xl shadow-xl py-2 w-48 max-h-60 overflow-y-auto z-50 border border-gray-100">
                        {RECITERS.map(r => (
                            <button key={r.id} onClick={() => { onReciterChange(r); setShowReciterMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-green-50 ${activeReciter.id === r.id ? 'text-green-700 font-bold' : 'text-gray-600'}`}>{r.name}</button>
                        ))}
                    </div>
                  )}
              </div>
           </div>
        </div>
      </div>

      {/* CONTENT */}
      <div 
        className="flex-1 overflow-y-auto p-4 scroll-smooth relative"
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
         <BismillahHeader />

         {/* MUSHAF MODE */}
         {viewMode === 'mushaf' && (
             <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-[#FFFBF2] border-[#E8DCC2]'} p-6 rounded-lg shadow-sm border-2 mushaf-text min-h-[60vh] relative z-10 text-justify leading-[3.5rem]`}>
                 {(pages[currentPage] || []).map((ayah, i) => {
                     const globalIndex = ayahs.findIndex(a => a.id === ayah.id);
                     return (
                        <span key={i} onClick={() => playAyah(globalIndex)} className={`cursor-pointer rounded px-1 transition-colors duration-300 ${currentIndex === globalIndex ? 'text-[#1B4332] bg-green-200 font-bold' : isDark ? 'text-gray-200 hover:bg-gray-800' : 'text-black hover:bg-[#F3EACF]'}`}>
                            {ayah.arabic} 
                            <span className={`inline-flex items-center justify-center w-6 h-6 border ${isDark ? 'border-gray-500' : 'border-[#1B4332]'} rounded-full text-[10px] mx-1 select-none font-sans`}>{ayah.number}</span>
                        </span>
                     );
                 })}
             </div>
         )}

         {/* LIST MODE */}
         {viewMode === 'list' && (
             <div className="space-y-4 pb-20">
                 {(pages[currentPage] || []).map((ayah, i) => {
                     const globalIndex = ayahs.findIndex(a => a.id === ayah.id);
                     return (
                        <div key={i} onClick={() => playAyah(globalIndex)} className={`p-4 rounded-xl border-b transition-all ${currentIndex === globalIndex ? 'bg-green-50/10 border-green-500' : isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{activeSurah.id}:{ayah.number}</span>
                            </div>
                            <p className={`text-right font-serif text-2xl mb-4 leading-loose dir-rtl ${isDark ? 'text-white' : 'text-black'}`}>{ayah.arabic}</p>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{ayah.english}</p>
                            <p className="text-xs text-green-600 italic">{ayah.hausa}</p>
                        </div>
                     );
                 })}
             </div>
         )}
      </div>

      {/* FOOTER */}
      <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t p-4 pb-8 shrink-0 flex flex-col gap-3 shadow-lg z-30`}>
          <div className="flex justify-between items-center px-2">
              <button onClick={handlePrevPage} className="opacity-60 hover:opacity-100"><ChevronLeft /></button>
              <span className="text-xs font-bold opacity-50">Page {currentPage}</span>
              <button onClick={handleNextPage} className="opacity-60 hover:opacity-100"><ChevronRight /></button>
          </div>
          <div className={`flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} p-2 rounded-2xl`}>
              <button onClick={cycleRepeat} className={`p-2 rounded-full text-xs font-bold flex items-center gap-1 ${repeatMode !== 'off' ? 'bg-green-100 text-green-700' : 'opacity-50'}`}>
                <Repeat size={14} /> <span className="uppercase">{repeatMode}</span>
              </button>
          </div>
      </div>
    </div>
  );
}