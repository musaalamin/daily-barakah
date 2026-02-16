'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Repeat, ChevronDown, AlignJustify, List, X, BookOpen } from 'lucide-react';
import { RECITERS } from '../data/quranData';

export default function QuranReader({ 
  activeSurah, ayahs, pages, surahList, currentPage, setCurrentPage, 
  activeReciter, onReciterChange, onBack, onSurahChange, audioState, isDark
}) {
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [viewMode, setViewMode] = useState('mushaf'); 
  
  // TRANSLATION POPUP STATE (Now stores Index for navigation)
  const [modalIndex, setModalIndex] = useState(null); 
  
  // GESTURE STATE
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const longPressTimer = useRef(null);
  const isScrolling = useRef(false);

  const { isPlaying, setRepeatMode, repeatMode, currentIndex, playAyah } = audioState;

  useEffect(() => {
    if (currentIndex !== null && ayahs[currentIndex]) {
      const p = ayahs[currentIndex].page;
      if (p !== currentPage) setCurrentPage(p);
    }
  }, [currentIndex]);

  // --- SMART NAVIGATION LOGIC ---
  const handleNextPage = () => {
    const lastPageOfSurah = ayahs[ayahs.length - 1]?.page;
    if (currentPage >= lastPageOfSurah) { 
        if (activeSurah.id < 114) {
            // Go to next Surah, Page 1
            onSurahChange(activeSurah.id + 1, null, true); 
        }
    } else { 
        setCurrentPage(p => p + 1); 
    }
  };

  const handlePrevPage = () => {
    const firstPageOfSurah = ayahs[0]?.page;
    
    if (currentPage <= firstPageOfSurah) { 
        if (activeSurah.id > 1) {
            // LOGIC FIX: Find previous Surah and go to its LAST PAGE
            const prevSurah = surahList.find(s => s.id === activeSurah.id - 1);
            if (prevSurah && prevSurah.pages) {
                // api.quran.com gives pages as [start, end]
                const lastPageOfPrev = prevSurah.pages[1]; 
                onSurahChange(activeSurah.id - 1, lastPageOfPrev);
            } else {
                // Fallback if data missing
                onSurahChange(activeSurah.id - 1);
            }
        } 
    } else { 
        setCurrentPage(p => p - 1); 
    }
  };

  // --- LONG PRESS INTERACTION ---
  const handleTouchStart = (ayahIndex) => {
      isScrolling.current = false;
      longPressTimer.current = setTimeout(() => {
          // Trigger Translation Modal
          setModalIndex(ayahIndex); // Set Index instead of Object
      }, 600); // 600ms hold time
  };

  const handleTouchEnd = (ayahIndex) => {
      // If timer exists, it means we let go BEFORE 600ms -> It's a TAP
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
          if (!isScrolling.current) {
              playAyah(ayahIndex); // Play Audio
          }
      }
  };

  const handleTouchMove = () => {
      // If user moves finger, cancel everything (it's a scroll)
      isScrolling.current = true;
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
      }
  };

  // Swipe for Page Turning
  const onSwipeStart = (e) => { touchStartX.current = e.targetTouches[0].clientX; touchEndX.current = null; };
  const onSwipeMove = (e) => { touchEndX.current = e.targetTouches[0].clientX; };
  const onSwipeEnd = () => {
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

  const BismillahHeader = () => {
      if (activeSurah.id === 9 || activeSurah.id === 1) return null; 
      const firstPageOfSurah = ayahs[0]?.page;
      if (currentPage !== firstPageOfSurah) return null;
      return (
          <div className="text-center mb-6 mt-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/27/Basmala.svg" alt="Bismillah" className={`h-12 mx-auto opacity-80 ${isDark ? 'invert' : ''}`}/>
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

      {/* CONTENT LAYER */}
      <div 
        className="flex-1 overflow-y-auto p-4 scroll-smooth relative"
        onTouchStart={onSwipeStart} onTouchMove={onSwipeMove} onTouchEnd={onSwipeEnd}
      >
         <BismillahHeader />

         {/* MUSHAF MODE */}
         {viewMode === 'mushaf' && (
             <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-[#FFFBF2] border-[#E8DCC2]'} p-6 rounded-lg shadow-sm border-2 mushaf-text min-h-[60vh] relative z-10 text-justify leading-[3.5rem]`}>
                 {(pages[currentPage] || []).map((ayah, i) => {
                     const globalIndex = ayahs.findIndex(a => a.id === ayah.id);
                     return (
                        <span 
                            key={i} 
                            // Touch Handlers for Long Press & Play
                            onMouseDown={() => handleTouchStart(globalIndex)}
                            onMouseUp={() => handleTouchEnd(globalIndex)}
                            onTouchStart={() => handleTouchStart(globalIndex)}
                            onTouchEnd={() => handleTouchEnd(globalIndex)}
                            onTouchMove={handleTouchMove}
                            className={`cursor-pointer rounded px-1 transition-colors duration-300 select-none ${currentIndex === globalIndex ? 'text-[#1B4332] bg-green-200 font-bold' : isDark ? 'text-gray-200 hover:bg-gray-800' : 'text-black hover:bg-[#F3EACF]'}`}
                        >
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
                        <div 
                            key={i} 
                            // Touch Handlers for Long Press & Play
                            onMouseDown={() => handleTouchStart(globalIndex)}
                            onMouseUp={() => handleTouchEnd(globalIndex)}
                            onTouchStart={() => handleTouchStart(globalIndex)}
                            onTouchEnd={() => handleTouchEnd(globalIndex)}
                            onTouchMove={handleTouchMove}
                            className={`p-4 rounded-xl border-b transition-all select-none ${currentIndex === globalIndex ? 'bg-green-50/10 border-green-500' : isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}
                        >
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

      {/* TRANSLATION MODAL OVERLAY (With Navigation) */}
      {modalIndex !== null && ayahs[modalIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setModalIndex(null)}>
              <div className="bg-[#FAF9F6] w-full max-w-md rounded-3xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setModalIndex(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-gray-100 rounded-full p-1"><X size={20} /></button>
                  
                  {/* Modal Header */}
                  <div className="text-center mb-6">
                      <span className="bg-[#1B4332] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                          {activeSurah.name_simple} • Ayah {ayahs[modalIndex].number}
                      </span>
                  </div>

                  {/* Modal Content */}
                  <div className="max-h-[50vh] overflow-y-auto space-y-6">
                      <p className="text-right font-serif text-3xl leading-loose dir-rtl text-gray-800 border-b border-gray-200 pb-4">
                          {ayahs[modalIndex].arabic}
                      </p>
                      
                      {/* English */}
                      <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">English</p>
                          <p className="text-gray-700 text-lg leading-relaxed">{ayahs[modalIndex].english}</p>
                      </div>
                      
                      {/* Hausa */}
                      {ayahs[modalIndex].hausa && (
                          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                              <p className="text-[10px] text-green-700 font-bold uppercase mb-1">Hausa</p>
                              <p className="text-green-900 text-md italic">{ayahs[modalIndex].hausa}</p>
                          </div>
                      )}
                  </div>

                  {/* Modal Navigation (Buttons) */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => modalIndex > 0 && setModalIndex(modalIndex - 1)}
                        className={`p-2 rounded-full bg-gray-100 ${modalIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-green-100 text-[#1B4332]'}`}
                      >
                          <ChevronLeft size={24}/>
                      </button>
                      <span className="text-xs font-bold text-gray-400">Navigate Verses</span>
                      <button 
                        onClick={() => modalIndex < ayahs.length - 1 && setModalIndex(modalIndex + 1)}
                        className={`p-2 rounded-full bg-gray-100 ${modalIndex === ayahs.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-green-100 text-[#1B4332]'}`}
                      >
                          <ChevronRight size={24}/>
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}