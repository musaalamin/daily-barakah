'use client';
import { useState } from 'react';
import { X, ArrowRight, RefreshCw, Heart, Smile } from 'lucide-react';

const MOOD_DATA = {
  anxious: {
    question: "What is causing your anxiety?",
    options: [
      { 
        label: "Fear of the Future / Rizq", 
        prescription: {
          title: "Allah is Al-Razzaq",
          text: "Do not worry about tomorrow, for Allah has already written your provision. What is meant for you will never miss you.",
          action: "Recite 'Hasbunallahu wa ni'mal wakeel' 33 times.",
          surah: "Read Surah At-Talaq, Verse 3"
        }
      },
      { 
        label: "A Mistake I Made", 
        prescription: {
          title: "Allah Loves Tawbah",
          text: "Every son of Adam makes mistakes, and the best are those who repent. Your regret is the first step of forgiveness.",
          action: "Perform Wudu and pray 2 Raka'at of Tawbah.",
          surah: "Read Sayyidul Istighfar"
        }
      }
    ]
  },
  sad: {
    question: "Where does this sadness come from?",
    options: [
      { 
        label: "Loss of Loved One / Thing", 
        prescription: {
          title: "To Allah We Return",
          text: "What was taken was His, and what was given was His. Patience is beautiful, and the reward is Jannah.",
          action: "Say 'Inna lillahi wa inna ilayhi raji'un' with your heart.",
          surah: "Read Surah Al-Baqarah, Verse 155-157"
        }
      },
      { 
        label: "Feeling Lonely/Empty", 
        prescription: {
          title: "Allah is Near",
          text: "He is closer to you than your jugular vein. He hears the whisper of your heart when no one else does.",
          action: "Make Dua in Sujood. It is the closest you can be to Him.",
          surah: "Read Surah Ad-Duha (It was revealed to comfort the Prophet)"
        }
      }
    ]
  },
  tired: {
    question: "What kind of tired are you?",
    options: [
      { 
        label: "Physical Exhaustion", 
        prescription: {
          title: "Rest is Worship",
          text: "Your body has a right over you. Sleep with the intention of gaining strength for ibadah, and your sleep becomes worship.",
          action: "Recite SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34) before sleep.",
          surah: "Read Ayatul Kursi"
        }
      },
      { 
        label: "Mental Burnout", 
        prescription: {
          title: "Disconnect to Reconnect",
          text: "The dunya is noisy. The heart finds rest only in the remembrance of Allah.",
          action: "Sit in silence for 5 minutes, close your eyes, and just listen to the Quran.",
          surah: "Listen to Surah Ar-Rahman"
        }
      }
    ]
  },
  // --- ADDED MISSING HAPPY LOGIC ---
  happy: {
    question: "MashaAllah! How do you want to express this?",
    options: [
      { 
        label: "Show Gratitude (Shukr)", 
        prescription: {
          title: "Alhamdulillah",
          text: "If you are grateful, I will surely increase you (in favor). Gratitude preserves blessings.",
          action: "Perform Sujood al-Shukr (Prostration of Gratitude) right now.",
          surah: "Read Surah Ibrahim, Verse 7"
        }
      },
      { 
        label: "Share the Joy", 
        prescription: {
          title: "Spread the Barakah",
          text: "The Prophet (SAW) was the most generous of people. Happiness shared is happiness doubled.",
          action: "Send a kind message to someone or give Sadaqah today.",
          surah: "Read Surah Al-Layl"
        }
      }
    ]
  }
};

export default function MoodDoctor({ mood, onClose }) {
  const [step, setStep] = useState(0); // 0 = Question, 1 = Prescription
  const [selectedOption, setSelectedOption] = useState(null);

  const data = MOOD_DATA[mood];

  // Safety check: If mood doesn't exist, show error or close
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-[#1B4332] p-6 text-white text-center relative">
           <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
           <h2 className="text-xl font-bold font-serif capitalize flex items-center justify-center gap-2">
             {mood === 'happy' ? <Smile size={24}/> : <Heart size={24}/>} 
             Treating {mood}
           </h2>
           <p className="text-xs opacity-80 mt-1">Islamic Spiritual Remedy</p>
        </div>

        <div className="p-6">
           {step === 0 ? (
             <div className="animate-in slide-in-from-right">
                <p className="text-lg font-bold text-gray-800 mb-6 text-center">{data.question}</p>
                <div className="space-y-3">
                   {data.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => { setSelectedOption(opt); setStep(1); }}
                        className="w-full p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 flex items-center justify-between group transition-all"
                      >
                         <span className="font-medium text-gray-700 group-hover:text-[#1B4332]">{opt.label}</span>
                         <ArrowRight size={18} className="text-gray-300 group-hover:text-green-500"/>
                      </button>
                   ))}
                </div>
             </div>
           ) : (
             <div className="animate-in slide-in-from-right text-center">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Heart size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-[#1B4332] mb-2">{selectedOption.prescription.title}</h3>
                <p className="text-gray-600 italic mb-6 text-sm leading-relaxed">"{selectedOption.prescription.text}"</p>
                
                <div className="bg-green-50 p-4 rounded-xl text-left mb-4 border border-green-100">
                    <p className="text-xs font-bold text-green-800 uppercase tracking-wide mb-1">Recommended Action</p>
                    <p className="text-sm text-green-900 font-medium">{selectedOption.prescription.action}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl text-left border border-orange-100">
                    <p className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-1">Quranic Prescription</p>
                    <p className="text-sm text-orange-900 font-medium">{selectedOption.prescription.surah}</p>
                </div>

                <button onClick={() => setStep(0)} className="mt-6 text-gray-400 text-xs flex items-center justify-center gap-1 hover:text-gray-600 transition-colors">
                    <RefreshCw size={12}/> Start Over
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}