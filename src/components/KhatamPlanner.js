'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Calendar, CheckCircle, Edit3, PlayCircle, Save, Settings } from 'lucide-react';

export default function KhatamPlanner({ onClose, onRead }) {
  const [mode, setMode] = useState('days'); // 'days' (Target Duration) or 'pages' (Daily Pace)
  const [targetValue, setTargetValue] = useState(30); // Represents Days OR Pages/Day based on mode
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('khatam_data');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        setMode(parsed.mode || 'days');
        setTargetValue(parsed.targetValue || 30);
        setCurrentPage(parsed.page || 1);
    }
  }, []);

  // Save data to storage
  const saveData = (newMode, newTarget, newPage) => {
      setMode(newMode);
      setTargetValue(newTarget);
      setCurrentPage(newPage);
      localStorage.setItem('khatam_data', JSON.stringify({ mode: newMode, targetValue: newTarget, page: newPage }));
      // Don't close editing immediately if just updating target value
  };

  // Logic Engine
  const totalPages = 604;
  let pagesPerDay, totalDays;

  if (mode === 'days') {
      // Input is "Days to Finish" -> Calculate Page Pace
      totalDays = targetValue;
      pagesPerDay = targetValue > 0 ? Math.ceil(totalPages / targetValue) : 0;
  } else {
      // Input is "Pages per Day" -> Calculate Total Days
      pagesPerDay = targetValue;
      totalDays = targetValue > 0 ? Math.ceil(totalPages / targetValue) : 0;
  }

  const progress = Math.min((currentPage / totalPages) * 100, 100);
  const pagesRemaining = totalPages - currentPage;
  const daysRemaining = pagesPerDay > 0 ? Math.ceil(pagesRemaining / pagesPerDay) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFCF8] flex flex-col overflow-y-auto animate-in slide-in-from-right">
      <div className="p-4 flex items-center gap-4 bg-[#1B4332] text-white shadow-lg sticky top-0 z-10">
        <button onClick={onClose}><ArrowLeft /></button>
        <h2 className="font-bold text-lg">Khatam Planner</h2>
      </div>

      <div className="p-6 space-y-6">
         
         {/* 1. PROGRESS CARD (Interactive) */}
         <div className="bg-white p-6 rounded-3xl shadow-lg border border-green-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
             
             <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                     <div>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">My Progress</p>
                         <h3 className="text-3xl font-bold text-[#1B4332] mt-1">Page {currentPage} <span className="text-sm font-normal text-gray-400">/ 604</span></h3>
                     </div>
                     <button onClick={() => setIsEditing(!isEditing)} className="text-green-600 bg-green-50 p-2 rounded-full hover:bg-green-100">
                         <Edit3 size={18}/>
                     </button>
                 </div>

                 {/* Edit Progress (Hidden until clicked) */}
                 {isEditing && (
                     <div className="mb-4 bg-gray-50 p-4 rounded-xl flex gap-2 items-center animate-in fade-in">
                         <input 
                            type="number" 
                            className="w-20 p-2 rounded-lg border text-center font-bold outline-none focus:border-green-500"
                            value={currentPage}
                            onChange={(e) => setCurrentPage(Number(e.target.value))}
                         />
                         <button 
                            onClick={() => { saveData(mode, targetValue, currentPage); setIsEditing(false); }} 
                            className="flex-1 bg-[#1B4332] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                         >
                             <Save size={14}/> Update Page
                         </button>
                     </div>
                 )}

                 {/* Progress Bar */}
                 <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                     <div className="h-full bg-gradient-to-r from-green-400 to-[#1B4332] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                 </div>

                 {/* ACTION BUTTON */}
                 <button 
                    onClick={() => onRead(currentPage)}
                    className="w-full bg-[#1B4332] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 active:scale-95 transition-transform flex items-center justify-center gap-3"
                 >
                     <PlayCircle size={24} /> Continue Reading
                 </button>
             </div>
         </div>

         {/* 2. FLEXIBLE CONFIGURATION (THE FIX) */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Settings className="text-[#1B4332]" size={20}/> Planner Settings</h3>
                
                {/* MODE TOGGLE: Days vs Pages */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                        onClick={() => { setMode('days'); setTargetValue(30); }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mode === 'days' ? 'bg-white shadow text-[#1B4332]' : 'text-gray-400'}`}
                    >
                        By Days
                    </button>
                    <button 
                        onClick={() => { setMode('pages'); setTargetValue(4); }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mode === 'pages' ? 'bg-white shadow text-[#1B4332]' : 'text-gray-400'}`}
                    >
                        By Daily Limit
                    </button>
                </div>
             </div>
             
             <div className="mb-6">
                 <label className="text-xs text-gray-500 uppercase font-bold block mb-2">
                    {mode === 'days' ? "I want to finish in (Days):" : "I will read (Pages per Day):"}
                 </label>
                 
                 <div className="relative">
                    <input 
                      type="number" 
                      value={targetValue} 
                      onChange={(e) => {
                          const val = Number(e.target.value);
                          setTargetValue(val);
                          saveData(mode, val, currentPage); // Auto-save on change
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-4 font-bold text-gray-800 outline-none focus:border-green-500 transition-colors text-lg"
                    />
                    <span className="absolute right-4 top-4 text-xs font-bold text-gray-400">
                        {mode === 'days' ? "DAYS" : "PAGES/DAY"}
                    </span>
                 </div>
             </div>

             {/* DYNAMIC STATS */}
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                     <p className="text-orange-800 text-[10px] font-bold uppercase mb-1">Your Pace</p>
                     <p className="text-xl font-bold text-gray-800">{pagesPerDay} <span className="text-xs font-normal">pgs/day</span></p>
                 </div>
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                     <p className="text-blue-800 text-[10px] font-bold uppercase mb-1">Finish In</p>
                     <p className="text-xl font-bold text-gray-800">{daysRemaining} <span className="text-xs font-normal">more days</span></p>
                 </div>
             </div>
         </div>

      </div>
    </div>
  );
}