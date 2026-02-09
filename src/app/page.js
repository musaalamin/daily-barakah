// src/app/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Moon, Sun, Play, Pause, ChevronLeft, Search, Calendar, 
  CheckSquare, Heart, Share2, Menu, Mic, Volume2, Type, Repeat, 
  RefreshCw, X, Sparkles, Download, Mail, Clock, Gauge, Settings, 
  Bookmark, Book, Mic2, Radio, ArrowLeft
} from 'lucide-react';
import { toPng } from 'html-to-image';

// IMPORTS FROM NEW FILES
import { RECITERS, DUA_CATEGORIES, DAILY_INSPIRATIONS } from '../data/quranData';
import Shamzan from '../components/Shamzan';
import { useGaplessAudio, GlobalPlayerBar } from '../components/AudioPlayer';

export default function DailyBarakahApp() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('morning_evening'); 
  const [showShamzan, setShowShamzan] = useState(false);

  // Data
  const [surahList, setSurahList] = useState([]);
  const [activeSurah, setActiveSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dates & Times
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayerName, setNextPrayerName] = useState("Loading");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [ramadanStatus, setRamadanStatus] = useState("Loading...");
  
  // Settings
  const [arabicFontSize, setArabicFontSize] = useState(32); 
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  const [showWelcome, setShowWelcome] = useState(true);
  const [dailyQuote, setDailyQuote] = useState(DAILY_INSPIRATIONS[0]);
  const hiddenDownloadRef = useRef(null); 

  // Audio State
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]); // Default: Hudaify
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // User Data
  const [lastRead, setLastRead] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [isMushafMode, setIsMushafMode] = useState(false);
  const [revealedAyah, setRevealedAyah] = useState(null);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [planner, setPlanner] = useState({ fasting: false, quran: false, taraweeh: false, dhikr: false, charity: false });

  // --- AUDIO HOOK INTEGRATION ---
  const { playAyah, pause, resume, setSpeed } = useGaplessAudio(
    activeReciter, 
    ayahs, 
    playbackRate,
    (index) => {
        // Auto-scroll on Ayah Change
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
  };

  const togglePlayPause = () => {
      if(isPlaying) {
          pause();
          setIsPlaying(false);
      } else {
          resume();
          setIsPlaying(true);
      }
  };

  // --- INIT EFFECT ---
  useEffect(() => {
    // 1. Daily Quote
    setDailyQuote(DAILY_INSPIRATIONS[new Date().getDate() % DAILY_INSPIRATIONS.length]);
    setGregorianDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    
    // 2. Load LocalStorage
    const savedLastRead = localStorage.getItem('barakah_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));
    const savedBookmarks = localStorage.getItem('barakah_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // 3. Ramadan Countdown
    const today = new Date();
    const ramadanStart = new Date('2026-02-18'); 
    const diffTime = ramadanStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 0) setRamadanStatus(`${diffDays} Days to Ramadan`);
    else if (diffDays <= 0 && diffDays > -30) setRamadanStatus(`Ramadan Day ${Math.abs(diffDays) + 1}`);
    else setRamadanStatus("Daily Barakah");

    // 4. Fetch Surah List
    fetch('https://api.quran.com/api/v4/chapters?language=en').then(res => res.json()).then(data => setSurahList(data.chapters || []));

    // 5. Prayer Times (Geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=3`);
          const data = await res.json();
          setPrayerTimes(data.data.timings);
          const h = data.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
          updateNextPrayer(data.data.timings);
        } catch (e) { console.error(e); }
      });
    }
  }, []);

  const updateNextPrayer = (timings) => {
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

  // --- ACTIONS ---
  const openSurah = async (surah) => {
    setActiveSurah(surah);
    setCurrentView('quran-reader');
    setLoading(true);
    try {
      // Fetch Ayahs
      const quranRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?language=en&words=true&translations=20&per_page=300&fields=text_uthmani`);
      const quranData = await quranRes.json();
      // Fetch Hausa Translation
      const hausaRes = await fetch(`https://quranenc.com/api/v1/translation/sura/hausa_gummi/${surah.id}`);
      const hausaData = await hausaRes.json();
      
      setAyahs(quranData.verses.map((verse, index) => ({
        id: verse.id, number: verse.verse_number, arabic: verse.text_uthmani,
        english: verse.translations[0]?.text.replace(/<[^>]*>?/gm, '') || "...",
        hausa: hausaData.result[index]?.translation || "..."
      })));
      
      // Save Status
      const data = { surahName: surah.name_simple, surahId: surah.id, ayah: 1, timestamp: Date.now() };
      setLastRead(data);
      localStorage.setItem('barakah_last_read', JSON.stringify(data));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleShamzanIdentify = async (surahId, ayahNum) => {
      setShowShamzan(false);
      const surah = surahList.find(s => s.id === surahId);
      if(surah) {
          await openSurah(surah);
          setTimeout(() => {
              const el = document.getElementById(`ayah-${ayahNum - 1}`);
              if(el) el.scrollIntoView({behavior: 'smooth', block: 'center'});
              setRevealedAyah(ayahNum - 1);
          }, 1500);
      }
  };

  const toggleBookmark = (surah, ayah) => {
    const newBookmark = { id: `${surah.id}:${ayah.number}`, surahName: surah.name_simple, ayahNum: ayah.number, arabic: ayah.arabic };
    let newBookmarks = [...bookmarks];
    const exists = newBookmarks.find(b => b.id === newBookmark.id);
    if (exists) newBookmarks = newBookmarks.filter(b => b.id !== newBookmark.id);
    else newBookmarks = [newBookmark, ...newBookmarks];
    setBookmarks(newBookmarks);
    localStorage.setItem('barakah_bookmarks', JSON.stringify(newBookmarks));
  };

  // --- RENDERING SUB-COMPONENTS ---
  const MobileCardContent = () => (
    <>
      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1"><Calendar size={12}/> <span>{gregorianDate}</span></div>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full"><Clock size={12}/> <span>{ramadanStatus}</span></div>
      </div>
      <div className="mb-8">
          <div className="w-12 h-12 bg-[#1B4332] text-white rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={20} /></div>
          <p className="font-serif text-3xl text-[#1B4332] leading-loose mb-6 dir-rtl">{dailyQuote.arabic}</p>
          <p className="text-gray-600 font-medium text-sm italic mb-4">"{dailyQuote.english}"</p>
          <span className="inline-block bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-bold">{dailyQuote.ref}</span>
      </div>
    </>
  );

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* GLOBAL PLAYER (From Component) */}
      <GlobalPlayerBar 
         isPlaying={isPlaying} 
         reciterName={activeReciter.name.split(' ')[0]} 
         onClick={() => setCurrentView('quran-reader')}
         onTogglePlay={togglePlayPause}
      />

      {/* SHAMZAN OVERLAY */}
      {showShamzan && <Shamzan onIdentify={handleShamzanIdentify} onClose={() => setShowShamzan(false)} />}

      {/* SETTINGS MODAL */}
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
                </div>
            </div>
        </div>
      )}

      {/* VIEW: HOME */}
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
             </div>
          </div>

          {/* SHAMZAN BUTTON */}
          <button onClick={() => setShowShamzan(true)} className="w-full bg-gradient-to-r from-green-600 to-[#1B4332] text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform group">
             <div className="bg-white/20 p-2 rounded-full group-hover:animate-pulse"><Radio size={24} /></div>
             <div className="text-left"><p className="font-bold text-lg">Shamzan</p><p className="text-xs text-green-100">Identify Reciter & Surah</p></div>
          </button>

          {/* CONTINUE READING */}
          {lastRead && (
             <div onClick={() => { const surah = surahList.find(s => s.id === lastRead.surahId); if(surah) openSurah(surah); }} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between cursor-pointer">
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

      {/* VIEW: QURAN LIST */}
      {currentView === 'quran-list' && (
        <div className="pb-24 pt-6 px-4">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Surahs</h2>
            <div className="space-y-2">
            {surahList.map(surah => (
                <div key={surah.id} onClick={() => openSurah(surah)} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 cursor-pointer">
                <div className="flex items-center gap-4"><div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-[#1B4332] text-sm">{surah.id}</div><h3 className="font-bold text-gray-900">{surah.name_simple}</h3></div>
                <span className="font-serif text-xl text-gray-400">{surah.name_arabic}</span>
                </div>
            ))}
            </div>
        </div>
      )}

      {/* VIEW: READER */}
      {currentView === 'quran-reader' && (
        <div className="pb-32 bg-[#FAF9F6]">
            <div className="sticky top-0 bg-[#1B4332] text-white p-4 flex items-center justify-between z-20 shadow-md">
                <button onClick={() => setCurrentView('quran-list')} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                <div className="text-center"><h2 className="font-bold text-lg">{activeSurah?.name_simple}</h2></div>
                <button onClick={() => setIsMushafMode(!isMushafMode)} className="text-xs bg-white/20 px-3 py-1 rounded-full">{isMushafMode ? "Verse" : "Mushaf"}</button>
            </div>
            
            <div className="p-6">
                {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
                   isMushafMode ? (
                      // MUSHAF MODE
                      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-justify leading-[2.8] dir-rtl font-serif" style={{fontSize: arabicFontSize}}>
                         {ayahs.map((ayah, i) => (
                             <span key={i} onClick={() => handlePlaySurah(i)} className={`hover:bg-green-100 cursor-pointer ${currentIndex === i ? 'text-[#1B4332] font-bold' : ''}`}>
                                 {ayah.arabic} <span className="inline-block text-xs border rounded-full w-5 h-5 text-center leading-4 mx-1">{ayah.number}</span>
                             </span>
                         ))}
                      </div>
                   ) : (
                      // LIST MODE
                      <div className="space-y-6">
                          {ayahs.map((ayah, i) => (
                              <div key={i} id={`ayah-${i}`} className={`text-center p-4 rounded-xl transition-all ${currentIndex === i ? 'bg-green-50 scale-105 shadow-sm' : ''}`}>
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs bg-gray-200 px-2 rounded-full">{ayah.number}</span>
                                      <button onClick={() => toggleBookmark(activeSurah, ayah)}><Bookmark size={16} className={bookmarks.some(b => b.id === `${activeSurah.id}:${ayah.number}`) ? "fill-green-700 text-green-700" : "text-gray-300"} /></button>
                                  </div>
                                  <p className="font-serif text-2xl mb-4 leading-loose dir-rtl" style={{fontSize: arabicFontSize}}>{ayah.arabic}</p>
                                  <p className="text-sm text-gray-600">{ayah.english}</p>
                              </div>
                          ))}
                      </div>
                   )
                )}
            </div>
            
            {/* Player Controls */}
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t p-4 z-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">{activeReciter.name}</span>
                <button onClick={togglePlayPause} className="w-12 h-12 bg-[#1B4332] rounded-full text-white flex items-center justify-center shadow-lg">{isPlaying ? <Pause /> : <Play />}</button>
                <button onClick={() => setSpeed(playbackRate === 1 ? 1.5 : 1)} className="text-xs bg-gray-100 px-2 py-1 rounded">{playbackRate}x</button>
            </div>
        </div>
      )}

      {/* VIEW: DUAS */}
      {currentView === 'duas' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Fortress of the Muslim</h2>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {Object.keys(DUA_CATEGORIES).map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeCategory === cat ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-gray-600'}`}>{DUA_CATEGORIES[cat].title}</button>
                ))}
            </div>
            <div className="space-y-4">
                {DUA_CATEGORIES[activeCategory].duas.map((dua, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-green-700 uppercase mb-2">{dua.title}</h3>
                        <p className="text-right font-serif text-xl mb-3 leading-loose">{dua.arabic}</p>
                        <p className="text-sm text-gray-500 italic">"{dua.meaning}"</p>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      {currentView !== 'quran-reader' && (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 py-3 px-4 flex justify-between items-center z-50">
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center ${currentView === 'home' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Menu size={20} /><span className="text-[10px]">Home</span></button>
          <button onClick={() => setCurrentView('quran-list')} className={`flex flex-col items-center ${currentView === 'quran-list' ? 'text-[#1B4332]' : 'text-gray-400'}`}><BookOpen size={20} /><span className="text-[10px]">Quran</span></button>
          <button onClick={() => setCurrentView('duas')} className={`flex flex-col items-center ${currentView === 'duas' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Heart size={20} /><span className="text-[10px]">Duas</span></button>
        </div>
      )}
    </div>
  );
}