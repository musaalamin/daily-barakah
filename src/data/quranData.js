// --- 1. RECITERS LIST (The Legends) ---
// --- OPTIMIZED RECITERS LIST (FAST SERVERS) ---
export const RECITERS = [
  { 
    id: 'ar.alafasy', 
    name: 'Mishary Rashid Alafasy', 
    url: 'https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/' 
  },
  { 
    id: 'ar.sudais', 
    name: 'Abdur-Rahman as-Sudais', 
    url: 'https://mirrors.quranicaudio.com/everyayah/Abdurrahmaan_As-Sudais_192kbps/' 
  },
  { 
    id: 'ar.dosari', 
    name: 'Yasser Al-Dosari', 
    // FIX: Added Yasser Al-Dosari (Note the spelling "Dussary")
    url: 'https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/' 
  },
  { 
    id: 'ar.maher', 
    name: 'Maher Al-Muaiqly', 
    url: 'https://everyayah.com/data/MaherAlMuaiqly128kbps/' 
  },
  { 
    id: 'ar.juhany', 
    name: 'Abdullah Al-Juhany', 
    url: 'https://everyayah.com/data/Abdullaah_3awwaad_Al-Juhaynee_128kbps/' 
  },
  { 
    id: 'ar.hudaify', 
    name: 'Ali Al-Hudaify', 
    url: 'https://everyayah.com/data/Hudhaify_128kbps/' 
  },
  { 
    id: 'ar.bandar', 
    name: 'Bandar Baleela', 
    url: 'https://mirrors.quranicaudio.com/everyayah/Bandar_Baleela_64kbps/' 
  },
  { 
    id: 'ar.husary', 
    name: 'Mahmoud Khalil Al-Husary', 
    url: 'https://mirrors.quranicaudio.com/everyayah/Husary_128kbps/' 
  },
  { 
    id: 'ar.minshawi', 
    name: 'Mohamed Siddiq Al-Minshawi', 
    url: 'https://mirrors.quranicaudio.com/everyayah/Minshawy_Murattal_128kbps/' 
  }
];

// --- 2. DUA CATEGORIES ---
export const DUA_CATEGORIES = {
  morning_evening: {
    title: "Morning & Evening",
    duas: [
      { title: "Morning Protection", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ", meaning: "In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm." },
      { title: "Evening Gratitude", arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ", meaning: "O Allah, whatever blessing has been received by me or anyone of Your creation is from You alone." }
    ]
  },
  daily_life: {
    title: "Daily Life",
    duas: [
      { title: "Leaving Home", arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", meaning: "In the name of Allah, I place my trust in Allah; there is no might and no power except by Allah." },
      { title: "Entering Mosque", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", meaning: "O Allah, open the gates of Your mercy for me." }
    ]
  },
  protection: {
    title: "Protection",
    duas: [
      { title: "Against Anxiety", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", meaning: "O Allah, I seek refuge in You from anxiety and sorrow." },
      { title: "Seek Forgiveness", arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", meaning: "I seek forgiveness from Allah and repent to Him." }
    ]
  }
};

// --- 3. MOOD DOCTOR CONTENT ---
export const MOOD_CONTENT = {
  anxious: {
    question: "What is causing your anxiety?",
    options: [
      { label: "Fear of Future", prescription: { title: "Allah is Al-Razzaq", text: "Your provision is written. Worrying does not empty tomorrow of its sorrow, it empties today of its strength.", action: "Recite 'Hasbunallahu wa ni'mal wakeel' 33x.", surah: "Read Surah At-Talaq:3" } },
      { label: "Regret/Mistake", prescription: { title: "Mercy of Allah", text: "My Mercy encompasses all things. Do not despair of the mercy of Allah.", action: "Pray 2 Raka'at Salatul Tawbah.", surah: "Read Surah Az-Zumar:53" } }
    ]
  },
  sad: {
    question: "Where does this sadness come from?",
    options: [
      { label: "Loneliness", prescription: { title: "He is With You", text: "And We are closer to him than his jugular vein.", action: "Make Dua in Sujood.", surah: "Read Surah Qaf:16" } },
      { label: "Loss", prescription: { title: "Temporary World", text: "Verily, with hardship comes ease.", action: "Give Sadaqah (Charity).", surah: "Read Surah Ash-Sharh" } }
    ]
  },
  tired: {
    question: "What kind of tired?",
    options: [
      { label: "Burnout", prescription: { title: "Rest in Remembrance", text: "Unquestionably, by the remembrance of Allah hearts are assured.", action: "Listen to Quran quietly.", surah: "Listen to Surah Ar-Rahman" } },
      { label: "Physical", prescription: { title: "Body's Right", text: "Your body has a right over you.", action: "Sleep with Wudu.", surah: "Read Ayatul Kursi" } }
    ]
  },
  happy: {
    question: "MashaAllah! Express your joy:",
    options: [
      { label: "Gratitude", prescription: { title: "Alhamdulillah", text: "If you are grateful, I will surely increase you.", action: "Perform Sujood al-Shukr.", surah: "Read Surah Ibrahim:7" } },
      { label: "Share Joy", prescription: { title: "Spread Peace", text: "None of you truly believes until he loves for his brother what he loves for himself.", action: "Call a friend or give charity.", surah: "Read Surah Ad-Duha" } }
    ]
  }
};

// --- 4. 100+ DAILY INSPIRATIONS (MASSIVE LIST) ---
export const DAILY_INSPIRATIONS = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Verily, with hardship comes ease.", ref: "Quran 94:6" },
  { arabic: "فَاصْبِرْ صَبْرًا جَمِيلًا", english: "So be patient with a beautiful patience.", ref: "Quran 70:5" },
  { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", ref: "Quran 2:286" },
  { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", english: "And say, 'My Lord, increase me in knowledge.'", ref: "Quran 20:114" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Unquestionably, by the remembrance of Allah hearts are assured.", ref: "Quran 13:28" },
  { arabic: "وَاللَّهُ يُحِبُّ الصَّابِرِينَ", english: "And Allah loves the patient.", ref: "Quran 3:146" },
  { arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ", english: "Call upon Me; I will respond to you.", ref: "Quran 40:60" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", english: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.", ref: "Quran 3:173" },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", english: "And whoever fears Allah - He will make for him a way out.", ref: "Quran 65:2" },
  { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", english: "The best of you are those who learn the Quran and teach it.", ref: "Hadith Bukhari" },
  { arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", english: "Actions are judged by intentions.", ref: "Hadith Bukhari" },
  { arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", english: "A good word is charity.", ref: "Hadith Bukhari" },
  { arabic: "لاَ تَغْضَبْ", english: "Do not get angry.", ref: "Hadith Bukhari" },
  { arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", english: "The most beloved deeds to Allah are those that are consistent, even if small.", ref: "Hadith Muslim" },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", english: "Our Lord, give us in this world [that which is] good.", ref: "Quran 2:201" },
  { arabic: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا", english: "And hold firmly to the rope of Allah all together.", ref: "Quran 3:103" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", english: "Indeed, Allah is with the patient.", ref: "Quran 2:153" },
  { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", english: "Say, He is Allah, [who is] One.", ref: "Quran 112:1" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", english: "So remember Me; I will remember you.", ref: "Quran 2:152" },
  { arabic: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا", english: "Do not grieve; indeed Allah is with us.", ref: "Quran 9:40" },
  { arabic: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ", english: "And rely upon the Ever-Living who does not die.", ref: "Quran 25:58" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", english: "My Lord, expand for me my breast [with assurance].", ref: "Quran 20:25" },
  { arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", english: "And He will provide for him from where he does not expect.", ref: "Quran 65:3" },
  { arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", english: "Every soul will taste death.", ref: "Quran 3:185" },
  { arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", english: "And My mercy encompasses all things.", ref: "Quran 7:156" },
  { arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", english: "If you are grateful, I will surely increase you.", ref: "Quran 14:7" },
  { arabic: "وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ", english: "And Allah knows, while you know not.", ref: "Quran 2:216" },
  { arabic: "إِنَّ رَبِّي لَسَمِيعُ الدُّعَاءِ", english: "Indeed, my Lord is the Hearer of supplication.", ref: "Quran 14:39" },
  { arabic: "فَفِرُّوا إِلَى اللَّهِ", english: "So flee to Allah.", ref: "Quran 51:50" },
  { arabic: "نَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ", english: "We are closer to him than [his] jugular vein.", ref: "Quran 50:16" },
  { arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", english: "And do not despair of relief from Allah.", ref: "Quran 12:87" },
  { arabic: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", english: "Indeed, Allah is Forgiving and Merciful.", ref: "Quran 2:173" },
  { arabic: "وَقُولُوا لِلنَّاسِ حُسْنًا", english: "And speak to people good [words].", ref: "Quran 2:83" },
  { arabic: "أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ", english: "Is not Allah sufficient for His servant?", ref: "Quran 39:36" },
  { arabic: "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا", english: "Say, 'Never will we be struck except by what Allah has decreed for us.'", ref: "Quran 9:51" },
  { arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", english: "And when I am ill, it is He who cures me.", ref: "Quran 26:80" },
  { arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ", english: "My Lord, indeed I am, for whatever good You would send down to me, in need.", ref: "Quran 28:24" },
  { arabic: "وَجَزَاهُم بِمَا صَبَرُوا جَنَّةً وَحَرِيرًا", english: "And will reward them for what they patiently endured [with] a garden and silk.", ref: "Quran 76:12" },
  { arabic: "سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا", english: "Allah will bring about, after hardship, ease.", ref: "Quran 65:7" },
  { arabic: "وَأَنَّ إِلَىٰ رَبِّكَ الْمُنتَهَىٰ", english: "And that to your Lord is the finality.", ref: "Quran 53:42" },
  { arabic: "مَنْ تَرَكَ شَيْئًا لِلَّهِ عَوَّضَهُ اللَّهُ خَيْرًا مِنْهُ", english: "Whoever leaves something for the sake of Allah, Allah will replace it with something better.", ref: "Hadith" },
  { arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ", english: "The world is a prison for the believer and a paradise for the unbeliever.", ref: "Hadith Muslim" },
  { arabic: "مَنْ لَا يَرْحَمُ لَا يُرْحَمُ", english: "He who does not show mercy will not be shown mercy.", ref: "Hadith Bukhari" },
  { arabic: "الظُّلْمُ ظُلُمَاتٌ يَوْمَ الْقِيَامَةِ", english: "Oppression will be a darkness on the Day of Resurrection.", ref: "Hadith Bukhari" },
  { arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا", english: "The most complete of the believers in faith are those with the best character.", ref: "Hadith Tirmidhi" },
  { arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ", english: "Fear Allah wherever you are.", ref: "Hadith Tirmidhi" },
  { arabic: "وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ", english: "And deal with people with good character.", ref: "Hadith Tirmidhi" },
  { arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ", english: "The strong believer is better and more beloved to Allah than the weak believer.", ref: "Hadith Muslim" },
  { arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", english: "None of you [truly] believes until he loves for his brother what he loves for himself.", ref: "Hadith Bukhari" },
  { arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", english: "Your smile for your brother is charity.", ref: "Hadith Tirmidhi" },
  { arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ", english: "The best of people are those that bring most benefit to the rest of mankind.", ref: "Hadith" },
  { arabic: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ", english: "Indeed, Allah is Beautiful and He loves beauty.", ref: "Hadith Muslim" },
  { arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", english: "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.", ref: "Hadith Muslim" },
  { arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ", english: "Purity is half of faith.", ref: "Hadith Muslim" },
  { arabic: "يَسِّرُوا وَلَا تُعَسِّرُوا", english: "Make things easy and do not make them difficult.", ref: "Hadith Bukhari" },
  { arabic: "بَشِّرُوا وَلَا تُنَفِّرُوا", english: "Give good tidings and do not repel people.", ref: "Hadith Bukhari" },
  { arabic: "كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ", english: "All of you are shepherds and each of you is responsible for his flock.", ref: "Hadith Bukhari" },
  { arabic: "أَيُّهَا النَّاسُ أَفْشُوا السَّلَامَ", english: "O people, spread peace.", ref: "Hadith Tirmidhi" },
  { arabic: "أَطْعِمُوا الطَّعَامَ", english: "Feed others.", ref: "Hadith Tirmidhi" },
  { arabic: "صِلُوا الْأَرْحَامَ", english: "Maintain ties of kinship.", ref: "Hadith Tirmidhi" },
  { arabic: "صَلُّوا بِاللَّيْلِ وَالنَّاسُ نِيَامٌ تَدْخُلُوا الْجَنَّةَ بِسَلَامٍ", english: "Pray at night while people are sleeping, and you will enter Paradise in peace.", ref: "Hadith Tirmidhi" },
  { arabic: "إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ", english: "Truthfulness leads to righteousness.", ref: "Hadith Bukhari" },
  { arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", english: "Whoever believes in Allah and the Last Day should say good or remain silent.", ref: "Hadith Bukhari" },
  { arabic: "رَبَّنَا لاَ تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", english: "Our Lord, do not impose blame upon us if we have forgotten or erred.", ref: "Quran 2:286" },
  { arabic: "رَبَّنَا وَلاَ تُحَمِّلْنَا مَا لاَ طَاقَةَ لَنَا بِهِ", english: "Our Lord, and do not burden us with that which we have no ability to bear.", ref: "Quran 2:286" },
  { arabic: "وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا", english: "And pardon us; and forgive us; and have mercy upon us.", ref: "Quran 2:286" },
  { arabic: "أَنتَ مَوْلاَنَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", english: "You are our protector, so give us victory over the disbelieving people.", ref: "Quran 2:286" },
  { arabic: "قُل لَّن يُصِيبَنَا إِلاَّ مَا كَتَبَ اللّهُ لَنَا", english: "Say: Nothing will happen to us except what Allah has decreed for us.", ref: "Quran 9:51" },
  { arabic: "هُوَ مَوْلاَنَا وَعَلَى اللّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ", english: "He is our Protector: and on Allah let the Believers put their trust.", ref: "Quran 9:51" },
  { arabic: "وَمَا تَوْفِيقِي إِلاَّ بِاللّهِ", english: "And my success is not but through Allah.", ref: "Quran 11:88" },
  { arabic: "عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ", english: "Upon Him I have relied, and to Him I return.", ref: "Quran 11:88" },
  { arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", english: "Our Lord, forgive me and my parents and the believers the Day the account is established.", ref: "Quran 14:41" },
  { arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلاَةِ وَمِن ذُرِّيَّتِي", english: "My Lord, make me an establisher of prayer, and [many] from my descendants.", ref: "Quran 14:40" },
  { arabic: "رَبَّنَا وَتَقَبَّلْ دُعَاء", english: "Our Lord, and accept my supplication.", ref: "Quran 14:40" },
  { arabic: "رَّبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ", english: "My Lord, cause me to enter a sound entrance and to exit a sound exit.", ref: "Quran 17:80" },
  { arabic: "وَاجْعَل لِّي مِن لَّدُنكَ سُلْطَانًا نَّصِيرًا", english: "And grant me from Yourself a supporting authority.", ref: "Quran 17:80" },
  { arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً", english: "Our Lord, grant us from Yourself mercy.", ref: "Quran 18:10" },
  { arabic: "وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", english: "And prepare for us from our affair right guidance.", ref: "Quran 18:10" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", english: "My Lord, expand for me my breast.", ref: "Quran 20:25" },
  { arabic: "وَيَسِّرْ لِي أَمْرِي", english: "And ease for me my task.", ref: "Quran 20:26" },
  { arabic: "وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي", english: "And untie the knot from my tongue.", ref: "Quran 20:27" },
  { arabic: "يَفْقَهُوا قَوْلِي", english: "That they may understand my speech.", ref: "Quran 20:28" },
  { arabic: "رَّبِّ زِدْنِي عِلْمًا", english: "My Lord, increase me in knowledge.", ref: "Quran 20:114" },
  { arabic: "لا إِلَهَ إِلا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", english: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.", ref: "Quran 21:87" },
  { arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ", english: "My Lord, do not leave me alone [with no heir], while You are the best of inheritors.", ref: "Quran 21:89" },
  { arabic: "رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ", english: "My Lord, I seek refuge in You from the incitements of the devils.", ref: "Quran 23:97" },
  { arabic: "وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ", english: "And I seek refuge in You, my Lord, lest they be present with me.", ref: "Quran 23:98" },
  { arabic: "رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنتَ خَيْرُ الرَّاحِمِينَ", english: "Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.", ref: "Quran 23:109" },
  { arabic: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ", english: "Our Lord, avert from us the punishment of Hell.", ref: "Quran 25:65" },
  { arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", english: "Our Lord, grant us from among our wives and offspring comfort to our eyes.", ref: "Quran 25:74" },
  { arabic: "وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", english: "And make us an example for the righteous.", ref: "Quran 25:74" },
  { arabic: "رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ", english: "My Lord, grant me authority and join me with the righteous.", ref: "Quran 26:83" },
  { arabic: "وَاجْعَل لِّي لِسَانَ صِدْقٍ فِي الْآخِرِينَ", english: "And grant me a reputation of honor among later generations.", ref: "Quran 26:84" },
  { arabic: "وَاجْعَلْنِي مِن وَرَثَةِ جَنَّةِ النَّعِيمِ", english: "And place me among the inheritors of the Garden of Pleasure.", ref: "Quran 26:85" },
  { arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ", english: "My Lord, enable me to be grateful for Your favor.", ref: "Quran 27:19" },
  { arabic: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي", english: "My Lord, indeed I have wronged myself, so forgive me.", ref: "Quran 28:16" },
  { arabic: "رَبِّ انصُرْنِي عَلَى الْقَوْمِ الْمُفْسِدِينَ", english: "My Lord, support me against the corrupting people.", ref: "Quran 29:30" },
  { arabic: "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَّحْمَةً وَعِلْمًا", english: "Our Lord, You have encompassed all things in mercy and knowledge.", ref: "Quran 40:7" },
  { arabic: "فَاغْفِرْ لِلَّذِينَ تَابُوا وَاتَّبَعُوا سَبِيلَكَ", english: "So forgive those who have repented and followed Your way.", ref: "Quran 40:7" },
  { arabic: "وَقِهِـمْ عَذَابَ الْجَحِيمِ", english: "And protect them from the punishment of Hellfire.", ref: "Quran 40:7" },
  { arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ", english: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me.", ref: "Quran 46:15" },
  { arabic: "وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ", english: "And that I may do righteous deeds which please You.", ref: "Quran 46:15" },
  { arabic: "وَأَصْلِحْ لِي فِي ذُرِّيَّتِي", english: "And make righteous for me my offspring.", ref: "Quran 46:15" },
  { arabic: "إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ", english: "Indeed, I have turned to You, and indeed, I am of the Muslims.", ref: "Quran 46:15" },
  { arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ", english: "Our Lord, forgive us and our brothers who preceded us in faith.", ref: "Quran 59:10" },
  { arabic: "وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا", english: "And do not place in our hearts any resentment toward those who have believed.", ref: "Quran 59:10" },
  { arabic: "رَبَّنَا إِنَّكَ رَؤُوفٌ رَّحِيمٌ", english: "Our Lord, indeed You are Kind and Merciful.", ref: "Quran 59:10" },
  { arabic: "رَّبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ", english: "Our Lord, upon You we have relied, and to You we have returned, and to You is the destination.", ref: "Quran 60:4" },
  { arabic: "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلَّذِينَ كَفَرُوا", english: "Our Lord, make us not [objects of] trial for the disbelievers.", ref: "Quran 60:5" },
  { arabic: "وَاغْفِرْ لَنَا رَبَّنَا إِنَّكَ أَنتَ الْعَزِيزُ الْحَكِيمُ", english: "And forgive us, our Lord. Indeed, You are the Exalted in Might, the Wise.", ref: "Quran 60:5" },
  { arabic: "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا", english: "Our Lord, perfect for us our light and forgive us.", ref: "Quran 66:8" },
  { arabic: "إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", english: "Indeed, You are over all things competent.", ref: "Quran 66:8" },
  { arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ", english: "My Lord, forgive me and my parents.", ref: "Quran 71:28" }
];