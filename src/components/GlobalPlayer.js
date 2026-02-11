'use client';
import { Pause, Play } from 'lucide-react';

export default function GlobalPlayer({ isPlaying, reciterName, onTogglePlay, onClick }) {
  if (!isPlaying) return null;

  return (
    <div 
      className="fixed bottom-[70px] left-2 right-2 bg-black/90 text-white rounded-xl shadow-2xl p-2 z-50 flex items-center justify-between border border-white/10 backdrop-blur-md h-12 animate-in fade-in slide-in-from-bottom-4"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 pl-2 overflow-hidden">
        <div className="flex gap-0.5 items-end h-3">
           <div className="w-0.5 bg-green-400 animate-[bounce_1s_infinite] h-2"></div>
           <div className="w-0.5 bg-green-400 animate-[bounce_1.5s_infinite] h-3"></div>
           <div className="w-0.5 bg-green-400 animate-[bounce_0.8s_infinite] h-1.5"></div>
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] text-gray-300 leading-none">Playing</span>
           <span className="text-xs font-bold truncate max-w-[150px] text-green-100">{reciterName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pr-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
}