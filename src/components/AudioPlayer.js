// src/components/AudioPlayer.js
'use client';
import { useRef, useEffect } from 'react';

// This is a Logic Hook + UI component wrapper
export const useGaplessAudio = (activeReciter, ayahs, playbackRate, onAyahChange) => {
    const audioRef = useRef(null);
    const preloadRef = useRef(null);

    const getUrl = (surahId, ayahNum) => {
        // Ensure 3 digit format: 001001.mp3
        const s = String(surahId).padStart(3, '0');
        const a = String(ayahNum).padStart(3, '0');
        return `${activeReciter.url}${s}${a}.mp3`;
    };

    const playAyah = (surahId, index) => {
        if (!ayahs || !ayahs[index]) return;

        const url = getUrl(surahId, ayahs[index].number);

        // Stop current
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Use Preload if matches
        if (preloadRef.current && preloadRef.current.src === url) {
            audioRef.current = preloadRef.current;
        } else {
            audioRef.current = new Audio(url);
        }

        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play().catch(e => console.warn("Play interrupted", e));
        
        // Notify parent
        onAyahChange(index);

        // Preload Next
        if (ayahs[index + 1]) {
            const nextUrl = getUrl(surahId, ayahs[index + 1].number);
            preloadRef.current = new Audio(nextUrl);
            preloadRef.current.preload = 'auto';
        }

        // Chain Next
        audioRef.current.onended = () => {
            playAyah(surahId, index + 1);
        };
    };

    const pause = () => {
        if (audioRef.current) audioRef.current.pause();
    };

    const resume = () => {
        if (audioRef.current) audioRef.current.play();
    };

    const setSpeed = (rate) => {
        if (audioRef.current) audioRef.current.playbackRate = rate;
    };

    return { playAyah, pause, resume, setSpeed, audioRef };
};

// Simple UI Component for the Global Player
export function GlobalPlayerBar({ isPlaying, reciterName, onClick, onTogglePlay }) {
    if (!isPlaying) return null;
    return (
        <div 
          className="fixed bottom-16 w-full max-w-md bg-[#1B4332] text-white p-3 z-40 flex items-center justify-between shadow-lg cursor-pointer" 
          onClick={onClick}
        >
            <div className="flex items-center gap-3">
                {/* Visualizer Animation */}
                <div className="w-8 h-8 flex items-center justify-center gap-1">
                     <div className="w-1 bg-green-200 animate-[bounce_1s_infinite] h-3"></div>
                     <div className="w-1 bg-green-200 animate-[bounce_1.2s_infinite] h-5"></div>
                     <div className="w-1 bg-green-200 animate-[bounce_0.8s_infinite] h-3"></div>
                </div>
                <div>
                    <p className="text-xs font-bold">Now Playing</p>
                    <p className="text-[10px] text-green-200">{reciterName}</p>
                </div>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} 
                className="w-8 h-8 bg-white text-[#1B4332] rounded-full flex items-center justify-center"
            >
                {/* Icon placeholder - use Lucide in parent */}
                ||
            </button>
        </div>
    );
}