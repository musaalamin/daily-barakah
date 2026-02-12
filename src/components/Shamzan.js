'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, X, Search, MicOff, Loader2 } from 'lucide-react';

export default function Shamzan({ surahList, onIdentify, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Tap mic to speak...");
  const [transcript, setTranscript] = useState("");
  const [manualSearch, setManualSearch] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Speech API safely
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US'; // Works better for "Surah Yasin" than Arabic setting sometimes
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setStatus("Listening...");
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase().replace('surah', '').trim();
        setTranscript(text);
        setStatus(`Heard: "${text}"`);
        handleSearch(text);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setStatus("Did not catch that. Try again.");
        console.error("Speech Error:", event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setStatus("Voice search not supported on this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
      } catch (e) {
        setStatus("Microphone permission denied.");
      }
    }
  };

  const handleSearch = (query) => {
    // Fuzzy match logic
    const match = surahList.find(s => 
      s.name_simple.toLowerCase().includes(query) || 
      String(s.id) === query
    );

    if (match) {
      setStatus(`Opening ${match.name_simple}...`);
      setTimeout(() => onIdentify(match.id), 1000);
    } else {
      setStatus(`Could not find Surah "${query}"`);
    }
  };

  // Filter for manual typing
  const filteredList = manualSearch 
    ? surahList.filter(s => s.name_simple.toLowerCase().includes(manualSearch.toLowerCase())) 
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1B4332] mb-1">Shamzan</h2>
          <p className="text-gray-500 text-sm">Say "Surah Mulk" or Type below</p>
        </div>

        {/* Voice Animation Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {isListening && (
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            )}
            <button 
              onClick={toggleListening}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isListening ? 'bg-red-500 text-white scale-110' : 'bg-[#1B4332] text-white hover:scale-105'}`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
          </div>
        </div>

        {/* Status Text */}
        <p className={`text-center text-sm font-medium mb-6 ${transcript ? 'text-[#1B4332]' : 'text-gray-400'}`}>
          {status}
        </p>

        {/* OR Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-400 font-bold uppercase">OR TYPE</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Manual Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Surah name..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#1B4332] focus:bg-white transition-all text-sm font-bold text-gray-700"
            value={manualSearch}
            onChange={(e) => setManualSearch(e.target.value)}
          />
        </div>

        {/* Manual Search Results */}
        {manualSearch && (
          <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-100 mt-2 bg-white shadow-sm">
            {filteredList.map(s => (
              <div 
                key={s.id} 
                onClick={() => onIdentify(s.id)}
                className="p-3 border-b border-gray-50 hover:bg-green-50 cursor-pointer flex justify-between items-center"
              >
                <span className="font-bold text-sm text-gray-700">{s.name_simple}</span>
                <span className="text-xs text-gray-400">{s.name_arabic}</span>
              </div>
            ))}
            {filteredList.length === 0 && (
              <div className="p-4 text-center text-xs text-gray-400">No Surah found</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}