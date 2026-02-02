'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Moon, Sun, Play, Pause, ChevronLeft, Search, Calendar, 
  CheckSquare, Heart, Share2, Menu, Mic, Volume2, Type, Repeat, 
  RefreshCw, X, Sparkles, Download, Mail, Clock, Gauge, Settings, 
  Globe, Bookmark, Book, Mic2
} from 'lucide-react';
import { toPng } from 'html-to-image';

// --- 1. RECITERS DATA ---
const RECITERS = [
  { id: "mishary", name: "Mishary Alafasy", url: "https://everyayah.com/data/Alafasy_128kbps/" },
  { id: "hussary", name: "Mahmoud Al-Hussary", url: "https://everyayah.com/data/Husary_128kbps/" },
  { id: "sudais", name: "Abdur-Rahman as-Sudais", url: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
  { id: "basit", name: "Abdul Basit (Murattal)", url: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/" },
  { id: "maher", name: "Maher Al Muaiqly", url: "https://everyayah.com/data/MaherAlMuaiqly128kbps/" },
  { id: "juhany", name: "Abdallah Al Juhany", url: "https://everyayah.com/data/Abdullaah_3awwaad_Al-Juhaynee_128kbps/" },
  { id: "dossary", name: "Yasser Al Dossary", url: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/" },
];

// --- 2. MASSIVE DAILY INSPIRATIONS (50+) ---
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
  { arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", english: "None of you truly believes until he loves for his brother what he loves for himself.", ref: "Hadith Bukhari" },
  { arabic: "ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ", english: "Show mercy to those on earth, and the One in the heavens will show mercy to you.", ref: "Hadith Tirmidhi" },
  { arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ", english: "The best of people are those that bring most benefit to the rest of mankind.", ref: "Hadith Daraqutni" },
  { arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", english: "Your smile for your brother is charity.", ref: "Hadith Tirmidhi" },
  { arabic: "أَلاَ بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Unquestionably, by the remembrance of Allah hearts are assured.", ref: "Quran 13:28" },
  { arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", english: "And Allah loves the doers of good.", ref: "Quran 3:134" },
  { arabic: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا", english: "Say, 'Never will we be struck except by what Allah has decreed for us.'", ref: "Quran 9:51" },
  { arabic: "وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", english: "And He is over all things competent.", ref: "Quran 67:1" },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", english: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good.", ref: "Quran 2:201" },
  { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", english: "And when My servants ask you concerning Me - indeed I am near.", ref: "Quran 2:186" },
  { arabic: "مَنْ تَرَكَ شَيْئًا لِلَّهِ عَوَّضَهُ اللَّهُ خَيْرًا مِنْهُ", english: "Whoever gives up something for the sake of Allah, Allah will replace it with something better.", ref: "Hadith Ahmad" },
  { arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ", english: "Cleanliness is half of faith.", ref: "Hadith Muslim" },
  { arabic: "إِيَّاكُمْ وَالظَّنَّ فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ", english: "Beware of suspicion, for suspicion is the worst of false tales.", ref: "Hadith Bukhari" },
  { arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ", english: "The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.", ref: "Hadith Bukhari" },
  { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", english: "And seek help through patience and prayer.", ref: "Quran 2:45" },
  { arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ", english: "Charity does not decrease wealth.", ref: "Hadith Muslim" },
  { arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ", english: "The world is a prison for the believer and a paradise for the unbeliever.", ref: "Hadith Muslim" },
  { arabic: "يَسِّرُوا وَلاَ تُعَسِّرُوا", english: "Make things easy and do not make them difficult.", ref: "Hadith Bukhari" },
  { arabic: "فَصَبْرٌ جَمِيلٌ", english: "So patience is most fitting.", ref: "Quran 12:18" },
  { arabic: "إِنَّ رَحْمَتِي سَبَقَتْ غَضَبِي", english: "Verily, My Mercy prevails over My Wrath.", ref: "Hadith Bukhari (Qudsi)" },
  { arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", english: "Every soul will taste death.", ref: "Quran 3:185" },
  { arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", english: "And I did not create the jinn and mankind except to worship Me.", ref: "Quran 51:56" },
  { arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ", english: "Paradise lies under the feet of your mother.", ref: "Hadith Nasai" },
  { arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", english: "Do not despair of the mercy of Allah.", ref: "Quran 39:53" },
  { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", english: "And say, 'My Lord, increase me in knowledge.'", ref: "Quran 20:114" },
  { arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ", english: "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.", ref: "Quran 2:222" },
  { arabic: "عَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", english: "But perhaps you hate a thing and it is good for you.", ref: "Quran 2:216" },
  { arabic: "مَنْ صَمَتَ نَجَا", english: "Whoever remains silent is saved.", ref: "Hadith Tirmidhi" },
  { arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ", english: "Fear Allah wherever you are.", ref: "Hadith Tirmidhi" },
  { arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", english: "The most beloved deeds to Allah are those that are most consistent, even if they are small.", ref: "Hadith Bukhari" },
  { arabic: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ", english: "Be in this world as if you were a stranger or a traveler.", ref: "Hadith Bukhari" },
  { arabic: "وَإِن تَعُدُّوا نِعْمَتَ اللَّهِ لَا تُحْصُوهَا", english: "And if you should count the favors of Allah, you could not enumerate them.", ref: "Quran 14:34" },
  { arabic: "فَفِرُّوا إِلَى اللَّهِ", english: "So flee to Allah.", ref: "Quran 51:50" },
  { arabic: "وَكَفَىٰ بِاللَّهِ وَكِيلًا", english: "And sufficient is Allah as Disposer of affairs.", ref: "Quran 4:81" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", english: "My Lord, expand for me my breast [with assurance].", ref: "Quran 20:25" },
];

// --- 3. FULL HISN AL-MUSLIM (Expanded Categories) ---
const DUA_CATEGORIES = {
  morning_evening: {
    title: "Morning & Evening",
    duas: [
      { 
        title: "Ayatul Kursi", 
        arabic: "ٱللَّهُ لَاۤ إِلَـٰهَ إِلَّا هُوَ ٱلۡحَیُّ ٱلۡقَیُّومُ ۚ لَا تَأۡخُذُهُۥ سِنَةࣱ وَلَا نَوۡمࣱ ۚ لَّهُۥ مَا فِی ٱلسَّمَـٰوَ ٰ⁠تِ وَمَا فِی ٱلۡأَرۡضِ ۗ مَن ذَا ٱلَّذِی یَشۡفَعُ عِندَهُۥۤ إِلَّا بِإِذۡنِهِۦ ۚ یَعۡلَمُ مَا بَیۡنَ أَیۡدِیهِمۡ وَمَا خَلۡفَهُمۡ ۖ وَلَا یُحِیطُونَ بِشَیۡءࣲ مِّنۡ عِلۡمِهِۦۤ إِلَّا بِمَا شَاۤءَ ۚ وَسِعَ كُرۡسِیُّهُ ٱلسَّمَـٰوَ ٰ⁠تِ وَٱلۡأَرۡضَ ۖ وَلَا یَـُٔودُهُۥ حِفۡظُهُمَا ۚ وَهُوَ ٱلۡعَلِیُّ ٱلۡعَظِیمُ", 
        meaning: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence..." 
      },
      { 
        title: "The 3 Quls (Protection)", 
        arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ \n\n قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ \n\n قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝ مَلِكِ ٱلنَّاسِ ۝ إِلَـٰهِ ٱلنَّاسِ ۝ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۝ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", 
        meaning: "Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas (3 times each morning and evening)." 
      },
      { 
        title: "Sayyidul Istighfar", 
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", 
        meaning: "O Allah, You are my Lord. There is no god but You. You created me and I am Your slave..." 
      },
    ]
  },
  daily_life: {
    title: "Daily Life",
    duas: [
      { title: "Waking Up", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", meaning: "Praise is to Allah Who gives us life after He has caused us to die and to Him is the return." },
      { title: "Before Eating", arabic: "بِسْمِ اللَّهِ", meaning: "In the name of Allah." },
      { title: "Leaving Home", arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ", meaning: "In the name of Allah, I trust in Allah; there is no might and no power but in Allah." },
      { title: "Entering Mosque", arabic: "اللّهُـمَّ افْتَـحْ لي أَبْوابَ رَحْمَتـِك", meaning: "O Allah, open the gates of Your mercy for me." },
    ]
  },
  travel: {
    title: "Travel",
    duas: [
      { title: "Mounting Vehicle", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ", meaning: "Glory to Him who has subjected this to us..." },
      { title: "Travel Prayer", arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى...", meaning: "O Allah, we ask You on this journey for righteousness and piety..." },
    ]
  },
  protection: {
    title: "Protection & Ruqyah",
    duas: [
      { title: "Protection from Harm", arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", meaning: "In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm. (3x)" },
      { title: "When in Fear", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", meaning: "Allah is sufficient for us and He is the Best Disposer of affairs." },
    ]
  },
  ramadan: {
    title: "Ramadan & Fasting",
    duas: [
      { title: "Breaking Fast", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", meaning: "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills." },
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
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [ramadanStatus, setRamadanStatus] = useState("Loading...");
  
  // Settings & Popup
  const [arabicFontSize, setArabicFontSize] = useState(32); 
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  const [showWelcome, setShowWelcome] = useState(true);
  const [dailyQuote, setDailyQuote] = useState(DAILY_INSPIRATIONS[0]);
  const hiddenDownloadRef = useRef<HTMLDivElement>(null); 

  // Audio State & Logic (FIXED)
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSurahId, setPlayingSurahId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1); 
  const playbackRateRef = useRef(1); 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistence
  const [lastRead, setLastRead] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // UI Modes
  const [isMushafMode, setIsMushafMode] = useState(false);
  const [revealedAyah, setRevealedAyah] = useState<number | null>(null);

  // Planner & Tasbih
  const [planner, setPlanner] = useState({ fasting: false, quran: false, taraweeh: false, dhikr: false, charity: false });
  const [tasbihCount, setTasbihCount] = useState(0);

  // --- INIT ---
  useEffect(() => {
    setDailyQuote(DAILY_INSPIRATIONS[Math.floor(Math.random() * DAILY_INSPIRATIONS.length)]);
    setGregorianDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    
    // Load Saved Data
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=3`);
          const data = await res.json();
          setPrayerTimes(data.data.timings);
          const h = data.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
        } catch (e) { console.error(e); }
      });
    }
  }, []);

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

  // --- AUDIO LOGIC (STABLE VERSION) ---
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
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const playSurah = (startIndex: number = -1) => {
    if (!activeSurah) return;
    setPlayingSurahId(activeSurah.id);
    if (audioRef.current) audioRef.current.pause();
    
    let url = startIndex === -1 ? `${activeReciter.url}001001.mp3` : `${activeReciter.url}${String(activeSurah.id).padStart(3, '0')}${String(ayahs[startIndex].number).padStart(3, '0')}.mp3`;
    if (startIndex === -1 && (activeSurah.id === 1 || activeSurah.id === 9)) { playSurah(0); return; }
    if (startIndex >= 0 && !ayahs[startIndex]) { setIsPlaying(false); return; }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.playbackRate = playbackRateRef.current;
    
    audio.play().catch(e => console.log("Audio Play Error:", e));
    setIsPlaying(true);
    setCurrentIndex(startIndex);
    
    if (startIndex >= 0 && currentView === 'quran-reader') {
        document.getElementById(`ayah-${startIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    if(startIndex >= 0) {
        const data = { surahName: activeSurah.name_simple, surahId: activeSurah.id, ayah: ayahs[startIndex].number, timestamp: Date.now() };
        setLastRead(data);
        localStorage.setItem('barakah_last_read', JSON.stringify(data));
    }

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

  // --- BOOKMARKS ---
  const toggleBookmark = (surah: any, ayah: any) => {
    const newBookmark = { id: `${surah.id}:${ayah.number}`, surahName: surah.name_simple, ayahNum: ayah.number, arabic: ayah.arabic };
    let newBookmarks = [...bookmarks];
    const exists = newBookmarks.find(b => b.id === newBookmark.id);
    if (exists) newBookmarks = newBookmarks.filter(b => b.id !== newBookmark.id);
    else newBookmarks = [newBookmark, ...newBookmarks];
    setBookmarks(newBookmarks);
    localStorage.setItem('barakah_bookmarks', JSON.stringify(newBookmarks));
  };

  // --- VOICE SEARCH ---
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase().replace('.', '');
            setSearchQuery(transcript);
        };
    } else {
        alert("Voice search not supported.");
    }
  };

  // --- COMPONENT: CARD ---
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
      
      {/* GLOBAL PLAYER */}
      {isPlaying && currentView !== 'quran-reader' && (
        <div className="fixed bottom-16 w-full max-w-md bg-[#1B4332] text-white p-3 z-40 flex items-center justify-between shadow-lg cursor-pointer" onClick={() => setCurrentView('quran-reader')}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Volume2 size={16} /></div>
                <div><p className="text-xs font-bold">Playing Surah...</p><p className="text-[10px] text-green-200">{activeReciter.name.split(' ')[0]}</p></div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="p-2 bg-white text-[#1B4332] rounded-full"><Pause size={16} /></button>
        </div>
      )}

      {/* POPUP */}
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

      {/* SETTINGS */}
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

      {/* HIDDEN STUDIO */}
      <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', opacity: 0, zIndex: -1 }}>
        <div ref={hiddenDownloadRef} style={{ width: '1080px', height: '1350px', background: 'linear-gradient(135deg, #FDFCF8 0%, #E8F5E9 100%)', padding: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}><div className="bg-white rounded-[60px] p-[80px] text-center shadow-2xl w-full h-full border-8 border-[#1B4332]/10 flex flex-col box-border"><HighResCardContent /></div></div>
      </div>

      {/* VIEWS */}
      {currentView === 'home' && (
        <div className="space-y-6 pb-24 p-6">
          <header className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-[#1B4332] font-serif">Daily Barakah</h1><p className="text-xs text-gray-500">{hijriDate} • Gusau</p></div>
            <div className="flex gap-2">
                <button onClick={() => setShowSettingsModal(true)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Settings size={20} /></button>
                <button className="w-10 h-10 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#1B4332]"><Moon size={20} /></button>
            </div>
          </header>
          
          <div className="bg-[#1B4332] rounded-3xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div><p className="text-[#95D5B2] text-xs font-bold uppercase mb-1">Next Prayer</p><h2 className="text-4xl font-bold">Asr <span className="text-xl font-normal text-white/70">{prayerTimes?.Asr || "--:--"}</span></h2></div>
                <div className="bg-white/10 p-2 rounded-lg text-center"><p className="text-xs text-[#95D5B2] uppercase font-bold">Status</p><p className="text-lg font-bold leading-tight">{ramadanStatus}</p></div>
            </div>
            <div className="flex justify-between text-center border-t border-white/20 pt-4">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (<div key={p} className="flex flex-col"><span className="text-[10px] text-[#95D5B2] uppercase">{p}</span><span className="font-bold text-sm">{prayerTimes ? prayerTimes[p] : "--:--"}</span></div>))}
            </div>
          </div>

          {lastRead && (
             <div onClick={() => { const surah = surahList.find(s => s.id === lastRead.surahId); if(surah) { openSurah(surah); setTimeout(() => document.getElementById(`ayah-${lastRead.ayah - 1}`)?.scrollIntoView({block:'center'}), 1000); } }} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between cursor-pointer hover:bg-orange-50 transition-colors">
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
            <div className="relative mb-4 flex items-center">
                <Search className="absolute left-4 text-gray-400" size={20} />
                <input type="text" placeholder="Search Surah or say 'Mulk'" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-12 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
                <button onClick={startVoiceSearch} className="absolute right-3 p-2 bg-green-100 rounded-full text-green-700 hover:bg-[#1B4332] hover:text-white transition-colors"><Mic size={18} /></button>
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

      {currentView === 'bookmarks' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Your Bookmarks</h2>
            {bookmarks.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No bookmarks yet. Tap the bookmark icon while reading a Surah.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookmarks.map((b, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-[#1B4332]">{b.surahName} <span className="text-gray-500 text-sm font-normal">Ayah {b.ayahNum}</span></h3>
                                <button onClick={() => { const newB = bookmarks.filter(x => x.id !== b.id); setBookmarks(newB); localStorage.setItem('barakah_bookmarks', JSON.stringify(newB)); }}><X size={16} className="text-gray-400" /></button>
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
                <div className="text-center"><h2 className="font-bold text-lg">{activeSurah?.name_simple}</h2><p className="text-xs text-green-200">{activeSurah?.verses_count} Ayahs</p></div>
                <div className="flex gap-2">
                    <button onClick={() => setIsMushafMode(!isMushafMode)} className={`p-2 rounded-full text-xs font-bold border border-white/20 ${isMushafMode ? 'bg-white text-[#1B4332]' : 'bg-white/10'}`}>{isMushafMode ? <BookOpen size={16} /> : <Menu size={16} />}</button>
                    <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-white/10 rounded-full text-xs font-bold border border-white/20"><Settings size={16} /></button>
                </div>
            </div>
            <div className="p-6">
                {loading ? <div className="py-20 text-center text-gray-400">Loading Surah...</div> : (
                    <>
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
                            <div className="space-y-6">
                                {activeSurah.id !== 1 && activeSurah.id !== 9 && <div className="text-center py-4"><p className="font-serif text-3xl text-[#1B4332]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p></div>}
                                {ayahs.map((ayah, i) => (
                                    <div key={ayah.id} id={`ayah-${i}`} onClick={() => setRevealedAyah(revealedAyah === i ? null : i)} className={`text-center cursor-pointer transition-all p-2 rounded-xl ${currentIndex === i ? 'bg-green-50/80 scale-105' : ''}`}>
                                        <div className="flex justify-between px-2 mb-2">
                                            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-bold">{ayah.number}</span>
                                            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(activeSurah, ayah); }}><Bookmark size={20} className={bookmarks.some(b => b.id === `${activeSurah.id}:${ayah.number}`) ? "fill-[#1B4332] text-[#1B4332]" : "text-gray-300"} /></button>
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
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'home' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Menu size={20} /><span className="text-[9px] font-bold">Home</span></button>
          <button onClick={() => setCurrentView('quran-list')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView.includes('quran') ? 'text-[#1B4332]' : 'text-gray-400'}`}><BookOpen size={20} /><span className="text-[9px] font-bold">Quran</span></button>
          <button onClick={() => setCurrentView('bookmarks')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'bookmarks' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Bookmark size={20} /><span className="text-[9px] font-bold">Saved</span></button>
          <button onClick={() => setCurrentView('tasbih')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'tasbih' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Repeat size={20} /><span className="text-[9px] font-bold">Tasbih</span></button>
          <button onClick={() => setCurrentView('duas')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'duas' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Heart size={20} /><span className="text-[9px] font-bold">Duas</span></button>
          <button onClick={() => setCurrentView('planner')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'planner' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Calendar size={20} /><span className="text-[9px] font-bold">Plan</span></button>
        </div>
      )}
    </div>
  );
}