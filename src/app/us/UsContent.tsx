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
    setDisplayedText("");

    const tick = () => {
      if (isCancelled) return;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
        setTimeout(tick, 20);
      }
    };

    tick();

    return () => {
      isCancelled = true;
    };
  }, [text]);

  return <span>{displayedText}</span>;
};


export default function UsContent() {


  const pageRef = useRef<HTMLDivElement>(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [expandedTimelineNode, setExpandedTimelineNode] = useState<number | null>(null);
  
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

  // New Flip Card States
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [flipCardsFilter, setFlipCardsFilter] = useState<'All' | 'First Impressions' | 'Deep Realizations' | 'Future Dreams'>('All');

  // New Deep Question States
  const [activeDeepCardIndex, setActiveDeepCardIndex] = useState<number | null>(null);

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

  const handleQuizAnswer = (option: string, e: React.MouseEvent) => {
    if (selectedQuizAnswer) return;

    setSelectedQuizAnswer(option);
    const isCorrect = option === QUIZ_QUESTIONS[quizIndex].correctAnswer;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      // Spawn floating hearts
      const heartCount = 8;
      for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = Math.random() > 0.5 ? "💖" : "✨";
        heart.className = "us-heart-particle";
        heart.style.left = `${e.clientX + (Math.random() - 0.5) * 40}px`;
        heart.style.top = `${e.clientY + (Math.random() - 0.5) * 40}px`;
        const rot = (Math.random() - 0.5) * 120;
        heart.style.setProperty("--rot", `${rot}deg`);
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
      }
    } else {
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
          setSelectedValues((prev) => [...prev, val.id]);
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
        setSelectedValues((prev) => [...prev, val.id]);
      }
    });
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
          style={{ touchAction: "none" }}
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
            Test your knowledge about my favorite things, fears, and quirks. Let's see if we are perfectly aligned!
          </p>
        </div>

        <div className="us-quiz-container px-4 us-reveal">
          <div className={`us-quiz-card ${isQuizCardShaking ? 'shake' : ''}`}>
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
              <div>
                <div className="flex justify-between items-center mb-6 text-xs font-bold text-[rgba(253,246,227,0.5)]">
                  <span>QUESTION {quizIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
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
              <div className="text-center py-4">
                <span className="text-5xl block mb-4">🏆</span>
                <span className="text-xs text-[rgba(253,246,227,0.5)] uppercase tracking-widest font-bold block mb-1">
                  Quiz Completed!
                </span>
                <h3 className="us-quiz-result-header mb-2">
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
                    <p>Wednesday <strong>Favorite TV Show:</strong> Wednesday (creepy, kooky, and cool!)</p>
                    <p>🐾 <strong>Favorite Animal:</strong> Cat (mysterious and super cute!)</p>
                    <p>🍨 <strong>Favorite Ice Cream:</strong> Butterscotch (the perfect sweet treat!)</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setQuizPhase('start');
                    setQuizIndex(0);
                    setQuizScore(0);
                  }}
                  className="px-6 py-2 text-xs border border-[rgba(212,168,83,0.3)] rounded-full hover:border-[#d4a853] transition-all bg-[rgba(212,168,83,0.05)] text-[#f5d799] tracking-widest uppercase"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

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
          {FLIP_CARDS.filter((card) => flipCardsFilter === "All" || card.category === flipCardsFilter).map((card, idx) => {
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
            style={{ touchAction: "none" }}
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
