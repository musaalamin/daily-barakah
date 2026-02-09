// src/data/quranData.js

// --- 1. RECITERS (Updated with Haramain Imams) ---
export const RECITERS = [
  { id: "hudaify", name: "Ali Al-Hudaify", url: "https://everyayah.com/data/Hudhaify_128kbps/" },
  { id: "sudais", name: "Abdur-Rahman as-Sudais", url: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
  { id: "shuraim", name: "Saud Al-Shuraim", url: "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/" },
  { id: "maher", name: "Maher Al Muaiqly", url: "https://everyayah.com/data/MaherAlMuaiqly128kbps/" },
  { id: "juhany", name: "Abdallah Al Juhany", url: "https://everyayah.com/data/Abdullaah_3awwaad_Al-Juhaynee_128kbps/" },
  { id: "dossary", name: "Yasser Al Dossary", url: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/" },
  { id: "bandar", name: "Bandar Baleela", url: "https://everyayah.com/data/Bandar_Baleela_128kbps/" },
  { id: "buayjan", name: "Abdullah Al Buayjan", url: "https://everyayah.com/data/Abdullah_Al_Buayjan_128kbps/" },
  { id: "mishary", name: "Mishary Alafasy", url: "https://everyayah.com/data/Alafasy_128kbps/" },
  { id: "ghaamidi", name: "Saad Al-Ghamdi", url: "https://everyayah.com/data/Ghamadi_40kbps/" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi", url: "https://everyayah.com/data/Minshawy_Murattal_128kbps/" },
];

// --- 2. DUAS (Extracted from Hisnul Muslim PDF) ---
export const DUA_CATEGORIES = {
  morning_evening: {
    title: "Morning & Evening",
    duas: [
      { 
        title: "Ayatul Kursi", 
        arabic: "ٱللَّهُ لَاۤ إِلَـٰهَ إِلَّا هُوَ ٱلۡحَیُّ ٱلۡقَیُّومُ... (Recite full Ayah)", 
        meaning: "Protection from morning until evening and vice versa." 
      },
      { 
        title: "Sayyidul Istighfar", 
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ ، وَأَبُوءُ بِذَنْبِي ، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", 
        meaning: "The Chief of prayers for forgiveness. Whoever says it during the day with firm belief and dies that day will enter Paradise." 
      },
      {
        title: "For Well-being",
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي ، اللَّهُمَّ عَافِنِي فِي سَمْعِي ، اللَّهُمَّ عَافِنِي فِي بَصَرِي ، لَا إِلَهَ إِلَّا أَنْتَ",
        meaning: "O Allah, grant health to my body, hearing, and sight."
      },
      {
         title: "Protection from Anxiety",
         arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ ، وَالْفَقْرِ ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ ، لَا إِلَهَ إِلَّا أَنْتَ",
         meaning: "Refuge from disbelief, poverty, and the punishment of the grave."
      }
    ]
  },
  daily_life: {
    title: "Daily Life",
    duas: [
      { title: "Waking Up", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", meaning: "Praise is to Allah Who gave us life after He had caused us to die." },
      { title: "Entering Toilet", arabic: "بِسْمِ اللَّهِ اللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ", meaning: "O Allah, I take refuge with you from all evil." },
      { title: "Leaving Home", arabic: "بِسْمِ اللَّهِ ، تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", meaning: "I place my trust in Allah, there is no might nor power except with Allah." },
      { title: "After Eating", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا ، وَكَفَانَا وَآوَانَا", meaning: "Praise be to Allah who fed us and gave us drink." }
    ]
  },
  travel: {
    title: "Travel",
    duas: [
        { title: "Travel Supplication (Safar)", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ... اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى", meaning: "Glory to Him who has subjected this to us... O Allah, we ask You for righteousness in this journey." },
        { title: "Returning", arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ", meaning: "We return, repent, worship and praise our Lord." }
    ]
  },
  protection: {
    title: "Protection & Ruqyah",
    duas: [
        { title: "For Anxiety & Sorrow", arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ...", meaning: "O Allah, I am Your servant... make the Quran the spring of my heart." },
        { title: "For Pain (Ruqyah)", arabic: "أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ", meaning: "(Place hand on pain, say Bismillah 3x, then this 7x): I seek refuge in Allah's power from the evil I feel." },
        { title: "Evil Eye", arabic: "اللَّهُمَّ بَارِكْ عَلَيْهِ", meaning: "O Allah, send blessings upon him." }
    ]
  },
  ramadan: {
    title: "Ramadan & Fasting",
    duas: [
      { title: "Sighting Crescent", arabic: "اللَّهُ أَكْبَرُ ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالإِيمَانِ...", meaning: "O Allah, let the crescent loom above us in safety and faith." },
      { title: "Breaking Fast", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ", meaning: "The thirst is gone, the veins are moistened, and the reward is confirmed." },
      { title: "Visiting Others", arabic: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ", meaning: "May the fasting break their fast in your home." }
    ]
  }
};

// --- 3. GENERATOR FOR 70+ REMINDERS ---
const BASE_QUOTES = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship [will be] ease.", ref: "Quran 94:6" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", english: "So remember Me; I will remember you.", ref: "Quran 2:152" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english: "And whoever relies upon Allah - then He is sufficient for him.", ref: "Quran 65:3" },
  { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", ref: "Quran 2:286" },
  { arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ", english: "Call upon Me; I will respond to you.", ref: "Quran 40:60" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "Quran 2:153" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Unquestionably, by the remembrance of Allah do hearts find rest.", ref: "Quran 13:28" },
  { arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", english: "And Allah loves the doers of good.", ref: "Quran 3:134" },
  { arabic: "فَاصْبِرْ صَبْرًا جَمِيلًا", english: "So be patient with a beautiful patience.", ref: "Quran 70:5" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", english: "My Lord, expand for me my breast [with assurance].", ref: "Quran 20:25" }
];

// Helper to expand list to 70+ for demo purposes (In production, fill this with 70 unique entries)
export const DAILY_INSPIRATIONS = Array(8).fill(BASE_QUOTES).flat();