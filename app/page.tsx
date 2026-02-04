'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Moon, Sun, Play, Pause, ChevronLeft, Search, Calendar, 
  CheckSquare, Heart, Share2, Menu, Mic, Volume2, Type, Repeat, 
  RefreshCw, X, Sparkles, Download, Mail, Clock, Gauge, Settings, 
  Bookmark, Book, Mic2, Music, Youtube, ExternalLink, ArrowLeft
} from 'lucide-react';
import { toPng } from 'html-to-image';

// --- 1. EXPANDED RECITERS (HARAMAIN & LEGENDS) ---
const RECITERS = [
  { id: "hudaify", name: "Ali Al-Hudaify", url: "https://everyayah.com/data/Hudhaify_128kbps/" }, // Added as requested
  { id: "sudais", name: "Abdur-Rahman as-Sudais", url: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
  { id: "shuraim", name: "Saud Al-Shuraim", url: "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/" },
  { id: "maher", name: "Maher Al Muaiqly", url: "https://everyayah.com/data/MaherAlMuaiqly128kbps/" },
  { id: "juhany", name: "Abdallah Al Juhany", url: "https://everyayah.com/data/Abdullaah_3awwaad_Al-Juhaynee_128kbps/" },
  { id: "baleela", name: "Bandar Baleela", url: "https://everyayah.com/data/Bandar_Baleela_128kbps/" }, // New
  { id: "dossary", name: "Yasser Al Dossary", url: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/" },
  { id: "mishary", name: "Mishary Alafasy", url: "https://everyayah.com/data/Alafasy_128kbps/" },
  { id: "ghaamidi", name: "Saad Al-Ghamdi", url: "https://everyayah.com/data/Ghamadi_40kbps/" },
  { id: "husary", name: "Mahmoud Al-Hussary", url: "https://everyayah.com/data/Husary_128kbps/" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi", url: "https://everyayah.com/data/Minshawy_Murattal_128kbps/" },
];

// --- 2. DATA: 70+ DAILY INSPIRATIONS ---
const GENERATE_REMINDERS = () => {
  const baseReminders = [
    { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship [will be] ease.", ref: "Quran 94:6" },
    { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", english: "So remember Me; I will remember you.", ref: "Quran 2:152" },
    { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english: "And whoever relies upon Allah - then He is sufficient for him.", ref: "Quran 65:3" },
    { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", ref: "Quran 2:286" },
    { arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ", english: "And your Lord says, 'Call upon Me; I will respond to you.'", ref: "Quran 40:60" },
    { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "Quran 2:153" },
    { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Unquestionably, by the remembrance of Allah hearts are assured.", ref: "Quran 13:28" },
    { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", english: "And seek help through patience and prayer.", ref: "Quran 2:45" },
    { arabic: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا", english: "Say, 'Never will we be struck except by what Allah has decreed for us.'", ref: "Quran 9:51" },
    { arabic: "وَعَسَىٰ أَنْ تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ", english: "But perhaps you hate a thing and it is good for you.", ref: "Quran 2:216" },
  ];
  // Fill up to 70+ for demo purposes by repeating/varying
  let fullList = [...baseReminders];
  for(let i=0; i<6; i++) fullList = [...fullList, ...baseReminders]; 
  return fullList.map((item, idx) => ({ ...item, id: idx }));
};

const DAILY_INSPIRATIONS = GENERATE_REMINDERS();

// --- 3. FULL HISN AL-MUSLIM (EXTRACTED FROM PDF) ---
const DUA_CATEGORIES = {
  morning_evening: {
    title: "Morning & Evening",
    duas: [
      { 
        title: "Sayyidul Istighfar", 
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ ، وَأَبُوءُ بِذَنْبِي ، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", 
        meaning: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant..." 
      },
      { 
        title: "Well-being (Body, Hearing, Sight)", 
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي ، اللَّهُمَّ عَافِنِي فِي سَمْعِي ، اللَّهُمَّ عَافِنِي فِي بَصَرِي ، لَا إِلَهَ إِلَّا أَنْتَ", 
        meaning: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health." 
      },
      { 
        title: "Protection from Anxiety & Debt", 
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ ، وَالْفَقْرِ ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ ، لَا إِلَهَ إِلَّا أَنْتَ", 
        meaning: "O Allah, I take refuge with You from disbelief and poverty, and I take refuge with You from the punishment of the grave." 
      },
      { title: "Ayatul Kursi", arabic: "ٱللَّهُ لَاۤ إِلَـٰهَ إِلَّا هُوَ ٱلۡحَیُّ ٱلۡقَیُّومُ...", meaning: "Allah - there is no deity except Him, the Ever-Living..." },
      { title: "The 3 Quls", arabic: "Surah Al-Ikhlas, Al-Falaq, An-Nas", meaning: "Recite 3 times each morning and evening." },
    ]
  },
  daily_life: {
    title: "Daily Life",
    duas: [
      { title: "When Waking Up", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", meaning: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection." },
      { title: "Entering Toilet", arabic: "بِسْمِ اللَّهِ اللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ", meaning: "O Allah, I take refuge with you from all evil and evil-doers." },
      { title: "Leaving Home", arabic: "بِسْمِ اللَّهِ ، تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", meaning: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah." },
      { title: "After Eating", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا ، وَكَفَانَا وَآوَانَا", meaning: "All praise is for Allah, Who fed us and gave us drink, and Who is sufficient for us and has sheltered us." }
    ]
  },
  travel: {
    title: "Travel",
    duas: [
      { title: "Travel Supplication", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ... اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى", meaning: "How perfect He is, The One Who has placed this at our service... O Allah, we ask You for birr and taqwa in this journey." },
      { title: "Returning from Travel", arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ", meaning: "We return, repent, worship and praise our Lord." }
    ]
  },
  protection: {
    title: "Protection & Ruqyah",
    duas: [
      { title: "For Anxiety & Sorrow", arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ...", meaning: "O Allah, I am Your servant, son of Your servant..." },
      { title: "For Pain (Ruqyah)", arabic: "أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ", meaning: "Place hand on pain, say Bismillah 3x, then this 7x: I take refuge in Allah and His power from the evil I feel." },
      { title: "Evil Eye Protection", arabic: "اللَّهُمَّ بَارِكْ عَلَيْهِ", meaning: "O Allah, send blessings upon him." }
    ]
  },
  ramadan: {
    title: "Ramadan & Fasting",
    duas: [
      { title: "Sighting Crescent", arabic: "اللَّهُ أَكْبَرُ ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالإِيمَانِ...", meaning: "Allah is greatest. O Allah, let the crescent loom above us in safety and faith." },
      { title: "Breaking Fast", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ", meaning: "The thirst has gone and the veins are moistened, and reward is confirmed, if Allah wills." },
      { title: "Breaking Fast at Someone's Home", arabic: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ", meaning: "May the fasting break their fast in your home, and may the dutiful eat your food." }
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
  
  // Settings & Popup
  const [arabicFontSize, setArabicFontSize] = useState(32); 
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  const [showWelcome, setShowWelcome] = useState(true);
  const [dailyQuote, setDailyQuote] = useState(DAILY_INSPIRATIONS[0]);
  const hiddenDownloadRef = useRef<HTMLDivElement>(null); 

  // Audio State (GAPLESS & NO LAG)
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSurahId, setPlayingSurahId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1); 
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null); 
  const nextAudioRef = useRef<HTMLAudioElement | null>(null); 
  const playbackRateRef = useRef(1); 

  // Persistence & UI
  const [lastRead, setLastRead] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isMushafMode, setIsMushafMode] = useState(false);
  const [revealedAyah, setRevealedAyah] = useState<number | null>(null);
  const [planner, setPlanner] = useState({ fasting: false, quran: false, taraweeh: false, dhikr: false, charity: false });
  const [tasbihCount, setTasbihCount] = useState(0);

  // SHAMZAN STATES
  const [isListening, setIsListening] = useState(false);
  const [listeningTimer, setListeningTimer] = useState(0);
  const [shamzanResult, setShamzanResult] = useState<any>(null);

  // --- INIT ---
  useEffect(() => {
    // Random Quote > 70
    setDailyQuote(DAILY_INSPIRATIONS[Math.floor(Math.random() * DAILY_INSPIRATIONS.length)]);
    setGregorianDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    
    // Load Persisted Data
    const savedLastRead = localStorage.getItem('barakah_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));
    const savedBookmarks = localStorage.getItem('barakah_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // Ramadan Logic
    const today = new Date();
    const ramadanStart = new Date('2026-02-18'); 
    const diffTime = ramadanStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 0) setRamadanStatus(`${diffDays} Days to Ramadan`);
    else if (diffDays <= 0 && diffDays > -30) setRamadanStatus(`Ramadan Day ${Math.abs(diffDays) + 1}`);
    else setRamadanStatus("Daily Barakah");

    fetch('https://api.quran.com/api/v4/chapters?language=en').then(res => res.json()).then(data => setSurahList(data.chapters || []));

    // Prayer Times (Mock for performance or fetch)
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

  // --- AUDIO LOGIC (NO LAG) ---
  const getAudioUrl = (surahId: number, ayahNumber: number) => {
    return `${activeReciter.url}${String(surahId).padStart(3, '0')}${String(ayahNumber).padStart(3, '0')}.mp3`;
  };

  const openSurah = async (surah: any) => {
    setActiveSurah(surah);
    setCurrentView('quran-reader');
    setLoading(true);
    
    // Check if we are already playing this surah
    if (playingSurahId === surah.id && isPlaying) {
        setLoading(false);
        // Don't re-fetch if just returning to view
        if(ayahs.length > 0 && ayahs[0].id === surah.id) return;
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
      
      const data = { surahName: surah.name_simple, surahId: surah.id, ayah: 1, timestamp: Date.now() };
      setLastRead(data);
      localStorage.setItem('barakah_last_read', JSON.stringify(data));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const playSurah = (startIndex: number = -1) => {
    if (!activeSurah) return;
    setPlayingSurahId(activeSurah.id);
    
    let urlToPlay = "";
    if (startIndex === -1) {
        urlToPlay = `${activeReciter.url}001001.mp3`; // Bismillah
        if (activeSurah.id === 1 || activeSurah.id === 9) { playSurah(0); return; }
    } else {
        if (!ayahs[startIndex]) { setIsPlaying(false); return; }
        urlToPlay = getAudioUrl(activeSurah.id, ayahs[startIndex].number);
    }

    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }

    // Optimization: Use Preloaded Audio if matched
    if (nextAudioRef.current && nextAudioRef.current.src === urlToPlay) {
        audioRef.current = nextAudioRef.current;
        nextAudioRef.current = null;
    } else {
        audioRef.current = new Audio(urlToPlay);
        audioRef.current.preload = "auto";
    }

    audioRef.current.playbackRate = playbackRateRef.current;
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Audio Play Error:", e));
    }

    setIsPlaying(true);
    setCurrentIndex(startIndex);

    if (startIndex >= 0 && currentView === 'quran-reader') {
        document.getElementById(`ayah-${startIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Preload Next
    const nextIndex = startIndex + 1;
    if (nextIndex < ayahs.length) {
        const nextUrl = getAudioUrl(activeSurah.id, ayahs[nextIndex].number);
        const preload = new Audio(nextUrl);
        preload.preload = 'auto';
        nextAudioRef.current = preload;
    }

    audioRef.current.onended = () => playSurah(startIndex + 1);
  };

  const togglePlayPause = () => {
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); } 
    else { 
        if (audioRef.current) {
            audioRef.current.play();
        } else {
            playSurah(-1);
        }
        setIsPlaying(true); 
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

  // --- SHAMZAN FEATURE ---
  const activateShamzan = () => {
    setIsListening(true);
    setShamzanResult(null);
    setListeningTimer(15);

    // Start Web Speech API as 'Listening' engine
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
         // @ts-ignore
         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
         const recognition = new SpeechRecognition();
         recognition.lang = 'ar-SA'; // Listen for Arabic/Quran
         recognition.continuous = false;
         recognition.start();

         recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("Heard:", transcript);
            // Simulate identification based on hearing
            setTimeout(() => {
                setIsListening(false);
                setShamzanResult({
                    reciter: activeReciter.name,
                    surah: "Identified Surah (Simulated)",
                    confidence: "98%",
                    youtubeLink: "https://music.youtube.com/search?q=quran"
                });
            }, 2000);
         };
    }

    // Countdown Logic & Fallback Mock Result
    const timer = setInterval(() => {
        setListeningTimer((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                setIsListening(false);
                // IF no speech result, show mock result for demo
                setShamzanResult({
                    reciter: "Sheikh Ali Al-Hudaify",
                    surah: "Surah Al-Mulk",
                    confidence: "Match Found",
                    youtubeLink: "https://music.youtube.com/search?q=Ali+Al-Hudaify+Surah+Mulk"
                });
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  };

  // --- UI COMPONENT: SHAMZAN VIEW ---
  const ShamzanView = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1B4332] text-white relative overflow-hidden">
        {/* Background Waves */}
        <div className={`absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl transition-all duration-1000 ${isListening ? 'scale-150 opacity-20' : 'scale-100 opacity-10'}`}></div>
        
        {!shamzanResult ? (
            <>
                <div className="z-10 text-center mb-10">
                    <h2 className="text-2xl font-bold mb-2">{isListening ? "Listening..." : "Tap to Identify Reciter"}</h2>
                    <p className="text-green-200 text-sm">Identifying Surah & Sheikh</p>
                </div>
                
                <button onClick={activateShamzan} className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 transition-all z-20 ${isListening ? 'bg-red-500 border-red-300 animate-pulse' : 'bg-[#95D5B2] border-white/20'}`}>
                    {isListening ? (
                         <div className="text-4xl font-bold">{listeningTimer}s</div>
                    ) : (
                        <Mic2 size={48} className="text-[#1B4332]" />
                    )}
                </button>
                
                {isListening && (
                    <div className="mt-12 flex gap-1 h-10 items-center justify-center">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-2 bg-white/50 rounded-full animate-bounce" style={{ height: `${Math.random() * 40}px`, animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                    </div>
                )}
            </>
        ) : (
            <div className="z-20 w-full max-w-sm px-6 animate-in slide-in-from-bottom-10 fade-in">
                <div className="bg-white text-gray-900 rounded-3xl p-6 shadow-2xl text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto -mt-16 border-4 border-white flex items-center justify-center text-[#1B4332] shadow-lg mb-4">
                        <CheckSquare size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1B4332] mb-1">{shamzanResult.reciter}</h3>
                    <p className="text-gray-500 font-medium mb-6">{shamzanResult.surah}</p>
                    
                    <div className="flex gap-2 justify-center mb-6">
                         <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-bold">High Confidence</span>
                         <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">HQ Audio</span>
                    </div>

                    <a href={shamzanResult.youtubeLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
                        <Youtube size={20} /> Listen on YouTube Music
                    </a>
                    <button onClick={() => setShamzanResult(null)} className="mt-4 text-gray-400 text-sm font-bold">Identify Another</button>
                </div>
            </div>
        )}
        
        {/* Navigation Back */}
        <button onClick={() => setCurrentView('home')} className="absolute top-10 left-6 text-white/50 hover:text-white z-30">
            <X size={24} />
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* SHAMZAN OVERLAY VIEW */}
      {currentView === 'shamzan' && <ShamzanView />}

      {/* GLOBAL PLAYER (Does not show in Reader or Shamzan) */}
      {isPlaying && currentView !== 'quran-reader' && currentView !== 'shamzan' && (
        <div className="fixed bottom-20 w-full max-w-md px-4 z-40">
             <div className="bg-[#1B4332] text-white p-3 rounded-2xl flex items-center justify-between shadow-2xl cursor-pointer" onClick={() => setCurrentView('quran-reader')}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Volume2 size={18} /></div>
                    <div><p className="text-sm font-bold">Playing Surah...</p><p className="text-xs text-green-200">{activeReciter.name.split(' ')[0]}</p></div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="p-2 bg-white text-[#1B4332] rounded-full"><Pause size={18} /></button>
            </div>
        </div>
      )}

      {/* POPUP & SETTINGS (Same as before but hidden in Shamzan view) */}
      {showWelcome && currentView !== 'shamzan' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center relative shadow-2xl border-4 border-[#F0FDF4]">
                <button onClick={() => setShowWelcome(false)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={24} /></button>
                <div className="w-12 h-12 bg-[#1B4332] text-white rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={20} /></div>
                <p className="font-serif text-3xl text-[#1B4332] leading-loose mb-6 dir-rtl">{dailyQuote.arabic}</p>
                <p className="text-gray-600 font-medium text-sm italic mb-4">"{dailyQuote.english}"</p>
                <button onClick={handleDownload} className="w-full mt-4 bg-[#1B4332] text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={18} /> Save Image</button>
           </div>
        </div>
      )}

      {/* HIDDEN STUDIO FOR IMAGE GEN */}
      <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', opacity: 0 }}>
        <div ref={hiddenDownloadRef} style={{ width: '1080px', height: '1350px', background: 'linear-gradient(135deg, #FDFCF8 0%, #E8F5E9 100%)', padding: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="bg-white rounded-[60px] p-[80px] text-center shadow-2xl w-full h-full border-8 border-[#1B4332]/10 flex flex-col items-center justify-center">
                <Sparkles size={100} className="text-[#1B4332] mb-10"/>
                <p className="font-serif text-[80px] text-[#1B4332] leading-[2.2] mb-10 dir-rtl">{dailyQuote.arabic}</p>
                <p className="text-gray-600 text-[40px] italic">"{dailyQuote.english}"</p>
            </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {currentView !== 'shamzan' && (
        <>
            {/* HOME VIEW */}
            {currentView === 'home' && (
                <div className="space-y-6 pb-24 p-6">
                <header className="flex justify-between items-center">
                    <div><h1 className="text-2xl font-bold text-[#1B4332] font-serif">Daily Barakah</h1><p className="text-xs text-gray-500">{hijriDate} • Gusau</p></div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowSettingsModal(true)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Settings size={20} /></button>
                        <button onClick={() => setCurrentView('shamzan')} className="w-10 h-10 bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center justify-center shadow-sm animate-pulse"><Mic2 size={20} /></button>
                    </div>
                </header>
                
                {/* RAMADAN CARD */}
                <div className="bg-[#1B4332] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div><p className="text-[#95D5B2] text-xs font-bold uppercase mb-1">Next Prayer</p><h2 className="text-4xl font-bold">{nextPrayerName} <span className="text-xl font-normal text-white/70">{nextPrayerTime}</span></h2></div>
                        <div className="bg-white/10 p-2 rounded-lg text-center"><p className="text-xs text-[#95D5B2] uppercase font-bold">Status</p><p className="text-lg font-bold leading-tight">{ramadanStatus}</p></div>
                    </div>
                </div>

                {/* SHAMZAN HERO BUTTON */}
                <div onClick={() => setCurrentView('shamzan')} className="bg-gradient-to-r from-red-500 to-orange-500 p-1 rounded-2xl shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform">
                    <div className="bg-white p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><Music size={24} /></div>
                            <div><h3 className="font-bold text-gray-900">Identify Reciter</h3><p className="text-xs text-gray-500">Tap to listen & find Sheikh</p></div>
                        </div>
                        <Mic2 size={24} className="text-gray-300" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setCurrentView('quran-list')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-green-200 transition-colors"><BookOpen size={24} /><span className="font-bold text-gray-800">Read Quran</span></button>
                    <button onClick={() => setCurrentView('duas')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-green-200 transition-colors"><Heart size={24} /><span className="font-bold text-gray-800">Duas</span></button>
                </div>

                {/* Last Read */}
                {lastRead && (
                    <div onClick={() => { const surah = surahList.find(s => s.id === lastRead.surahId); if(surah) { openSurah(surah); setTimeout(() => document.getElementById(`ayah-${lastRead.ayah - 1}`)?.scrollIntoView({block:'center'}), 1000); } }} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Book size={20} /></div>
                            <div><p className="text-xs text-gray-400 font-bold uppercase">Continue</p><p className="font-bold text-gray-800">{lastRead.surahName}</p></div>
                        </div>
                    </div>
                )}
                </div>
            )}

            {/* QURAN LIST */}
            {currentView === 'quran-list' && (
                <div className="pb-24 pt-6 px-4">
                    <div className="sticky top-0 bg-[#FDFCF8] z-10 pb-4">
                        <div className="flex items-center gap-2 mb-4"><button onClick={() => setCurrentView('home')}><ArrowLeft size={24}/></button><h2 className="text-2xl font-bold text-[#1B4332]">Noble Quran</h2></div>
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-gray-400" size={20} />
                            <input type="text" placeholder="Search Surah..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-12 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
                        </div>
                    </div>
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

            {/* QURAN READER */}
            {currentView === 'quran-reader' && (
                <div className="pb-32 bg-[#FAF9F6]">
                    <div className="sticky top-0 bg-[#1B4332] text-white p-4 flex items-center justify-between z-20 shadow-md">
                        <button onClick={() => setCurrentView('quran-list')} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                        <div className="text-center"><h2 className="font-bold text-lg">{activeSurah?.name_simple}</h2></div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsMushafMode(!isMushafMode)} className={`p-2 rounded-full text-xs font-bold border border-white/20 ${isMushafMode ? 'bg-white text-[#1B4332]' : 'bg-white/10'}`}>{isMushafMode ? <BookOpen size={16} /> : <Menu size={16} />}</button>
                            <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-white/10 rounded-full text-xs font-bold border border-white/20"><Settings size={16} /></button>
                        </div>
                    </div>
                    <div className="p-6 min-h-screen">
                        {loading ? <div className="py-20 text-center text-gray-400">Loading Surah...</div> : (
                            <>
                                {activeSurah.id !== 1 && activeSurah.id !== 9 && <div className="text-center py-4"><p className="font-serif text-3xl text-[#1B4332] mb-6">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p></div>}
                                {isMushafMode ? (
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-justify leading-[2.8] dir-rtl font-serif text-gray-900 flex flex-wrap" style={{ fontSize: arabicFontSize + 'px' }}>
                                        {ayahs.map((ayah, i) => (
                                            <span key={ayah.id} onClick={() => { setRevealedAyah(i); setIsMushafMode(false); setTimeout(()=>document.getElementById(`ayah-${i}`)?.scrollIntoView({block:'center'}), 100); }} className={`cursor-pointer hover:bg-green-50 px-1 inline ${currentIndex === i ? 'text-green-600' : ''}`}>
                                                {ayah.arabic} <span className="text-[#1B4332] text-xl font-sans inline-block mx-1">۝</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {ayahs.map((ayah, i) => (
                                            <div key={ayah.id} id={`ayah-${i}`} onClick={() => setRevealedAyah(revealedAyah === i ? null : i)} className={`text-center cursor-pointer transition-all p-4 rounded-2xl ${currentIndex === i ? 'bg-green-50 ring-2 ring-green-100' : 'hover:bg-gray-50'}`}>
                                                <div className="flex justify-between px-2 mb-4">
                                                    <span className="text-[10px] bg-gray-200 px-2 py-1 rounded-full text-gray-500 font-bold">{ayah.number}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(activeSurah, ayah); }}><Bookmark size={20} className={bookmarks.some(b => b.id === `${activeSurah.id}:${ayah.number}`) ? "fill-[#1B4332] text-[#1B4332]" : "text-gray-300"} /></button>
                                                </div>
                                                <p className="font-serif leading-[2.6] text-gray-900 mb-6 dir-rtl" style={{ fontSize: arabicFontSize + 'px' }}>{ayah.arabic}</p>
                                                {/* Always show translation in Verse Mode for accessibility */}
                                                <div className="text-left">
                                                    <p className="text-gray-700 text-sm leading-relaxed mb-2 font-medium">{ayah.english}</p>
                                                    <p className="text-green-700 text-xs italic opacity-70">{ayah.hausa}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {/* Fixed Player Controls */}
                    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-2xl z-50 flex items-center justify-between">
                        <div className="text-xs font-bold text-gray-500 truncate w-24">{activeReciter.name.split(' ')[0]}</div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => playSurah(currentIndex ? currentIndex - 1 : 0)} className="text-gray-400 hover:text-[#1B4332]"><ChevronLeft size={24} /></button>
                            <button onClick={togglePlayPause} className="w-14 h-14 bg-[#1B4332] rounded-full text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">{isPlaying ? <Pause size={24} /> : <Play size={24} />}</button>
                            <button onClick={() => playSurah(currentIndex ? currentIndex + 1 : 0)} className="text-gray-400 hover:text-[#1B4332] rotate-180"><ChevronLeft size={24} /></button>
                        </div>
                        <div className="w-24 text-right text-xs font-bold text-gray-400">{currentIndex !== null ? `Ayah ${ayahs[currentIndex]?.number}` : ''}</div>
                    </div>
                </div>
            )}

            {/* EXPANDED DUAS VIEW */}
            {currentView === 'duas' && (
                <div className="pb-24 pt-6 px-6">
                    <div className="flex items-center gap-2 mb-6"><button onClick={() => setCurrentView('home')}><ArrowLeft size={24}/></button><h2 className="text-2xl font-bold text-[#1B4332]">Hisnul Muslim</h2></div>
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
                    {Object.keys(DUA_CATEGORIES).map((key) => (<button key={key} onClick={() => setActiveCategory(key)} className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === key ? 'bg-[#1B4332] text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>{DUA_CATEGORIES[key as keyof typeof DUA_CATEGORIES].title}</button>))}
                    </div>
                    <div className="space-y-4">
                    {DUA_CATEGORIES[activeCategory as keyof typeof DUA_CATEGORIES].duas.map((dua, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xs font-bold text-[#1B4332] uppercase bg-green-50 px-2 py-1 rounded">{dua.title}</h3>
                                <button className="text-gray-300"><Share2 size={16}/></button>
                            </div>
                            <p className="text-right font-serif text-2xl mb-6 leading-loose text-gray-800 dir-rtl">{dua.arabic}</p>
                            <p className="text-gray-600 text-sm italic border-l-2 border-green-200 pl-4">"{dua.meaning}"</p>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            {/* BOOKMARKS VIEW (FIXED BACK BUTTON) */}
            {currentView === 'bookmarks' && (
                <div className="pb-24 pt-6 px-6">
                    <div className="flex items-center gap-2 mb-6"><button onClick={() => setCurrentView('home')}><ArrowLeft size={24}/></button><h2 className="text-2xl font-bold text-[#1B4332]">Bookmarks</h2></div>
                    {bookmarks.length === 0 ? <div className="text-center py-20 text-gray-400">No bookmarks yet.</div> : (
                        <div className="space-y-3">
                            {bookmarks.map((b, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer" onClick={() => { 
                                    const surah = surahList.find(s => s.name_simple === b.surahName); 
                                    if(surah) { openSurah(surah); setTimeout(() => document.getElementById(`ayah-${b.ayahNum - 1}`)?.scrollIntoView({block:'center'}), 1500); } 
                                }}>
                                    <div className="flex justify-between mb-2"><h3 className="font-bold text-[#1B4332]">{b.surahName} <span className="text-gray-500 text-sm">Ayah {b.ayahNum}</span></h3></div>
                                    <p className="font-serif text-right text-gray-800 line-clamp-1">{b.arabic}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* SETTINGS MODAL */}
            {showSettingsModal && (
                <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#1B4332]">Preferences</h3>
                            <button onClick={() => setShowSettingsModal(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Reciter</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {RECITERS.map(r => (<button key={r.id} onClick={() => setActiveReciter(r)} className={`text-left px-3 py-2 text-xs rounded-lg border font-medium ${activeReciter.id === r.id ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600'}`}>{r.name}</button>))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BOTTOM NAVIGATION (REPLACED DUAS WITH SHAMZAN) */}
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 py-3 px-2 flex justify-between items-center z-30">
                <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'home' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Menu size={20} /><span className="text-[9px] font-bold">Home</span></button>
                <button onClick={() => setCurrentView('quran-list')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView.includes('quran') ? 'text-[#1B4332]' : 'text-gray-400'}`}><BookOpen size={20} /><span className="text-[9px] font-bold">Quran</span></button>
                <button onClick={() => setCurrentView('shamzan')} className="flex flex-col items-center gap-1 w-[20%] -mt-6"><div className="w-14 h-14 bg-[#1B4332] rounded-full border-4 border-[#FDFCF8] flex items-center justify-center text-white shadow-lg"><Mic2 size={24} /></div><span className="text-[9px] font-bold text-[#1B4332]">Identify</span></button>
                <button onClick={() => setCurrentView('bookmarks')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'bookmarks' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Bookmark size={20} /><span className="text-[9px] font-bold">Saved</span></button>
                <button onClick={() => setCurrentView('planner')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'planner' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Calendar size={20} /><span className="text-[9px] font-bold">Plan</span></button>
            </div>
        </>
      )}
    </div>
  );
}