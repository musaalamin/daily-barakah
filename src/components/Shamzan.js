// src/components/Shamzan.js
'use client';
import React, { useState, useEffect } from 'react';
import { Radio, X, Mic } from 'lucide-react';

export default function Shamzan({ onIdentify, onClose }) {
  const [status, setStatus] = useState('listening'); // listening, analyzing, error, success
  const [message, setMessage] = useState('Listening for recitation...');

  useEffect(() => {
    let recognition = null;
    let timeout = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA'; // Critical: Listen for Arabic
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setStatus('listening');
        setMessage('Listening to Quran...');
      };

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setStatus('analyzing');
        setMessage('Identifying Ayah...');
        
        try {
          // Search Quran.com API
          const response = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(transcript)}&language=ar`);
          const data = await response.json();

          if (data.search && data.search.results && data.search.results.length > 0) {
            // Take the first best match
            const bestMatch = data.search.results[0];
            const [surahId, ayahNum] = bestMatch.verse_key.split(':');
            
            setStatus('success');
            setMessage(`Found: Surah ${surahId}, Ayah ${ayahNum}`);
            
            // Wait a moment then navigate
            setTimeout(() => {
              onIdentify(parseInt(surahId), parseInt(ayahNum));
            }, 1000);

          } else {
            setStatus('error');
            setMessage('Could not identify the Ayah. Try getting closer.');
          }
        } catch (e) {
          setStatus('error');
          setMessage('Connection failed. Please check internet.');
        }
      };

      recognition.onerror = () => {
        setStatus('error');
        setMessage('Audio not clear. Please try again.');
      };

      recognition.onend = () => {
        // If simply ended without result (silence)
        if (status === 'listening') {
           // Optional: Auto restart or stop
        }
      };

      recognition.start();

      // Auto-stop after 15 seconds to save battery/resources
      timeout = setTimeout(() => {
        if (status === 'listening') {
            recognition.stop();
            setStatus('error');
            setMessage('Timed out. No recitation detected.');
        }
      }, 15000);

    } else {
      setStatus('error');
      setMessage('Your browser does not support Voice Recognition.');
    }

    return () => {
      if (recognition) recognition.abort();
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-white text-center animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={24} /></button>
      
      {/* Visual Pulse Animation */}
      <div className="relative mb-8">
        {status === 'listening' && (
           <>
             <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 delay-75"></div>
             <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 delay-150"></div>
           </>
        )}
        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${status === 'error' ? 'border-red-500 bg-red-500/10' : 'border-green-500 bg-green-500/10'}`}>
           <Radio size={48} className={status === 'listening' ? 'animate-pulse' : ''} />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2 font-serif">Shamzan</h3>
      <p className={`text-lg mb-8 ${status === 'error' ? 'text-red-300' : 'text-green-100'}`}>{message}</p>
      
      {status === 'error' && (
        <button onClick={onClose} className="bg-white text-black px-8 py-3 rounded-full font-bold">Close</button>
      )}
    </div>
  );
}