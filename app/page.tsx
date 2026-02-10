'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Moon, Sun, Play, Pause, ChevronLeft, Search, Calendar, 
  CheckSquare, Heart, Share2, Menu, Mic, Volume2, Type, Repeat, 
  RefreshCw, X, Sparkles, Download, Mail, Clock, Gauge, Settings, 
  Bookmark, Book, Mic2, Radio, ArrowLeft, MapPin
} from 'lucide-react';

// --- IMPORTS FROM YOUR NEW FILES ---
import { RECITERS, DUA_CATEGORIES, DAILY_INSPIRATIONS } from '../data/quranData';
import Shamzan from '../components/Shamzan';
import { useGaplessAudio, GlobalPlayerBar } from '../components/AudioPlayer';

export default function DailyBarakahApp() {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('morning_evening'); 
  const [showShamzan, setShowShamzan] = useState(false);

  // Data State
  const [surahList, setSurahList] = useState<any[]>([]);
  const [activeSurah, setActiveSurah] = useState<any>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Date & Time State
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [nextPrayerName, setNextPrayerName] = useState("Loading");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [ramadanStatus, setRamadanStatus] = useState("Loading...");
  
  // Settings State
  const [arabicFontSize, setArabicFontSize] = useState(32); 
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  const [dailyQuote, setDailyQuote] = useState(DAILY_INSPIRATIONS[0]);

  // Audio State (Managed by useGaplessAudio hook)
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // User Data & Persistence
  const [lastRead, setLastRead] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isMushafMode, setIsMushafMode] = useState(false);
  const [revealedAyah, setRevealedAyah] = useState<number | null>(null);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [planner, setPlanner] = useState({ fasting: false, quran: false, taraweeh: false, dhikr: false, charity: false });

  // --- AUDIO HOOK INTEGRATION ---
  const { playAyah, pause, resume, setSpeed } = useGaplessAudio(
    activeReciter, 
    ayahs, 
    playbackRate,
    (index: number) => {
        setCurrentIndex(index);
        if(currentView === 'quran-reader') {
             document.getElementById(`ayah-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  );

  const handlePlaySurah = (startIndex = 0) => {
      if(!activeSurah) return;
      setIsPlaying(true);
      playAyah(activeSurah.id, startIndex);
      setCurrentIndex(startIndex);
  };

  const togglePlayPause = () => {
      if(isPlaying) {
          pause();
          setIsPlaying(false);
      } else {
          if (currentIndex !== null && ayahs.length > 0) {
              resume();
          } else if (activeSurah) {
              handlePlaySurah(0);
          }
          setIsPlaying(true);
      }
  };

  // --- INITIALIZATION ---
  useEffect(() => {
    const dayIndex = new Date().getDate() % DAILY_INSPIRATIONS.length;
    setDailyQuote(DAILY_INSPIRATIONS[dayIndex]);
    setGregorianDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    
    const savedLastRead = localStorage.getItem('barakah_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));
    const savedBookmarks = localStorage.getItem('barakah_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const today = new Date();
    const ramadanStart = new Date('2026-02-18'); 
    const diffTime = ramadanStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 0) setRamadanStatus(`${diffDays} Days to Ramadan`);
    else if (diffDays <= 0 && diffDays > -30) setRamadanStatus(`Ramadan Day ${Math.abs(diffDays) + 1}`);
    else setRamadanStatus("Daily Barakah");

    fetch('https://api.quran.com/api/v4/chapters?language=en')
      .then(res => res.json())
      .then(data => setSurahList(data.chapters || []));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=3`);
          const data = await res.json();
          setPrayerTimes(data.data.timings);
          const h = data.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
          updateNextPrayer(data.data.timings);
        } catch (e) { console.error("Location error", e); }
      });
    }
  }, []);

  const updateNextPrayer = (timings: any) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let found = false;
    for (const prayer of prayerOrder) {
        const [h, m] = timings[prayer].split(':');
        if ((parseInt(h) * 60 + parseInt(m)) > currentTime) {
            setNextPrayerName(prayer); setNextPrayerTime(timings[prayer]); found = true; break;
        }
    }
    if (!found) { setNextPrayerName("Fajr"); setNextPrayerTime(timings["Fajr"]); }
  };

  // --- NAVIGATION & LOGIC ---
  const openSurah = async (surah: any) => {
    setActiveSurah(surah);
    setCurrentView('quran-reader');
    setLoading(true);
    try {
      const quranRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?language=en&words=true&translations=20&per_page=300&fields=text_uthmani`);
      const quranData = await quranRes.json();
      const hausaRes = await fetch(`https://quranenc.com/api/v1/translation/sura/hausa_gummi/${surah.id}`);
      const hausaData = await hausaRes.json();
      
      setAyahs(quranData.verses.map((verse: any, index: number) => ({
        id: verse.id, number: verse.verse_number, arabic: verse.text_uthmani,
        english: verse.translations[0]?.text.replace(/<[^>]*>?/gm, '') || "...",
        hausa: hausaData.result[index]?.translation || "..."
      })));
      
      const data = { surahName: surah.name_simple, surahId: surah.id, ayah: 1, timestamp: Date.now() };
      setLastRead(data);
      localStorage.setItem('barakah_last_read', JSON.stringify(data));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleShamzanIdentify = async (surahId: number, ayahNum: number) => {
      setShowShamzan(false);
      const surah = surahList.find(s => s.id === surahId);
      if(surah) {
          await openSurah(surah);
          setTimeout(() => {
              const targetIndex = ayahNum - 1;
              const el = document.getElementById(`ayah-${targetIndex}`);
              if(el) el.scrollIntoView({behavior: 'smooth', block: 'center'});
              setRevealedAyah(targetIndex);
          }, 1500);
      }
  };

  const toggleBookmark = (surah: any, ayah: any) => {
    const newBookmark = { id: `${surah.id}:${ayah.number}`, surahName: surah.name_simple, ayahNum: ayah.number, arabic: ayah.arabic };
    let newBookmarks = [...bookmarks];
    const exists = newBookmarks.find(b => b.id === newBookmark.id);
    if (exists) newBookmarks = newBookmarks.filter(b => b.id !== newBookmark.id);
    else newBookmarks = [newBookmark, ...newBookmarks];
    setBookmarks(newBookmarks);
    localStorage.setItem('barakah_bookmarks', JSON.stringify(newBookmarks));
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      <GlobalPlayerBar 
         isPlaying={isPlaying} 
         reciterName={activeReciter.name.split(' ')[0]} 
         onClick={() => setCurrentView('quran-reader')}
         onTogglePlay={togglePlayPause}
      />

      {showShamzan && (
         <Shamzan 
            onIdentify={handleShamzanIdentify} 
            onClose={() => setShowShamzan(false)} 
         />
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-10 shadow-2xl h-[70vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2"><Settings size={20} /> Preferences</h3>
                    <button onClick={() => setShowSettingsModal(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Reciter</p>
                        <div className="grid grid-cols-2 gap-2">
                            {RECITERS.map(r => (
                                <button key={r.id} onClick={() => setActiveReciter(r)} className={`text-left px-3 py-2 text-xs rounded-lg border font-medium ${activeReciter.id === r.id ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600'}`}>{r.name}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Font Size</p>
                        <input type="range" min="20" max="60" value={arabicFontSize} onChange={(e) => setArabicFontSize(Number(e.target.value))} className="w-full accent-[#1B4332]" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {currentView === 'home' && (
        <div className="space-y-6 pb-24 p-6">
          <header className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-[#1B4332] font-serif">Daily Barakah</h1><p className="text-xs text-gray-500">{hijriDate} • Gusau</p></div>
            <button onClick={() => setShowSettingsModal(true)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Settings size={20} /></button>
          </header>
          
          <div className="bg-[#1B4332] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-10"><Moon size={120} /></div>
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div><p className="text-[#95D5B2] text-xs font-bold uppercase mb-1">Next Prayer</p><h2 className="text-4xl font-bold">{nextPrayerName} <span className="text-xl font-normal text-white/70">{nextPrayerTime}</span></h2></div>
                    <div className="bg-white/10 p-2 rounded-lg text-center"><p className="text-xs text-[#95D5B2] uppercase font-bold">Status</p><p className="text-lg font-bold leading-tight">{ramadanStatus}</p></div>
                </div>
                <div className="flex justify-between text-center border-t border-white/20 pt-4">
                  {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (<div key={p} className="flex flex-col"><span className="text-[10px] text-[#95D5B2] uppercase">{p}</span><span className="font-bold text-sm">{prayerTimes ? prayerTimes[p] : "--:--"}</span></div>))}
                </div>
             </div>
          </div>

          <button onClick={() => setShowShamzan(true)} className="w-full bg-gradient-to-r from-green-600 to-[#1B4332] text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform group">
             <div className="bg-white/20 p-2 rounded-full group-hover:animate-pulse"><Radio size={24} /></div>
             <div className="text-left"><p className="font-bold text-lg">Shamzan</p><p className="text-xs text-green-100">Identify Reciter & Surah</p></div>
          </button>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Sparkles size={16} className="mx-auto text-green-600 mb-2"/>
              <p className="font-serif text-xl text-[#1B4332] mb-2 dir-rtl">{dailyQuote.arabic}</p>
              <p className="text-xs text-gray-500 italic">"{dailyQuote.english}"</p>
          </div>

          {lastRead && (
             <div onClick={() => { const surah = surahList.find(s => s.id === lastRead.surahId); if(surah) openSurah(surah); }} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between cursor-pointer hover:bg-orange-50">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Book size={20} /></div>
                     <div><p className="text-xs text-gray-400 font-bold uppercase">Continue</p><p className="font-bold text-gray-800">{lastRead.surahName}</p></div>
                 </div>
                 <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Ayah {lastRead.ayah}</div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setCurrentView('quran-list')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"><BookOpen size={24} /><span className="font-bold text-gray-800">Quran</span></button>
            <button onClick={() => setCurrentView('duas')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"><Heart size={24} /><span className="font-bold text-gray-800">Duas</span></button>
          </div>
        </div>
      )}

      {currentView === 'quran-list' && (
        <div className="pb-24 pt-6 px-4">
            <div className="sticky top-0 bg-[#FDFCF8] z-10 pb-4">
               <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Surahs</h2>
               <div className="relative">
                  <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input type="text" placeholder="Search Surah..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-12 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
               </div>
            </div>
            <div className="space-y-2">
            {surahList.filter(s => s.name_simple.toLowerCase().includes(searchQuery)).map(surah => (
                <div key={surah.id} onClick={() => openSurah(surah)} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 cursor-pointer hover:border-green-200">
                <div className="flex items-center gap-4"><div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-[#1B4332] text-sm">{surah.id}</div><h3 className="font-bold text-gray-900">{surah.name_simple}</h3></div>
                <span className="font-serif text-xl text-gray-400">{surah.name_arabic}</span>
                </div>
            ))}
            </div>
        </div>
      )}

      {currentView === 'bookmarks' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Saved Ayahs</h2>
            {bookmarks.length === 0 ? <p className="text-gray-400 text-center mt-10">No bookmarks yet.</p> : (
                <div className="space-y-3">
                    {bookmarks.map((b, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer" onClick={() => { const surah = surahList.find(s => s.name_simple === b.surahName); if(surah) { openSurah(surah); setTimeout(() => document.getElementById(`ayah-${b.ayahNum - 1}`)?.scrollIntoView({block:'center'}), 1000); } }}>
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-[#1B4332]">{b.surahName} <span className="text-gray-500 text-sm font-normal">Ayah {b.ayahNum}</span></h3>
                                <button onClick={(e) => { e.stopPropagation(); const newB = bookmarks.filter(x => x.id !== b.id); setBookmarks(newB); localStorage.setItem('barakah_bookmarks', JSON.stringify(newB)); }}><X size={16} className="text-gray-400" /></button>
                            </div>
                            <p className="font-serif text-right text-gray-800">{b.arabic}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {currentView === 'quran-reader' && (
        <div className="pb-32 bg-[#FAF9F6]">
            <div className="sticky top-0 bg-[#1B4332] text-white p-4 flex items-center justify-between z-20 shadow-md">
                <button onClick={() => setCurrentView('quran-list')} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                <div className="text-center"><h2 className="font-bold text-lg">{activeSurah?.name_simple}</h2></div>
                <button onClick={() => setIsMushafMode(!isMushafMode)} className="text-xs bg-white/20 px-3 py-1 rounded-full border border-white/20">{isMushafMode ? "Verse" : "Mushaf"}</button>
            </div>
            
            <div className="p-6">
                {loading ? <div className="text-center py-20 text-gray-400">Loading Surah...</div> : (
                   isMushafMode ? (
                      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-justify leading-[2.8] dir-rtl font-serif text-gray-900" style={{fontSize: arabicFontSize + 'px'}}>
                         {activeSurah.id !== 1 && activeSurah.id !== 9 && <div className="w-full text-center mb-6 text-[#1B4332]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>}
                         {ayahs.map((ayah, i) => (
                             <span key={i} onClick={() => handlePlaySurah(i)} className={`hover:bg-green-100 cursor-pointer rounded px-1 ${currentIndex === i ? 'text-[#1B4332] font-bold bg-green-50' : ''}`}>
                                 {ayah.arabic} <span className="inline-block text-xs border rounded-full w-5 h-5 text-center leading-4 mx-1">{ayah.number}</span>
                             </span>
                         ))}
                      </div>
                   ) : (
                      <div className="space-y-6">
                          {activeSurah.id !== 1 && activeSurah.id !== 9 && <div className="text-center py-4"><p className="font-serif text-3xl text-[#1B4332]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p></div>}
                          {ayahs.map((ayah, i) => (
                              <div key={i} id={`ayah-${i}`} onClick={() => setRevealedAyah(revealedAyah === i ? null : i)} className={`text-center p-4 rounded-xl transition-all cursor-pointer ${currentIndex === i ? 'bg-green-50 scale-105 shadow-sm ring-1 ring-[#1B4332]' : ''}`}>
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs bg-gray-200 px-2 rounded-full text-gray-600">{ayah.number}</span>
                                      <button onClick={(e) => { e.stopPropagation(); toggleBookmark(activeSurah, ayah); }}><Bookmark size={16} className={bookmarks.some(b => b.id === `${activeSurah.id}:${ayah.number}`) ? "fill-green-700 text-green-700" : "text-gray-300"} /></button>
                                  </div>
                                  <p className="font-serif text-2xl mb-4 leading-loose dir-rtl text-gray-900" style={{fontSize: arabicFontSize + 'px'}}>{ayah.arabic}</p>
                                  {(revealedAyah === i || currentIndex === i) && (
                                      <div className="animate-in fade-in slide-in-from-top-2">
                                        <p className="text-sm text-gray-700 mb-2">{ayah.english}</p>
                                        <p className="text-xs text-green-600 italic">{ayah.hausa}</p>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                   )
                )}
            </div>
            
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t p-4 z-50 flex items-center justify-between pb-8">
                <span className="text-xs font-bold text-gray-500">{activeReciter.name.split(' ')[0]}</span>
                <button onClick={togglePlayPause} className="w-12 h-12 bg-[#1B4332] rounded-full text-white flex items-center justify-center shadow-lg active:scale-95">{isPlaying ? <Pause /> : <Play />}</button>
                <button onClick={() => setSpeed(playbackRate === 1 ? 1.5 : 1)} className="text-xs bg-gray-100 px-2 py-1 rounded">{playbackRate}x</button>
            </div>
        </div>
      )}

      {currentView === 'duas' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Fortress of the Muslim</h2>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
                {Object.keys(DUA_CATEGORIES).map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {DUA_CATEGORIES[cat as keyof typeof DUA_CATEGORIES].title}
                    </button>
                ))}
            </div>
            <div className="space-y-4">
                {DUA_CATEGORIES[activeCategory as keyof typeof DUA_CATEGORIES].duas.map((dua: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-green-700 uppercase mb-2">{dua.title}</h3>
                        <p className="text-right font-serif text-xl mb-3 leading-loose" style={{fontSize: arabicFontSize + 'px'}}>{dua.arabic}</p>
                        <p className="text-sm text-gray-500 italic">"{dua.meaning}"</p>
                    </div>
                ))}
            </div>
        </div>
      )}
      
      {currentView === 'tasbih' && (
        <div className="pb-24 pt-10 px-6 min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6]">
            <h2 className="text-3xl font-bold text-[#1B4332] mb-2 font-serif">Digital Tasbih</h2>
            <div onClick={() => { setTasbihCount(c => c + 1); if (navigator.vibrate) navigator.vibrate(40); }} className="w-64 h-64 rounded-full bg-[#1B4332] shadow-2xl flex items-center justify-center border-8 border-[#D8F3DC] cursor-pointer active:scale-95 transition-transform select-none mb-10"><span className="text-7xl font-bold text-white font-mono">{tasbihCount}</span></div>
            <button onClick={() => setTasbihCount(0)} className="flex items-center gap-2 text-gray-400"><RefreshCw size={20} /> Reset</button>
        </div>
      )}

      {currentView !== 'quran-reader' && (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 py-3 px-4 flex justify-between items-center z-50">
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Menu size={20} /><span className="text-[10px] font-bold">Home</span></button>
          <button onClick={() => setCurrentView('quran-list')} className={`flex flex-col items-center gap-1 ${currentView === 'quran-list' ? 'text-[#1B4332]' : 'text-gray-400'}`}><BookOpen size={20} /><span className="text-[10px] font-bold">Quran</span></button>
          <button onClick={() => setCurrentView('bookmarks')} className={`flex flex-col items-center gap-1 ${currentView === 'bookmarks' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Bookmark size={20} /><span className="text-[10px] font-bold">Saved</span></button>
          <button onClick={() => setCurrentView('tasbih')} className={`flex flex-col items-center gap-1 ${currentView === 'tasbih' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Repeat size={20} /><span className="text-[10px] font-bold">Tasbih</span></button>
          <button onClick={() => setCurrentView('duas')} className={`flex flex-col items-center gap-1 ${currentView === 'duas' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Heart size={20} /><span className="text-[10px] font-bold">Duas</span></button>
        </div>
      )}
    </div>
  );
}