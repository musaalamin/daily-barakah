"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

export default function NewVision() {
  const [view, setView] = useState("home");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const navLinks = ["HOME", "AGENDA", "NEWS", "CONTACT"];

  // THE 7-PILLAR DATA
  const agendaPillars = [
    { t: "Education", d: "Revitalizing learning through infrastructure and digital literacy." },
    { t: "Livelihood", d: "Sustainable wealth through vocational training and micro-grants." },
    { t: "Agriculture", d: "Mechanized farming and AI-driven disease detection." },
    { t: "Healthcare", d: "Modernizing clinics and maternal health services." },
    { t: "Security", d: "Technology-driven community policing and intelligence." },
    { t: "Infrastructure", d: "Connecting rural markets through robust road networks." },
    { t: "Youth Empowerment", d: "Mentorship and innovation hubs for Zamfara's future." }
  ];

  return (
    <div className="h-screen bg-white flex flex-col uppercase font-black overflow-hidden">
      {/* MENU BUTTON */}
      <button onClick={() => setIsNavOpen(true)} className="fixed top-6 right-6 z-50 bg-[#064E3B] p-4 text-white rounded-full shadow-2xl">
        <Menu size={24} />
      </button>

      {/* FULLSCREEN MENU */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[60] p-12 flex flex-col text-white">
            <button onClick={() => setIsNavOpen(false)} className="self-end mb-12"><X size={40} /></button>
            <div className="flex flex-col gap-6">
              {navLinks.map(item => (
                <button key={item} onClick={() => { setView(item.toLowerCase()); setIsNavOpen(false); }} className="text-5xl md:text-8xl text-left hover:text-[#D97706] transition-all uppercase">
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {view === "home" && (
            <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#064E3B] text-white">
              <h1 className="text-6xl md:text-9xl tracking-tighter italic">JAGABAN <br/> ZAMFARA</h1>
              <p className="mt-8 text-[#D97706] border-b-2 border-[#D97706] pb-2">THE VISION 2031</p>
            </motion.div>
          )}

          {/* AGENDA VIEW */}
          {view === "agenda" && (
            <motion.div key="ag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full p-8 pt-32 md:p-24 bg-white text-black">
              <h2 className="text-5xl md:text-8xl italic text-[#064E3B] mb-12">THE AGENDA</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {agendaPillars.map((p, i) => (
                  <div key={i} className="border-l-4 border-[#D97706] pl-6 py-2">
                    <h3 className="text-xl md:text-2xl text-[#064E3B] mb-2 uppercase">0{i+1}. {p.t}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 italic lowercase first-letter:uppercase">{p.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
