'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, Moon, Sun, Play, Pause, ChevronLeft, Search, Calendar, 
  CheckSquare, Heart, Share2, Menu, Mic, Volume2, Type, Repeat, 
  RefreshCw, X, Sparkles, Download, Mail, Clock, Gauge, Settings, 
  Bookmark, Book, Mic2, ArrowLeft, Shield, MapPin, Coffee
} from 'lucide-react';
import { toPng } from 'html-to-image';

// --- 1. EXPANDED RECITERS (HARAMAIN & LEGENDS) ---
const RECITERS = [
  // MADINAH IMAMS
  { id: "hudaify", name: "Ali Al-Hudaify", url: "https://everyayah.com/data/Hudhaify_128kbps/" },
  { id: "qasim", name: "Abdulmohsen Al-Qasim", url: "https://everyayah.com/data/Abdul_Muhsin_Al_Qasim_128kbps/" },
  { id: "budair", name: "Salah Al-Budair", url: "https://everyayah.com/data/Salah_Al_Budair_128kbps/" },
  { id: "ahmed_hudaify", name: "Ahmed Al-Hudhaify", url: "https://everyayah.com/data/Ahmed_Al_Hudhaify_128kbps/" },
  { id: "buayjan", name: "Abdullah Al-Buayjan", url: "https://everyayah.com/data/Abdullah_Al_Buayjan_128kbps/" },
  
  // MAKKAH IMAMS
  { id: "sudais", name: "Abdur-Rahman as-Sudais", url: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
  { id: "shuraim", name: "Saud Al-Shuraim", url: "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/" },
  { id: "maher", name: "Maher Al Muaiqly", url: "https://everyayah.com/data/MaherAlMuaiqly128kbps/" },
  { id: "baleela", name: "Bandar Baleela", url: "https://everyayah.com/data/Bandar_Baleela_128kbps/" },
  { id: "dossary", name: "Yasser Al Dossary", url: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/" },
  { id: "juhany", name: "Abdallah Al Juhany", url: "https://everyayah.com/data/Abdullaah_3awwaad_Al-Juhaynee_128kbps/" },
  
  // LEGENDS
  { id: "mishary", name: "Mishary Alafasy", url: "https://everyayah.com/data/Alafasy_128kbps/" },
  { id: "ghaamidi", name: "Saad Al-Ghamdi", url: "https://everyayah.com/data/Ghamadi_40kbps/" },
  { id: "husary", name: "Mahmoud Al-Hussary", url: "https://everyayah.com/data/Husary_128kbps/" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi", url: "https://everyayah.com/data/Minshawy_Murattal_128kbps/" },
];

// --- 2. DATA: 75 DAILY INSPIRATIONS ---
const DAILY_INSPIRATIONS = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship [will be] ease.", ref: "Quran 94:6" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", english: "So remember Me; I will remember you.", ref: "Quran 2:152" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english: "And whoever relies upon Allah - then He is sufficient for him.", ref: "Quran 65:3" },
  { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", ref: "Quran 2:286" },
  { arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ", english: "And your Lord says, 'Call upon Me; I will respond to you.'", ref: "Quran 40:60" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "Quran 2:153" },
  { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", english: "The best of you are those who learn the Quran and teach it.", ref: "Hadith Bukhari" },
  { arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ", english: "Dua is worship.", ref: "Hadith Tirmidhi" },
  { arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", english: "Actions are judged by intentions.", ref: "Hadith Bukhari" },
  { arabic: "فَفِرُّوا إِلَى اللَّهِ", english: "So flee to Allah.", ref: "Quran 51:50" },
  { arabic: "وَكَفَىٰ بِاللَّهِ وَكِيلًا", english: "And sufficient is Allah as Disposer of affairs.", ref: "Quran 4:81" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", english: "My Lord, expand for me my breast [with assurance].", ref: "Quran 20:25" },
  { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", english: "All praise is for Allah, Lord of the worlds.", ref: "Quran 1:2" },
  { arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", english: "O Allah, You are Forgiving and love forgiveness, so forgive me.", ref: "Hadith" },
  { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", english: "And when My servants ask you concerning Me - indeed I am near.", ref: "Quran 2:186" },
  { arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ", english: "Fear Allah wherever you are.", ref: "Hadith Tirmidhi" },
  { arabic: "لَا تَغْضَبْ", english: "Do not get angry.", ref: "Hadith Bukhari" },
  { arabic: "أَلا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Unquestionably, by the remembrance of Allah hearts are assured.", ref: "Quran 13:28" },
  { arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", english: "And Allah loves the doers of good.", ref: "Quran 3:134" },
  { arabic: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا", english: "Say, 'Never will we be struck except by what Allah has decreed for us.'", ref: "Quran 9:51" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", english: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.", ref: "Quran 3:173" },
  { arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", english: "There is no might and no power except with Allah.", ref: "Hadith" },
  { arabic: "وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", english: "And do good; indeed, Allah loves the doers of good.", ref: "Quran 2:195" },
  { arabic: "اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", english: "Seek help through patience and prayer.", ref: "Quran 2:153" },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", english: "Our Lord, give us in this world [that which is] good.", ref: "Quran 2:201" },
  { arabic: "الظُّلْمُ ظُلُمَاتٌ يَوْمَ الْقِيَامَةِ", english: "Oppression will be darknesses on the Day of Resurrection.", ref: "Hadith Bukhari" },
  { arabic: "مَنْ صَمَتَ نَجَا", english: "Whoever remains silent is saved.", ref: "Hadith Tirmidhi" },
  { arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", english: "A good word is charity.", ref: "Hadith Bukhari" },
  { arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", english: "Your smile for your brother is charity.", ref: "Hadith Tirmidhi" },
  { arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", english: "The most beloved deeds to Allah are those that are consistent, even if small.", ref: "Hadith Muslim" },
  { arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", english: "None of you believes until he loves for his brother what he loves for himself.", ref: "Hadith Bukhari" },
  { arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ", english: "The best of people are those most beneficial to people.", ref: "Hadith" },
  { arabic: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ", english: "Indeed, Allah is Beautiful and He loves beauty.", ref: "Hadith Muslim" },
  { arabic: "مَنْ لَا يَرْحَمْ لَا يُرْحَمْ", english: "Whoever does not show mercy will not be shown mercy.", ref: "Hadith Bukhari" },
  { arabic: "وَقُولُوا لِلنَّاسِ حُسْنًا", english: "And speak to people good [words].", ref: "Quran 2:83" },
  { arabic: "وَاجْعَلْ لِي مِنْ لَدُنْكَ سُلْطَانًا نَصِيرًا", english: "And grant me from Yourself a supporting authority.", ref: "Quran 17:80" },
  { arabic: "رَبِّ زِدْنِي عِلْمًا", english: "My Lord, increase me in knowledge.", ref: "Quran 20:114" },
  { arabic: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا", english: "And turn to Allah in repentance, all of you.", ref: "Quran 24:31" },
  { arabic: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", english: "Indeed, Allah is Forgiving and Merciful.", ref: "Quran 2:173" },
  { arabic: "وَمَا كَانَ رَبُّكَ نَسِيًّا", english: "And never is your Lord forgetful.", ref: "Quran 19:64" },
  { arabic: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ", english: "If you are grateful, I will surely increase you [in favor].", ref: "Quran 14:7" },
  { arabic: "إِنَّ رَحْمَتِ اللَّهِ قَرِيبٌ مِنَ الْمُحْسِنِينَ", english: "Indeed, the mercy of Allah is near to the doers of good.", ref: "Quran 7:56" },
  { arabic: "فَاصْبِرْ صَبْرًا جَمِيلًا", english: "So be patient with a beautiful patience.", ref: "Quran 70:5" },
  { arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", english: "Indeed, Allah does not allow to be lost the reward of the doers of good.", ref: "Quran 9:120" },
  { arabic: "عَسَىٰ أَنْ تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَكُمْ", english: "But perhaps you hate a thing and it is good for you.", ref: "Quran 2:216" },
  { arabic: "وَكَانَ فَضْلُ اللَّهِ عَلَيْكَ عَظِيمًا", english: "And ever has the favor of Allah upon you been great.", ref: "Quran 4:113" },
  { arabic: "قُلْ إِنَّ الْفَضْلَ بِيَدِ اللَّهِ", english: "Say, 'Indeed, [all] bounty is in the hand of Allah.'", ref: "Quran 3:73" },
  { arabic: "يَهْدِي اللَّهُ لِنُورِهِ مَنْ يَشَاءُ", english: "Allah guides to His light whom He wills.", ref: "Quran 24:35" },
  { arabic: "وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ", english: "And Allah knows, while you know not.", ref: "Quran 2:216" },
  { arabic: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ", english: "Indeed, good deeds do away with misdeeds.", ref: "Quran 11:114" },
  { arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", english: "Every soul will taste death.", ref: "Quran 3:185" },
  { arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", english: "And my success is not but through Allah.", ref: "Quran 11:88" },
  { arabic: "نُورٌ عَلَىٰ نُورٍ", english: "Light upon light.", ref: "Quran 24:35" },
  { arabic: "فَاسْتَقِمْ كَمَا أُمِرْتَ", english: "So remain on a right course as you have been commanded.", ref: "Quran 11:112" },
  { arabic: "وَقُلْ رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", english: "And say, 'My Lord, have mercy upon them as they brought me up [when I was] small.'", ref: "Quran 17:24" },
  { arabic: "إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", english: "Indeed, Allah is over all things competent.", ref: "Quran 2:20" },
  { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ", english: "O you who have believed, ask [Allah to confer] blessing upon him.", ref: "Quran 33:56" },
  { arabic: "الْحَيَاءُ مِنَ الْإِيمَانِ", english: "Modesty is part of faith.", ref: "Hadith Bukhari" },
  { arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ", english: "Cleanliness is half of faith.", ref: "Hadith Muslim" },
  { arabic: "إِيَّاكُمْ وَالظَّنَّ", english: "Beware of suspicion.", ref: "Hadith Bukhari" },
  { arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ", english: "The strong man is not the good wrestler; the strong man is the one who controls himself when angry.", ref: "Hadith Bukhari" },
  { arabic: "بَشِّرُوا وَلَا تُنَفِّرُوا", english: "Give good tidings and do not make people run away.", ref: "Hadith Bukhari" },
  { arabic: "يَسِّرُوا وَلَا تُعَسِّرُوا", english: "Make things easy and do not make things difficult.", ref: "Hadith Bukhari" },
  { arabic: "اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ", english: "Save yourselves from Hellfire even with half a date.", ref: "Hadith Bukhari" },
  { arabic: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا", english: "Do not consider any act of kindness insignificant.", ref: "Hadith Muslim" },
  { arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", english: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", ref: "Hadith Bukhari" },
  { arabic: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ", english: "Indeed, Allah is Gentle and loves gentleness.", ref: "Hadith Muslim" },
  { arabic: "أَفْشُوا السَّلَامَ", english: "Spread peace [greeting].", ref: "Hadith Muslim" },
  { arabic: "إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", english: "Indeed, Allah forgives all sins.", ref: "Quran 39:53" },
  { arabic: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ", english: "And what is the worldly life except the enjoyment of delusion.", ref: "Quran 3:185" }
];

// --- 3. EXPANDED DUAS FROM HISNUL MUSLIM PDF ---
const DUA_CATEGORIES = {
  morning_evening: {
    title: "Morning & Evening",
    icon: <Sun size={20} />,
    duas: [
      { 
        title: "Ayatul Kursi", 
        arabic: "ٱللَّهُ لَاۤ إِلَـٰهَ إِلَّا هُوَ ٱلۡحَیُّ ٱلۡقَیُّومُ ۚ لَا تَأۡخُذُهُۥ سِنَةࣱ وَلَا نَوۡمࣱ ۚ لَّهُۥ مَا فِی ٱلسَّمَـٰوَ ٰ⁠تِ وَمَا فِی ٱلۡأَرۡضِ ۗ مَن ذَا ٱلَّذِی یَشۡفَعُ عِندَهُۥۤ إِلَّا بِإِذۡنِهِۦ ۚ یَعۡلَمُ مَا بَیۡنَ أَیۡدِیهِمۡ وَمَا خَلۡفَهُمۡ ۖ وَلَا یُحِیطُونَ بِشَیۡءࣲ مِّنۡ عِلۡمِهِۦۤ إِلَّا بِمَا شَاۤءَ ۚ وَسِعَ كُرۡسِیُّهُ ٱلسَّمَـٰوَ ٰ⁠تِ وَٱلۡأَرۡضَ ۖ وَلَا یَـُٔودُهُۥ حِفۡظُهُمَا ۚ وَهُوَ ٱلۡعَلِیُّ ٱلۡعَظِیمُ", 
        meaning: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence..." 
      },
      { 
        title: "The 3 Quls", 
        arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ... قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", 
        meaning: "Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas (3 times each)." 
      },
      { 
        title: "Sayyidul Istighfar", 
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ ، وَأَبُوءُ بِذَنْبِي ، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", 
        meaning: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant..." 
      },
      {
        title: "For Well-being",
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي ، اللَّهُمَّ عَافِنِي فِي سَمْعِي ، اللَّهُمَّ عَافِنِي فِي بَصَرِي ، لَا إِلَهَ إِلَّا أَنْتَ",
        meaning: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health. None has the right to be worshipped except You."
      },
      {
        title: "Protection from Anxiety & Debt",
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ ، وَالْفَقْرِ ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ ، لَا إِلَهَ إِلَّا أَنْتَ",
        meaning: "O Allah, I take refuge with You from disbelief and poverty, and I take refuge with You from the punishment of the grave."
      }
    ]
  },
  daily_life: {
    title: "Daily Life",
    icon: <Coffee size={20} />,
    duas: [
      { title: "When Waking Up", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", meaning: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection." },
      { title: "Before Eating", arabic: "بِسْمِ اللَّهِ", meaning: "In the name of Allah." },
      { title: "Upon Completing a Meal", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا ، وَكَفَانَا وَآوَانَا", meaning: "All praise is for Allah, Who fed us and gave us drink, and Who is sufficient for us and has sheltered us." },
      { title: "Leaving Home", arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ", meaning: "In the name of Allah, I trust in Allah; there is no might and no power but in Allah." },
      { title: "Entering Mosque", arabic: "اللّهُـمَّ افْتَـحْ لي أَبْوابَ رَحْمَتـِك", meaning: "O Allah, open the gates of Your mercy for me." },
      { title: "Entering the Toilet", arabic: "بِسْمِ اللَّهِ اللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ", meaning: "[In the name of Allah]. O Allah, I take refuge with you from all evil and evil-doers." },
    ]
  },
  travel: {
    title: "Travel",
    icon: <MapPin size={20} />,
    duas: [
      { title: "Travel Supplication", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ... اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى", meaning: "How perfect He is, The One Who has placed this [transport] at our service... O Allah, we ask You for birr and taqwa in this journey of ours." },
      { title: "Returning from Travel", arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ", meaning: "We return, repent, worship and praise our Lord." },
      { title: "Entering a Town", arabic: "اللَّهُمَّ رَبَّ السَّمَوَاتِ السَّبْعِ... أَسْأَلُكَ خَيْرَ هَذِهِ الْقَرْيَةِ وَخَيْرَ أَهْلِهَا", meaning: "O Allah, Lord of the seven heavens... I ask You for the goodness of this town and the goodness of its inhabitants." }
    ]
  },
  protection: {
    title: "Protection & Ruqyah",
    icon: <Shield size={20} />,
    duas: [
      { title: "For Anxiety and Sorrow", arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ ، مَاضٍ فِيَّ حُكْمُكَ", meaning: "O Allah, I am Your servant... my forelock is in Your hand, Your command over me is forever executed..." },
      { title: "For Pain (Ruqyah)", arabic: "بِسْمِ اللَّهِ (3x) ... أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (7x)", meaning: "In the name of Allah (3x). I take refuge in Allah and within His omnipotence from the evil that I feel and am wary of (7x)." },
      { title: "Protection from Evil Eye", arabic: "اللَّهُمَّ بَارِكْ عَلَيْهِ", meaning: "O Allah, send blessings upon him." },
      { title: "When Startled", arabic: "لَا إِلَهَ إِلَّا اللَّهُ", meaning: "None has the right to be worshipped except Allah." }
    ]
  },
  ramadan: {
    title: "Ramadan & Fasting",
    icon: <Moon size={20} />,
    duas: [
      { title: "Sighting Crescent", arabic: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالإِيمَانِ ، وَالسَّلَامَةِ وَالإِسْلَامِ", meaning: "O Allah, let the crescent loom above us in safety, faith, peace, and Islam." },
      { title: "Breaking Fast", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", meaning: "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills." },
      { title: "Breaking Fast at Someone's Home", arabic: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ ، وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ", meaning: "May the fasting break their fast in your home, and may the dutiful eat your food, and may the angels send prayers upon you." },
      { title: "Lailatul Qadr", arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", meaning: "O Allah, You are Forgiving and love forgiveness, so forgive me." },
    ]
  }
};

// --- 4. CUSTOM AUDIO HOOK FOR LAG-FREE PLAYBACK ---
const useGaplessAudio = (playlist, activeReciter, playbackRate) => {
  const audioRef = useRef(new Audio());
  const preloadRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const getUrl = (index) => {
    if (!playlist || !playlist[index]) return null;
    const surahId = String(playlist[index].surahId).padStart(3, '0');
    const ayahNum = String(playlist[index].number).padStart(3, '0');
    return `${activeReciter.url}${surahId}${ayahNum}.mp3`;
  };

  const playIndex = (index) => {
    const url = getUrl(index);
    if (!url) return;

    // Use preloaded if matches, else load new
    if (preloadRef.current.src === url) {
      audioRef.current = preloadRef.current;
      preloadRef.current = new Audio(); // Reset preload
    } else {
      audioRef.current.src = url;
    }

    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setCurrentIndex(index);
        
        // Preload next
        const nextUrl = getUrl(index + 1);
        if (nextUrl) {
          preloadRef.current.src = nextUrl;
          preloadRef.current.load();
        }

        // Handle End
        audioRef.current.onended = () => {
          if (index + 1 < playlist.length) {
            playIndex(index + 1);
          } else {
            setIsPlaying(false);
            setCurrentIndex(null);
          }
        };
      })
      .catch(e => {
        console.error("Playback error", e);
        setIsPlaying(false);
      });
  };

  const toggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentIndex !== null) {
        audioRef.current.play();
        setIsPlaying(true);
      } else if (playlist && playlist.length > 0) {
        playIndex(0);
      }
    }
  };

  const setSpeed = (rate) => {
    audioRef.current.playbackRate = rate;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  return { isPlaying, currentIndex, playIndex, toggle, setSpeed };
};

export default function DailyBarakahApp() {
  const [currentView, setCurrentView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('morning_evening'); 
  
  // Data State
  const [surahList, setSurahList] = useState<any[]>([]);
  const [activeSurah, setActiveSurah] = useState<any>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [nextPrayerName, setNextPrayerName] = useState("Loading");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [ramadanStatus, setRamadanStatus] = useState("Loading...");
  
  // Settings & Popup
  const [arabicFontSize, setArabicFontSize] = useState(32); 
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  const [showWelcome, setShowWelcome] = useState(true);
  const [dailyQuote, setDailyQuote] = useState(DAILY_INSPIRATIONS[0]);
  const hiddenDownloadRef = useRef<HTMLDivElement>(null); 

  // Audio State
  const [activeReciter, setActiveReciter] = useState(RECITERS[0]);
  const [playbackRate, setPlaybackRate] = useState(1); 
  
  // Using the new Hook
  const { isPlaying, currentIndex, playIndex, toggle, setSpeed } = useGaplessAudio(
    ayahs.map(a => ({ ...a, surahId: activeSurah?.id })), 
    activeReciter, 
    playbackRate
  );

  // Persistence & UI
  const [lastRead, setLastRead] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isMushafMode, setIsMushafMode] = useState(false);
  const [revealedAyah, setRevealedAyah] = useState<number | null>(null);
  const [planner, setPlanner] = useState({ fasting: false, quran: false, taraweeh: false, dhikr: false, charity: false });
  const [tasbihCount, setTasbihCount] = useState(0);

  // --- INIT ---
  useEffect(() => {
    setDailyQuote(DAILY_INSPIRATIONS[Math.floor(Math.random() * DAILY_INSPIRATIONS.length)]);
    setGregorianDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    
    // Load Persisted Data
    const savedLastRead = localStorage.getItem('barakah_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));
    const savedBookmarks = localStorage.getItem('barakah_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // Ramadan Logic
    const today = new Date();
    const ramadanStart = new Date('2026-02-18'); 
    const diffTime = ramadanStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 0) setRamadanStatus(`${diffDays} Days to Ramadan`);
    else if (diffDays <= 0 && diffDays > -30) setRamadanStatus(`Ramadan Day ${Math.abs(diffDays) + 1}`);
    else setRamadanStatus("Daily Barakah");

    fetch('https://api.quran.com/api/v4/chapters?language=en').then(res => res.json()).then(data => setSurahList(data.chapters || []));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=3`);
          const data = await res.json();
          setPrayerTimes(data.data.timings);
          const h = data.data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
          updateNextPrayer(data.data.timings);
        } catch (e) { console.error(e); }
      });
    }
    const interval = setInterval(() => { if (prayerTimes) updateNextPrayer(prayerTimes); }, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateNextPrayer = (timings: any) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let found = false;
    for (const prayer of prayerOrder) {
        const [h, m] = timings[prayer].split(':');
        if ((parseInt(h) * 60 + parseInt(m)) > currentTime) {
            setNextPrayerName(prayer); setNextPrayerTime(timings[prayer]); found = true; break;
        }
    }
    if (!found) { setNextPrayerName("Fajr"); setNextPrayerTime(timings["Fajr"]); }
  };

  const handleDownload = async () => {
    if (hiddenDownloadRef.current) {
      try {
        const dataUrl = await toPng(hiddenDownloadRef.current, { cacheBust: true, pixelRatio: 1 });
        const link = document.createElement('a');
        link.download = `Daily-Barakah-${gregorianDate}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) { console.error('Download failed', err); }
    }
  };

  // --- VOICE SEARCH (SHAMZAN) ---
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            setSearchQuery(transcript.replace('.', '')); 
        };
        recognition.onerror = () => alert("Voice search failed. Please try again.");
    } else {
        alert("Voice search is not supported in this browser.");
    }
  };

  const openSurah = async (surah: any) => {
    setActiveSurah(surah);
    setCurrentView('quran-reader');
    setLoading(true);
    try {
      const quranRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?language=en&words=true&translations=20&per_page=300&fields=text_uthmani`);
      const quranData = await quranRes.json();
      const hausaRes = await fetch(`https://quranenc.com/api/v1/translation/sura/hausa_gummi/${surah.id}`);
      const hausaData = await hausaRes.json();
      setAyahs(quranData.verses.map((verse: any, index: number) => ({
        id: verse.id, number: verse.verse_number, arabic: verse.text_uthmani,
        english: verse.translations[0]?.text.replace(/<[^>]*>?/gm, '') || "...",
        hausa: hausaData.result[index]?.translation || "..."
      })));
      // Save as Recent
      const data = { surahName: surah.name_simple, surahId: surah.id, ayah: 1, timestamp: Date.now() };
      setLastRead(data);
      localStorage.setItem('barakah_last_read', JSON.stringify(data));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateSpeed = (rate: number) => {
    setPlaybackRate(rate);
    setSpeed(rate);
  };

  const toggleBookmark = (surah: any, ayah: any) => {
    const newBookmark = { id: `${surah.id}:${ayah.number}`, surahName: surah.name_simple, ayahNum: ayah.number, arabic: ayah.arabic };
    let newBookmarks = [...bookmarks];
    const exists = newBookmarks.find(b => b.id === newBookmark.id);
    if (exists) newBookmarks = newBookmarks.filter(b => b.id !== newBookmark.id);
    else newBookmarks = [newBookmark, ...newBookmarks];
    setBookmarks(newBookmarks);
    localStorage.setItem('barakah_bookmarks', JSON.stringify(newBookmarks));
  };

  // --- SUB-COMPONENTS ---
  const MobileCardContent = () => (
    <>
      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1"><Calendar size={12}/> <span>{gregorianDate}</span></div>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full"><Clock size={12}/> <span>{ramadanStatus}</span></div>
      </div>
      <div className="mb-8">
          <div className="w-12 h-12 bg-[#1B4332] text-white rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={20} /></div>
          <p className="font-serif text-3xl text-[#1B4332] leading-loose mb-6 dir-rtl">{dailyQuote.arabic}</p>
          <p className="text-gray-600 font-medium text-sm italic mb-4">"{dailyQuote.english}"</p>
          <span className="inline-block bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-bold">{dailyQuote.ref}</span>
      </div>
      <div className="pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-900">Wonder Sight Gallery</p>
          <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1"><Mail size={10} /> wondersightgallery@gmail.com</p>
      </div>
    </>
  );

  const HighResCardContent = () => (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-start border-b-2 border-green-100 pb-8 mb-12">
          <div className="text-left"><p className="text-3xl text-gray-600 font-bold uppercase tracking-widest mb-2">{gregorianDate}</p><p className="text-2xl text-green-600 font-medium">{hijriDate}</p></div>
          <div className="bg-[#1B4332] text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-xl"><Moon size={32} /><span className="text-3xl font-bold">{ramadanStatus}</span></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center mb-12">
          <div className="w-32 h-32 bg-[#1B4332] text-white rounded-full flex items-center justify-center mb-12 shadow-2xl"><Sparkles size={64} /></div>
          <p className="font-serif text-[80px] text-[#1B4332] leading-[2.2] mb-12 text-center dir-rtl drop-shadow-sm">{dailyQuote.arabic}</p>
          <p className="text-gray-600 font-medium text-[36px] italic mb-8 text-center max-w-2xl leading-relaxed">"{dailyQuote.english}"</p>
          <span className="inline-block bg-gray-100 text-gray-600 text-2xl px-8 py-3 rounded-full font-bold mt-4 tracking-wide border border-gray-200">{dailyQuote.ref}</span>
      </div>
      <div className="pt-10 border-t-2 border-green-100 text-center">
          <p className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Wonder Sight Gallery</p>
          <p className="text-2xl text-gray-500 flex items-center justify-center gap-3"><Mail size={28} /> wondersightgallery@gmail.com</p>
      </div>
    </div>
  );

  // Auto Scroll to Playing Ayah
  useEffect(() => {
    if (currentIndex !== null && currentView === 'quran-reader') {
      document.getElementById(`ayah-${currentIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex, currentView]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* GLOBAL PLAYER */}
      {isPlaying && currentView !== 'quran-reader' && (
        <div className="fixed bottom-16 w-full max-w-md bg-[#1B4332] text-white p-3 z-40 flex items-center justify-between shadow-lg cursor-pointer" onClick={() => setCurrentView('quran-reader')}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Volume2 size={16} /></div>
                <div><p className="text-xs font-bold">Playing Surah...</p><p className="text-[10px] text-green-200">{activeReciter.name.split(' ')[0]}</p></div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); toggle(); }} className="p-2 bg-white text-[#1B4332] rounded-full"><Pause size={16} /></button>
        </div>
      )}

      {/* POPUP */}
      {showWelcome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-sm">
             <div className="bg-white rounded-3xl p-8 text-center relative shadow-2xl border-4 border-[#F0FDF4]">
                <button onClick={() => setShowWelcome(false)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={24} /></button>
                <MobileCardContent />
             </div>
             <button onClick={handleDownload} className="w-full mt-4 bg-[#1B4332] text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><Download size={18} /> Download HD Image</button>
           </div>
        </div>
      )}

      {/* SETTINGS */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-10 h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2"><Settings size={20} /> Preferences</h3>
                    <button onClick={() => setShowSettingsModal(false)} className="bg-gray-100 p-2 rounded-full hover:bg-red-50 hover:text-red-500"><X size={20} /></button>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Mic2 size={12} /> Reciter (Makkah & Madinah)</p>
                        <div className="grid grid-cols-2 gap-2">
                            {RECITERS.map(r => (<button key={r.id} onClick={() => setActiveReciter(r)} className={`text-left px-3 py-2 text-xs rounded-lg border font-medium ${activeReciter.id === r.id ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-gray-600 border-gray-200'}`}>{r.name}</button>))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Gauge size={12} /> Audio Speed</p>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {[0.5, 0.75, 1, 1.25, 1.5].map(rate => (<button key={rate} onClick={() => updateSpeed(rate)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${playbackRate === rate ? 'bg-white text-[#1B4332] shadow-sm' : 'text-gray-400'}`}>{rate}x</button>))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Type size={12} /> Arabic Size</p>
                        <input type="range" min="20" max="60" value={arabicFontSize} onChange={(e) => setArabicFontSize(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B4332]" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* HIDDEN STUDIO */}
      <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', opacity: 0, zIndex: -1 }}>
        <div ref={hiddenDownloadRef} style={{ width: '1080px', height: '1350px', background: 'linear-gradient(135deg, #FDFCF8 0%, #E8F5E9 100%)', padding: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}><div className="bg-white rounded-[60px] p-[80px] text-center shadow-2xl w-full h-full border-8 border-[#1B4332]/10 flex flex-col box-border"><HighResCardContent /></div></div>
      </div>

      {/* MAIN APP CONTENT */}
      {currentView === 'home' && (
        <div className="space-y-6 pb-24 p-6">
          <header className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-[#1B4332] font-serif">Daily Barakah</h1><p className="text-xs text-gray-500">{hijriDate} • Gusau</p></div>
            <div className="flex gap-2">
                <button onClick={() => setShowSettingsModal(true)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm"><Settings size={20} /></button>
                <button className="w-10 h-10 bg-[#D8F3DC] rounded-full flex items-center justify-center text-[#1B4332]"><Moon size={20} /></button>
            </div>
          </header>
          
          <div className="bg-[#1B4332] rounded-3xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div><p className="text-[#95D5B2] text-xs font-bold uppercase mb-1">Next Prayer</p><h2 className="text-4xl font-bold">{nextPrayerName} <span className="text-xl font-normal text-white/70">{nextPrayerTime}</span></h2></div>
                <div className="bg-white/10 p-2 rounded-lg text-center"><p className="text-xs text-[#95D5B2] uppercase font-bold">Status</p><p className="text-lg font-bold leading-tight">{ramadanStatus}</p></div>
            </div>
            <div className="flex justify-between text-center border-t border-white/20 pt-4">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (<div key={p} className="flex flex-col"><span className="text-[10px] text-[#95D5B2] uppercase">{p}</span><span className="font-bold text-sm">{prayerTimes ? prayerTimes[p] : "--:--"}</span></div>))}
            </div>
          </div>

          {lastRead && (
             <div onClick={() => { const surah = surahList.find(s => s.id === lastRead.surahId); if(surah) { openSurah(surah); setTimeout(() => document.getElementById(`ayah-${lastRead.ayah - 1}`)?.scrollIntoView({block:'center'}), 1000); } }} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between cursor-pointer hover:bg-orange-50 transition-colors">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Book size={20} /></div>
                     <div><p className="text-xs text-gray-400 font-bold uppercase">Continue Reading</p><p className="font-bold text-gray-800">{lastRead.surahName}</p></div>
                 </div>
                 <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Ayah {lastRead.ayah}</div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setCurrentView('quran-list')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"><BookOpen size={24} /><span className="font-bold text-gray-800">Read Quran</span></button>
            <button onClick={() => setCurrentView('duas')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2"><Heart size={24} /><span className="font-bold text-gray-800">Duas</span></button>
          </div>
          <div className="bg-[#F0FDF4] p-6 rounded-2xl border border-[#D8F3DC] text-center cursor-pointer" onClick={() => setShowWelcome(true)}>
            <p className="text-green-800 font-bold text-sm flex items-center justify-center gap-2"><Sparkles size={16} /> Show Daily Inspiration Again</p>
          </div>
        </div>
      )}

      {currentView === 'quran-list' && (
        <div className="pb-24 pt-6 px-4">
            <div className="sticky top-0 bg-[#FDFCF8] z-10 pb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1B4332] mb-2 px-2">The Noble Quran</h2>
                <button onClick={() => setShowSettingsModal(true)}><Settings size={24} className="text-gray-400" /></button>
            </div>
            {/* SEARCH BAR WITH PROMINENT SHAMZAN ICON */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input type="text" placeholder="Search Surah..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
                </div>
                <button onClick={startVoiceSearch} className="bg-[#1B4332] text-white p-3 rounded-xl shadow-lg shadow-green-200 hover:scale-105 transition-transform animate-pulse">
                    <Mic size={24} />
                </button>
            </div>
            
            <div className="space-y-2">
            {surahList.filter(s => s.name_simple.toLowerCase().includes(searchQuery)).map(surah => (
                <div key={surah.id} onClick={() => openSurah(surah)} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 hover:border-green-200 cursor-pointer">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-[#1B4332] text-sm">{surah.id}</div><div><h3 className="font-bold text-gray-900">{surah.name_simple}</h3><p className="text-xs text-gray-500">{surah.translated_name.name}</p></div></div>
                <span className="font-serif text-xl text-gray-400">{surah.name_arabic}</span>
                </div>
            ))}
            </div>
        </div>
      )}

      {currentView === 'bookmarks' && (
        <div className="pb-24 pt-6 px-6">
            <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-[#1B4332]">Your Bookmarks</h2>
                 {/* Bookmark Back Button */}
                 <button onClick={() => setCurrentView('home')} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"><ArrowLeft size={20} /></button>
            </div>
            
            {bookmarks.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No bookmarks yet. Tap the bookmark icon while reading a Surah.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookmarks.map((b, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer" onClick={() => { const surah = surahList.find(s => s.name_simple === b.surahName); if(surah) { openSurah(surah); setTimeout(() => document.getElementById(`ayah-${b.ayahNum - 1}`)?.scrollIntoView({block:'center'}), 1000); } }}>
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-[#1B4332]">{b.surahName} <span className="text-gray-500 text-sm font-normal">Ayah {b.ayahNum}</span></h3>
                                <button onClick={(e) => { e.stopPropagation(); const newB = bookmarks.filter(x => x.id !== b.id); setBookmarks(newB); localStorage.setItem('barakah_bookmarks', JSON.stringify(newB)); }}><X size={16} className="text-gray-400" /></button>
                            </div>
                            <p className="font-serif text-right text-gray-800">{b.arabic}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {currentView === 'quran-reader' && (
        <div className="pb-32 bg-[#FAF9F6]">
            <div className="sticky top-0 bg-[#1B4332] text-white p-4 flex items-center justify-between z-20 shadow-md">
                <button onClick={() => setCurrentView('quran-list')} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                <div className="text-center"><h2 className="font-bold text-lg">{activeSurah?.name_simple}</h2><p className="text-xs text-green-200">{activeSurah?.verses_count} Ayahs</p></div>
                <div className="flex gap-2">
                    <button onClick={() => setIsMushafMode(!isMushafMode)} className={`p-2 rounded-full text-xs font-bold border border-white/20 ${isMushafMode ? 'bg-white text-[#1B4332]' : 'bg-white/10'}`}>{isMushafMode ? <BookOpen size={16} /> : <Menu size={16} />}</button>
                    <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-white/10 rounded-full text-xs font-bold border border-white/20"><Settings size={16} /></button>
                </div>
            </div>
            <div className="p-6">
                {loading ? <div className="py-20 text-center text-gray-400">Loading Surah...</div> : (
                    <>
                        {isMushafMode ? (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center leading-[2.8] dir-rtl font-serif text-gray-900" style={{ fontSize: arabicFontSize + 'px' }}>
                                {activeSurah.id !== 1 && activeSurah.id !== 9 && <p className="mb-4 text-[#1B4332]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>}
                                {ayahs.map((ayah, i) => (
                                    <span key={ayah.id} onClick={() => { setRevealedAyah(i); setIsMushafMode(false); setTimeout(() => document.getElementById(`ayah-${i}`)?.scrollIntoView({block:'center'}), 100); }} className={`cursor-pointer hover:bg-green-50 ${currentIndex === i ? 'text-[#1B4332]' : ''}`}>
                                        {ayah.arabic} <span className="text-[#1B4332] text-sm inline-block mx-1">۝</span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {activeSurah.id !== 1 && activeSurah.id !== 9 && <div className="text-center py-4"><p className="font-serif text-3xl text-[#1B4332]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p></div>}
                                {ayahs.map((ayah, i) => (
                                    <div key={ayah.id} id={`ayah-${i}`} onClick={() => setRevealedAyah(revealedAyah === i ? null : i)} className={`text-center cursor-pointer transition-all p-2 rounded-xl ${currentIndex === i ? 'bg-green-50/80 scale-105' : ''}`}>
                                        <div className="flex justify-between px-2 mb-2">
                                            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-bold">{ayah.number}</span>
                                            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(activeSurah, ayah); }}><Bookmark size={20} className={bookmarks.some(b => b.id === `${activeSurah.id}:${ayah.number}`) ? "fill-[#1B4332] text-[#1B4332]" : "text-gray-300"} /></button>
                                        </div>
                                        <p className="font-serif leading-[2.5] text-gray-900 mb-4 dir-rtl" style={{ fontSize: arabicFontSize + 'px' }}>{ayah.arabic}</p>
                                        {revealedAyah === i && (
                                            <div className="animate-in fade-in slide-in-from-top-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mx-auto max-w-sm mt-2 text-left">
                                                <p className="text-gray-700 text-sm leading-relaxed mb-2 font-medium">{ayah.english}</p>
                                                <div className="h-px bg-gray-100 w-full my-2"></div>
                                                <p className="text-green-700 text-xs italic">{ayah.hausa}</p>
                                                <div className="mt-2 flex justify-end">
                                                    <button onClick={(e) => { e.stopPropagation(); playIndex(i); }} className="text-[#1B4332] flex items-center gap-1 text-xs font-bold"><Play size={12} /> Play Ayah</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-2xl z-50 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-500">{activeReciter.name}</div>
                <button onClick={toggle} className="w-12 h-12 bg-[#1B4332] rounded-full text-white flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">{isPlaying ? <Pause size={24} /> : <Play size={24} />}</button>
                <div className="w-10"></div>
            </div>
        </div>
      )}

      {currentView === 'duas' && (
        <div className="pb-24 pt-6 px-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B4332]">Fortress of the Muslim</h2>
                <button onClick={() => setShowSettingsModal(true)}><Settings size={24} className="text-gray-400" /></button>
            </div>
            {/* Scrollable Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
            {Object.keys(DUA_CATEGORIES).map((key) => (
                <button key={key} onClick={() => setActiveCategory(key)} className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeCategory === key ? 'bg-[#1B4332] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}>
                    {DUA_CATEGORIES[key].icon}
                    {DUA_CATEGORIES[key].title}
                </button>
            ))}
            </div>
            
            <div className="space-y-4">
            {DUA_CATEGORIES[activeCategory].duas.map((dua, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-bold text-[#1B4332] uppercase mb-4 border-b border-gray-50 pb-2">{dua.title}</h3>
                    <p className="text-right font-serif text-2xl mb-4 leading-loose text-gray-800" style={{ fontSize: arabicFontSize + 'px' }}>{dua.arabic}</p>
                    <p className="text-gray-600 text-sm italic">"{dua.meaning}"</p>
                </div>
            ))}
            </div>
        </div>
      )}

      {currentView === 'tasbih' && (
        <div className="pb-24 pt-10 px-6 min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6]">
            <h2 className="text-3xl font-bold text-[#1B4332] mb-2 font-serif">Digital Tasbih</h2>
            <div onClick={() => { setTasbihCount(c => c + 1); if (navigator.vibrate) navigator.vibrate(40); }} className="w-64 h-64 rounded-full bg-[#1B4332] shadow-2xl flex items-center justify-center border-8 border-[#D8F3DC] cursor-pointer active:scale-95 transition-transform select-none mb-10"><span className="text-7xl font-bold text-white font-mono">{tasbihCount}</span></div>
            <button onClick={() => setTasbihCount(0)} className="flex items-center gap-2 text-gray-400"><RefreshCw size={20} /> Reset</button>
        </div>
      )}

      {currentView === 'planner' && (
        <div className="pb-24 pt-6 px-6">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Ramadan Tracker</h2>
            <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                {['fasting', 'quran', 'taraweeh', 'dhikr', 'charity'].map((item) => (<div key={item} onClick={() => setPlanner(p => ({...p, [item]: !p[item as keyof typeof planner]}))} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${planner[item as keyof typeof planner] ? 'bg-[#1B4332] text-white' : 'bg-gray-50 text-gray-600'}`}><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${planner[item as keyof typeof planner] ? 'border-white' : 'border-gray-300'}`}>{planner[item as keyof typeof planner] && <CheckSquare size={14} />}</div><span className="capitalize font-medium">{item}</span></div>))}
            </div>
        </div>
      )}

      {/* FIXED BOTTOM NAVIGATION */}
      {currentView !== 'quran-reader' && (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 py-3 px-2 flex justify-between items-center z-50">
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'home' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Menu size={20} /><span className="text-[9px] font-bold">Home</span></button>
          <button onClick={() => setCurrentView('quran-list')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView.includes('quran') ? 'text-[#1B4332]' : 'text-gray-400'}`}><BookOpen size={20} /><span className="text-[9px] font-bold">Quran</span></button>
          <button onClick={() => setCurrentView('bookmarks')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'bookmarks' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Bookmark size={20} /><span className="text-[9px] font-bold">Saved</span></button>
          <button onClick={() => setCurrentView('tasbih')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'tasbih' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Repeat size={20} /><span className="text-[9px] font-bold">Tasbih</span></button>
          <button onClick={() => setCurrentView('duas')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'duas' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Heart size={20} /><span className="text-[9px] font-bold">Duas</span></button>
          <button onClick={() => setCurrentView('planner')} className={`flex flex-col items-center gap-1 w-[16%] ${currentView === 'planner' ? 'text-[#1B4332]' : 'text-gray-400'}`}><Calendar size={20} /><span className="text-[9px] font-bold">Plan</span></button>
        </div>
      )}
    </div>
  );
}