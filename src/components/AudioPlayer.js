'use client';
import { useRef, useEffect, useState } from 'react';
import { Play, Pause, ChevronDown } from 'lucide-react';

export const useGaplessAudio = (activeReciter, ayahs, activeSurah, playbackRate, onTrackEnd) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const onTrackEndRef = useRef(onTrackEnd);

    useEffect(() => { onTrackEndRef.current = onTrackEnd; }, [onTrackEnd]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
            audioRef.current.preservesPitch = false; 
        }
    }, [playbackRate]);

    useEffect(() => {
        return () => { if (audioRef.current) audioRef.current.pause(); };
    }, []);

    const getUrl = (surahId, ayahNum) => {
        const s = String(surahId).padStart(3, '0');
        const a = String(ayahNum).padStart(3, '0');
        return `${activeReciter.url}${s}${a}.mp3`;
    };

    const stop = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        setIsPlaying(false);
    };

    // UPDATED PLAY FUNCTION (Handles Bismillah)
    const playAyah = (index, skipBismillah = false) => {
        if (!ayahs || !ayahs[index] || !activeSurah) return;
        if (audioRef.current) audioRef.current.pause();

        // LOGIC: Should we play Bismillah first?
        // 1. We are at start (index 0)
        // 2. Not Fatiha (1) or Tawbah (9)
        // 3. Not explicitly skipped (recursive call)
        if (index === 0 && activeSurah.id !== 1 && activeSurah.id !== 9 && !skipBismillah) {
            const bismillahUrl = `${activeReciter.url}001001.mp3`;
            const bAudio = new Audio(bismillahUrl);
            bAudio.playbackRate = playbackRate;
            bAudio.preservesPitch = false;
            audioRef.current = bAudio;
            
            bAudio.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Bismillah Error", e));

            // ON END: Play the actual verse 1
            bAudio.onended = () => {
                playAyah(0, true); // True = Don't play Bismillah again
            };
            return;
        }

        // NORMAL PLAYBACK
        const url = getUrl(activeSurah.id, ayahs[index].number);
        const newAudio = new Audio(url);
        newAudio.playbackRate = playbackRate;
        newAudio.preservesPitch = false;
        newAudio.preload = "auto";
        audioRef.current = newAudio;

        const playPromise = newAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => { setIsPlaying(true); setCurrentIndex(index); })
                       .catch(e => console.error("Playback error:", e));
        }

        newAudio.onended = () => { if (onTrackEndRef.current) onTrackEndRef.current(index); };
    };

    const togglePlay = () => {
        if (isPlaying && audioRef.current) { audioRef.current.pause(); setIsPlaying(false); }
        else {
            if (audioRef.current) { audioRef.current.play(); setIsPlaying(true); }
            else if (currentIndex !== null) playAyah(currentIndex);
            else playAyah(0);
        }
    };

    return { playAyah, togglePlay, stop, isPlaying, currentIndex };
};

export function GlobalPlayerBar({ isPlaying, reciterName, onTogglePlay, playbackRate, onSpeedChange, onClick }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`fixed left-4 right-4 z-50 transition-all duration-500 ease-in-out ${isExpanded ? 'bottom-24' : 'bottom-[85px]'} ${isPlaying || isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <div className={`bg-[#1B4332] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-500 ${isExpanded ? 'h-48 p-6' : 'h-16 p-2'}`}>
                
                {!isExpanded && (
                    <div className="flex items-center justify-between h-full px-2" onClick={() => setIsExpanded(true)}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-green-200 font-bold uppercase">Now Playing</span>
                                <span className="text-xs font-bold truncate max-w-[100px]">{reciterName}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); onSpeedChange(); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold hover:bg-white/20">
                                {playbackRate}x
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="w-10 h-10 bg-white text-[#1B4332] rounded-full flex items-center justify-center shadow-lg">
                                {isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}
                            </button>
                        </div>
                    </div>
                )}

                {isExpanded && (
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div onClick={() => setIsExpanded(false)} className="cursor-pointer p-2"><ChevronDown /></div>
                            <div className="text-center">
                                <p className="text-xs text-green-300 uppercase tracking-widest">Reciting Now</p>
                                <h3 className="font-serif text-xl font-bold mt-1">{reciterName}</h3>
                            </div>
                            <div onClick={onClick} className="cursor-pointer p-2"><Play size={20} /></div>
                        </div>
                        <div className="flex items-center justify-center gap-8 mt-4">
                            <button onClick={(e) => { e.stopPropagation(); onSpeedChange(); }} className="flex flex-col items-center gap-1 text-green-200 hover:text-white">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">{playbackRate}x</div>
                                <span className="text-[9px] uppercase">Speed</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="w-16 h-16 bg-white text-[#1B4332] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                                {isPlaying ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor"/>}
                            </button>
                            <div className="w-10"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}