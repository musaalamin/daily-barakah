'use client';
import { useState, useEffect } from 'react';
import { Mic, X, Activity } from 'lucide-react';

export default function Shamzan({ onIdentify, onClose, surahList }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("Tap Mic & Say 'Surah Name'...");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check browser support
    if (!('webkitSpeechRecognition' in window)) {
      setError("Voice search is not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    setError(null);
    setIsListening(true);
    setTranscript("Listening...");

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(`You said: "${text}"`);
      findSurah(text);
    };

    recognition.onerror = (event) => {
      setError("Didn't catch that. Try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const findSurah = (text) => {
    // 1. Remove common words like "open", "play", "surah"
    const cleanText = text.replace(/open|play|surah|chapter|read/g, '').trim();

    // 2. Fuzzy Search in Surah List
    // We look for the name in English or simple name
    const found = surahList.find(s => 
      s.name_simple.toLowerCase().includes(cleanText) || 
      s.name_arabic.includes(cleanText) ||
      parseInt(cleanText) === s.id
    );

    if (found) {
      setTranscript(`Opening ${found.name_simple}...`);
      setTimeout(() => {
        onIdentify(found.id); // Pass ID back to parent
      }, 1000);
    } else {
      setError(`Could not find Surah "${cleanText}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={24}/></button>
        
        <h2 className="text-2xl font-bold text-[#1B4332] mb-2">Voice Search</h2>
        <p className="text-gray-500 text-sm mb-8">Say "Surah Mulk" or "Open Yasin"</p>

        {/* Mic Animation Container */}
        <div className="relative mx-auto w-24 h-24 mb-8 flex items-center justify-center">
           {isListening && (
             <>
               <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
               <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 animate-pulse delay-75"></div>
             </>
           )}
           <button 
             onClick={startListening}
             className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${isListening ? 'bg-red-500 text-white scale-110' : 'bg-[#1B4332] text-white hover:scale-105'}`}
           >
             {isListening ? <Activity size={32} className="animate-pulse"/> : <Mic size={32} />}
           </button>
        </div>

        <div className="min-h-[3rem]">
            {error ? (
               <p className="text-red-500 font-bold animate-pulse">{error}</p>
            ) : (
               <p className="text-[#1B4332] font-medium text-lg">{transcript}</p>
            )}
        </div>
      </div>
    </div>
  );
}