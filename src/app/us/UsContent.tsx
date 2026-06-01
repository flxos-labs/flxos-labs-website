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

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
  emoji: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What is my absolute favorite watch brand?",
    correctAnswer: "Rolex",
    options: ["Casio (Retro Gold)", "Rolex", "Apple Watch (Boring!)", "Sundial (Ancient Style)"],
    emoji: "⌚"
  },
  {
    question: "If I could eat only one gourmet breakfast forever, what is it?",
    correctAnswer: "Scrambled Eggs with Smoked Trout and Crème Fraîche",
    options: ["Plain Instant Maggi", "Over-salted Rolled Oats", "Scrambled Eggs with Smoked Trout and Crème Fraîche", "Burnt Toast & black coffee"],
    emoji: "🍳"
  },
  {
    question: "What is my absolute favorite color?",
    correctAnswer: "White",
    options: ["Glitter Gold", "White", "Hot Pink", "RGB Rainbow Glow"],
    emoji: "🎨"
  },
  {
    question: "Which movie is my absolute favorite cosmic adventure?",
    correctAnswer: "Interstellar",
    options: ["The Emoji Movie", "Interstellar", "Twilight Saga: New Moon", "Barbie (2023)"],
    emoji: "🚀"
  },
  {
    question: "What song is my favorite classic track?",
    correctAnswer: "Faded",
    options: ["Baby Shark", "Rick Astley - Never Gonna Give You Up", "Faded", "Crazy Frog Theme"],
    emoji: "🎵"
  },
  {
    question: "Which mobile brand do I use and love?",
    correctAnswer: "Xiaomi",
    options: ["Nokia 3310 (Unbreakable)", "Xiaomi", "Banana Phone", "Tin Can & String"],
    emoji: "📱"
  },
  {
    question: "Where is my dream destination to visit?",
    correctAnswer: "Japan",
    options: ["Bermuda Triangle", "Japan", "The Exam Hall (Never!)", "Crowded Subway Station"],
    emoji: "🌸"
  },
  {
    question: "Which fruit reigns supreme in my heart?",
    correctAnswer: "Mango",
    options: ["Mango", "Durian (Smelly King)", "Sour Lemon", "Plastic Decorative Grape"],
    emoji: "🥭"
  },
  {
    question: "What is my favorite brand of chocolate?",
    correctAnswer: "Feastables",
    options: ["Feastables", "Dark Cocoa 99% (Tears)", "Sugar-Free Raisin Bar", "Cardboard Surprise"],
    emoji: "🍫"
  },
  {
    question: "Which virtual universe do I enjoy exploring in games?",
    correctAnswer: "Genshin Impact",
    options: ["Minesweeper Classic", "Genshin Impact", "Flappy Bird", "Tic Tac Toe (Hard Mode)"],
    emoji: "🎮"
  },
  {
    question: "What is my favorite subject of all time?",
    correctAnswer: "Computer Science Engineering",
    options: ["Computer Science Engineering", "Advanced Calculus of Pain", "Syllabus Analysis 101", "History of Sand"],
    emoji: "💻"
  },
  {
    question: "Which actor's charismatic performance is my favorite?",
    correctAnswer: "Robert Downey Jr.",
    options: ["Peppa Pig", "Robert Downey Jr.", "Shrek", "Minion Bob"],
    emoji: "🕶️"
  },
  {
    question: "Which hypercar brand makes my heart race?",
    correctAnswer: "Koenigsegg",
    options: ["Koenigsegg", "Rusty Tricycle", "Wooden Bull Cart", "Broken Skateboards"],
    emoji: "🏎️"
  },
  {
    question: "What is my absolute favorite application?",
    correctAnswer: "Claude",
    options: ["Claude", "Flappy Bird Clones", "System Settings UI", "Battery Saver App"],
    emoji: "🧠"
  },
  {
    question: "What is my absolute biggest fear in life?",
    correctAnswer: "Failing to get you",
    options: ["Failing to get you", "Spiders in the closet", "Eating bitter gourd", "Losing my gaming saves"],
    emoji: "🥺"
  }
];

interface FlipCardData {
  category: "First Impressions" | "Deep Realizations" | "Future Dreams";
  question: string;
  answer: string;
  icon: string;
}

const FLIP_CARDS: FlipCardData[] = [
  {
    category: "First Impressions",
    question: "What was my absolute first impression of you?",
    answer: "You were so incredibly cute and spoke so nicely that I was instantly charmed! 🥰",
    icon: "🌸"
  },
  {
    category: "First Impressions",
    question: "What is my most favorite memory with you?",
    answer: "Spending beautiful, uninterrupted time together on your birthday. 🎂✨",
    icon: "💖"
  },
  {
    category: "First Impressions",
    question: "What is it about you that always makes me smile?",
    answer: "The genuine, unconditional care and warmth you show me every day. 💕",
    icon: "😊"
  },
  {
    category: "First Impressions",
    question: "What is our absolute funniest moment together?",
    answer: "The fun, quiet, and playful times we shared in the library! 📚🤫",
    icon: "🤭"
  },
  {
    category: "First Impressions",
    question: "Which country's beauty must we explore together?",
    answer: "Japan! Walking hand-in-hand under the cherry blossoms. 🌸🇯🇵",
    icon: "🗼"
  },
  {
    category: "Deep Realizations",
    question: "When did I realize that my heart truly loved you?",
    answer: "The exact moment when I kindly asked to help you, and our souls just aligned. ✨",
    icon: "🌟"
  },
  {
    category: "Deep Realizations",
    question: "What is the one thing you do that makes me feel most loved?",
    answer: "Your undivided attention. It makes the rest of the universe fade away. 💫",
    icon: "🎯"
  },
  {
    category: "Deep Realizations",
    question: "What small thing do I do that comforts you the most?",
    answer: "Holding my hand gently and comforting me in quiet, soft moments. 🤝❤️",
    icon: "☕"
  },
  {
    category: "Deep Realizations",
    question: "How do I describe our beautiful relationship?",
    answer: "A profound understanding and a constant fire keeping each other motivated! 🔥",
    icon: "🚀"
  },
  {
    category: "Deep Realizations",
    question: "What do I admire most about you?",
    answer: "How beautifully and deeply you listen to me when I share my mind. 👂💖",
    icon: "🏆"
  },
  {
    category: "Future Dreams",
    question: "What is my ultimate dream life with you?",
    answer: "Living together in a big, warm house, caring for each other without a single worry. 🏡💫",
    icon: "🏰"
  },
  {
    category: "Future Dreams",
    question: "Where do I see us 5 years from now?",
    answer: "Building a massive empire and products together that positively impact billions of lives! 🌍💼",
    icon: "📈"
  },
  {
    category: "Future Dreams",
    question: "What kind of home do I want us to build together?",
    answer: "A beautiful home that satisfies all our needs and constantly reminds us of our mission. 🗝️🌱",
    icon: "🛋️"
  },
  {
    category: "Future Dreams",
    question: "What major goals should we achieve together?",
    answer: "Build a revolutionary company, explore every beautiful corner of the world, and grow old together. 🗺️🤝",
    icon: "🎯"
  },
  {
    category: "Future Dreams",
    question: "What crazy adventure must we try one day?",
    answer: "Trekking all the way to the majestic Everest Base Camp! 🏔️🥾",
    icon: "🦅"
  }
];

interface DeepQuestionData {
  question: string;
  answer: string;
  icon: string;
}

const DEEP_QUESTIONS: DeepQuestionData[] = [
  {
    question: "What is my biggest fear when it comes to relationships?",
    answer: "My ultimate biggest fear is losing you. You are my absolute anchor in this life.",
    icon: "⚓"
  },
  {
    question: "What is the greatest lesson that love has taught me?",
    answer: "Staying calm, grounded, and immensely patient through all seasons of life.",
    icon: "⏳"
  },
  {
    question: "What is the single thing that helps me trust someone deeply?",
    answer: "Their absolute openness and direct transparency with me.",
    icon: "🔓"
  },
  {
    question: "What does a truly healthy relationship mean to me?",
    answer: "Constantly pushing and supporting each other to achieve our highest goals.",
    icon: "📈"
  },
  {
    question: "Which beautiful song always reminds me of you?",
    answer: "Alone by Alan Walker. It captures my thoughts so perfectly.",
    icon: "🎵"
  },
  {
    question: "What is a sweet nickname that I secretly adore?",
    answer: "Moonlight. It describes your soft, bright guide in my dark nights.",
    icon: "🌙"
  },
  {
    question: "What is one small, subtle thing about me that you love?",
    answer: "How deeply and effortlessly you understand my mind.",
    icon: "🧩"
  }
];

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let isCancelled = false;

    const tick = () => {
      if (isCancelled) return;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
        setTimeout(tick, 20);
      }
    };

    // Defer the initial tick to avoid synchronous setState inside effect body
    const timeoutId = setTimeout(tick, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [text]);

  return <span>{displayedText}</span>;
};

const OdometerDigit = ({ digit }: { digit: number }) => {
  return (
    <span className="inline-block overflow-hidden h-[1.1em] relative leading-none">
      <span 
        className="flex flex-col transition-transform duration-600 ease-in-out"
        style={{ transform: `translateY(-${digit * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1.1em] flex items-center justify-center">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
};

const Odometer = ({ value }: { value: number }) => {
  const digits = Math.max(0, value).toString().split("").map(Number);
  return (
    <span className="inline-flex leading-none">
      {digits.map((d, i) => (
        <OdometerDigit key={i} digit={d} />
      ))}
    </span>
  );
};


// Stable static random configuration for the 35 cinematic dust particles (avoids render-time impurity)
const DUST_PARTICLES_CONFIG = Array.from({ length: 35 }).map(() => {
  const size = Math.random() * 5 + 3; // 3px to 8px
  const x = Math.random() * 100; // 0% to 100%
  const y = Math.random() * 100; // 0% to 100%
  const driftX = (Math.random() - 0.5) * 80; // -40px to 40px
  const driftY = Math.random() * 60 + 40; // 40px to 100px
  const duration = Math.random() * 8 + 6; // 6s to 14s
  const delay = Math.random() * -10; // negative delay to start immediately
  const opacity = Math.random() * 0.4 + 0.3; // 0.3 to 0.7
  return {
    size: `${size}px`,
    x: `${x}%`,
    y: `${y}%`,
    driftX: `${driftX}px`,
    driftY: `${driftY}px`,
    duration: `${duration}s`,
    delay: `${delay}s`,
    opacity,
  };
});

// Pure helper function for DOM particle spawns (extracted to module scope)
function spawnQuizHearts(clientX: number, clientY: number) {
  const heartCount = 8;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = Math.random() > 0.5 ? "💖" : "✨";
    heart.className = "us-heart-particle";
    heart.style.left = `${clientX + (Math.random() - 0.5) * 40}px`;
    heart.style.top = `${clientY + (Math.random() - 0.5) * 40}px`;
    const rot = (Math.random() - 0.5) * 120;
    heart.style.setProperty("--rot", `${rot}deg`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

function spawnPromiseHearts(clientX: number, clientY: number) {
  const heartCount = 6;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.className = "us-heart-particle";
    heart.style.left = `${clientX + (Math.random() - 0.5) * 40}px`;
    heart.style.top = `${clientY + (Math.random() - 0.5) * 40}px`;
    const rot = (Math.random() - 0.5) * 120;
    heart.style.setProperty("--rot", `${rot}deg`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

function spawnJarHearts(clientX: number, clientY: number) {
  const heartCount = 10;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = Math.random() > 0.5 ? "💖" : "✨";
    heart.className = "us-heart-particle";
    heart.style.left = `${clientX + (Math.random() - 0.5) * 60}px`;
    heart.style.top = `${clientY + (Math.random() - 0.5) * 60}px`;
    const rot = (Math.random() - 0.5) * 180;
    heart.style.setProperty("--rot", `${rot}deg`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

// Random choice helpers (no Math.random in component scope)
function selectRandomOracleIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function selectRandomComplimentIndex(length: number) {
  return Math.floor(Math.random() * length);
}

export default function UsContent() {

  const pageRef = useRef<HTMLDivElement>(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [expandedTimelineNode, setExpandedTimelineNode] = useState<number | null>(null);

  const getDaysAgo = (dateStr: string) => {
    if (dateStr.includes("Sem") || dateStr.includes("Today")) {
      if (dateStr.includes("Today")) return "Our ongoing story";
      return "The prologue of us";
    }
    try {
      const past = new Date(dateStr).getTime();
      const now = new Date().getTime();
      const diff = now - past;
      if (diff < 0) return "Just around the corner";
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return `${days} days ago`;
    } catch (e) {
      return "";
    }
  };

  const scrollToTop = () => {
    if (pageRef.current) {
      pageRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  // Phased intro state machine (0 to 7. 0 = initial, 7 = completed)
  const [introPhase, setIntroPhase] = useState(0);
  const introTimersRef = useRef<NodeJS.Timeout[]>([]);
  
  // Ambient Music player states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.5);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const TRACKS = [
    { title: "Our Love Theme (Ambient)", url: "/audio/soundtrack.mp3", duration: "3:45" },
    { title: "Starry Night (Soft Piano)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "6:12" },
    { title: "Alone (Alan Walker Cover)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "7:05" },
    { title: "Cosmic Resonance (Ambient)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "5:44" }
  ];

  const LYRICS: Record<number, string[]> = {
    0: [
      "In the quiet of the night...",
      "Underneath the stellar light...",
      "Two souls, one orbit, synchronized in flight.",
      "No matter where the cosmic dust may blow...",
      "You are my harbor, the only truth I know. ❤️"
    ],
    1: [
      "Softly, the keys begin to play...",
      "Washing all the clouds away...",
      "Starry skies in your eyes, guiding my way.",
      "A melody of quiet, peaceful grace...",
      "Lost in the comfort of your warm embrace. ✨"
    ],
    2: [
      "We walked along the empty streets...",
      "Listening to our matching heartbeats...",
      "With you, the quiet silence feels complete.",
      "No words are needed, no distance can divide...",
      "I am forever anchored by your side. 🤝"
    ],
    3: [
      "A resonance across the dark...",
      "A sudden, quiet glowing spark...",
      "We wrote our names upon the stellar arc.",
      "The universe is vast, and stars will fade...",
      "But we will walk the path that love has made. 🌌"
    ]
  };

  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      timer = setInterval(() => {
        const trackLyrics = LYRICS[currentTrackIndex] || [];
        if (trackLyrics.length > 0) {
          setActiveLyricIndex((prev) => (prev + 1) % trackLyrics.length);
        }
      }, 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = audioVolume;
      audioRef.current = audio;
    }

    // Choreographed 6-phase 10-second cinematic intro sequence
    const phases = [
      { phase: 1, delay: 50 },      // Phase 1: Dust + Grain + projector warming
      { phase: 2, delay: 2000 },    // Phase 2: Monogram crest fades in
      { phase: 3, delay: 4000 },    // Phase 3: Tagline typewriter
      { phase: 4, delay: 5500 },    // Phase 4: Light wash + lens flare + zoom-dissolve
      { phase: 5, delay: 7000 },    // Phase 5: Velvet curtains slide apart + medallion split
      { phase: 6, delay: 9000 },    // Phase 6: Letterbox slide-away
      { phase: 7, delay: 10200 },   // Phase 7: Complete cleanup and unmount
    ];

    phases.forEach(({ phase, delay }) => {
      const timer = setTimeout(() => {
        setIntroPhase(phase);
      }, delay);
      introTimersRef.current.push(timer);
    });

    return () => {
      introTimersRef.current.forEach(clearTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const skipIntro = () => {
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    setIntroPhase(7);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === "") {
        audioRef.current.src = TRACKS[currentTrackIndex].url;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio autoplay or source error, retrying with fallback track...", err);
        // Fallback to online sample if local file is missing
        audioRef.current!.src = TRACKS[1].url;
        audioRef.current!.play().then(() => {
          setIsPlaying(true);
        }).catch((err2) => {
          console.log("Fallback audio also failed:", err2);
        });
      });
    }
  };

  const handleVolumeChange = (v: number) => {
    setAudioVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setActiveLyricIndex(0);
    if (audioRef.current) {
      audioRef.current.src = TRACKS[index].url;
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Error playing selected track:", err);
        });
      }
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    selectTrack(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    selectTrack(prevIndex);
  };
  
  // Constellation Game State & Refs
  const skyContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingStarSky, setIsDraggingStarSky] = useState(false);
  const [lastDragStarSkyPos, setLastDragStarSkyPos] = useState<{ x: number; y: number } | null>(null);
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
  const valuesContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingValues, setIsDraggingValues] = useState(false);
  const [lastDragValuesPos, setLastDragValuesPos] = useState<{ x: number; y: number } | null>(null);
  const [capsuleUnlocked, setCapsuleUnlocked] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [oracleSpinning, setOracleSpinning] = useState(false);
  const [oracleResult, setOracleResult] = useState<string | null>(null);

  // New Quiz States
  const [quizPhase, setQuizPhase] = useState<'start' | 'playing' | 'results'>('start');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [isQuizCardShaking, setIsQuizCardShaking] = useState(false);
  const [quizStreak, setQuizStreak] = useState(0);
  const [maxQuizStreak, setMaxQuizStreak] = useState(0);

  // New Flip Card States
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [flipCardsFilter, setFlipCardsFilter] = useState<'All' | 'First Impressions' | 'Deep Realizations' | 'Future Dreams'>('All');

  // New Deep Question States
  const [activeDeepCardIndex, setActiveDeepCardIndex] = useState<number | null>(null);

  // Reasons Card Deck active index state
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);

  const spinCompass = () => {
    if (oracleSpinning) return;
    setOracleSpinning(true);
    setOracleResult(null);

    setTimeout(() => {
      setOracleSpinning(false);
      const randomIndex = selectRandomOracleIndex(ORACLE_PREDICTIONS.length);
      setOracleResult(ORACLE_PREDICTIONS[randomIndex]);
    }, 1800);
  };

  const handleQuizAnswer = (option: string, e: React.MouseEvent) => {
    if (selectedQuizAnswer) return;

    setSelectedQuizAnswer(option);
    const isCorrect = option === QUIZ_QUESTIONS[quizIndex].correctAnswer;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      setQuizStreak((prev) => {
        const next = prev + 1;
        if (next > maxQuizStreak) {
          setMaxQuizStreak(next);
        }
        return next;
      });
      // Spawn floating hearts using the external module helper
      spawnQuizHearts(e.clientX, e.clientY);
    } else {
      setQuizStreak(0);
      setIsQuizCardShaking(true);
      setTimeout(() => setIsQuizCardShaking(false), 500);
    }

    setTimeout(() => {
      setSelectedQuizAnswer(null);
      if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
        setQuizIndex((prev) => prev + 1);
      } else {
        setQuizPhase('results');
      }
    }, 1500);
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

  // Safety window pointerup listener to reset dragging states
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsDraggingStarSky(false);
      setLastDragStarSkyPos(null);
      setIsDraggingValues(false);
      setLastDragValuesPos(null);
    };
    if (isDraggingStarSky || isDraggingValues) {
      window.addEventListener("pointerup", handleGlobalPointerUp);
      return () => window.removeEventListener("pointerup", handleGlobalPointerUp);
    }
  }, [isDraggingStarSky, isDraggingValues]);

  const handlePromiseClick = (index: number, e: React.MouseEvent) => {
    const isChecked = checkedPromises.includes(index);
    if (!isChecked) {
      setCheckedPromises([...checkedPromises, index]);
      
      // Spawn floating hearts using the external module helper
      spawnPromiseHearts(e.clientX, e.clientY);
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

  const handleSkyPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (constellationUnlocked) return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingStarSky(true);

    const rect = skyContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;
      setLastDragStarSkyPos({ x: xPct, y: yPct });

      CONSTELLATION_STARS.forEach((star) => {
        if (connectedStars.includes(star.id)) return;
        const starXpx = (star.x / 100) * rect.width;
        const starYpx = (star.y / 100) * rect.height;
        const dist = Math.hypot(x - starXpx, y - starYpx);
        if (dist < 28) {
          handleStarClick(star.id);
        }
      });
    }
  };

  const handleSkyPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingStarSky || constellationUnlocked || !skyContainerRef.current) return;
    const rect = skyContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    setLastDragStarSkyPos({ x: xPct, y: yPct });

    CONSTELLATION_STARS.forEach((star) => {
      if (connectedStars.includes(star.id)) return;
      const starXpx = (star.x / 100) * rect.width;
      const starYpx = (star.y / 100) * rect.height;
      const dist = Math.hypot(x - starXpx, y - starYpx);
      if (dist < 28) {
        handleStarClick(star.id);
      }
    });
  };

  const handleValuesPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingValues(true);

    const rect = valuesContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;
      setLastDragValuesPos({ x: xPct, y: yPct });

      LOVE_VALUES.forEach((val) => {
        if (selectedValues.includes(val.id)) return;
        const valXpx = (val.x / 100) * rect.width;
        const valYpx = (val.y / 100) * rect.height;
        const dist = Math.hypot(x - valXpx, y - valYpx);
        if (dist < 28) {
          setSelectedValues((prev) => prev.includes(val.id) ? prev : [...prev, val.id]);
        }
      });
    }
  };

  const handleValuesPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingValues || !valuesContainerRef.current) return;
    const rect = valuesContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    setLastDragValuesPos({ x: xPct, y: yPct });

    LOVE_VALUES.forEach((val) => {
      if (selectedValues.includes(val.id)) return;
      const valXpx = (val.x / 100) * rect.width;
      const valYpx = (val.y / 100) * rect.height;
      const dist = Math.hypot(x - valXpx, y - valYpx);
      if (dist < 28) {
        setSelectedValues((prev) => prev.includes(val.id) ? prev : [...prev, val.id]);
      }
    });
  };

  // Compliment Jar click
  const handleJarClick = (e: React.MouseEvent) => {
    setIsJarAnimating(true);
    
    // Choose random compliment using external pure helper
    const randomIndex = selectRandomComplimentIndex(COMPLIMENTS.length);
    setCurrentCompliment(COMPLIMENTS[randomIndex]);

    // Spawn heart particles using external module helper
    spawnJarHearts(e.clientX, e.clientY);

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

    // Render pointer tracking line if dragging
    if (isDraggingStarSky && lastDragStarSkyPos && connectedStars.length > 0 && !constellationUnlocked) {
      const lastStarId = connectedStars[connectedStars.length - 1];
      const lastStar = CONSTELLATION_STARS.find((s) => s.id === lastStarId);
      if (lastStar) {
        lines.push(
          <line
            key="drag-temp-line"
            x1={`${lastStar.x}%`}
            y1={`${lastStar.y}%`}
            x2={`${lastDragStarSkyPos.x}%`}
            y2={`${lastDragStarSkyPos.y}%`}
            stroke="url(#gold-rose-grad)"
            strokeWidth="2.5"
            strokeDasharray="4"
            className="animate-pulse"
            style={{ opacity: 0.8 }}
          />
        );
      }
    }

    return lines;
  };

  return (
    <div className="us-page" ref={pageRef}>
      {/* Cinematic Movie Intro & Velvet Curtain Reveal */}
      {introPhase < 7 && (
        <div className={`us-intro-overlay phase-${introPhase}`}>
          {/* Film Grain */}
          <div className="us-intro-grain" />

          {/* Projector warming glow */}
          <div className="us-intro-projector-glow" />

          {/* Floating golden dust particles */}
          <div className="us-intro-dust">
            {DUST_PARTICLES_CONFIG.map((p, i) => (
              <div
                key={i}
                className="us-intro-dust-particle"
                style={
                  {
                    "--size": p.size,
                    "--x": p.x,
                    "--y": p.y,
                    "--drift-x": p.driftX,
                    "--drift-y": p.driftY,
                    "--duration": p.duration,
                    "--delay": p.delay,
                    "--opacity": p.opacity,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Monogram Crest (A ♥ R) */}
          <div className="us-intro-crest">
            <div className="us-intro-crest-bloom" />
            <div className="us-intro-crest-circle">
              <div className="us-intro-crest-inner">
                <span>A</span>
                <span className="text-[#e8475f]">♥</span>
                <span>R</span>
              </div>
            </div>
          </div>

          {/* Typewriter Tagline */}
          <div className="us-intro-tagline">
            <span className="us-intro-tagline-text">A Universe Made for Two</span>
            <div className="us-intro-tagline-rule" />
          </div>

          {/* Horizontal Lens Flare */}
          <div className="us-intro-flare" />

          {/* Cinematic Letterbox Bars */}
          <div className="us-intro-letterbox-top" />
          <div className="us-intro-letterbox-bottom" />

          {/* Velvet Curtain Reveal */}
          <div className="us-curtain-container">
            <div className="us-curtain-panel us-curtain-left">
              <div className="us-curtain-fringe" />
              <div className="us-curtain-medallion us-curtain-medallion-left">
                <div className="us-curtain-medallion-circle">
                  <svg className="us-curtain-medallion-svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="us-curtain-panel us-curtain-right">
              <div className="us-curtain-fringe" />
              <div className="us-curtain-medallion us-curtain-medallion-right">
                <div className="us-curtain-medallion-circle">
                  <svg className="us-curtain-medallion-svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="us-curtain-light-spill" />
          </div>

          {/* Skip Button */}
          <button className="us-intro-skip" onClick={skipIntro}>
            Skip Intro →
          </button>
        </div>
      )}

      <StarfieldCanvas />

      {/* Cinematic Hero */}
      <section className="us-hero relative overflow-hidden flex flex-col justify-center items-center">
        {/* Orbital particle rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <div className="us-orbital-ring"></div>
          <div className="us-orbital-ring-outer"></div>
        </div>

        <div className="text-center max-w-4xl px-6 z-10 select-none">
          <p 
            className="text-[#d4a853] tracking-[0.3em] text-xs font-bold uppercase mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            A Dedication to My Favorite Person
          </p>
          <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium mb-8 leading-tight tracking-wide text-white">
            {"To the One Who Stole My Heart".split(" ").map((word, idx) => (
              <span 
                key={idx} 
                className="inline-block mr-3 md:mr-4 opacity-0 animate-fade-in"
                style={{ 
                  animationDelay: `${idx * 0.12 + 0.4}s`,
                  animationFillMode: "forwards"
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          <p 
            className="text-lg sm:text-xl text-[rgba(253,246,227,0.7)] font-serif-body font-light leading-relaxed max-w-2xl mx-auto opacity-0 animate-fade-in"
            style={{ animationDelay: "1.8s", animationFillMode: "forwards" }}
          >
            A small corner of the universe designed just for you, Rekha. A celebration of us.
          </p>

          <div 
            className="opacity-0 animate-fade-in" 
            style={{ animationDelay: "2.2s", animationFillMode: "forwards" }}
          >
            <button 
              onClick={togglePlay}
              className="mt-10 px-8 py-3.5 rounded-full border border-[rgba(212,168,83,0.25)] bg-[rgba(10,10,12,0.65)] backdrop-blur-md text-[#d4a853] hover:text-white hover:border-[#d4a853] hover:bg-[rgba(212,168,83,0.12)] transition-all duration-300 flex items-center gap-3.5 mx-auto shadow-xl z-20 group active:scale-95 cursor-pointer"
            >
              <span className="relative flex h-3 w-3">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a853] opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? "bg-[#d4a853]" : "bg-gray-500"}`}></span>
              </span>
              <span className="text-xs uppercase tracking-widest font-bold">
                {isPlaying ? "Pause Ambient Music" : "Play Ambient Music"}
              </span>
              {isPlaying ? (
                <svg className="w-4 h-4 text-[#d4a853] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#d4a853] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[rgba(253,246,227,0.4)] animate-pulse">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold">Scroll to Begin</span>
          <svg className="w-4 h-4 animate-bounce text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

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
              <div className="overflow-y-auto max-h-full pr-1 text-left font-serif-body italic">
                <span className="font-display font-bold text-[#d4a853] tracking-widest text-[10px] uppercase block mb-3">
                  With All My Love
                </span>
                {isLetterOpen ? (
                  <>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#d4a853] mb-3">
                      <TypewriterText text="Rekha, from the moment our paths crossed, the world seemed to shift into a warmer, more vibrant focus. You brought a quiet grace and an undeniable magic into my life that I didn't know I was searching for, but now cannot imagine living without." />
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#df7859] mb-3">
                      <TypewriterText text="In the noise of the everyday, you are my sanctuary. The ease with which we share both laughter and comfortable silence is a rare gift that I cherish more with each passing day. You have this beautiful way of turning ordinary moments into extraordinary memories." />
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#e8475f]">
                      <TypewriterText text="Thank you for being my constant anchor, my source of inspiration, and the keeper of my heart. I promise to stand by you through every season, celebrating your triumphs, supporting your dreams, and loving you more fiercely with every beat of my heart." />
                    </p>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm text-transparent">.</p>
                )}
              </div>

              <div className="text-right font-display italic text-[#d4a853] text-sm mt-2 border-t border-[rgba(212,168,83,0.1)] pt-2">
                Yours forever, <span className="font-bold tracking-wider not-italic">Akash</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

      {/* Section 2.5 — Immersive Music Player */}
      <section className="us-player-section py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Our Soundtrack
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Echoes of Us
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            A curated selection of melodies that echo the rhythm of our hearts. Press play to spin the vinyl and read the lyrics.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 us-reveal">
          <div className={`us-player-container ${isPlaying ? "playing" : ""}`}>
            {/* Player Visuals */}
            <div className="us-player-left">
              <div className="us-vinyl-deck">
                <div className="us-vinyl-jacket">
                  <span className="font-display font-bold text-[#d4a853] text-[9px] uppercase tracking-widest mb-1">
                    Rekha & Akash
                  </span>
                  <span className="text-[10px] text-[rgba(253,246,227,0.65)] font-serif-body italic truncate max-w-full">
                    {TRACKS[currentTrackIndex].title}
                  </span>
                </div>
                <div className="us-vinyl-record">
                  <div className="us-vinyl-label">
                    <div className="us-vinyl-label-center"></div>
                  </div>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="w-full max-w-[200px] mt-6 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-[rgba(253,246,227,0.4)]">
                  <span>Volume</span>
                  <span>{Math.round(audioVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#d4a853] bg-[rgba(255,255,255,0.05)] rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Visual Equalizer Bars */}
              <div className="us-audio-equalizer">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="us-equalizer-bar" />
                ))}
              </div>

              {/* Controls */}
              <div className="us-player-controls">
                <button
                  onClick={prevTrack}
                  className="us-player-btn text-xs"
                  aria-label="Previous Track"
                >
                  ⏮
                </button>
                <button
                  onClick={togglePlay}
                  className="us-player-btn play-btn text-base"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button
                  onClick={nextTrack}
                  className="us-player-btn text-xs"
                  aria-label="Next Track"
                >
                  ⏭
                </button>
              </div>
            </div>

            {/* Playlist and Lyrics */}
            <div className="flex flex-col gap-6 text-left justify-between">
              {/* Lyrics Panel */}
              <div className="p-6 border border-[rgba(212,168,83,0.15)] bg-[rgba(10,10,12,0.4)] rounded-2xl min-h-[160px] flex flex-col justify-center relative overflow-hidden">
                <span className="absolute top-4 left-6 text-[9px] uppercase font-bold tracking-widest text-[rgba(253,246,227,0.35)]">
                  Highlight Lyric
                </span>
                <div className="flex flex-col gap-2 mt-4">
                  {(LYRICS[currentTrackIndex] || []).map((lyric, idx) => (
                    <p
                      key={idx}
                      className={`text-xs sm:text-sm font-serif-body transition-all duration-500 leading-relaxed ${
                        activeLyricIndex === idx
                          ? "text-[#e8475f] font-bold scale-[1.02] origin-left"
                          : "text-[rgba(253,246,227,0.45)] italic"
                      }`}
                    >
                      {lyric}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tracks List */}
              <div className="us-playlist">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[rgba(253,246,227,0.4)] mb-2 block">
                  Select Track
                </span>
                {TRACKS.map((track, index) => {
                  const isActive = currentTrackIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => selectTrack(index)}
                      className={`us-playlist-track ${isActive ? "active" : ""}`}
                    >
                      <span className="us-playlist-track-num">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="us-playlist-track-info">
                        <p className="us-playlist-track-title text-sm">{track.title}</p>
                        <p className="us-playlist-track-artist text-xs">Akash & Rekha</p>
                      </div>
                      <span className="us-playlist-track-duration text-xs">{track.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

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

        <div className="us-timeline us-reveal relative flex md:flex-row flex-col">
          {/* Horizontal line for desktop */}
          <div className="us-timeline-horizontal-line hidden md:block"></div>

          {TIMELINE_EVENTS.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isExpanded = expandedTimelineNode === index;
            const daysAgo = getDaysAgo(event.date);

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
                  className={`us-timeline-card us-card-frosted group ${isExpanded ? "expanded" : ""}`}
                  onClick={() => setExpandedTimelineNode(isExpanded ? null : index)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="us-timeline-date">{event.date}</span>
                    {daysAgo && (
                      <span className="text-[9px] text-[rgba(253,246,227,0.45)] font-bold tracking-wider uppercase bg-[rgba(255,255,255,0.03)] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.05)]">
                        {daysAgo}
                      </span>
                    )}
                  </div>
                  
                  {/* Styled Vector SVG Header Illustration Frame */}
                  <div className="w-full h-24 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(212,168,83,0.12)] flex items-center justify-center mb-4 group-hover:border-[rgba(212,168,83,0.3)] transition-colors overflow-hidden relative">
                    <div className="absolute inset-0 bg-radial-gradient(circle, rgba(212,168,83,0.05)_0%, transparent_70%)"></div>
                    <svg className="w-9 h-9 text-[#d4a853] opacity-50 group-hover:opacity-100 transition-opacity z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                      {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                      {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                      {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />}
                    </svg>
                  </div>

                  <h3 className="us-timeline-title">{event.title}</h3>
                  <p className="us-timeline-desc">{event.desc}</p>
                  
                  <div className="us-memory-details">
                    <p className="italic text-[rgba(253,246,227,0.85)] font-serif-body">
                      &ldquo;{event.memory}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

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

        <div 
          ref={skyContainerRef}
          className="us-sky-canvas-wrapper us-reveal"
          style={{ touchAction: "none", userSelect: "none" }}
          onPointerDown={handleSkyPointerDown}
          onPointerMove={handleSkyPointerMove}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            setIsDraggingStarSky(false);
            setLastDragStarSkyPos(null);
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="gold-rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a853" />
                <stop offset="100%" stopColor="#e8475f" />
              </linearGradient>
            </defs>
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
            <div className="max-w-md text-center p-6 rounded-2xl us-card-shadow">
              <span className="text-3xl">🌌</span>
              <h3 className="font-display font-bold text-2xl text-[#d4a853] mt-4">
                Constellation Aligned!
              </h3>
              <p className="text-[rgba(253,246,227,0.5)] text-xs uppercase tracking-widest font-bold mt-2">
                &ldquo;The Heart of Rekha &amp; Akash&rdquo;
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

      <div className="us-divider-gold us-reveal"></div>

      {/* Section 4.5 — "How Well Do You Know Me?" Quiz Game */}
      <section className="us-quiz-section">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Love Challenge
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            How Well Do You Know Me?
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Test your knowledge about my favorite things, fears, and quirks. Let&apos;s see if we are perfectly aligned!
          </p>
        </div>

        <div className="us-quiz-container px-4 us-reveal">
          <div className={`us-quiz-card us-card-gradient ${isQuizCardShaking ? 'shake' : ''}`}>
            <div className="us-quiz-progress-bar-bg">
              <div 
                className="us-quiz-progress-bar" 
                style={{ width: `${quizPhase === 'playing' ? ((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100 : quizPhase === 'results' ? 100 : 0}%` }}
              ></div>
            </div>

            {quizPhase === 'start' && (
              <div className="text-center py-6">
                <span className="text-5xl block mb-4 animate-bounce">✨</span>
                <h3 className="font-display font-bold text-xl text-white mb-2">The Ultimate Soulmate Test</h3>
                <p className="text-sm text-[rgba(253,246,227,0.7)] leading-relaxed mb-6">
                  I have prepared 15 questions about my favorites, fears, and personality. Answer them all to reveal our connection tier!
                </p>
                <button 
                  onClick={() => {
                    setQuizPhase('playing');
                    setQuizIndex(0);
                    setQuizScore(0);
                  }}
                  className="px-8 py-3 text-xs font-bold border border-[rgba(212,168,83,0.3)] hover:border-[#d4a853] transition-all bg-[rgba(212,168,83,0.05)] text-[#f5d799] rounded-full tracking-widest uppercase"
                >
                  Start Quiz
                </button>
              </div>
            )}

            {quizPhase === 'playing' && (
              <div key={`quiz-q-${quizIndex}`} className="animate-fade-in">
                <div className="flex justify-between items-center mb-6 text-xs font-bold text-[rgba(253,246,227,0.5)]">
                  <span>QUESTION {quizIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
                  {quizStreak > 0 && (
                    <span className="flex items-center gap-1 text-[#e8475f] animate-pulse">
                      🔥 STREAK: {quizStreak}
                    </span>
                  )}
                  <span>SCORE: {quizScore}</span>
                </div>

                <div className="text-center py-4">
                  <span className="text-4xl block mb-3">{QUIZ_QUESTIONS[quizIndex].emoji}</span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white leading-relaxed">
                    {QUIZ_QUESTIONS[quizIndex].question}
                  </h3>
                </div>

                <div className="us-quiz-options-grid">
                  {QUIZ_QUESTIONS[quizIndex].options.map((option) => {
                    const isSelected = selectedQuizAnswer === option;
                    const isCorrect = option === QUIZ_QUESTIONS[quizIndex].correctAnswer;
                    const hasAnswered = selectedQuizAnswer !== null;

                    let btnClass = "";
                    if (hasAnswered) {
                      if (isCorrect) btnClass = "correct";
                      else if (isSelected) btnClass = "wrong";
                    }

                    return (
                      <button
                        key={option}
                        disabled={hasAnswered}
                        className={`us-quiz-option-btn ${btnClass}`}
                        onClick={(e) => handleQuizAnswer(option, e)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {quizPhase === 'results' && (
              <div className="text-center py-4 animate-fade-in">
                {/* SVG Badge based on score */}
                <div className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center">
                  <svg className="w-full h-full animate-[spin_30s_linear_infinite]" viewBox="0 0 100 100">
                    <polygon 
                      points="50,5 95,25 95,75 50,95 5,75 5,25" 
                      fill="none" 
                      stroke={quizScore === QUIZ_QUESTIONS.length ? "url(#gold-badge-grad)" : quizScore >= 12 ? "url(#rose-badge-grad)" : "#d4a853"} 
                      strokeWidth="2.5"
                    />
                    <polygon 
                      points="50,15 85,32 85,68 50,85 15,68 15,32" 
                      fill="rgba(212, 168, 83, 0.03)" 
                      stroke="rgba(255, 255, 255, 0.08)" 
                      strokeWidth="1"
                    />
                    <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="30">
                      {quizScore === QUIZ_QUESTIONS.length ? "👑" : quizScore >= 12 ? "💝" : "✨"}
                    </text>
                    <defs>
                      <linearGradient id="gold-badge-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f5d799" />
                        <stop offset="100%" stopColor="#d4a853" />
                      </linearGradient>
                      <linearGradient id="rose-badge-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffb3bf" />
                        <stop offset="100%" stopColor="#e8475f" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <span className="text-[10px] text-[#d4a853] uppercase font-bold tracking-[0.25em] block mb-1">
                  {quizScore === QUIZ_QUESTIONS.length ? "Cosmic Soulmate" :
                   quizScore >= 12 ? "Celestial Partner" :
                   quizScore >= 8 ? "Kindred Spirit" : "Perfect Match"}
                </span>

                <h3 className="us-quiz-result-header mb-2 font-mono">
                  {quizScore} / {QUIZ_QUESTIONS.length}
                </h3>
                <p className="text-sm font-bold text-white mb-4">
                  {quizScore === QUIZ_QUESTIONS.length ? "Soulmate Status Aligned! 💫" :
                   quizScore >= 12 ? "Practically Joined at the Soul! 🥰" :
                   quizScore >= 8 ? "Beautiful Connection! 😊" :
                   "Let's Continue Learning Each Other! 💕"}
                </p>
                <p className="text-xs text-[rgba(253,246,227,0.6)] leading-relaxed mb-6 max-w-sm mx-auto">
                  {quizScore === QUIZ_QUESTIONS.length ? "You know every single little detail about me. My heart is perfectly safe with you." :
                   quizScore >= 12 ? "You know me incredibly well! We are perfectly in sync and understand each other's worlds." :
                   quizScore >= 8 ? "You know so much about me, and the parts you missed are just more beautiful things to discover together." :
                   "Every day is a beautiful adventure of getting to know each other. I love sharing my world with you."}
                </p>

                {maxQuizStreak > 0 && (
                  <div className="inline-block px-3 py-1.5 rounded-full border border-[rgba(232,71,95,0.2)] bg-[rgba(232,71,95,0.05)] text-[#e8475f] text-[10px] uppercase font-bold tracking-widest mb-6">
                    🔥 Max Streak: {maxQuizStreak} Correct
                  </div>
                )}

                {/* Fun Facts Ticker */}
                <div className="border-t border-[rgba(212,168,83,0.15)] pt-4 mb-6 text-left">
                  <span className="text-[10px] text-[#d4a853] uppercase font-bold tracking-widest block mb-2 text-center">
                    More Fun Facts About Me
                  </span>
                  <div className="max-h-24 overflow-y-auto pr-1 text-xs text-[rgba(253,246,227,0.75)] space-y-2">
                    <p>❄️ <strong>Favorite Season:</strong> Winter (cozy evenings and endless warm tea!)</p>
                    <p>🥛 <strong>Favorite Drink:</strong> Masala Chhas (absolute delight!)</p>
                    <p>👚 <strong>Favorite Brand:</strong> Snitch (loves the clothing style!)</p>
                    <p>🎥 <strong>Favorite YouTube:</strong> MrBeast (super creative and fun!)</p>
                    <p>📺 <strong>Favorite TV Show:</strong> Wednesday (creepy, kooky, and cool!)</p>
                    <p>🐾 <strong>Favorite Animal:</strong> Cat (mysterious and super cute!)</p>
                    <p>🍨 <strong>Favorite Ice Cream:</strong> Butterscotch (the perfect sweet treat!)</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setQuizPhase('start');
                    setQuizIndex(0);
                    setQuizScore(0);
                    setQuizStreak(0);
                    setMaxQuizStreak(0);
                  }}
                  className="px-6 py-2 text-xs border border-[rgba(212,168,83,0.3)] rounded-full hover:border-[#d4a853] transition-all bg-[rgba(212,168,83,0.05)] text-[#f5d799] tracking-widest uppercase cursor-pointer"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

      {/* Section 4.6 — "Our Story" Flip-Card Gallery */}
      <section className="us-flipcard-section">
        <div className="text-center max-w-2xl mx-auto mb-6 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Milestones & Dreams
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Our Story Gallery
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click on the cards to flip them and reveal our deep memories, first impressions, and future plans together.
          </p>
        </div>

        {/* Categories filter bar */}
        <div className="us-flipcards-filter-bar px-4 us-reveal">
          {(["All", "First Impressions", "Deep Realizations", "Future Dreams"] as const).map((category) => (
            <button
              key={category}
              className={`us-flipcard-filter-btn ${flipCardsFilter === category ? "active" : ""}`}
              onClick={() => setFlipCardsFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="us-flipcards-grid px-4 us-reveal">
          {FLIP_CARDS.filter((card) => flipCardsFilter === "All" || card.category === flipCardsFilter).map((card) => {
            // Find global index in FLIP_CARDS array to track flip state consistently
            const globalIndex = FLIP_CARDS.indexOf(card);
            const isFlipped = flippedCardIds.includes(globalIndex);

            return (
              <div
                key={globalIndex}
                className={`us-flipcard-container ${isFlipped ? "flipped" : ""}`}
                onClick={() => {
                  if (isFlipped) {
                    setFlippedCardIds(flippedCardIds.filter((id) => id !== globalIndex));
                  } else {
                    setFlippedCardIds([...flippedCardIds, globalIndex]);
                  }
                }}
              >
                <div className="us-flipcard">
                  {/* Front Face */}
                  <div className="us-flipcard-front">
                    <div className="flex justify-between items-start">
                      <span className="us-flipcard-category">{card.category}</span>
                      <span className="text-lg">{card.icon}</span>
                    </div>
                    <p className="us-flipcard-question">
                      {card.question}
                    </p>
                    <span className="us-flipcard-hint">
                      TAP TO REVEAL ANSWER
                    </span>
                  </div>

                  {/* Back Face */}
                  <div className="us-flipcard-back">
                    <span className="text-2xl mb-3">✨</span>
                    <p className="us-flipcard-answer">
                      {card.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Tracker */}
        <div className="text-center mt-8 text-xs font-bold tracking-widest text-[rgba(253,246,227,0.45)] uppercase us-reveal">
          REVEALED {flippedCardIds.length} OF {FLIP_CARDS.length} CARDS
          {flippedCardIds.length === FLIP_CARDS.length && (
            <span className="text-[#e8475f] block mt-2 animate-bounce">
              ❤️ Perfect! You have read our entire story from beginning to tomorrow!
            </span>
          )}
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

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
          <div 
            ref={valuesContainerRef}
            className="us-align-visualizer relative aspect-square w-full max-w-[360px] mx-auto border border-[rgba(212,168,83,0.15)] rounded-full bg-[rgba(10,10,12,0.4)] overflow-hidden"
            style={{ touchAction: "none", userSelect: "none" }}
            onPointerDown={handleValuesPointerDown}
            onPointerMove={handleValuesPointerMove}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              setIsDraggingValues(false);
              setLastDragValuesPos(null);
            }}
          >
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
              {/* Render dynamic cursor tracking line if dragging */}
              {isDraggingValues && lastDragValuesPos && selectedValues.length > 0 && selectedValues.length < LOVE_VALUES.length && (() => {
                const lastValId = selectedValues[selectedValues.length - 1];
                const lastVal = LOVE_VALUES.find((v) => v.id === lastValId);
                if (!lastVal) return null;
                return (
                  <line
                    x1={`${lastVal.x}%`}
                    y1={`${lastVal.y}%`}
                    x2={`${lastDragValuesPos.x}%`}
                    y2={`${lastDragValuesPos.y}%`}
                    stroke="url(#rose-gold-glow-values)"
                    strokeWidth="2"
                    strokeDasharray="4"
                    className="animate-pulse"
                    style={{ opacity: 0.8 }}
                  />
                );
              })()}
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

      <div className="us-divider-gold us-reveal"></div>

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
          <div className="us-dashboard-counter-card us-card-frosted relative overflow-hidden">
            <div className="us-counter-title">Our Time in the Universe</div>

            {/* Pulsing ECG Heartbeat SVG Line */}
            <div className="w-full h-10 my-4 relative overflow-hidden opacity-60">
              <svg className="w-full h-full stroke-[#e8475f]" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none">
                <path
                  className="us-ecg-path"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M 0 30 L 140 30 L 148 10 L 156 50 L 164 0 L 172 60 L 180 30 L 188 30 L 400 30"
                />
              </svg>
            </div>
            
            <div className="us-counter-timer select-none">
              <div className="us-counter-unit">
                <div className="us-counter-val font-mono">
                  <Odometer value={timeElapsed.years} />
                </div>
                <div className="us-counter-label">Years</div>
              </div>
              <div className="us-counter-unit">
                <div className="us-counter-val font-mono">
                  <Odometer value={timeElapsed.days} />
                </div>
                <div className="us-counter-label">Days</div>
              </div>
              <div className="us-counter-unit">
                <div className="us-counter-val font-mono">
                  <Odometer value={timeElapsed.hours} />
                </div>
                <div className="us-counter-label">Hours</div>
              </div>
              <div className="us-counter-unit">
                <div className="us-counter-val font-mono">
                  <Odometer value={timeElapsed.minutes} />
                </div>
                <div className="us-counter-label">Mins</div>
              </div>
            </div>
            
            <div className="us-counter-val-ms text-center mt-6 select-none">
              <span className="text-[rgba(253,246,227,0.4)] text-[10px] uppercase font-bold tracking-wider block mb-1">
                Live Precision Counter
              </span>
              <span className="font-mono text-xl sm:text-2xl text-[#e8475f] font-extrabold">
                <Odometer value={timeElapsed.seconds} />.{timeElapsed.ms.toString().padStart(3, "0")}s
              </span>
            </div>
          </div>

          {/* Promises Checklist panel */}
          <div className="us-promises-panel us-card-frosted">
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

      <div className="us-divider-gold us-reveal"></div>

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

      <div className="us-divider-gold us-reveal"></div>

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

      <div className="us-divider-gold us-reveal"></div>

      {/* Section 4.7 — "Between the Lines" Deep Reveals */}
      <section className="us-deep-section">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Deep Revelations
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Between the Lines
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click on a topic to uncover the deep and cute truths of our connection.
          </p>
        </div>

        <div className="us-deep-container px-4 us-reveal">
          <div className="us-deep-cards-stack">
            {DEEP_QUESTIONS.map((item, idx) => {
              const isActive = activeDeepCardIndex === idx;
              return (
                <div
                  key={idx}
                  className={`us-deep-card ${isActive ? "active" : ""}`}
                  onClick={() => setActiveDeepCardIndex(isActive ? null : idx)}
                >
                  <div className="us-deep-question-row">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <h3 className="us-deep-question">{item.question}</h3>
                    </div>
                    <span className="us-deep-reveal-icon">▼</span>
                  </div>
                  <div className="us-deep-answer-box">
                    {isActive && (
                      <p className="us-deep-answer">
                        <TypewriterText text={item.answer} />
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Q52: The Moment to Relive - Special Finale Card */}
            <div
              className={`us-deep-card border border-[rgba(232,71,95,0.25)] bg-[rgba(232,71,95,0.03)] ${activeDeepCardIndex === 99 ? "active" : ""}`}
              onClick={() => setActiveDeepCardIndex(activeDeepCardIndex === 99 ? null : 99)}
            >
              <div className="us-deep-question-row">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <h3 className="us-deep-question text-[#e8475f]">Which moment with me would you relive forever?</h3>
                </div>
                <span className="us-deep-reveal-icon text-[#e8475f]">▼</span>
              </div>
              <div className="us-deep-answer-box">
                {activeDeepCardIndex === 99 && (
                  <p className="us-deep-answer text-[#ffb3bf]">
                    <TypewriterText text="Watching our empire rise—because I got to build it with you. ❤️" />
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

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

      <div className="us-divider-gold us-reveal"></div>

      {/* Section 4.8 — Cinematic Movie Highlight Banner */}
      <section className="us-movie-banner-section py-20">
        <div className="us-movie-backdrop-glow"></div>
        <div className="us-movie-content us-reveal px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-[0.3em] text-xs uppercase block mb-6 animate-pulse">
            🎬 Our Cinematic Masterpiece
          </span>
          <p className="text-xs sm:text-sm text-[rgba(253,246,227,0.5)] uppercase tracking-widest font-bold mb-2">
            If we had a movie, what would its title be?
          </p>
          <h2 className="us-movie-title animate-pulse">
            The One I Didn&apos;t See Coming
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4a853] to-transparent mx-auto my-6"></div>
          <p className="font-serif italic text-base sm:text-lg text-[rgba(253,246,227,0.85)] max-w-lg mx-auto leading-relaxed">
            &ldquo;A beautiful twist of fate. A quiet entry that completely rewrote my entire universe.&rdquo;
          </p>
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

      {/* Section 8 — Reasons I Love You Cards */}
      <section className="us-reasons-section py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
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

        <div className="max-w-xl mx-auto px-4 relative h-[380px] flex flex-col justify-between items-center us-reveal">
          <div className="relative w-full h-[280px]">
            {REASONS.map((reason, index) => {
              const total = REASONS.length;
              const offset = (index - activeReasonIndex + total) % total;
              const isActive = offset === 0;
              const isBehind = offset === 1;
              const isFurtherBehind = offset === 2;
              const isVisible = isActive || isBehind || isFurtherBehind;
              
              if (!isVisible) return null;

              let transformStyle = "";
              let zIndexVal = 0;
              let opacityVal = 0;

              if (isActive) {
                transformStyle = "translate3d(0, 0, 0) scale(1) rotate(0deg)";
                zIndexVal = 30;
                opacityVal = 1;
              } else if (isBehind) {
                transformStyle = "translate3d(0, 12px, 0) scale(0.95) rotate(-1.5deg)";
                zIndexVal = 20;
                opacityVal = 0.8;
              } else if (isFurtherBehind) {
                transformStyle = "translate3d(0, 24px, 0) scale(0.9) rotate(1.5deg)";
                zIndexVal = 10;
                opacityVal = 0.55;
              }

              return (
                <div
                  key={reason.num}
                  onClick={() => setActiveReasonIndex((prev) => (prev + 1) % total)}
                  className={`absolute inset-0 p-8 sm:p-10 rounded-3xl border border-[rgba(212,168,83,0.2)] flex flex-col justify-between text-left transition-all duration-500 cursor-pointer select-none ${
                    isActive ? "us-card-gradient shadow-2xl" : "us-card-frosted pointer-events-none"
                  }`}
                  style={{
                    transform: transformStyle,
                    zIndex: zIndexVal,
                    opacity: opacityVal,
                  }}
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-mono text-xs font-bold text-[#d4a853] tracking-widest uppercase">
                        Reason {reason.num}
                      </span>
                      <span className="text-xl opacity-60">✦</span>
                    </div>
                    <p className="font-serif-display italic text-lg sm:text-xl md:text-2xl text-white leading-relaxed mb-4">
                      &ldquo;{reason.title}&rdquo;
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-[rgba(253,246,227,0.7)] font-serif-body leading-relaxed border-t border-[rgba(212,168,83,0.1)] pt-4">
                    {reason.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-6 z-40">
            <button
              onClick={() => setActiveReasonIndex((prev) => (prev - 1 + REASONS.length) % REASONS.length)}
              className="w-10 h-10 rounded-full border border-[rgba(212,168,83,0.25)] flex items-center justify-center text-[#d4a853] hover:text-white hover:border-[#d4a853] bg-[rgba(10,10,12,0.4)] transition-all active:scale-90 cursor-pointer"
              aria-label="Previous Reason"
            >
              ◀
            </button>
            <span className="font-mono text-xs font-bold tracking-widest text-[rgba(253,246,227,0.5)]">
              {activeReasonIndex + 1} OF {REASONS.length}
            </span>
            <button
              onClick={() => setActiveReasonIndex((prev) => (prev + 1) % REASONS.length)}
              className="w-10 h-10 rounded-full border border-[rgba(212,168,83,0.25)] flex items-center justify-center text-[#d4a853] hover:text-white hover:border-[#d4a853] bg-[rgba(10,10,12,0.4)] transition-all active:scale-90 cursor-pointer"
              aria-label="Next Reason"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      <div className="us-divider-gold us-reveal"></div>

      {/* Section 9 — Closing Section */}
      <section className="us-closing-section">
        <div className="us-reveal transition-all duration-1000 flex flex-col items-center">
          <div className="us-infinity-container animate-pulse">
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 us-reveal transition-all duration-1000 delay-300">
          <Link href="/" className="btn-secondary text-sm border-[rgba(212,168,83,0.3)] hover:border-[#d4a853] px-8 py-3 bg-[rgba(10,10,12,0.4)]">
            Back to Home
          </Link>
          <button 
            onClick={scrollToTop}
            className="px-8 py-3 text-sm font-bold border border-[rgba(232,71,95,0.3)] hover:border-[#e8475f] bg-[rgba(10,10,12,0.4)] text-[#ffb3bf] rounded-full hover:shadow-[0_0_15px_rgba(232,71,95,0.2)] transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
          >
            <span>Scroll to Top</span>
            <span className="group-hover:-translate-y-1.5 transition-transform duration-300">❤️</span>
          </button>
        </div>

        {/* Credit footer */}
        <div className="mt-16 text-center text-[10px] uppercase tracking-[0.25em] text-[rgba(253,246,227,0.3)] font-mono us-reveal">
          Made with ❤️ by Akash for Rekha • {new Date().getFullYear()}
        </div>
      </section>
    </div>
  );
}
