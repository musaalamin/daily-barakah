'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Moon, Sun, Heart, Menu, Search, Clock, 
  Sparkles, Download, Bookmark, Repeat, Radio, Smile, CloudRain, Zap, Coffee,
  CheckSquare, CheckCircle, RefreshCw, X, Gift, MessageCircle, History, Smartphone, Globe
} from 'lucide-react';

import { RECITERS, DUA_CATEGORIES, DAILY_INSPIRATIONS, MOOD_CONTENT } from '../data/quranData';
import Shamzan from '../components/Shamzan';
import { useGaplessAudio, GlobalPlayerBar } from '../components/AudioPlayer';
import QuranReader from '../components/QuranReader';
import DailyPopup from '../components/DailyPopup';
import GlobalPlayer from '../components/GlobalPlayer';
import MoodDoctor from '../components/MoodDoctor';
import QiblaCompass from '../components/QiblaCompass';
import KhatamPlanner from '../components/KhatamPlanner';
import DuaFeed from '../components/DuaFeed';

export default function DailyBarakahApp() {
  const [currentView, setCurrentView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('morning_evening'); 
  const [showShamzan, setShowShamzan] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showInstall, setShowInstall] = useState(false); // Default hidden
  
  const [activeMood, setActiveMood] = useState(null); 
  const [surahList, setSurahList] = useState([]);
  const [activeSurah, setActiveSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [pages, setPages] = useState({}); 
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentReads, setRecentReads] = useState([]); 
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]); 
  const [repeatMode, setRepeatMode] = useState('off'); 
  const [playbackRate, setPlaybackRate] = useState(1);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [trackerData, setTrackerData] = useState({ prayers: [], deeds: [] });
  
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [ramadanStatus, setRamadanStatus] = useState("Checking...");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayerName, setNextPrayerName] = useState("Loading...");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [dailyQuote, setDailyQuote] = useState(DAILY_INSPIRATIONS[0]);
  const [timeContext, setTimeContext] = useState("morning");
  const [locationName, setLocationName] = useState("Detecting...");
  const [installPrompt, setInstallPrompt] = useState(null);

  const abortControllerRef = useRef(null);
  const playAyahRef = useRef(null);
  const loadSurahRef = useRef(null);

  // --- AUDIO LOGIC ---
  const handleTrackEnd = (finishedIndex) => {
      const play = playAyahRef.current;
      if (!play) return;

      if (repeatMode === 'ayah') { play(finishedIndex); return; }
      if (repeatMode === 'page') {
          const currentPage = ayahs[finishedIndex].page;
          const nextAyah = ayahs[finishedIndex + 1];
          if (!nextAyah || nextAyah.page !== currentPage) {
              const startOfPage = ayahs.findIndex(a => a.page === currentPage);
              play(startOfPage);
              return;
          }
      }
      if (finishedIndex + 1 < ayahs.length) { 
          play(finishedIndex + 1); 
      } else if (repeatMode === 'surah') { 
          play(0); 
      } else {
          if (activeSurah && activeSurah.id < 114) {
              if (loadSurahRef.current) loadSurahRef.current(activeSurah.id + 1, null, true);
          }
      }
  };

  const { playAyah, togglePlay, stop, isPlaying, currentIndex } = useGaplessAudio(
    activeReciter, ayahs, activeSurah, playbackRate, handleTrackEnd
  );

  useEffect(() => { playAyahRef.current = playAyah; }, [playAyah]);

  const cycleSpeed = () => {
      const speeds = [1, 1.25, 1.5, 2.0];
      const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
      setPlaybackRate(speeds[nextIdx]);
  };

  const openSurah = async (surah, forcedPage = null, shouldAutoPlay = false) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      stop(); 
      setActiveSurah(surah);
      setCurrentView('quran-reader');
      setLoading(true);
      setAyahs([]); 

      try {
          const arabicRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?language=en&words=false&per_page=300&fields=text_uthmani,page_number`, { signal });
          if (!arabicRes.ok) throw new Error("API Error");
          const arabicData = await arabicRes.json();

          const processed = arabicData.verses.map(v => ({
              id: v.id, number: v.verse_number, arabic: v.text_uthmani, page: v.page_number,
              english: "Loading...", hausa: ""
          }));

          const pgs = {};
          processed.forEach(a => { if(!pgs[a.page]) pgs[a.page] = []; pgs[a.page].push(a); });

          setAyahs(processed);
          setPages(pgs);
          setCurrentPageNum(forcedPage || processed[0]?.page || 1); 
          setLoading(false); 

          if (shouldAutoPlay) {
              setTimeout(() => { if (playAyahRef.current) playAyahRef.current(0); }, 500);
          }

          const newRead = { id: surah.id, name: surah.name_simple, arabic: surah.name_arabic, page: forcedPage || processed[0]?.page || 1, timestamp: Date.now() };
          const updatedRecents = [newRead, ...recentReads.filter(r => r.id !== surah.id)].slice(0, 3);
          setRecentReads(updatedRecents);
          localStorage.setItem('barakah_recents', JSON.stringify(updatedRecents));

          try {
              const engRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?language=en&words=false&translations=131&per_page=300`, { signal });
              const engData = await engRes.json();
              const engMap = {};
              if (engData.verses) engData.verses.forEach(v => { if (v.translations[0]) engMap[v.verse_number] = v.translations[0].text.replace(/<[^>]*>?/gm, ''); });
              setAyahs(prev => prev.map(item => ({ ...item, english: engMap[item.number] || "Translation unavailable" })));
          } catch(e) { console.warn("Eng Trans Failed"); }

          try {
              const hausaRes = await fetch(`https://quranenc.com/api/v1/translation/sura/hausa_gummi/${surah.id}`, { signal });
              const hausaData = await hausaRes.json();
              if(hausaData.result) {
                  const hMap = {};
                  hausaData.result.forEach(i => hMap[i.aya] = i.translation);
                  setAyahs(prev => prev.map(item => ({ ...item, hausa: hMap[item.number] || "" })));
              }
          } catch (e) { console.warn("Hausa Failed"); }

      } catch (e) { if (e.name !== 'AbortError') { console.error(e); alert("Network slow. Retrying..."); } }
  };

  const loadSurahById = async (id, pageToStart = null, autoPlay = false) => {
      const foundSurah = surahList.find(s => s.id === id);
      if (foundSurah) openSurah(foundSurah, pageToStart, autoPlay);
  };

  useEffect(() => { loadSurahRef.current = loadSurahById; }, [surahList]);

  const handlePlannerRead = (targetPage) => {
      const foundSurah = surahList.find(s => {
          if (s.pages && s.pages.length === 2) {
              return targetPage >= s.pages[0] && targetPage <= s.pages[1];
          }
          return false;
      });
      if (foundSurah) openSurah(foundSurah, targetPage);
      else loadSurahById(1, 1);
  };

  const toggleCheck = (type, item) => {
      const list = trackerData[type] || [];
      if (list.includes(item)) setTrackerData({ ...trackerData, [type]: list.filter(i => i !== item) });
      else setTrackerData({ ...trackerData, [type]: [...list, item] });
  };

  const handleInstall = () => {
      if (installPrompt) {
          installPrompt.prompt();
          installPrompt.userChoice.then((choiceResult) => { setInstallPrompt(null); });
      } else { alert("Tap the browser menu (⋮ or Share) and select 'Add to Home Screen'"); }
  };

  useEffect(() => {
      // 1. CAPTURE INSTALL PROMPT
      window.addEventListener('beforeinstallprompt', (e) => { 
          e.preventDefault(); 
          setInstallPrompt(e); 
          setShowInstall(true); // Only show banner if browser allows install!
      });

      setTimeout(() => setShowWelcome(true), 1500); 
      
      // 2. DAILY QUOTE ROTATION (Based on Day of Year)
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      // Pick a quote based on the day number
      const quoteIndex = dayOfYear % DAILY_INSPIRATIONS.length;
      setDailyQuote(DAILY_INSPIRATIONS[quoteIndex]);

      setGregorianDate(now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
      
      const hour = now.getHours();
      if(hour < 12) { setTimeContext("morning"); setActiveCategory("morning_evening"); }
      else if(hour < 18) { setTimeContext("afternoon"); setActiveCategory("daily_life"); }
      else { setTimeContext("evening"); setActiveCategory("protection"); }

      const rStart = new Date('2026-02-18T00:00:00');
      const diffTime = rStart - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRamadanStatus(diffDays > 0 ? `${diffDays} Days to Ramadan` : "Ramadan Mubarak!");

      const savedRecents = localStorage.getItem('barakah_recents');
      if (savedRecents) setRecentReads(JSON.parse(savedRecents));

      fetch('https://api.quran.com/api/v4/chapters?language=en').then(res => res.json()).then(data => setSurahList(data.chapters || []));

      const fetchPrayerData = async (lat, lng, method) => {
          try {
              const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${lat}&longitude=${lng}&method=${method}`);
              const data = await res.json();
              setPrayerTimes(data.data.timings);
              setHijriDate(`${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`);
              
              const curTime = now.getHours() * 60 + now.getMinutes();
              const pOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
              let found = false;
              for (const p of pOrder) {
                  const [h, m] = data.data.timings[p].split(':');
                  if ((parseInt(h)*60 + parseInt(m)) > curTime) {
                      setNextPrayerName(p); setNextPrayerTime(data.data.timings[p]); found = true; break;
                  }
              }
              if (!found) { setNextPrayerName("Fajr"); setNextPrayerTime(data.data.timings["Fajr"]); }
          } catch(e) { console.error("Prayer API Error", e); }
      };

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
              fetchPrayerData(pos.coords.latitude, pos.coords.longitude, 3);
              try {
                  const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`);
                  const geoData = await geoRes.json();
                  setLocationName(`${geoData.city || "Unknown"}, ${geoData.principalSubdivision || ""}`);
              } catch(e) {}
          }, (err) => {
              fetchPrayerData(21.4225, 39.8262, 3); 
              setLocationName("General Location");
          });
      } else {
          fetchPrayerData(21.4225, 39.8262, 3);
          setLocationName("General Location");
      }
  }, []);

  return (
    <div className={`min-h-screen font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-[#FAF9F6] text-gray-900'}`}>
      
      {showShamzan && (
        <Shamzan surahList={surahList} onIdentify={(id) => { loadSurahById(id); setShowShamzan(false); }} onClose={() => setShowShamzan(false)} />
      )}

      {showWelcome && (
        <DailyPopup onClose={() => setShowWelcome(false)} quote={dailyQuote} hijriDate={hijriDate} gregorianDate={gregorianDate} prayerTimes={prayerTimes} ramadanStatus={ramadanStatus} locationName={locationName} />
      )}

      {activeMood && <MoodDoctor mood={activeMood} onClose={() => setActiveMood(null)} />}
      
      {currentView === 'qibla' && <QiblaCompass onClose={() => setCurrentView('home')} />}
      {currentView === 'khatam' && <KhatamPlanner onClose={() => setCurrentView('home')} onRead={handlePlannerRead} />}
      {currentView === 'community' && <DuaFeed onClose={() => setCurrentView('home')} />}

      {currentView !== 'quran-reader' && (
          <GlobalPlayer isPlaying={isPlaying} reciterName={activeReciter.name.split(' ')[0]} onTogglePlay={togglePlay} onClick={() => setCurrentView('quran-reader')} />
      )}

      {currentView === 'home' && (
        <div className="space-y-6 pb-24 p-6">
          <header className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-[#1B4332] font-serif">Daily Barakah</h1><p className="text-xs opacity-60">{hijriDate || "Loading..."} • {locationName}</p></div>
            <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-[#D8F3DC] text-[#1B4332]'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>
          
          {showInstall && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl flex items-start gap-3 relative border border-green-200 shadow-sm animate-in slide-in-from-top-4">
                <button onClick={() => setShowInstall(false)} className="absolute top-2 right-2 text-green-700 opacity-50 hover:opacity-100"><X size={16}/></button>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 shadow-sm shrink-0"><Smartphone size={20}/></div>
                <div>
                    <h3 className="font-bold text-green-900 text-sm">Install App</h3>
                    <p className="text-[10px] text-green-800 leading-relaxed mt-1 pr-4">
                        This app won't take your space! Install now to access daily without using a browser.
                    </p>
                    <button onClick={handleInstall} className="mt-2 text-[10px] font-bold bg-[#1B4332] text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-green-800">
                        Add to Home Screen
                    </button>
                </div>
            </div>
          )}

          <div className="bg-[#1B4332] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             <div className="relative z-10">
                <div className="flex justify-between mb-4">
                    <div><p className="text-green-200 text-xs uppercase">Next Prayer</p><h2 className="text-3xl font-bold">{nextPrayerName} <span className="text-lg font-normal opacity-80">{nextPrayerTime}</span></h2></div>
                    <div className="bg-white/10 p-2 rounded-lg text-center"><p className="text-xs text-green-200 uppercase">Status</p><p className="font-bold">{ramadanStatus}</p></div>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-3">
                    {prayerTimes && ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
                        <div key={p} className="text-center"><span className="text-[10px] text-green-200 block">{p}</span><span className="font-bold text-sm">{prayerTimes[p]}</span></div>
                    ))}
                </div>
             </div>
          </div>

          <button onClick={() => setShowShamzan(true)} className="w-full bg-gradient-to-r from-green-600 to-[#1B4332] text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform group">
             <div className="bg-white/20 p-2 rounded-full group-hover:animate-pulse"><Radio size={24} /></div>
             <div className="text-left"><p className="font-bold text-lg">Voice Search</p><p className="text-xs text-green-100">Tap to Open Surah</p></div>
          </button>

          {recentReads.length > 0 && (
            <div className="mb-2">
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Jump Back In</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {recentReads.map((read, i) => (
                        <div key={i} onClick={() => loadSurahById(read.id, read.page)} className={`min-w-[140px] p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${isDark ? 'bg-gray-900 border-gray-800 hover:border-yellow-600' : 'bg-white border-gray-100 hover:border-green-300 hover:shadow-md'}`}>
                            <div className="flex justify-between items-center">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold"><History size={16}/></div>
                                <span className="text-[10px] text-gray-400">Pg {read.page}</span>
                            </div>
                            <div><p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{read.name}</p></div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div className={`p-4 rounded-2xl border text-center cursor-pointer transition-colors ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-[#F0FDF4] border-green-100'}`} onClick={() => setShowWelcome(true)}>
              <p className={`font-bold text-sm flex items-center justify-center gap-2 ${isDark ? 'text-yellow-500' : 'text-green-800'}`}><Sparkles size={16} /> Show Daily Inspiration</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setCurrentView('quran-list')} className={`p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 transition-colors ${isDark ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' : 'bg-white hover:bg-gray-50'}`}><BookOpen size={24} /><span className="font-bold">Quran</span></button>
            <button onClick={() => setCurrentView('duas')} className={`p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 transition-colors ${isDark ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' : 'bg-white hover:bg-gray-50'}`}><Heart size={24} /><span className="font-bold">Duas</span></button>
            <button onClick={() => setCurrentView('qibla')} className={`p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 transition-colors ${isDark ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' : 'bg-white hover:bg-gray-50'}`}><span className="text-2xl">🧭</span><span className="font-bold">Qibla</span></button>
            <button onClick={() => setCurrentView('khatam')} className={`p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 transition-colors ${isDark ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' : 'bg-white hover:bg-gray-50'}`}><span className="text-2xl">📅</span><span className="font-bold">Planner</span></button>
            <button onClick={() => setCurrentView('community')} className={`col-span-2 p-4 rounded-2xl shadow-sm flex items-center justify-center gap-3 transition-colors ${isDark ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' : 'bg-white hover:bg-gray-50'}`}><MessageCircle size={24} className="text-green-600"/><span className="font-bold">Community Dua Feed</span></button>
          </div>
        </div>
      )}

      {currentView === 'quran-list' && (
        <div className="pb-24 pt-6 px-4">
            <div className={`sticky top-0 z-10 pb-4 ${isDark ? 'bg-black' : 'bg-[#FDFCF8]'}`}>
               <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Surahs</h2>
               <div className="relative mb-4">
                  <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input type="text" placeholder="Search..." className={`w-full border rounded-xl py-3 pl-12 outline-none ${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
               </div>
            </div>
            <div className="space-y-2">
            {surahList.filter(s => s.name_simple.toLowerCase().includes(searchQuery)).map(surah => (
                <div key={surah.id} onClick={() => openSurah(surah)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${isDark ? 'bg-gray-900 border-gray-800 hover:border-yellow-600' : 'bg-white border-gray-100 hover:border-green-200'}`}>
                    <div className="flex items-center gap-4"><div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-[#1B4332] text-sm">{surah.id}</div><h3 className="font-bold">{surah.name_simple}</h3></div>
                    <span className="font-serif text-xl opacity-50">{surah.name_arabic}</span>
                </div>
            ))}
            </div>
        </div>
      )}

      {currentView === 'quran-reader' && activeSurah && (
          <>
            <QuranReader 
               activeSurah={activeSurah} 
               ayahs={ayahs} 
               pages={pages}
               surahList={surahList} // <--- NEW: Added this prop for Navigation Logic
               currentPage={currentPageNum} 
               setCurrentPage={setCurrentPageNum} 
               activeReciter={activeReciter} 
               onReciterChange={setActiveReciter}
               onBack={() => setCurrentView('quran-list')} 
               onSurahChange={loadSurahById}
               audioState={{ isPlaying, togglePlay, currentIndex, repeatMode, setRepeatMode, playAyah }} 
               isDark={isDark}
            />
            <GlobalPlayerBar isPlaying={isPlaying} reciterName={activeReciter.name.split(' ')[0]} onTogglePlay={togglePlay} playbackRate={playbackRate} onSpeedChange={cycleSpeed} onClick={() => {}} />
          </>
      )}

      {currentView === 'duas' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Fortress of the Muslim</h2>
            <div className="mb-6 p-4 bg-gradient-to-r from-[#1B4332] to-green-800 rounded-2xl text-white shadow-lg">
                <h3 className="font-bold text-lg mb-1 capitalize">{timeContext} Azkar</h3>
                <button onClick={() => setActiveCategory(timeContext === 'morning' ? 'morning_evening' : 'daily_life')} className="mt-3 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Read Now</button>
            </div>
            
            <div className={`mb-6 p-4 rounded-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-green-50 border-green-100'}`}>
               <p className="text-xs font-bold text-green-600 uppercase mb-3">Soul Doctor (How are you?)</p>
               <div className="flex justify-between px-2">
                  <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveMood('happy')}><Smile size={20} className="text-yellow-500"/><span className="text-[10px]">Happy</span></div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveMood('sad')}><CloudRain size={20} className="text-blue-500"/><span className="text-[10px]">Sad</span></div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveMood('anxious')}><Zap size={20} className="text-orange-500"/><span className="text-[10px]">Anxious</span></div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveMood('tired')}><Coffee size={20} className="text-brown-500"/><span className="text-[10px]">Tired</span></div>
               </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
                {Object.keys(DUA_CATEGORIES).map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-[#1B4332] text-white' : isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{DUA_CATEGORIES[cat].title}</button>
                ))}
            </div>
            
            <div className="space-y-4">
                {DUA_CATEGORIES[activeCategory].duas.map((dua, i) => (
                    <div key={i} className={`p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                        <h3 className="text-xs font-bold text-green-600 uppercase mb-2">{dua.title}</h3>
                        <p className="text-right font-serif text-xl mb-3 leading-loose">{dua.arabic}</p>
                        <p className="text-sm opacity-60 italic">"{dua.meaning}"</p>
                    </div>
                ))}
            </div>
        </div>
      )}
      
      {currentView === 'tasbih' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Daily Amal Tracker</h2>
            <div className={`p-6 rounded-2xl shadow-sm border mb-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <h3 className="font-bold mb-4 flex items-center gap-2 text-lg"><CheckSquare size={20} className="text-green-600"/> Ramadan Goals</h3>
                <div className="space-y-4">
                   {['Read 1 Juz Quran', 'Give Sadaqah', '100x Istighfar', '100x Salawat', 'Taraweeh Prayer'].map(deed => (
                      <label key={deed} className="flex items-center gap-4 cursor-pointer group">
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${trackerData.deeds?.includes(deed) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                             {trackerData.deeds?.includes(deed) && <CheckCircle size={16} className="text-white"/>}
                         </div>
                         <input type="checkbox" className="hidden" checked={trackerData.deeds?.includes(deed) || false} onChange={() => toggleCheck('deeds', deed)} />
                         <span className={`text-sm font-bold ${trackerData.deeds?.includes(deed) ? 'line-through opacity-50' : ''}`}>{deed}</span>
                      </label>
                   ))}
                </div>
            </div>
            <div className={`p-6 rounded-2xl shadow-sm border mb-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <h3 className="font-bold mb-4 text-lg">Daily Prayers</h3>
                <div className="flex justify-between">
                   {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
                      <div key={p} onClick={() => toggleCheck('prayers', p)} className={`flex flex-col items-center gap-2 cursor-pointer`}>
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${trackerData.prayers?.includes(p) ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}>
                             {trackerData.prayers?.includes(p) ? <CheckCircle size={20}/> : <div className="w-3 h-3 bg-gray-200 rounded-full"></div>}
                         </div>
                         <span className="text-[10px] uppercase font-bold">{p[0]}</span>
                      </div>
                   ))}
                </div>
            </div>
            <div className="bg-[#1B4332] text-white p-8 rounded-3xl text-center shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="relative z-10">
                    <p className="text-xs uppercase opacity-70 tracking-widest mb-4">Digital Dhikr</p>
                    <div onClick={() => setTasbihCount(c => c+1)} className="text-7xl font-mono font-bold cursor-pointer select-none active:scale-90 transition-transform mb-4">{tasbihCount}</div>
                    <button onClick={() => setTasbihCount(0)} className="absolute top-4 right-4 opacity-50 hover:opacity-100 hover:text-red-300"><RefreshCw size={18}/></button>
                </div>
            </div>
        </div>
      )}

      {currentView !== 'quran-reader' && (
        <div className={`fixed bottom-0 w-full max-w-md border-t py-3 px-4 flex justify-between items-center z-40 transition-colors ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-[#1B4332]' : 'opacity-40'}`}><Menu size={20} /><span className="text-[10px] font-bold">Home</span></button>
          <button onClick={() => setCurrentView('quran-list')} className={`flex flex-col items-center gap-1 ${currentView === 'quran-list' ? 'text-[#1B4332]' : 'opacity-40'}`}><BookOpen size={20} /><span className="text-[10px] font-bold">Quran</span></button>
          <button onClick={() => setCurrentView('bookmarks')} className={`flex flex-col items-center gap-1 ${currentView === 'bookmarks' ? 'text-[#1B4332]' : 'opacity-40'}`}><Bookmark size={20} /><span className="text-[10px]">Saved</span></button>
          <button onClick={() => setCurrentView('tasbih')} className={`flex flex-col items-center gap-1 ${currentView === 'tasbih' ? 'text-[#1B4332]' : 'opacity-40'}`}><CheckSquare size={20} /><span className="text-[10px]">Tracker</span></button>
          <button onClick={() => setCurrentView('duas')} className={`flex flex-col items-center gap-1 ${currentView === 'duas' ? 'text-[#1B4332]' : 'opacity-40'}`}><Heart size={20} /><span className="text-[10px]">Duas</span></button>
        </div>
      )}
    </div>
  );
}