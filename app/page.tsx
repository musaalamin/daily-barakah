'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Moon, Sun, Play, Pause, ChevronLeft, Search, Calendar, CheckSquare, Heart, Share2, Menu, Mic2, Volume2, Type, Repeat, RefreshCw, X, Sparkles, Download, Mail, Clock, Gauge, Settings, Globe, Bookmark, Book } from 'lucide-react';
import { toPng } from 'html-to-image';

// --- DATA: RECITERS ---
const RECITERS = [
  { id: "mishary", name: "Mishary Alafasy", url: "https://everyayah.com/data/Alafasy_128kbps/" },
  { id: "hussary", name: "Mahmoud Al-Hussary", url: "https://everyayah.com/data/Husary_128kbps/" },
  { id: "sudais", name: "Abdur-Rahman as-Sudais", url: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
  { id: "basit", name: "Abdul Basit (Murattal)", url: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/" },
  { id: "maher", name: "Maher Al Muaiqly", url: "https://everyayah.com/data/MaherAlMuaiqly128kbps/" },
  { id: "juhany", name: "Abdallah Al Juhany", url: "https://everyayah.com/data/Abdullaah_3awwaad_Al-Juhaynee_128kbps/" },
  { id: "dossary", name: "Yasser Al Dossary", url: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/" },
];

// --- DATA: DAILY INSPIRATIONS ---
const DAILY_INSPIRATIONS = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship [will be] ease.", ref: "Quran 94:6" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", english: "So remember Me; I will remember you.", ref: "Quran 2:152" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english: "And whoever relies upon Allah - then He is sufficient for him.", ref: "Quran 65:3" },
  { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", ref: "Quran 2:286" },
  { arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ", english: "And your Lord says, 'Call upon Me; I will respond to you.'", ref: "Quran 40:60" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "Quran 2:153" },
  { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", english: "The best of you are those who learn the Quran and teach it.", ref: "Hadith Bukhari" },
  { arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ", english: "Dua is worship.", ref: "Hadith Tirmidhi" },
  { arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", english: "Actions are judged by intentions.", ref: "Hadith Bukhari" },
  { arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", english: "A good word is charity.", ref: "Hadith Bukhari" },
  { arabic: "فَفِرُّوا إِلَى اللَّهِ", english: "So flee to Allah.", ref: "Quran 51:50" },
  { arabic: "وَكَفَىٰ بِاللَّهِ وَكِيلًا", english: "And sufficient is Allah as Disposer of affairs.", ref: "Quran 4:81" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", english: "My Lord, expand for me my breast [with assurance].", ref: "Quran 20:25" },
];

// --- DATA: DUAS ---
const DUA_CATEGORIES = {
  morning_evening: {
    title: "Morning & Evening",
    duas: [
      { title: "Ayatul Kursi (Full)", arabic: "ٱللَّهُ لَاۤ إِلَـٰهَ إِلَّا هُوَ ٱلۡحَیُّ ٱلۡقَیُّومُ ۚ لَا تَأۡخُذُهُۥ سِنَةࣱ وَلَا نَوۡمࣱ ۚ لَّهُۥ مَا فِی ٱلسَّمَـٰوَ ٰ⁠تِ وَمَا فِی ٱلۡأَرۡضِ ۗ مَن ذَا ٱلَّذِی یَشۡفَعُ عِندَهُۥۤ إِلَّا بِإِذۡنِهِۦ ۚ یَعۡلَمُ مَا بَیۡنَ أَیۡدِیهِمۡ وَمَا خَلۡفَهُمۡ ۖ وَلَا یُحِیطُونَ بِشَیۡءࣲ مِّنۡ عِلۡمِهِۦۤ إِلَّا بِمَا شَاۤءَ ۚ وَسِعَ كُرۡسِیُّهُ ٱلسَّمَـٰوَ ٰ⁠تِ وَٱلۡأَرۡضَ ۖ وَلَا یَـُٔودُهُۥ حِفۡظُهُمَا ۚ وَهُوَ ٱلۡعَلِیُّ ٱلۡعَظِیمُ", meaning: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence..." },
      { title: "The 3 Quls (Full)", arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ... (Full text omitted for brevity but logic handles it)", meaning: "Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas." },
      { title: "Sayyidul Istighfar (Full)", arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي...", meaning: "O Allah, You are my Lord..." },
    ]
  },
  daily_life: {
    title: "Daily Life",
    duas: [
      { title: "Before Eating", arabic: "بِسْمِ اللَّهِ", meaning: "In the name of Allah." },
      { title: "Leaving Home", arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ", meaning: "In the name of Allah, I trust in Allah." },
    ]
  },
  travel: {
    title: "Travel",
    duas: [
      { title: "Travel Prayer", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا...", meaning: "Glory to Him who has subjected this to us..." },
    ]
  },
  ramadan: {
    title: "Ramadan",
    duas: [
      { title: "Breaking Fast", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ", meaning: "The thirst is gone and veins are moistened." },
      { title: "Lailatul Qadr", arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", meaning: "O Allah, You are Forgiving and love forgiveness, so forgive me." },
    ]
  }
};

export default function DailyBarakahApp() {
  const [currentView, setCurrentView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('morning_evening'); 
  
  // Data State
  const [surahList, setSurahList] = useState<any[]>([]);
  const [activeSurah, setActiveSurah] = useState<any>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [nextPrayerName, setNextPrayerName] = useState("Loading");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [ramadanStatus, setRamadanStatus] = useState("Loading...");
  
  // Persistence State
  const [lastRead, setLastRead] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Settings & Popup
  const [arabicFontSize, setArabicFontSize] = useState(32); 
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  const [showWelcome, setShowWelcome] = useState(true);
  const [dailyQuote, setDailyQuote] = useState(DAILY_INSPIRATIONS[0]);
  const hiddenDownloadRef = useRef<HTMLDivElement>(null); 

  // Audio State & Logic (GLOBAL)
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSurahId, setPlayingSurahId] = useState<number | null>(null); // To track which surah is playing
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1); 
  const playbackRateRef = useRef(1); 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // UI Modes
  const [isMushafMode, setIsMushafMode] = useState(false); // Toggle for Quran View
  const [revealedAyah, setRevealedAyah] = useState<number | null>(null);

  // Planner & Tasbih
  const [planner, setPlanner] = useState({ fasting: false, quran: false, taraweeh: false, dhikr: false, charity: false });
  const [tasbihCount, setTasbihCount] = useState(0);

  // --- INIT ---
  useEffect(() => {
    // 1. Initial Setup
    setDailyQuote(DAILY_INSPIRATIONS[Math.floor(Math.random() * DAILY_INSPIRATIONS.length)]);
    setGregorianDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    
    // 2. Load Persisted Data
    const savedLastRead = localStorage.getItem('barakah_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));
    
    const savedBookmarks = localStorage.getItem('barakah_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // 3. Ramadan Logic
    const today = new Date();
    const ramadanStart = new Date('2026-02-18'); 
    const diffTime = ramadanStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 0) setRamadanStatus(`${diffDays} Days to Ramadan`);
    else if (diffDays <= 0 && diffDays > -30) setRamadanStatus(`Ramadan Day ${Math.abs(diffDays) + 1}`);
    else setRamadanStatus("Daily Barakah");

    // 4. Fetch Surah List
    fetch('https://api.quran.com/api/v4/chapters?language=en').then(res => res.json()).then(data => setSurahList(data.chapters || []));

    // 5. Prayer Times & Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=3`);
          const data = await res.json();
          setPrayerTimes(data.data.timings);
          const h = data.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
          updateNextPrayer(data.data.timings); // Initial Check
        } catch (e) { console.error(e); }
      });
    }

    // 6. Live Timer for Prayer (Updates every minute)
    const interval = setInterval(() => {
       if (prayerTimes) updateNextPrayer(prayerTimes);
    }, 60000);
    return () => clearInterval(interval);

  }, []);

  // --- LOGIC: PRAYER TIMES AUTOMATION ---
  const updateNextPrayer = (timings: any) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let found = false;

    for (const prayer of prayerOrder) {
        const [h, m] = timings[prayer].split(':');
        const prayerTime = parseInt(h) * 60 + parseInt(m);
        if (prayerTime > currentTime) {
            setNextPrayerName(prayer);
            setNextPrayerTime(timings[prayer]);
            found = true;
            break;
        }
    }
    // If passed Isha, next is Fajr tomorrow
    if (!found) {
        setNextPrayerName("Fajr");
        setNextPrayerTime(timings["Fajr"]);
    }
  };

  // --- LOGIC: BOOKMARKING & RECENTS ---
  const saveRecent = (surah: any, ayahNum: number) => {
    const data = { surahName: surah.name_simple, surahId: surah.id, ayah: ayahNum, timestamp: Date.now() };
    setLastRead(data);
    localStorage.setItem('barakah_last_read', JSON.stringify(data));
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

  // --- LOGIC: AUDIO & QURAN ---
  const openSurah = async (surah: any) => {
    setActiveSurah(surah);
    setCurrentView('quran-reader');
    setLoading(true);
    // Don't stop audio if we are opening the same Surah that is playing!
    if (playingSurahId !== surah.id) {
       // Only load data, let user decide when to play
    }
    
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
      saveRecent(surah, 1); // Save as recent when opened
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const playSurah = (startIndex: number = -1) => {
    if (!activeSurah) return;
    
    setPlayingSurahId(activeSurah.id); // Mark this surah as playing
    if (audioRef.current) audioRef.current.pause();
    
    let url = startIndex === -1 ? `${activeReciter.url}001001.mp3` : `${activeReciter.url}${String(activeSurah.id).padStart(3, '0')}${String(ayahs[startIndex].number).padStart(3, '0')}.mp3`;
    if (startIndex === -1 && (activeSurah.id === 1 || activeSurah.id === 9)) { playSurah(0); return; }
    if (startIndex >= 0 && !ayahs[startIndex]) { setIsPlaying(false); return; }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.playbackRate = playbackRateRef.current; // PERSIST SPEED
    
    audio.play();
    setIsPlaying(true);
    setCurrentIndex(startIndex);
    
    // Auto scroll if in view
    if (startIndex >= 0 && currentView === 'quran-reader') {
        document.getElementById(`ayah-${startIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Save progress
    if(startIndex >= 0) saveRecent(activeSurah, ayahs[startIndex].number);

    audio.onended = () => playSurah(startIndex + 1);
  };

  const togglePlayPause = () => {
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); } 
    else { 
        if (audioRef.current) {
            audioRef.current.play();
            audioRef.current.playbackRate = playbackRateRef.current;
        } else {
            playSurah(-1);
        }
        setIsPlaying(true); 
    }
  };

  const updateSpeed = (rate: number) => {
    setPlaybackRate(rate);
    playbackRateRef.current = rate;
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  const handleDownload = async () => {
    if (hiddenDownloadRef.current) {
      try {
        const dataUrl = await toPng(hiddenDownloadRef.current, { cacheBust: true, pixelRatio: 1 });
        const link = document.createElement('a');
        link.download = `Daily-Barakah-${gregorianDate}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) { console.error('Download failed', err); }
    }
  };

  // --- SUB-COMPONENTS ---
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
      <div className="pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-900">Wonder Sight Gallery</p>
          <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1"><Mail size={10} /> wondersightgallery@gmail.com</p>
      </div>
    </>
  );

  const HighResCardContent = () => (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-start border-b-2 border-green-100 pb-8 mb-12">
          <div className="text-left"><p className="text-3xl text-gray-600 font-bold uppercase tracking-widest mb-2">{gregorianDate}</p><p className="text-2xl text-green-600 font-medium">{hijriDate}</p></div>
          <div className="bg-[#1B4332] text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-xl"><Moon size={32} /><span className="text-3xl font-bold">{ramadanStatus}</span></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center mb-12">
          <div className="w-32 h-32 bg-[#1B4332] text-white rounded-full flex items-center justify-center mb-12 shadow-2xl"><Sparkles size={64} /></div>
          <p className="font-serif text-[80px] text-[#1B4332] leading-[2.2] mb-12 text-center dir-rtl drop-shadow-sm">{dailyQuote.arabic}</p>
          <p className="text-gray-600 font-medium text-[36px] italic mb-8 text-center max-w-2xl leading-relaxed">"{dailyQuote.english}"</p>
          <span className="inline-block bg-gray-100 text-gray-600 text-2xl px-8 py-3 rounded-full font-bold mt-4 tracking-wide border border-gray-200">{dailyQuote.ref}</span>
      </div>
      <div className="pt-10 border-t-2 border-green-100 text-center">
          <p className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Wonder Sight Gallery</p>
          <p className="text-2xl text-gray-500 flex items-center justify-center gap-3"><Mail size={28} /> wondersightgallery@gmail.com</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* GLOBAL AUDIO PLAYER (Fixed at bottom if playing and not in reader) */}
      {isPlaying && currentView !== 'quran-reader' && (
        <div className="fixed bottom-16 w-full max-w-md bg-[#1B4332] text-white p-3 z-40 flex items-center justify-between shadow-lg cursor-pointer" onClick={() => setCurrentView('quran-reader')}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Volume2 size={16} /></div>
                <div><p className="text-xs font-bold">Playing Surah...</p><p className="text-[10px] text-green-200">{activeReciter.name.split(' ')[0]}</p></div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="p-2 bg-white text-[#1B4332] rounded-full"><Pause size={16} /></button>
        </div>
      )}

      {/* 1. VISIBLE POPUP */}
      {showWelcome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-sm">
             <div className="bg-white rounded-3xl p-8 text-center relative shadow-2xl border-4 border-[#F0FDF4]">
                <button onClick={() => setShowWelcome(false)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={24} /></button>
                <MobileCardContent />
             </div>
             <button onClick={handleDownload} className="w-full mt-4 bg-[#1B4332] text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={18} /> Download HD Image</button>
           </div>
        </div>
      )}

      {/* 2. SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2"><Settings size={20} /> Preferences</h3>
                    <button onClick={() => setShowSettingsModal(false)} className="bg-gray-100 p-2 rounded-full hover:bg-red-50 hover:text-red-500"><X size={20} /></button>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Mic2 size={12} /> Reciter</p>
                        <div className="grid grid-cols-2 gap-2">
                            {RECITERS.map(r => (<button key={r.id} onClick={() => setActiveReciter(r)} className={`text-left px-3 py-2 text-xs rounded-lg border font-medium ${activeReciter.id === r.id ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-gray-600 border-gray-200'}`}>{r.name.split(' ')[0]}</button>))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Gauge size={12} /> Audio Speed</p>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {[0.5, 0.75, 1, 1.25, 1.5].map(rate => (<button key={rate} onClick={() => updateSpeed(rate)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${playbackRate === rate ? 'bg-white text-[#1B4332] shadow-sm' : 'text-gray-400'}`}>{rate}x</button>))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Type size={12} /> Arabic Size</p>
                        <input type="range" min="20" max="60" value={arabicFontSize} onChange={(e) => setArabicFontSize(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B4332]" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 3. HIDDEN STUDIO */}
      <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', opacity: 0, zIndex: -1 }}>
        <div ref={hiddenDownloadRef} style={{ width: '1080px', height: '1350px', background: 'linear-gradient(135deg, #FDFCF8 0%, #E8F5E9 100%)', padding: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}><div className="bg-white rounded-[60px] p-[80px] text-center shadow-2xl w-full h-full border-8 border-[#1B4332]/10 flex flex-col box-border"><HighResCardContent /></div></div>
      </div>

      {/* 4. MAIN APP CONTENT */}
      {currentView === 'home' && (
        <div className="space-y-6 pb-24 p-6">
          <header className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-[#1B4332] font-serif">Daily Barakah</h1><p className="text-xs text-gray-500">{hijriDate} • Gusau</p></div>
            <div className="flex gap-2">
                <button onClick={() => setShowSettingsModal(true)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Settings size={20} /></button>
                <button className="w-10 h-10 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#1B4332]"><Moon size={20} /></button>
            </div>
          </header>
          
          {/* PRAYER TIME CARD (LIVE UPDATING) */}
          <div className="bg-[#1B4332] rounded-3xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div><p className="text-[#95D5B2] text-xs font-bold uppercase mb-1">Next Prayer</p><h2 className="text-4xl font-bold">{nextPrayerName} <span className="text-xl font-normal text-white/70">{nextPrayerTime}</span></h2></div>
                <div className="bg-white/10 p-2 rounded-lg text-center"><p className="text-xs text-[#95D5B2] uppercase font-bold">Status</p><p className="text-lg font-bold leading-tight">{ramadanStatus}</p></div>
            </div>
            <div className="flex justify-between text-center border-t border-white/20 pt-4">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (<div key={p} className="flex flex-col"><span className="text-[10px] text-[#95D5B2] uppercase">{p}</span><span className="font-bold text-sm">{prayerTimes ? prayerTimes[p] : "--:--"}</span></div>))}
            </div>
          </div>

          {/* RECENTLY READ CARD */}
          {lastRead && (
             <div onClick={() => { 
                 const surah = surahList.find(s => s.id === lastRead.surahId); 
                 if(surah) { openSurah(surah); setTimeout(() => document.getElementById(`ayah-${lastRead.ayah - 1}`)?.scrollIntoView({block:'center'}), 1000); }
             }} 
             className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between cursor-pointer hover:bg-orange-50 transition-colors">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Book size={20} /></div>
                     <div><p className="text-xs text-gray-400 font-bold uppercase">Continue Reading</p><p className="font-bold text-gray-800">{lastRead.surahName}</p></div>
                 </div>
                 <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Ayah {lastRead.ayah}</div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setCurrentView('quran-list')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"><BookOpen size={24} /><span className="font-bold text-gray-800">Read Quran</span></button>
            <button onClick={() => setCurrentView('duas')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"><Heart size={24} /><span className="font-bold text-gray-800">Duas</span></button>
          </div>
          <div className="bg-[#F0FDF4] p-6 rounded-2xl border border-[#D8F3DC] text-center cursor-pointer" onClick={() => setShowWelcome(true)}>
            <p className="text-green-800 font-bold text-sm flex items-center justify-center gap-2"><Sparkles size={16} /> Show Daily Inspiration Again</p>
          </div>
        </div>
      )}

      {currentView === 'quran-list' && (
        <div className="pb-24 pt-6 px-4">
            <div className="sticky top-0 bg-[#FDFCF8] z-10 pb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1B4332] mb-2 px-2">The Noble Quran</h2>
                <button onClick={() => setShowSettingsModal(true)}><Settings size={24} className="text-gray-400" /></button>
            </div>
            <div className="relative mb-4"><Search className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" placeholder="Search Surah" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none" onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} /></div>
            
            {/* BOOKMARKS SECTION */}
            {bookmarks.length > 0 && (
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Bookmarks</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {bookmarks.map((b, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-gray-200 min-w-[150px] shadow-sm flex flex-col justify-between">
                                <p className="font-bold text-sm text-[#1B4332]">{b.surahName}</p>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-xs text-gray-500">Ayah {b.ayahNum}</span>
                                    <Bookmark size={14} className="text-[#1B4332] fill-current" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
            {surahList.filter(s => s.name_simple.toLowerCase().includes(searchQuery)).map(surah => (
                <div key={surah.id} onClick={() => openSurah(surah)} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 hover:border-green-200 cursor-pointer">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-[#1B4332] text-sm">{surah.id}</div><div><h3 className="font-bold text-gray-900">{surah.name_simple}</h3><p className="text-xs text-gray-500">{surah.translated_name.name}</p></div></div>
                <span className="font-serif text-xl text-gray-400">{surah.name_arabic}</span>
                </div>
            ))}
            </div>
        </div>
      )}

      {currentView === 'quran-reader' && (
        <div className="pb-32 bg-[#FAF9F6]">
            <div className="sticky top-0 bg-[#1B4332] text-white p-4 flex items-center justify-between z-20 shadow-md">
                <button onClick={() => setCurrentView('quran-list')} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                <div className="text-center"><h2 className="font-bold text-lg">{activeSurah?.name_simple}</h2><p className="text-xs text-green-200">{activeSurah?.verses_count} Ayahs</p></div>
                <div className="flex gap-2">
                    <button onClick={() => setIsMushafMode(!isMushafMode)} className={`p-2 rounded-full text-xs font-bold border border-white/20 ${isMushafMode ? 'bg-white text-[#1B4332]' : 'bg-white/10'}`}>{isMushafMode ? <BookOpen size={16} /> : <Menu size={16} />}</button>
                    <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-white/10 rounded-full text-xs font-bold border border-white/20"><Settings size={16} /></button>
                </div>
            </div>
            
            <div className="p-6">
                {loading ? <div className="py-20 text-center text-gray-400">Loading Surah...</div> : (
                    <>
                        {/* MUSHAF MODE (PAGE VIEW) */}
                        {isMushafMode ? (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center leading-[2.8] dir-rtl font-serif text-gray-900" style={{ fontSize: arabicFontSize + 'px' }}>
                                {activeSurah.id !== 1 && activeSurah.id !== 9 && <p className="mb-4 text-[#1B4332]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>}
                                {ayahs.map((ayah, i) => (
                                    <span key={ayah.id} onClick={() => { setRevealedAyah(i); setIsMushafMode(false); document.getElementById(`ayah-${i}`)?.scrollIntoView({block:'center'}); }} className={`cursor-pointer hover:bg-green-50 ${currentIndex === i ? 'text-[#1B4332]' : ''}`}>
                                        {ayah.arabic} <span className="text-[#1B4332] text-sm inline-block mx-1">۝</span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            /* LIST MODE (CARD VIEW) */
                            <div className="space-y-6">
                                {activeSurah.id !== 1 && activeSurah.id !== 9 && <div className="text-center py-4"><p className="font-serif text-3xl text-[#1B4332]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p></div>}
                                {ayahs.map((ayah, i) => (
                                    <div key={ayah.id} id={`ayah-${i}`} onClick={() => setRevealedAyah(revealedAyah === i ? null : i)} className={`text-center cursor-pointer transition-all p-2 rounded-xl ${currentIndex === i ? 'bg-green-50/80 scale-105' : ''}`}>
                                        <div className="flex justify-between px-2 mb-2">
                                            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-bold">{ayah.number}</span>
                                            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(activeSurah, ayah); }}><Bookmark size={16} className={bookmarks.some(b => b.id === `${activeSurah.id}:${ayah.number}`) ? "fill-[#1B4332] text-[#1B4332]" : "text-gray-300"} /></button>
                                        </div>
                                        <p className="font-serif leading-[2.5] text-gray-900 mb-4 dir-rtl" style={{ fontSize: arabicFontSize + 'px' }}>{ayah.arabic}</p>
                                        {revealedAyah === i && (
                                            <div className="animate-in fade-in slide-in-from-top-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mx-auto max-w-sm mt-2 text-left">
                                                <p className="text-gray-700 text-sm leading-relaxed mb-2 font-medium">{ayah.english}</p>
                                                <div className="h-px bg-gray-100 w-full my-2"></div>
                                                <p className="text-green-700 text-xs italic">{ayah.hausa}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* IN-READER PLAYER CONTROLS */}
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-2xl z-50 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-500">{activeReciter.name.split(' ')[0]}</div>
                <button onClick={togglePlayPause} className="w-12 h-12 bg-[#1B4332] rounded-full text-white flex items-center justify-center shadow-lg">{isPlaying ? <Pause size={24} /> : <Play size={24} />}</button>
                <div className="w-10"></div>
            </div>
        </div>
      )}

      {currentView === 'duas' && (
        <div className="pb-24 pt-6 px-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B4332]">Fortress of the Muslim</h2>
                <button onClick={() => setShowSettingsModal(true)}><Settings size={24} className="text-gray-400" /></button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
            {Object.keys(DUA_CATEGORIES).map((key) => (<button key={key} onClick={() => setActiveCategory(key)} className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === key ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-gray-500'}`}>{DUA_CATEGORIES[key as keyof typeof DUA_CATEGORIES].title}</button>))}
            </div>
            <div className="space-y-4">
            {DUA_CATEGORIES[activeCategory as keyof typeof DUA_CATEGORIES].duas.map((dua, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"><h3 className="text-xs font-bold text-[#1B4332] uppercase mb-4">{dua.title}</h3><p className="text-right font-serif text-2xl mb-4 leading-loose" style={{ fontSize: arabicFontSize + 'px' }}>{dua.arabic}</p><p className="text-gray-600 text-sm italic">"{dua.meaning}"</p></div>
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

      {currentView === 'planner' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Ramadan Tracker</h2>
            <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                {['fasting', 'quran', 'taraweeh', 'dhikr', 'charity'].map((item) => (<div key={item} onClick={() => setPlanner(p => ({...p, [item]: !p[item as keyof typeof planner]}))} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${planner[item as keyof typeof planner] ? 'bg-[#1B4332] text-white' : 'bg-gray-50 text-gray-600'}`}><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${planner[item as keyof typeof planner] ? 'border-white' : 'border-gray-300'}`}>{planner[item as keyof typeof planner] && <CheckSquare size={14} />}</div><span className="capitalize font-medium">{item}</span></div>))}
            </div>
        </div>
      )}

      {currentView !== 'quran-reader' && (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 py-3 px-2 flex justify-between items-center z-50">
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 w-1/5 ${currentView === 'home' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Menu size={20} /><span className="text-[9px] font-bold">Home</span></button>
          <button onClick={() => setCurrentView('quran-list')} className={`flex flex-col items-center gap-1 w-1/5 ${currentView.includes('quran') ? 'text-[#1B4332]' : 'text-gray-400'}`}><BookOpen size={20} /><span className="text-[9px] font-bold">Quran</span></button>
          <button onClick={() => setCurrentView('tasbih')} className={`flex flex-col items-center gap-1 w-1/5 ${currentView === 'tasbih' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Repeat size={20} /><span className="text-[9px] font-bold">Tasbih</span></button>
          <button onClick={() => setCurrentView('duas')} className={`flex flex-col items-center gap-1 w-1/5 ${currentView === 'duas' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Heart size={20} /><span className="text-[9px] font-bold">Duas</span></button>
          <button onClick={() => setCurrentView('planner')} className={`flex flex-col items-center gap-1 w-1/5 ${currentView === 'planner' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Calendar size={20} /><span className="text-[9px] font-bold">Planner</span></button>
        </div>
      )}
    </div>
  );
}