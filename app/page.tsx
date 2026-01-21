'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Moon, Sun, Play, Pause, Info, Loader2, MapPin, Repeat, X, Mic2, ChevronDown, Heart, Share2 } from 'lucide-react';

// --- CONSTANTS ---
const SURAHS = [
  { 
    id: 67, 
    name: "Al-Mulk", 
    meaning: "The Sovereignty", 
    purpose: "Read at night for protection from the grave.", 
    icon: <Moon size={20} /> 
  },
  { 
    id: 56, 
    name: "Al-Waqi'a", 
    meaning: "The Inevitable", 
    purpose: "Read for Rizq (Sustenance) expansion.", 
    icon: <Sun size={20} /> 
  }
];

// --- RECITER OPTIONS ---
const RECITERS = [
  { id: "mishary", name: "Mishary Rashid Alafasy", url: "https://everyayah.com/data/Alafasy_128kbps/" },
  { id: "hussary", name: "Mahmoud Khalil Al-Hussary", url: "https://everyayah.com/data/Husary_128kbps/" },
  { id: "basit", name: "Abdul Basit (Murattal)", url: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/" },
  { id: "sudais", name: "Abdur-Rahman as-Sudais", url: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
];

export default function QuranApp() {
  const [activeSurah, setActiveSurah] = useState(SURAHS[0]);
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]); 
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Audio State
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Prayer & Location State
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [locationName, setLocationName] = useState("Detecting Location...");
  const [hijriDate, setHijriDate] = useState("");

  // Modals State
  const [showTasbih, setShowTasbih] = useState(false);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [showSupport, setShowSupport] = useState(false);

  // --- 1. GET PRAYER TIMES ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const locRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
          const locData = await locRes.json();
          setLocationName(locData.city || locData.locality || "Nigeria");

          const date = new Date();
          const timestamp = Math.floor(date.getTime() / 1000);
          const prayerRes = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=3`);
          const prayerData = await prayerRes.json();
          
          setPrayerTimes(prayerData.data.timings);
          const h = prayerData.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year}`);

        } catch (e) {
          console.error("Location Error:", e);
          setLocationName("Nigeria (Default)");
        }
      }, () => {
        setLocationName("Location Access Denied");
      });
    }
  }, []);

  // --- 2. FETCH QURAN DATA ---
  const fetchSurahData = async (surahId: number) => {
    setLoading(true);
    setPlayingIndex(null);
    setIsPlaying(false);

    try {
      const quranComRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=en&words=true&translations=20&per_page=160&fields=text_uthmani`);
      const quranData = await quranComRes.json();

      const hausaRes = await fetch(`https://quranenc.com/api/v1/translation/sura/hausa_gummi/${surahId}`);
      const hausaData = await hausaRes.json();

      const processed = quranData.verses.map((verse: any, index: number) => {
        const engObj = verse.translations.find((t: any) => t.resource_id === 20);
        const hausaText = hausaData.result[index]?.translation || "Tarjama tana lodawa...";
        
        return {
          id: verse.id,
          number: verse.verse_number,
          arabic: verse.text_uthmani,
          english: engObj ? engObj.text.replace(/<[^>]*>?/gm, '') : "Translation loading...",
          hausa: hausaText,
          audioUrl: `${activeReciter.url}${String(surahId).padStart(3, '0')}${String(verse.verse_number).padStart(3, '0')}.mp3`
        };
      });

      setAyahs(processed);
    } catch (error) {
      console.error("Error fetching Surah:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurahData(activeSurah.id);
  }, [activeSurah, activeReciter]);

  // --- 3. AUDIO ENGINE ---
  useEffect(() => {
    if (playingIndex !== null && ayahs[playingIndex]) {
      const url = ayahs[playingIndex].audioUrl;
      
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
      
      audioRef.current.play();
      setIsPlaying(true);

      document.getElementById(`ayah-${playingIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      audioRef.current.onended = () => {
        if (playingIndex < ayahs.length - 1) {
          setPlayingIndex(prev => (prev !== null ? prev + 1 : null));
        } else {
          setIsPlaying(false);
          setPlayingIndex(null);
        }
      };
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [playingIndex, ayahs]);

  const togglePlay = (index: number) => {
    if (playingIndex === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setPlayingIndex(index);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied! Share it on WhatsApp.");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans pb-32 text-gray-900" suppressHydrationWarning>
      
      {/* HEADER */}
      <header className="bg-[#1B4332] text-white rounded-b-3xl shadow-xl sticky top-0 z-30 overflow-hidden">
        <div className="p-6 pb-4">
          <div className="max-w-2xl mx-auto flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-wide font-serif">Daily Barakah</h1>
              <div className="flex flex-col mt-1">
                <div className="flex items-center gap-1 text-[#95D5B2] text-xs uppercase tracking-widest">
                  <MapPin size={12} />
                  <span>{locationName}</span>
                </div>
                {hijriDate && <span className="text-[10px] text-white/60 mt-1 font-medium">{hijriDate}</span>}
              </div>
            </div>
            <BookOpen size={28} className="text-[#D8F3DC]" />
          </div>

          {/* RECITER SELECTOR */}
          <div className="max-w-2xl mx-auto mt-4">
            <div className="bg-[#2D6A4F] p-2 rounded-xl flex items-center justify-between cursor-pointer border border-[#40916C]">
              <div className="flex items-center gap-2 text-xs font-medium text-[#D8F3DC] pl-2">
                <Mic2 size={14} />
                <span>Reciter:</span>
              </div>
              <div className="relative">
                <select 
                  value={activeReciter.id}
                  onChange={(e) => setActiveReciter(RECITERS.find(r => r.id === e.target.value) || RECITERS[0])}
                  className="bg-transparent text-white font-bold text-xs appearance-none pr-6 outline-none cursor-pointer text-right"
                >
                  {RECITERS.map(r => (
                    <option key={r.id} value={r.id} className="text-gray-900">{r.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-0.5 text-white pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* PRAYER TIMES */}
        {prayerTimes && (
          <div className="bg-[#2D6A4F] px-4 py-3 border-t border-[#40916C]">
            <div className="max-w-2xl mx-auto flex justify-between text-center">
              {[
                { name: 'Fajr', time: prayerTimes.Fajr },
                { name: 'Dhuhr', time: prayerTimes.Dhuhr },
                { name: 'Asr', time: prayerTimes.Asr },
                { name: 'Maghrib', time: prayerTimes.Maghrib },
                { name: 'Isha', time: prayerTimes.Isha },
              ].map((prayer) => (
                <div key={prayer.name} className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-[10px] text-[#95D5B2] uppercase font-bold group-hover:text-white transition-colors">{prayer.name}</span>
                  <span className="text-xs font-bold text-white">{prayer.time.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6 mt-2">
        {/* TABS */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
          {SURAHS.map((surah) => (
            <button
              key={surah.id}
              onClick={() => setActiveSurah(surah)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${
                activeSurah.id === surah.id ? 'bg-[#2D6A4F] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {surah.icon}
              <span>{surah.name}</span>
            </button>
          ))}
        </div>

        {/* INFO CARD */}
        <div className="bg-[#D8F3DC] border border-[#B7E4C7] p-4 rounded-xl flex items-start gap-3">
          <div className="bg-[#2D6A4F] text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs shrink-0 mt-1">
            <Info size={14} />
          </div>
          <div>
            <h3 className="font-bold text-[#1B4332] text-sm">{activeSurah.meaning}</h3>
            <p className="text-xs text-[#40916C]">{activeSurah.purpose}</p>
          </div>
        </div>

        {/* AYAH LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 size={48} className="animate-spin mb-4 text-[#2D6A4F]" />
            <p>Loading {activeSurah.name}...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ayahs.map((ayah, index) => {
              const isActive = playingIndex === index;
              return (
                <div 
                  key={ayah.id} 
                  id={`ayah-${index}`}
                  className={`p-5 rounded-2xl transition-all duration-500 border ${isActive ? 'bg-[#F0FDF4] border-[#2D6A4F] shadow-md scale-[1.02]' : 'bg-white border-gray-100 hover:border-[#95D5B2]'}`}
                >
                  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${isActive ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      Ayah {ayah.number}
                    </span>
                    <button 
                      onClick={() => togglePlay(index)}
                      className={`transition-transform active:scale-95 p-2 rounded-full ${isActive ? 'bg-[#2D6A4F] text-white' : 'text-gray-300 hover:text-[#2D6A4F]'}`}
                    >
                      {isActive && isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                    </button>
                  </div>

                  <p className="text-right font-serif text-3xl leading-[2.5] text-gray-900 mb-6" style={{ fontFamily: 'Traditional Arabic, serif' }}>
                    {ayah.arabic}
                  </p>

                  <div className="mb-4">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-wider">English</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-serif">{ayah.english}</p>
                  </div>

                  <div className={`p-3 rounded-lg border-l-4 ${isActive ? 'bg-white border-[#2D6A4F]' : 'bg-gray-50 border-gray-300'}`}>
                    <p className="text-[10px] text-[#2D6A4F] uppercase font-bold mb-1 tracking-wider">Hausa (Gumi)</p>
                    <p className="text-gray-900 text-sm font-medium leading-relaxed">{ayah.hausa}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FLOATING CONTROLS */}
      
      {/* 1. Share/Reward Button (Left) */}
      <div className="fixed bottom-6 left-6 z-40">
         <button 
          onClick={() => setShowSupport(true)}
          className="bg-red-100 text-red-600 p-4 rounded-full shadow-xl hover:scale-110 transition-transform border-2 border-red-200"
        >
          <Heart size={24} fill="currentColor" />
        </button>
      </div>

      {/* 2. Play/Pause (Center) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1B4332] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-40 hover:scale-105 transition-transform">
         <button onClick={() => playingIndex !== null && togglePlay(playingIndex)}>
           {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
         </button>
         <div className="text-xs font-bold border-l border-[#40916C] pl-4">
            {isPlaying ? `Ayah ${ayahs[playingIndex!]?.number}` : "Tap Ayah"}
         </div>
      </div>

      {/* 3. Tasbih (Right) */}
      <button 
        onClick={() => setShowTasbih(true)}
        className="fixed bottom-6 right-6 bg-[#D8F3DC] text-[#1B4332] p-4 rounded-full shadow-xl hover:scale-110 transition-transform z-40 border-2 border-[#1B4332]"
      >
        <Repeat size={24} />
      </button>

      {/* TASBIH MODAL */}
      {showTasbih && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative">
            <button onClick={() => setShowTasbih(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-[#1B4332] mb-2">Digital Tasbih</h2>
            <p className="text-gray-500 text-sm mb-8">SubhanAllah • Alhamdulillah • Allahu Akbar</p>
            <div 
              onClick={() => setTasbihCount(c => c + 1)}
              className="w-48 h-48 bg-[#F0FDF4] rounded-full mx-auto flex items-center justify-center border-4 border-[#2D6A4F] cursor-pointer active:scale-95 transition-all shadow-inner select-none"
            >
              <span className="text-6xl font-bold text-[#1B4332]">{tasbihCount}</span>
            </div>
            <p className="text-gray-400 text-xs mt-6 uppercase tracking-widest">Tap Circle to Count</p>
            <button onClick={() => setTasbihCount(0)} className="mt-6 text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg">Reset Counter</button>
          </div>
        </div>
      )}

      {/* SHARE MODAL (Pure Sadaqah) */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setShowSupport(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-4">
               <div className="bg-red-100 p-3 rounded-full text-red-500">
                 <Heart size={32} fill="currentColor" />
               </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Share the Barakah</h2>
            <p className="text-gray-500 text-sm text-center mb-6">"Whoever guides someone to goodness will have a reward like one who did it."</p>
            
            <button 
              onClick={copyLink}
              className="w-full flex items-center justify-center gap-3 bg-[#2D6A4F] text-white py-4 rounded-xl font-bold active:scale-95 transition-transform shadow-lg"
            >
              <Share2 size={20} />
              Copy Link to Share
            </button>
          </div>
        </div>
      )}

    </div>
  );
}