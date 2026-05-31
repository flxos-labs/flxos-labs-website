"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import StarfieldCanvas from "./StarfieldCanvas";

interface Reason {
  num: string;
  title: string;
  desc: string;
}

const REASONS: Reason[] = [
  {
    num: "01",
    title: "Your Smile Rewrites My Worst Days",
    desc: "No matter how heavy the day feels, the moment you smile, everything else fades into the background. It is my guiding light.",
  },
  {
    num: "02",
    title: "You Make Silence Feel Like Poetry",
    desc: "With you, quiet spaces aren't empty. They are filled with an unspoken understanding and a deep, comforting peace that words could never capture.",
  },
  {
    num: "03",
    title: "Your Courage Inspires My Ambition",
    desc: "The grace and resilience you show in the face of challenges makes me want to grow, push my boundaries, and be the best version of myself.",
  },
  {
    num: "04",
    title: "You See the Me I'm Still Becoming",
    desc: "You don't just love me for who I am today; you believe in the person I am striving to become, guiding me gently with your patience.",
  },
  {
    num: "05",
    title: "Your Laughter Is My Favorite Sound",
    desc: "It's a melody that instantly lifts my spirit. Hearing you laugh is the sweetest reminder of the pure joy we bring into each other's lives.",
  },
  {
    num: "06",
    title: "You Turn Ordinary Into Extraordinary",
    desc: "A simple walk, a quiet evening, or a routine errand becomes an adventure when I'm by your side. You bring magic to the mundane.",
  },
  {
    num: "07",
    title: "Your Heart Knows Mine Before I Speak",
    desc: "We have a connection that transcends spoken language. You can read my thoughts in a glance and feel my emotions before I even explain them.",
  },
  {
    num: "08",
    title: "You Are My Calm in Every Storm",
    desc: "When the world is chaotic and loud, you are my safe harbor. In your arms, I find a stillness and peace that keeps me centered.",
  },
];

interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
  memory: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: "1st Year, 1st Sem",
    title: "Classroom Chemistry",
    desc: "First time sitting right next to you during our semester exam.",
    memory: "I could barely concentrate on the paper. Having you sit next to me was the best kind of distraction, and where my silent admiration for you truly began."
  },
  {
    date: "April 9, 2026",
    title: "Our First Chat",
    desc: "The night we started chatting and couldn't stop.",
    memory: "A simple text message that sparked a conversation lasting hours. We connected instantly, talking about everything and realizing how beautifully our minds aligned."
  },
  {
    date: "April 10, 2026",
    title: "Holding Your Hand",
    desc: "The moment our fingers laced together for the first time.",
    memory: "A quiet, gentle touch that sent sparks through my heart. Lacing my fingers with yours, I felt an overwhelming sense of calm, knowing I never wanted to let go."
  },
  {
    date: "Today & Beyond",
    title: "Hand in Hand, Always",
    desc: "Looking forward to every tomorrow, knowing we'll face it together.",
    memory: "Building our dreams, making promises, and loving you more with every single passing second. Our infinity starts here."
  }
];

const COMPLIMENTS = [
  "You have a heart of pure gold, and being loved by you is my greatest fortune.",
  "Your laughter is my favorite song, and your smile is my daily inspiration.",
  "You make the hardest days feel light and the simplest moments feel like magic.",
  "I love the way you look at the world with such kindness and courage.",
  "You are my safe haven, my peace, and my anchor in every storm.",
  "Thank you for believing in the person I am still striving to become.",
  "I fall in love with you all over again, every single time I see your face.",
  "You are the poetry I never knew how to write, and the song I always want to sing.",
  "With you, silence is comfortable, laughter is easy, and love is limitless.",
  "You are the best part of my today, and the only tomorrow I will ever need.",
  "Your kindness is a light that makes the entire world a warmer place.",
  "I adore the quiet way you understand my thoughts before I even speak them."
];

const PROMISES = [
  "To always choose you, in every season of life.",
  "To cherish the quiet mornings and laugh in the wild storms.",
  "To support your dreams as if they were my own.",
  "To never let the spark fade, and grow old with you.",
  "To hold your hand through every twist and turn."
];

interface StarNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

const CONSTELLATION_STARS: StarNode[] = [
  { id: 1, x: 50, y: 85, label: "Anchor" },      // Bottom point of heart
  { id: 2, x: 20, y: 55, label: "Trust" },       // Lower left curve
  { id: 3, x: 15, y: 25, label: "Dream" },       // Top left outer
  { id: 4, x: 35, y: 15, label: "Laughter" },    // Top left peak
  { id: 5, x: 50, y: 35, label: "Destiny" },     // Center dip
  { id: 6, x: 65, y: 15, label: "Passion" },     // Top right peak
  { id: 7, x: 85, y: 25, label: "Kindness" },    // Top right outer
  { id: 8, x: 80, y: 55, label: "Devotion" }     // Lower right curve
];

interface LoveValue {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  description: string;
}

const LOVE_VALUES: LoveValue[] = [
  { id: "trust", label: "Trust", icon: "🤝", x: 50, y: 15, description: "The safe foundation that lets us share our absolute truths." },
  { id: "laughter", label: "Laughter", icon: "✨", x: 20, y: 35, description: "Our secret language of joy, turning simple days into melodies." },
  { id: "comfort", label: "Comfort", icon: "☕", x: 15, y: 65, description: "The peace of quiet moments, feeling completely at home together." },
  { id: "dreams", label: "Shared Dreams", icon: "🌌", x: 50, y: 85, description: "Designing our tomorrow side-by-side in the vast universe." },
  { id: "patience", label: "Patience", icon: "⏳", x: 85, y: 65, description: "The gentle breathing room that lets our love grow at its own pace." },
  { id: "kindness", label: "Kindness", icon: "🌸", x: 80, y: 35, description: "The soft, protective warmth in every look and spoken word." }
];

const ORACLE_PREDICTIONS = [
  "A lifetime of warm hugs, hot cocoa, and late-night laughing fits is in your stars. ☕✨",
  "A cozy trip to a hidden cabin in the woods awaits you, complete with a fireplace and endless stories. 🌲🏡",
  "Your love constellation predicts a surprise date night filled with your favorite sweet treats. 🍫❤️",
  "The cosmic alignment shows Akash making you a cup of tea exactly when you need it most. 🍵💫",
  "A future afternoon spent walking hand-in-hand through a sunlit flower garden is written in your stars. 🌸☀️",
  "The stars declare that you will find magic in the most ordinary of Tuesdays. 💫🗓️",
  "An unexpected moment of shared eye contact will make your heart skip a beat all over again. 👀💖",
  "A quiet Sunday morning with zero alarms and endless comfort is predicted for your horizon. ☕🛋️"
];

interface LoveStat {
  label: string;
  val: string;
  percent: number;
  icon: string;
}

const LOVE_STATS: LoveStat[] = [
  { label: "Days Admiring You", val: "100%", percent: 100, icon: "👀" },
  { label: "Laughter Shared", val: "Infinite", percent: 100, icon: "😂" },
  { label: "Tea Envisioned", val: "10,000+", percent: 95, icon: "☕" },
  { label: "Hugs Needed Daily", val: "∞", percent: 100, icon: "🤗" }
];

const FUTURE_LETTER_CONTENT = `My Dearest Rekha,

As you read this scroll, know that my heart is, and will always be, anchored in yours. I wrote this message as a small promise to our future—a promise that no matter how many chapters we write, how many days pass, or how much the world changes around us, my devotion to you will remain constant.

I look forward to all the tomorrows we haven't seen yet. To the ordinary mornings, the sudden adventures, the quiet evenings, and the dreams we are building day by day. You are my greatest miracle in this vast universe, and I am infinitely grateful to walk this path hand-in-hand with you.

Yours forever and always,
Akash`;

interface TriviaQuestion {
  id: number;
  q: string;
  answer: string;
  options: string[];
  reaction: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 1,
    q: "What is Akash's favorite watch brand?",
    answer: "Rolex",
    options: ["Omega", "Rolex", "Casio", "Seiko"],
    reaction: "Yes! A classic Rolex represents my timeless love for you! ⌚❤️"
  },
  {
    id: 2,
    q: "What is Akash's favorite food?",
    answer: "Scrambled Eggs with Smoked Trout and Crème Fraîche",
    options: [
      "Truffle Pizza with Mushrooms",
      "Spicy Ramen with Boiled Eggs",
      "Scrambled Eggs with Smoked Trout and Crème Fraîche",
      "Fresh Salmon Sushi Platter"
    ],
    reaction: "Oh my god, you actually know it perfectly! Such a delicious selection! 🍳🐟✨"
  },
  {
    id: 3,
    q: "What is Akash's favorite color?",
    answer: "White",
    options: ["Crimson Red", "White", "Pastel Pink", "Deep Navy Blue"],
    reaction: "Yes! White—pure, serene, and absolute, just like how I feel when I look at you. 🤍"
  },
  {
    id: 4,
    q: "What is Akash's favorite movie of all time?",
    answer: "Interstellar",
    options: ["Inception", "Tenet", "Interstellar", "Oppenheimer"],
    reaction: "Correct! The gravity of my love pulls me to you across any dimension, Rekha! 🌌🚀"
  },
  {
    id: 5,
    q: "What is Akash's favorite song?",
    answer: "Faded",
    options: ["Alone", "Faded", "Spectre", "Sing Me To Sleep"],
    reaction: "Yes! 'Faded' by Alan Walker—but with you, my world is fully in focus. 🎵⚡"
  },
  {
    id: 6,
    q: "What is Akash's favorite mobile brand?",
    answer: "Xiaomi",
    options: ["Samsung", "Apple iPhone", "Xiaomi", "OnePlus"],
    reaction: "You got it! Xiaomi for life! 📱🔥"
  },
  {
    id: 7,
    q: "What is Akash's favorite place to visit?",
    answer: "Japan",
    options: ["Switzerland", "Japan", "Paris", "Bali"],
    reaction: "Yes! Japan—and I can't wait to walk under the cherry blossoms hand-in-hand with you. 🌸🇯🇵"
  },
  {
    id: 8,
    q: "What is Akash's favorite fruit?",
    answer: "Mango",
    options: ["Strawberry", "Blueberry", "Mango", "Alphonso Peach"],
    reaction: "Correct! The sweet king of fruits, just like how sweet you are to me! 🥭💛"
  },
  {
    id: 9,
    q: "What is Akash's favorite chocolate?",
    answer: "Feastables",
    options: ["Feastables", "Lindt Swiss Classic", "Cadbury Dairy Milk Silk", "Ferrero Rocher"],
    reaction: "Yes! Feastables! A modern sweet treat for my favorite person. 🍫✨"
  },
  {
    id: 10,
    q: "What is Akash's favorite game?",
    answer: "Genshin Impact",
    options: ["Valorant", "Genshin Impact", "Cyberpunk 2077", "Minecraft"],
    reaction: "Wow! You remembered Genshin Impact! Ready for our next adventure in Teyvat? 🎮💫"
  },
  {
    id: 11,
    q: "What is Akash's favorite academic subject?",
    answer: "Computer Science Engineering",
    options: ["Astrophysics", "Quantum Mechanics", "Computer Science Engineering", "Advanced Mathematics"],
    reaction: "Correct! Coding my way to your heart is my favorite program. 💻❤️"
  },
  {
    id: 12,
    q: "Who is Akash's favorite actor?",
    answer: "Robert Downey Jr.",
    options: ["Tom Holland", "Robert Downey Jr.", "Cillian Murphy", "Ryan Reynolds"],
    reaction: "Yes! I love you 3000, just like Tony Stark! 🦾❤️"
  },
  {
    id: 13,
    q: "Who is Akash's favorite actress?",
    answer: "Katrina Kaif",
    options: ["Deepika Padukone", "Alia Bhatt", "Katrina Kaif", "Emma Watson"],
    reaction: "Correct! Katrina Kaif! You know my silver screen preferences so well. 🎬🌟"
  },
  {
    id: 14,
    q: "What is Akash's favorite bike or car brand?",
    answer: "Koenigsegg",
    options: ["Koenigsegg", "Bugatti Chiron", "Ferrari LaFerrari", "Pagani Huayra"],
    reaction: "Spot on! Hypercars and fast dreams, and you are my ultimate co-pilot! 🏎️💨"
  },
  {
    id: 15,
    q: "What is Akash's absolute favorite app?",
    answer: "Claude",
    options: ["Spotify", "Claude", "YouTube", "GitHub"],
    reaction: "Haha, yes! Claude is the assistant of choice, coding up this beautiful site for us. 🤖🤍"
  },
  {
    id: 16,
    q: "What is Akash's favorite season?",
    answer: "Winter",
    options: ["Autumn", "Winter", "Spring", "Summer"],
    reaction: "Yes! Cold winter mornings are perfect for cozying up and drinking tea together. ❄️☕"
  },
  {
    id: 17,
    q: "What is Akash's favorite drink?",
    answer: "Masala Chhas",
    options: ["Mango Lassi", "Masala Chhas", "Iced Peach Tea", "Cold Coffee"],
    reaction: "Correct! A refreshing glass of Masala Chhas is unbeatable! 🥛✨"
  },
  {
    id: 18,
    q: "What is Akash's favorite hobby?",
    answer: "Content Creation",
    options: ["Landscape Photography", "Playing the Guitar", "Content Creation", "Reading Novels"],
    reaction: "Yes! Creating content, and you are my infinite muse. 📹🎨"
  },
  {
    id: 19,
    q: "What is Akash's favorite festival?",
    answer: "Dussehra",
    options: ["Diwali", "Dussehra", "Holi", "Navratri"],
    reaction: "Correct! Dussehra, celebrating the victory of goodness and light. 🏹✨"
  },
  {
    id: 20,
    q: "What is Akash's favorite TV show?",
    answer: "Wednesday",
    options: ["Stranger Things", "Wednesday", "Dark", "The Crown"],
    reaction: "Yes! Wednesday Addams! A little bit quirky, highly determined, just like me. 🖤🎻"
  },
  {
    id: 21,
    q: "What is Akash's favorite pet animal?",
    answer: "Cat",
    options: ["Golden Retriever Dog", "Cat", "Fluffy Rabbit", "Baby Panda"],
    reaction: "Yes! A cat—mysterious, elegant, cozy, and cute. 🐱🐾"
  },
  {
    id: 22,
    q: "What is Akash's favorite ice cream flavor?",
    answer: "Butterscotch",
    options: ["Classic Vanilla Bean", "Double Dark Chocolate", "Butterscotch", "Mint Chocolate Chip"],
    reaction: "Exactly! Butterscotch with its crunchy caramelized sweetness. 🍦💛"
  },
  {
    id: 23,
    q: "What is Akash's favorite clothing brand?",
    answer: "Snitch",
    options: ["Zara", "Snitch", "H&M", "Uniqlo"],
    reaction: "Correct! Snitch has the absolute best styling! 👕✨"
  },
  {
    id: 24,
    q: "What is Akash's favorite YouTube channel?",
    answer: "MrBeast",
    options: ["Marques Brownlee", "MrBeast", "PewDiePie", "Zach King"],
    reaction: "Yes! MrBeast's crazy videos and positive vibes! 🎬💥"
  },
  {
    id: 25,
    q: "What is Akash's biggest fear?",
    answer: "Failing to get you",
    options: ["Extreme Heights", "Spiders & Insects", "Failing to get you", "Being in the Dark"],
    reaction: "You know my heart completely. My only real fear in this life was losing my chance with you. 💖"
  },
  {
    id: 26,
    q: "What is Akash's best childhood memory?",
    answer: "Playing with friends",
    options: ["Going to a waterpark", "Family picnics", "Playing with friends", "Getting my first bicycle"],
    reaction: "Yes! Just running around under the afternoon sun, playing carefree with friends. 🏃‍♂️✨"
  },
  {
    id: 27,
    q: "What makes Akash angry quickly?",
    answer: "If things don't go as planned",
    options: ["Wasting precious time", "Unclean spaces", "If things don't go as planned", "Loud environments"],
    reaction: "Haha, yes. I like precision, so when my plans get interrupted, I get a bit restless. 📈⚡"
  },
  {
    id: 28,
    q: "What type of people does Akash like most?",
    answer: "Kind & encouraging",
    options: ["Kind & encouraging", "Super high achievers", "Quiet and reserved thinkers", "Loud and expressive extroverts"],
    reaction: "Exactly! Kindness and encouragement are the most beautiful traits a person can have—and you have them both. 🌸❤️"
  }
];

interface MemoryItem {
  q: string;
  a: string;
}

interface MemoryCategory {
  title: string;
  icon: string;
  items: MemoryItem[];
}

const MEMORY_CATEGORIES: MemoryCategory[] = [
  {
    title: "🌱 First Impressions & Fun",
    icon: "😊",
    items: [
      {
        q: "What was your first impression of me?",
        a: "Cute and spoke nicely. There was this instant warmth and grace about you that made me feel so comfortable right away."
      },
      {
        q: "What is your favorite memory with me?",
        a: "Spending time on your birthday. Being there to celebrate you, seeing you smile, and knowing we were building our own little world."
      },
      {
        q: "What is our funniest moment together?",
        a: "The time we spent in the library. Trying to be completely quiet but holding back our giggles, sharing notes, and stealing glances under the strict gaze of the librarian!"
      }
    ]
  },
  {
    title: "💖 Love & Devotion",
    icon: "🔥",
    items: [
      {
        q: "What always makes you smile about me?",
        a: "Your care for me. The way you check in, the thoughtfulness behind your actions, and how you protect my peace."
      },
      {
        q: "When did you realize you loved me?",
        a: "When I kindly asked to help you. It wasn't a grand gesture, just a quiet moment where your kindness shined so brightly that my heart simply knew you were the one."
      },
      {
        q: "What makes you feel most loved?",
        a: "Your attention. When you look at me, listen to me, and make me feel like the only person in the room."
      },
      {
        q: "What is one thing I do that comforts you?",
        a: "Holding my hand and comforting me. The moment our hands lace, all the noise in the universe quietens down."
      },
      {
        q: "What do you admire most about me?",
        a: "Listening to me. You don't just hear my words; you understand my thoughts and hold space for my feelings."
      }
    ]
  },
  {
    title: "🔮 Our Shared Horizons",
    icon: "🌌",
    items: [
      {
        q: "Which place should we visit together?",
        a: "Japan! Exploring the neon streets of Tokyo, the historic temples of Kyoto, and chasing the cherry blossoms together."
      },
      {
        q: "How do you describe our relationship?",
        a: "Understanding and keeping each other motivated. We are partners, teammates, and each other's biggest cheerleaders."
      },
      {
        q: "What is your dream life with me?",
        a: "Living together in a big house, caring for each other without worries, and doing whatever we want in our own sanctuary of peace."
      },
      {
        q: "Where do you see us in 5 years?",
        a: "Probably building something together that impacts billions of people. Combining our talents and dreams to leave a legacy."
      },
      {
        q: "What kind of home do you want together?",
        a: "A home that satisfies our needs and reminds us of our mission—a space full of warmth, books, code, and love."
      },
      {
        q: "What goals should we achieve together?",
        a: "Build a company that impacts billions of people, explore the world together, and create a lifetime of absolute happiness."
      },
      {
        q: "What adventure should we try one day?",
        a: "Trek to Everest Base Camp! Standing in front of the world's tallest peak, hand-in-hand, realizing we can conquer anything."
      }
    ]
  }
];

interface DeepQuestion {
  q: string;
  a: string;
  icon: string;
}

const DEEP_QUESTIONS: DeepQuestion[] = [
  {
    q: "What is your biggest fear in relationships?",
    a: "Losing you. You have become my peace and my guiding light, and the thought of a life without your presence is my only true vulnerability.",
    icon: "🖤"
  },
  {
    q: "What lesson has love taught you?",
    a: "Staying calm and patient. Real love isn't rushed; it's a gentle, steady fire that teaches us to breathe through the storms and grow stronger together.",
    icon: "⏳"
  },
  {
    q: "What helps you trust someone deeply?",
    a: "Their openness with me. When there are no walls, no secrets, just raw, honest truths shared in a safe space.",
    icon: "🤝"
  },
  {
    q: "What does a healthy relationship mean to you?",
    a: "Pushing each other to achieve our goals. Being a haven of comfort, but also a launching pad for each other's wildest dreams.",
    icon: "🌱"
  },
  {
    q: "Which song reminds you of me?",
    a: "'Alone' by Alan Walker. Because since I found you, I know that neither of us will ever have to walk this massive universe alone again.",
    icon: "🎧"
  },
  {
    q: "What nickname do you secretly like?",
    a: "Moonlight. Because in my darkest nights, you are the soft, beautiful glow that shows me the path forward.",
    icon: "🌙"
  },
  {
    q: "What small thing about me do you love?",
    a: "Understanding me. Even when I don't express myself fully, you have this beautiful way of reading my mind and soothing my soul.",
    icon: "🌸"
  },
  {
    q: "If we had a movie, what would its title be?",
    a: "The One I Didn't See Coming. A beautiful love story that arrived like a sudden, magical whisper and changed everything forever.",
    icon: "🎬"
  },
  {
    q: "Which moment with me would you relive forever?",
    a: "Watching our empire rise—because I got to build it with you. Hand in hand, turning dreams into code, and code into reality. ❤️",
    icon: "🏰"
  }
];

export default function UsContent() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [expandedTimelineNode, setExpandedTimelineNode] = useState<number | null>(null);
  
  // Constellation Game State
  const [connectedStars, setConnectedStars] = useState<number[]>([]);
  const [constellationUnlocked, setConstellationUnlocked] = useState(false);
  
  // Love Dashboard Counter State
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0
  });

  // Promises State
  const [checkedPromises, setCheckedPromises] = useState<number[]>([]);

  // Compliment Jar State
  const [currentCompliment, setCurrentCompliment] = useState<string | null>(null);
  const [isJarAnimating, setIsJarAnimating] = useState(false);

  // --- NEW SECTIONS STATES & HANDLERS ---
  const [capsuleUnlocked, setCapsuleUnlocked] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [oracleSpinning, setOracleSpinning] = useState(false);
  const [oracleResult, setOracleResult] = useState<string | null>(null);

  // --- AKASH & REKHA UNIVERSE STATES ---
  const [activeUniverseTab, setActiveUniverseTab] = useState<"trivia" | "memories" | "deep">("trivia");
  
  // Trivia States
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);
  const [selectedTriviaOpt, setSelectedTriviaOpt] = useState<string | null>(null);
  const [isTriviaChecked, setIsTriviaChecked] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaEnded, setTriviaEnded] = useState(false);

  // Memories States
  const [activeMemoryCat, setActiveMemoryCat] = useState<number>(0);
  const [expandedMemoryIdx, setExpandedMemoryIdx] = useState<number | null>(null);

  // Deep questions States
  const [activeDeepIdx, setActiveDeepIdx] = useState<number | null>(null);

  const handleSelectTriviaOption = (option: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTriviaChecked) return;
    setSelectedTriviaOpt(option);
    setIsTriviaChecked(true);

    const currentQ = TRIVIA_QUESTIONS[currentTriviaIdx];
    const isCorrect = option === currentQ.answer;

    if (isCorrect) {
      setTriviaScore(prev => prev + 1);

      // Spawn heart particles
      const heartCount = 8;
      for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.className = "us-heart-particle";
        heart.style.left = `${e.clientX + (Math.random() - 0.5) * 60}px`;
        heart.style.top = `${e.clientY + (Math.random() - 0.5) * 60}px`;
        const rot = (Math.random() - 0.5) * 120;
        heart.style.setProperty("--rot", `${rot}deg`);
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
      }
    } else {
      // Spawn sad face particles
      const heartCount = 5;
      for (let i = 0; i < heartCount; i++) {
        const particle = document.createElement("div");
        particle.innerHTML = "😢";
        particle.className = "us-heart-particle";
        particle.style.left = `${e.clientX + (Math.random() - 0.5) * 40}px`;
        particle.style.top = `${e.clientY + (Math.random() - 0.5) * 40}px`;
        const rot = (Math.random() - 0.5) * 80;
        particle.style.setProperty("--rot", `${rot}deg`);
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
      }
    }
  };

  const handleNextTrivia = () => {
    if (currentTriviaIdx < TRIVIA_QUESTIONS.length - 1) {
      setCurrentTriviaIdx(prev => prev + 1);
      setSelectedTriviaOpt(null);
      setIsTriviaChecked(false);
    } else {
      setTriviaEnded(true);
    }
  };

  const handleResetTrivia = () => {
    setCurrentTriviaIdx(0);
    setSelectedTriviaOpt(null);
    setIsTriviaChecked(false);
    setTriviaScore(0);
    setTriviaEnded(false);
  };

  const spinCompass = () => {
    if (oracleSpinning) return;
    setOracleSpinning(true);
    setOracleResult(null);

    setTimeout(() => {
      setOracleSpinning(false);
      const randomIndex = Math.floor(Math.random() * ORACLE_PREDICTIONS.length);
      setOracleResult(ORACLE_PREDICTIONS[randomIndex]);
    }, 1800);
  };

  // Intersection Observer for scroll reveals — uses .us-page as root since it's the scroll container
  useEffect(() => {
    const pageEl = pageRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        root: pageEl,
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    const elements = document.querySelectorAll(".us-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Anniversary date setup (June 15, 2024 00:00:00)
  useEffect(() => {
    const startDate = new Date("2026-04-09T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - startDate;

      if (diff > 0) {
        const ms = diff % 1000;
        const secondsTotal = Math.floor(diff / 1000);
        const minutesTotal = Math.floor(secondsTotal / 60);
        const hoursTotal = Math.floor(minutesTotal / 60);
        const daysTotal = Math.floor(hoursTotal / 24);

        const years = Math.floor(daysTotal / 365);
        const days = daysTotal % 365;
        const hours = hoursTotal % 24;
        const minutes = minutesTotal % 60;
        const seconds = secondsTotal % 60;

        setTimeElapsed({ years, days, hours, minutes, seconds, ms });
      }
    }, 45); // high precision tick

    return () => clearInterval(interval);
  }, []);

  // Sparkle / Heart click burst
  const handlePromiseClick = (index: number, e: React.MouseEvent) => {
    const isChecked = checkedPromises.includes(index);
    if (!isChecked) {
      setCheckedPromises([...checkedPromises, index]);
      
      // Spawn floating hearts
      const heartCount = 6;
      for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.className = "us-heart-particle";
        heart.style.left = `${e.clientX + (Math.random() - 0.5) * 40}px`;
        heart.style.top = `${e.clientY + (Math.random() - 0.5) * 40}px`;
        
        // Random drift and rotation
        const rot = (Math.random() - 0.5) * 120;
        heart.style.setProperty("--rot", `${rot}deg`);
        
        document.body.appendChild(heart);

        // Cleanup
        setTimeout(() => {
          heart.remove();
        }, 1000);
      }
    } else {
      setCheckedPromises(checkedPromises.filter((item) => item !== index));
    }
  };

  // Star Constellation Game logic
  const handleStarClick = (starId: number) => {
    if (constellationUnlocked) return;

    setConnectedStars((prev) => {
      // If already connected, do nothing
      if (prev.includes(starId)) return prev;

      const next = [...prev, starId];
      // Check if all connected
      if (next.length === CONSTELLATION_STARS.length) {
        setConstellationUnlocked(true);
      }
      return next;
    });
  };

  const resetConstellation = () => {
    setConnectedStars([]);
    setConstellationUnlocked(false);
  };

  // Compliment Jar click
  const handleJarClick = (e: React.MouseEvent) => {
    setIsJarAnimating(true);
    
    // Choose random compliment
    const randomIndex = Math.floor(Math.random() * COMPLIMENTS.length);
    setCurrentCompliment(COMPLIMENTS[randomIndex]);

    // Spawn heart particles
    const heartCount = 10;
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = Math.random() > 0.5 ? "💖" : "✨";
      heart.className = "us-heart-particle";
      heart.style.left = `${e.clientX + (Math.random() - 0.5) * 60}px`;
      heart.style.top = `${e.clientY + (Math.random() - 0.5) * 60}px`;
      
      const rot = (Math.random() - 0.5) * 180;
      heart.style.setProperty("--rot", `${rot}deg`);
      
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }

    setTimeout(() => {
      setIsJarAnimating(false);
    }, 600);
  };

  // Render SVG connection lines for active stars based on adjacency in the heart shape
  const renderConstellationLines = () => {
    const lines: React.ReactNode[] = [];
    
    // Natural pairs forming the heart shape
    const heartPairs = [
      [1, 2], [2, 3], [3, 4], [4, 5],
      [5, 6], [6, 7], [7, 8]
    ];

    heartPairs.forEach(([id1, id2], i) => {
      if (connectedStars.includes(id1) && connectedStars.includes(id2)) {
        const fromStar = CONSTELLATION_STARS.find((s) => s.id === id1);
        const toStar = CONSTELLATION_STARS.find((s) => s.id === id2);
        if (fromStar && toStar) {
          lines.push(
            <line
              key={`line-${i}`}
              x1={`${fromStar.x}%`}
              y1={`${fromStar.y}%`}
              x2={`${toStar.x}%`}
              y2={`${toStar.y}%`}
              stroke="url(#gold-rose-grad)"
              strokeWidth="2.5"
              strokeDasharray="4"
              className="animate-pulse"
            />
          );
        }
      }
    });

    // Connect last star to first if fully connected to complete the shape
    if (constellationUnlocked) {
      const firstStar = CONSTELLATION_STARS.find((s) => s.id === 1);
      const lastStar = CONSTELLATION_STARS.find((s) => s.id === 8);
      if (firstStar && lastStar) {
        lines.push(
          <line
            key="line-closing"
            x1={`${lastStar.x}%`}
            y1={`${lastStar.y}%`}
            x2={`${firstStar.x}%`}
            y2={`${firstStar.y}%`}
            stroke="url(#gold-rose-grad)"
            strokeWidth="3.5"
            className="animate-pulse"
          />
        );
      }
    }

    return lines;
  };

  return (
    <div className="us-page" ref={pageRef}>
      <StarfieldCanvas />

      {/* Cinematic Hero */}
      <section className="us-hero">
        <div className="text-center max-w-3xl px-4 mb-16">
          <p className="text-[#d4a853] tracking-[0.25em] text-xs font-bold uppercase mb-4 animate-fade-in">
            A Dedication to My Favorite Person
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="us-shimmer-effect">To the One Who Stole My Heart</span>
          </h1>
          <p className="text-lg text-[rgba(253,246,227,0.7)] leading-relaxed max-w-xl mx-auto">
            A small corner of the universe designed just for you, Rekha. A celebration of us.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[rgba(253,246,227,0.4)]">
          <span className="text-xs uppercase tracking-widest font-bold">Scroll Down</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Section 2 — Wax-Sealed Love Letter Envelope */}
      <section className="us-letter-section">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            A Heartfelt Message
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            For Your Eyes Only
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click the golden wax seal to open the envelope and reveal the letter inside.
          </p>
        </div>

        <div className="us-envelope-wrapper us-reveal">
          <div 
            className={`us-envelope ${isLetterOpen ? "open" : ""}`}
            onClick={() => setIsLetterOpen(!isLetterOpen)}
          >
            <div className="us-envelope-flap"></div>
            <div className="us-wax-seal">
              <span>❤️</span>
            </div>
            
            <div className="us-envelope-paper flex flex-col justify-between">
              <div className="overflow-y-auto max-h-full pr-1 text-left">
                <span className="font-display font-bold text-[#d4a853] tracking-widest text-[10px] uppercase block mb-3">
                  With All My Love
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-[rgba(253,246,227,0.85)] mb-3">
                  Rekha, from the moment our paths crossed, the world seemed to shift into a warmer, more vibrant focus. You brought a quiet grace and an undeniable magic into my life that I didn&apos;t know I was searching for, but now cannot imagine living without.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-[rgba(253,246,227,0.85)] mb-3">
                  In the noise of the everyday, you are my sanctuary. The ease with which we share both laughter and comfortable silence is a rare gift that I cherish more with each passing day. You have this beautiful way of turning ordinary moments into extraordinary memories.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-[rgba(253,246,227,0.85)]">
                  Thank you for being my constant anchor, my source of inspiration, and the keeper of my heart. I promise to stand by you through every season, celebrating your triumphs, supporting your dreams, and loving you more fiercely with every beat of my heart.
                </p>
              </div>

              <div className="text-right font-display italic text-[#d4a853] text-sm mt-2 border-t border-[rgba(212,168,83,0.1)] pt-2">
                Yours forever, <span className="font-bold tracking-wider not-italic">Akash</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Relationship Timeline */}
      <section className="us-timeline-section py-20 bg-[rgba(10,10,12,0.5)]">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Our Chapters
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Our Story So Far
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click on individual milestone cards to unlock deeper memories and reflections.
          </p>
        </div>

        <div className="us-timeline us-reveal">
          {TIMELINE_EVENTS.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isExpanded = expandedTimelineNode === index;
            return (
              <div 
                key={event.date}
                className={`us-timeline-item ${isLeft ? "left" : "right"}`}
              >
                <div 
                  className="us-timeline-node"
                  onClick={() => setExpandedTimelineNode(isExpanded ? null : index)}
                ></div>
                <div 
                  className={`us-timeline-card ${isExpanded ? "expanded" : ""}`}
                  onClick={() => setExpandedTimelineNode(isExpanded ? null : index)}
                >
                  <div className="us-timeline-date">{event.date}</div>
                  <h3 className="us-timeline-title">{event.title}</h3>
                  <p className="us-timeline-desc">{event.desc}</p>
                  
                  <div className="us-memory-details">
                    <p className="italic text-[rgba(253,246,227,0.85)]">
                      &ldquo;{event.memory}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3.5 — The Akash & Rekha Universe (Trivia, Memories & Deep Q&A) */}
      <section className="us-universe-section py-20 bg-[#0d0c11]">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            The Inner Circle
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Akash & Rekha Universe
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Test your knowledge about me, browse our heartfelt answers, and unlock the deepest parts of our bond.
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="us-universe-tabs max-w-md mx-auto px-4 flex justify-between gap-2 border-b border-[rgba(212,168,83,0.15)] pb-1 mb-12">
          <button
            onClick={() => setActiveUniverseTab("trivia")}
            className={`us-universe-tab-btn flex-1 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase text-center transition-all ${
              activeUniverseTab === "trivia"
                ? "text-[#d4a853] border-b-2 border-[#d4a853] scale-105"
                : "text-[rgba(253,246,227,0.4)] hover:text-white"
            }`}
          >
            🎮 Trivia Quiz
          </button>
          <button
            onClick={() => {
              setActiveUniverseTab("memories");
              setExpandedMemoryIdx(null);
            }}
            className={`us-universe-tab-btn flex-1 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase text-center transition-all ${
              activeUniverseTab === "memories"
                ? "text-[#d4a853] border-b-2 border-[#d4a853] scale-105"
                : "text-[rgba(253,246,227,0.4)] hover:text-white"
            }`}
          >
            📖 Memory Book
          </button>
          <button
            onClick={() => {
              setActiveUniverseTab("deep");
              setActiveDeepIdx(null);
            }}
            className={`us-universe-tab-btn flex-1 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase text-center transition-all ${
              activeUniverseTab === "deep"
                ? "text-[#d4a853] border-b-2 border-[#d4a853] scale-105"
                : "text-[rgba(253,246,227,0.4)] hover:text-white"
            }`}
          >
            ✨ Deep Card
          </button>
        </div>

        <div className="us-universe-panel max-w-4xl mx-auto px-4 min-h-[460px] flex items-center justify-center">
          {/* TAB 1: TRIVIA QUIZ */}
          {activeUniverseTab === "trivia" && (
            <div className="w-full us-reveal revealed">
              {triviaEnded ? (
                <div className="us-trivia-result-card text-center p-8 border border-[rgba(212,168,83,0.25)] rounded-3xl bg-[rgba(18,18,22,0.6)] backdrop-blur-md max-w-xl mx-auto">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="font-display font-bold text-2xl text-[#d4a853]">Quiz Completed!</h3>
                  
                  <div className="my-6">
                    <span className="text-[rgba(253,246,227,0.4)] text-xs uppercase tracking-wider block mb-1">
                      Your Score
                    </span>
                    <span className="font-mono text-5xl font-extrabold text-[#e8475f]">
                      {triviaScore} / {TRIVIA_QUESTIONS.length}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-[rgba(253,246,227,0.85)] max-w-md mx-auto mb-8">
                    {triviaScore === TRIVIA_QUESTIONS.length ? (
                      "A perfect 100%! You know me inside out, Rekha! You are officially my ultimate soulmate! 👑❤️"
                    ) : triviaScore >= 20 ? (
                      "An outstanding score! You know so many little details about my preferences. It makes me smile to see how much you pay attention. 🥰"
                    ) : triviaScore >= 10 ? (
                      "A beautiful score! You know a lot about me, and the parts you missed are just excuses for us to chat and share more! 💕"
                    ) : (
                      "A great try! Every question is just a small detail in the massive universe of us. Let's play again and learn more! 🤍"
                    )}
                  </p>

                  {triviaScore === TRIVIA_QUESTIONS.length && (
                    <div className="us-badge-glow border border-[rgba(212,168,83,0.3)] bg-[rgba(212,168,83,0.05)] text-[#f5d799] p-3 rounded-xl inline-block mb-6 animate-pulse text-xs font-bold uppercase tracking-widest">
                      💫 Soulmate Connection Unlocked
                    </div>
                  )}

                  <div>
                    <button
                      onClick={handleResetTrivia}
                      className="px-6 py-2.5 text-xs font-bold border border-[rgba(212,168,83,0.3)] hover:border-[#d4a853] transition-all bg-[rgba(212,168,83,0.05)] text-[#f5d799] rounded-full tracking-widest uppercase"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="us-trivia-game-panel max-w-2xl mx-auto border border-[rgba(255,255,255,0.06)] rounded-3xl bg-[rgba(18,18,22,0.65)] backdrop-blur-md p-6 sm:p-8">
                  {/* Progress Header */}
                  <div className="flex justify-between items-center mb-6 text-xs text-[rgba(253,246,227,0.45)] font-mono">
                    <span>PROGRESS: {currentTriviaIdx + 1} / {TRIVIA_QUESTIONS.length}</span>
                    <span>SCORE: {triviaScore}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden mb-8">
                    <div
                      className="h-full bg-gradient-to-r from-[#e8475f] to-[#d4a853] transition-all duration-300"
                      style={{ width: `${((currentTriviaIdx + 1) / TRIVIA_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Question */}
                  <h3 className="font-display font-bold text-lg sm:text-xl mb-8 text-white text-center leading-relaxed">
                    {TRIVIA_QUESTIONS[currentTriviaIdx].q}
                  </h3>

                  {/* Choices Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TRIVIA_QUESTIONS[currentTriviaIdx].options.map((option) => {
                      const isCorrect = option === TRIVIA_QUESTIONS[currentTriviaIdx].answer;
                      const isSelected = option === selectedTriviaOpt;
                      
                      let btnClass = "us-trivia-opt-btn";
                      if (isTriviaChecked) {
                        if (isCorrect) {
                          btnClass += " correct";
                        } else if (isSelected) {
                          btnClass += " incorrect";
                        } else {
                          btnClass += " disabled";
                        }
                      } else if (isSelected) {
                        btnClass += " selected";
                      }

                      return (
                        <button
                          key={option}
                          disabled={isTriviaChecked}
                          onClick={(e) => handleSelectTriviaOption(option, e)}
                          className={btnClass}
                        >
                          <span className="flex items-center gap-2">
                            {isTriviaChecked && isCorrect && "✨"}
                            {isTriviaChecked && isSelected && !isCorrect && "❌"}
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Drawer */}
                  {isTriviaChecked && (
                    <div className="mt-8 p-4 border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.04)] rounded-2xl animate-fade-in text-center">
                      <span className="text-[10px] text-[#d4a853] uppercase font-bold tracking-widest block mb-1">
                        Akash says:
                      </span>
                      <p className="text-xs sm:text-sm text-[rgba(253,246,227,0.85)] font-medium">
                        {TRIVIA_QUESTIONS[currentTriviaIdx].reaction}
                      </p>
                    </div>
                  )}

                  {/* Next Control */}
                  {isTriviaChecked && (
                    <div className="mt-8 text-right">
                      <button
                        onClick={handleNextTrivia}
                        className="px-6 py-2 text-xs font-bold border border-[#d4a853] hover:bg-[rgba(212,168,83,0.1)] transition-all bg-[rgba(212,168,83,0.02)] text-[#f5d799] rounded-full tracking-widest uppercase"
                      >
                        {currentTriviaIdx < TRIVIA_QUESTIONS.length - 1 ? "Next Question" : "View Results"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEMORY BOOK */}
          {activeUniverseTab === "memories" && (
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 us-reveal revealed">
              {/* Left Side: Category Navigator */}
              <div className="md:col-span-1 flex flex-col gap-3">
                {MEMORY_CATEGORIES.map((cat, idx) => {
                  const isActive = idx === activeMemoryCat;
                  return (
                    <button
                      key={cat.title}
                      onClick={() => {
                        setActiveMemoryCat(idx);
                        setExpandedMemoryIdx(null);
                      }}
                      className={`w-full text-left p-4 border rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? "border-[#d4a853] bg-[rgba(212,168,83,0.08)] text-[#fdf6e3] shadow-lg"
                          : "border-[rgba(255,255,255,0.05)] bg-[rgba(18,18,22,0.4)] text-[rgba(253,246,227,0.5)] hover:text-white"
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs sm:text-sm font-display font-bold tracking-wide">
                        {cat.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Side: List of Q&As */}
              <div className="md:col-span-2 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {MEMORY_CATEGORIES[activeMemoryCat].items.map((item, idx) => {
                  const isExpanded = idx === expandedMemoryIdx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedMemoryIdx(isExpanded ? null : idx)}
                      className={`border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                        isExpanded
                          ? "border-[#e8475f] bg-[rgba(232,71,95,0.03)]"
                          : "border-[rgba(255,255,255,0.06)] bg-[rgba(18,18,22,0.5)] hover:border-[rgba(212,168,83,0.25)]"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-white tracking-wide pr-4">
                          Q: {item.q}
                        </h4>
                        <span className={`text-xs text-[#d4a853] transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </div>
                      
                      <div className={`us-memory-ans-drawer overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-40 mt-4 border-t border-[rgba(255,255,255,0.06)] pt-4" : "max-h-0"}`}>
                        <p className="font-serif italic text-xs sm:text-sm leading-relaxed text-[rgba(253,246,227,0.85)]">
                          &ldquo;{item.a}&rdquo;
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DEEP REFLECTIONS */}
          {activeUniverseTab === "deep" && (
            <div className="w-full us-reveal revealed">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {DEEP_QUESTIONS.map((question, idx) => {
                  const isFlipped = idx === activeDeepIdx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveDeepIdx(isFlipped ? null : idx)}
                      className="us-deep-card-container aspect-[3/4] cursor-pointer"
                    >
                      <div className={`us-deep-card ${isFlipped ? "flipped" : ""}`}>
                        {/* Front Side */}
                        <div className="us-deep-card-front flex flex-col justify-between p-4 border border-[rgba(212,168,83,0.15)] rounded-2xl bg-[#141318]">
                          <div className="text-right text-xs font-mono text-[rgba(253,246,227,0.2)]">
                            {(idx + 1).toString().padStart(2, "0")}
                          </div>
                          <div className="text-center text-3xl my-2">
                            {question.icon}
                          </div>
                          <div className="text-center">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-[#d4a853]">
                              Read Secret
                            </span>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="us-deep-card-back flex flex-col justify-between p-4 border border-[rgba(232,71,95,0.25)] rounded-2xl bg-[#0a0a0c]">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-[#e8475f] border-b border-[rgba(255,255,255,0.05)] pb-1 mb-2">
                            Deep Reflection
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-center gap-2">
                            <h4 className="font-display font-extrabold text-[10px] sm:text-xs text-white leading-snug">
                              {question.q}
                            </h4>
                            <p className="font-serif italic text-[10px] sm:text-[11px] leading-relaxed text-[rgba(253,246,227,0.8)] border-t border-[rgba(255,255,255,0.05)] pt-2 mt-1">
                              {question.a}
                            </p>
                          </div>
                          <div className="text-right text-[8px] uppercase tracking-widest text-[rgba(253,246,227,0.3)] mt-2">
                            Close Card
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 4 — Connect the Stars Constellation Game */}
      <section className="us-constellation-sec">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Interactive Star Sky
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Connect Our Constellation
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click the stars in order to draw the cosmic alignment of our love. Connect all {CONSTELLATION_STARS.length} stars to unlock a hidden constellation.
          </p>
        </div>

        <div className="us-sky-canvas-wrapper us-reveal">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {renderConstellationLines()}
          </svg>

          {/* Render Star Dots */}
          {CONSTELLATION_STARS.map((star) => {
            const isConnected = connectedStars.includes(star.id);
            
            return (
              <div
                key={star.id}
                className={`us-sky-star ${isConnected ? "connected" : ""}`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: `translate(-50%, -50%) ${isConnected ? "scale(1.3)" : "scale(1)"}`,
                }}
                onClick={() => {
                  handleStarClick(star.id);
                }}
              >
                <span className="absolute left-6 -top-2 text-[10px] uppercase font-bold tracking-widest text-[rgba(253,246,227,0.4)] pointer-events-none whitespace-nowrap">
                  {star.label}
                </span>
              </div>
            );
          })}

          {/* Unlocked Message Popup overlay */}
          <div className={`us-constellation-unlocked-card ${constellationUnlocked ? "active" : ""}`}>
            <div className="max-w-md text-center p-6 border border-[rgba(212,168,83,0.3)] rounded-2xl bg-[#14131a] shadow-2xl">
              <span className="text-3xl">🌌</span>
              <h3 className="font-display font-bold text-2xl text-[#d4a853] mt-4">
                Constellation Aligned!
              </h3>
              <p className="text-[rgba(253,246,227,0.5)] text-xs uppercase tracking-widest font-bold mt-2">
                "The Heart of Rekha & Akash"
              </p>
              <p className="text-sm leading-relaxed text-[rgba(253,246,227,0.85)] mt-4">
                Just like these stars, our lives have woven together to form a beautiful design in the vast sky. Written in the universe, bound together forever.
              </p>
              <button 
                onClick={resetConstellation}
                className="mt-6 px-6 py-2 text-xs border border-[rgba(212,168,83,0.3)] rounded-full hover:border-[#d4a853] transition-all bg-[rgba(212,168,83,0.05)] text-[#f5d799]"
              >
                Connect Again
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Love Constellation Alignment Section */}
      <section className="us-constellation-align-section py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Value Constellation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Our Love Constellation
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Select the values that connect our hearts. Toggle different pillars to weave the constellation network.
          </p>
        </div>

        <div className="us-constellation-align-container max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center us-reveal">
          {/* Constellation SVG Interactive Visualizer */}
          <div className="us-align-visualizer relative aspect-square w-full max-w-[360px] mx-auto border border-[rgba(212,168,83,0.15)] rounded-full bg-[rgba(10,10,12,0.4)] overflow-hidden">
            <div className="absolute inset-4 border border-[rgba(212,168,83,0.06)] rounded-full animate-pulse"></div>
            <div className="absolute inset-12 border border-[rgba(212,168,83,0.04)] rounded-full"></div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="rose-gold-glow-values" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8475f" />
                  <stop offset="100%" stopColor="#d4a853" />
                </linearGradient>
              </defs>
              {LOVE_VALUES.map((v1, i) => {
                const s1 = selectedValues.includes(v1.id);
                if (!s1) return null;
                return LOVE_VALUES.slice(i + 1).map((v2) => {
                  const s2 = selectedValues.includes(v2.id);
                  if (!s2) return null;
                  return (
                    <line
                      key={`${v1.id}-${v2.id}`}
                      x1={`${v1.x}%`}
                      y1={`${v1.y}%`}
                      x2={`${v2.x}%`}
                      y2={`${v2.y}%`}
                      stroke="url(#rose-gold-glow-values)"
                      strokeWidth="2"
                      className="animate-pulse"
                      style={{ opacity: 0.6 }}
                    />
                  );
                });
              })}
            </svg>

            {selectedValues.length === LOVE_VALUES.length && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[radial-gradient(circle,rgba(232,71,95,0.4)_0%,transparent_70%)] animate-ping"></div>
            )}

            {LOVE_VALUES.map((val) => {
              const isSelected = selectedValues.includes(val.id);
              return (
                <div
                  key={val.id}
                  className={`us-align-node ${isSelected ? "selected" : ""}`}
                  style={{
                    left: `${val.x}%`,
                    top: `${val.y}%`,
                  }}
                  onClick={() => {
                    setSelectedValues(prev =>
                      prev.includes(val.id) ? prev.filter(id => id !== val.id) : [...prev, val.id]
                    );
                  }}
                >
                  <span className="text-sm">{val.icon}</span>
                  <span className="us-node-label">{val.label}</span>
                </div>
              );
            })}
          </div>

          {/* Interactive controls */}
          <div className="flex flex-col gap-4 text-left">
            <h3 className="font-display font-bold text-xl text-white">Weave our Bond</h3>
            <p className="text-sm text-[rgba(253,246,227,0.7)] leading-relaxed mb-4">
              Our relationship is built on different core pillars. Select the values to see how they connect together. Select all pillars to align our constellation.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {LOVE_VALUES.map((val) => {
                const isSelected = selectedValues.includes(val.id);
                return (
                  <button
                    key={val.id}
                    className={`us-value-btn ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setSelectedValues(prev =>
                        prev.includes(val.id) ? prev.filter(id => id !== val.id) : [...prev, val.id]
                      );
                    }}
                  >
                    <span>{val.icon} {val.label}</span>
                  </button>
                );
              })}
            </div>
            
            {selectedValues.length > 0 && (
              <div className="mt-6 p-4 border border-[rgba(212,168,83,0.15)] bg-[rgba(18,18,22,0.4)] rounded-xl">
                <span className="text-xs text-[#d4a853] uppercase font-bold tracking-widest block mb-1">
                  Pillar Definition
                </span>
                <p className="text-xs text-[rgba(253,246,227,0.85)]">
                  {LOVE_VALUES.find(v => v.id === selectedValues[selectedValues.length - 1])?.description}
                </p>
              </div>
            )}

            {selectedValues.length === LOVE_VALUES.length && (
              <div className="mt-4 text-center p-3 border border-[rgba(232,71,95,0.3)] bg-[rgba(232,71,95,0.05)] rounded-lg text-xs font-bold text-[#e8475f] tracking-wide animate-bounce">
                ❤️ All pillars aligned! Our connection forms a perfect heart constellation.
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Section 6 — Love Dashboard (Live Counter & Promise Checkboxes) */}
      <section className="us-dashboard-section max-w-5xl mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Love Dashboard
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Our Journey In Numbers
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Tracking every single beautiful moment of our connection down to the millisecond.
          </p>
        </div>

        <div className="us-dashboard-grid us-reveal">
          <div className="us-dashboard-counter-card">
            <div className="us-counter-title">Our Time in the Universe</div>
            
            <div className="us-counter-timer">
              <div className="us-counter-unit">
                <div className="us-counter-val">{timeElapsed.years}</div>
                <div className="us-counter-label">Years</div>
              </div>
              <div className="us-counter-unit">
                <div className="us-counter-val">{timeElapsed.days}</div>
                <div className="us-counter-label">Days</div>
              </div>
              <div className="us-counter-unit">
                <div className="us-counter-val">{timeElapsed.hours}</div>
                <div className="us-counter-label">Hours</div>
              </div>
              <div className="us-counter-unit">
                <div className="us-counter-val">{timeElapsed.minutes}</div>
                <div className="us-counter-label">Mins</div>
              </div>
            </div>
            
            <div className="us-counter-val-ms text-center mt-6">
              <span className="text-[rgba(253,246,227,0.4)] text-[10px] uppercase font-bold tracking-wider block mb-1">
                Live Precision Counter
              </span>
              <span className="font-mono text-xl sm:text-2xl text-[#e8475f] font-extrabold">
                {timeElapsed.seconds}.{timeElapsed.ms.toString().padStart(3, "0")}s
              </span>
            </div>
          </div>

          {/* Promises Checklist panel */}
          <div className="us-promises-panel">
            <h3 className="font-display font-extrabold text-lg text-white mb-2 text-left">
              Promises to You
            </h3>
            <p className="text-xs text-[rgba(253,246,227,0.5)] mb-2 text-left">
              Click a promise to seal it with a heart checkbox.
            </p>
            {PROMISES.map((promise, index) => {
              const isChecked = checkedPromises.includes(index);
              return (
                <div 
                  key={index}
                  className={`us-promise-row ${isChecked ? "checked" : ""}`}
                  onClick={(e) => handlePromiseClick(index, e)}
                >
                  <div className="us-promise-check">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="us-promise-text text-left">{promise}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated Love Stats Dashboard */}
        <div className="us-stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 us-reveal">
          {LOVE_STATS.map((stat, i) => (
            <div key={i} className="us-stat-card border border-[rgba(212,168,83,0.12)] bg-[rgba(18,18,22,0.4)] backdrop-blur-md p-5 rounded-2xl flex flex-col items-center text-center">
              <span className="text-2xl mb-2">{stat.icon}</span>
              <span className="text-2xl font-extrabold text-white font-display mb-1">{stat.val}</span>
              <span className="text-xs text-[rgba(253,246,227,0.5)] uppercase tracking-wider">{stat.label}</span>
              
              {/* Circular progress SVG ring */}
              <div className="w-10 h-10 mt-3 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.03)" strokeWidth="3" fill="transparent" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="url(#rose-gold-glow-values)"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={100.53}
                    strokeDashoffset={100.53 - (100.53 * stat.percent) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7 — Compliment Jar */}
      <section className="us-jar-section">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Jar of Compliments
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            A Jar Full of Hearts
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click the glowing glass jar to draw a random message of affection, appreciation, and adoration.
          </p>
        </div>

        <div className={`us-compliment-scroll-wrapper ${currentCompliment ? "active" : ""}`}>
          {currentCompliment && (
            <div className="us-compliment-scroll">
              <span className="text-xs text-[#d4a853] uppercase font-bold tracking-widest block mb-2">
                A Note For Rekha
              </span>
              <p className="us-compliment-text">
                &ldquo;{currentCompliment}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="us-reveal">
          <div 
            className={`us-jar-container ${currentCompliment ? "open" : ""} ${isJarAnimating ? "scale-90" : ""}`}
            onClick={handleJarClick}
          >
            <div className={`us-jar-lid ${currentCompliment ? "open" : ""}`}></div>
            <div className="us-jar-body">
              <div className="us-jar-glow"></div>
              <div className="us-jar-hearts-inside">
                <div className="us-jar-heart-inside">❤️</div>
                <div className="us-jar-heart-inside">💖</div>
                <div className="us-jar-heart-inside">✨</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cosmic Compass Oracle Section */}
      <section className="us-oracle-section py-20 bg-[rgba(10,10,12,0.3)]">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Celestial Oracle
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            The Cosmic Compass
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click the celestial compass to spin the rings of destiny and reveal a prediction of our beautiful future.
          </p>
        </div>

        <div className="max-w-md mx-auto text-center px-4 us-reveal">
          <div className="relative w-48 h-48 mx-auto mb-8 cursor-pointer" onClick={spinCompass}>
            <div className={`us-compass-outer border-2 border-[rgba(212,168,83,0.25)] rounded-full w-full h-full flex items-center justify-center ${oracleSpinning ? "us-spin-fast" : "us-spin-slow"}`}>
              <div className="us-compass-middle border border-dashed border-[rgba(232,71,95,0.3)] rounded-full w-[85%] h-[85%] flex items-center justify-center">
                <div className="us-compass-inner border border-[rgba(212,168,83,0.15)] rounded-full w-[70%] h-[70%] flex items-center justify-center bg-[rgba(10,10,12,0.6)]">
                  <span className="text-3xl animate-pulse">💫</span>
                </div>
              </div>
            </div>
            <div 
              className="absolute top-1/2 left-1/2 w-1.5 h-36 bg-gradient-to-b from-[#e8475f] to-[#d4a853] rounded-full pointer-events-none" 
              style={{ 
                transform: `translate(-50%, -50%) rotate(${oracleSpinning ? 1080 : 45}deg)`, 
                transition: oracleSpinning ? "transform 1.8s cubic-bezier(0.1, 0.8, 0.1, 1)" : "transform 0.5s ease" 
              }}
            ></div>
          </div>

          <button
            onClick={spinCompass}
            disabled={oracleSpinning}
            className="px-6 py-2.5 text-xs font-bold border border-[rgba(212,168,83,0.3)] hover:border-[#d4a853] transition-all bg-[rgba(212,168,83,0.05)] text-[#f5d799] rounded-full tracking-widest uppercase mb-6"
          >
            {oracleSpinning ? "Consulting Stars..." : "Spin the Compass"}
          </button>

          <div className={`us-oracle-box ${oracleResult ? "active" : ""}`}>
            {oracleResult && (
              <div className="p-5 border border-[rgba(212,168,83,0.15)] bg-[rgba(18,18,22,0.6)] backdrop-blur-md rounded-2xl animate-fade-in">
                <span className="text-xs text-[#d4a853] uppercase font-bold tracking-widest block mb-2">
                  Destiny Proclaimed
                </span>
                <p className="text-sm leading-relaxed text-[rgba(253,246,227,0.9)]">
                  {oracleResult}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Message in a Bottle / Future Capsule Section */}
      <section className="us-capsule-section py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Time Capsule
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Message in a Bottle
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click the glowing glass bottle to unlock a letter written for our future self.
          </p>
        </div>

        <div className="max-w-xl mx-auto px-4 text-center us-reveal">
          <div 
            className={`us-capsule-container ${capsuleUnlocked ? "unlocked" : ""}`}
            onClick={() => setCapsuleUnlocked(!capsuleUnlocked)}
          >
            <div className="us-capsule-bottle relative w-24 h-44 mx-auto mb-6 flex items-center justify-center cursor-pointer transition-all duration-500">
              <div className="us-bottle-cork"></div>
              <div className="us-bottle-body">
                <div className="us-bottle-glow"></div>
                <div className="us-bottle-scroll-inside"></div>
              </div>
            </div>
          </div>

          <div className={`us-parchment-scroll-wrapper ${capsuleUnlocked ? "active" : ""}`}>
            {capsuleUnlocked && (
              <div className="us-parchment-scroll p-6 sm:p-10 border border-[rgba(212,168,83,0.2)] bg-[#ebd2ad] text-[#362719] rounded-xl shadow-2xl relative text-left">
                <div className="absolute top-4 right-4 text-lg cursor-pointer hover:scale-110 transition-transform" onClick={(e) => { e.stopPropagation(); setCapsuleUnlocked(false); }}>❌</div>
                <span className="font-display font-bold text-[#7d5f30] tracking-widest text-[10px] uppercase block mb-4 border-b border-[rgba(125,95,48,0.15)] pb-2">
                  A Promise for the Future
                </span>
                <p className="font-serif italic text-sm leading-relaxed mb-4 whitespace-pre-line text-[#4e3b27]">
                  {FUTURE_LETTER_CONTENT}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 8 — Reasons I Love You Cards */}
      <section className="us-reasons-section">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Poetic Reflections
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Reasons I Love You
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Just a few of the countless ways you fill my life with light, beauty, and joy.
          </p>
        </div>

        <div className="us-reasons-grid">
          {REASONS.map((reason, index) => (
            <div
              key={reason.num}
              className="us-reason-card us-reveal transition-all duration-1000"
              style={{ transitionDelay: `${index * 80}ms` } as any}
            >
              <div className="us-reason-num">{reason.num}</div>
              <h3 className="us-reason-title">{reason.title}</h3>
              <p className="us-reason-desc">{reason.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9 — Closing Section */}
      <section className="us-closing-section">
        <div className="us-reveal transition-all duration-1000 flex flex-col items-center">
          <div className="us-infinity-container">
            <svg className="us-infinity-svg" viewBox="0 0 120 60">
              <path
                className="us-infinity-path"
                d="M 60,30 C 45,15 15,15 15,30 C 15,45 45,45 60,30 C 75,15 105,15 105,30 C 105,45 75,45 60,30 Z"
              />
            </svg>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-4 text-[#d4a853] tracking-wide">
            Yours Forever
          </h2>
          <p className="text-[rgba(253,246,227,0.7)] text-lg italic max-w-md mx-auto mb-10">
            &ldquo;Two hearts, one infinity.&rdquo;
          </p>
        </div>

        {/* Collage Layout */}
        <div className="us-collage us-reveal transition-all duration-1000 delay-200">
          <div className="us-collage-item us-photo-frame w-[180px] sm:w-[220px]">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/images/me.jpg"
                alt="Akash"
                fill
                sizes="(max-width: 768px) 180px, 220px"
                className="rounded-xl object-cover"
                priority
              />
            </div>
          </div>
          <div className="us-collage-item us-photo-frame glow-pulse w-[180px] sm:w-[220px]">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/images/her.jpg"
                alt="Rekha"
                fill
                sizes="(max-width: 768px) 180px, 220px"
                className="rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="us-reveal transition-all duration-1000 delay-300">
          <Link href="/" className="btn-secondary text-sm border-[rgba(212,168,83,0.3)] hover:border-[#d4a853] px-8 py-3 bg-[rgba(10,10,12,0.4)]">
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
