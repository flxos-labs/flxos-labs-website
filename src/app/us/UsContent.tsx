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

interface Track {
  title: string;
  artist: string;
  duration: string;
  url: string;
}

const TRACKS: Track[] = [
  { 
    title: "Gymnopédie No. 1", 
    artist: "Erik Satie", 
    duration: "3:07",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Erik_Satie_-_Gymnop%C3%A9die_No._1.mp3"
  },
  { 
    title: "Nocturne in E-flat", 
    artist: "Frédéric Chopin", 
    duration: "4:14",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Chopin_Nocturne_Op._9_No._2_E_flat_Major.mp3"
  },
  { 
    title: "Clair de Lune", 
    artist: "Claude Debussy", 
    duration: "5:05",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Debussy_-_Clair_de_Lune.mp3"
  },
  { 
    title: "Für Elise", 
    artist: "Ludwig van Beethoven", 
    duration: "2:50",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Fur_Elise.mp3"
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

// --- NEW DATASETS FOR DATA-READY SECTIONS ---

interface Dream {
  id: string;
  title: string;
  icon: string;
  descShort: string;
  descLong: string;
  status: "Planned" | "Dreaming" | "Completed";
}

const DREAMS_LIST: Dream[] = [
  {
    id: "lights",
    title: "See the Northern Lights",
    icon: "🌌",
    descShort: "A trip to the edge of the world.",
    descLong: "I want to stand with you under the glowing green skies of the north, wrapped in warm blankets, watching the universe paint itself in light, knowing my world is right next to me.",
    status: "Planned"
  },
  {
    id: "library",
    title: "Build a Home Library",
    icon: "📚",
    descShort: "A cozy reading corner for quiet afternoons.",
    descLong: "A floor-to-ceiling bookshelf filled with our favorite stories, a soft window seat, and the smell of old pages. A quiet sanctuary where we can read together in comfortable silence.",
    status: "Dreaming"
  },
  {
    id: "stargaze",
    title: "Stargaze in the Desert",
    icon: "✨",
    descShort: "Looking up at the infinite sky together.",
    descLong: "Away from the city lights, sitting on the hood of a car in the silent desert, counting shooting stars. A reminder that in this vast universe, finding you was my greatest miracle.",
    status: "Planned"
  },
  {
    id: "grow-old",
    title: "Grow Old Together",
    icon: "🌱",
    descShort: "The ultimate, lifelong adventure.",
    descLong: "To look back at a life full of shared laughter, crazy dreams, and quiet moments. To hold your wrinkled hand and know that through every season, you were my constant choice.",
    status: "Dreaming"
  }
];

interface LyricLine {
  time: number;
  text: string;
}

const TRACK_LYRICS: Record<number, LyricLine[]> = {
  0: [ // Satie Gymnopédie No. 1
    { time: 0, text: "🎵 Gymnopédie No. 1 — Erik Satie" },
    { time: 5, text: "Listen to the gentle rising notes of the piano..." },
    { time: 14, text: "Every single tone speaks of your soft, calm presence." },
    { time: 24, text: "Like a beautiful dream, you entered my world..." },
    { time: 35, text: "...and turned the quiet spaces into poetry." },
    { time: 48, text: "I love the way we share both laughter and absolute silence." },
    { time: 62, text: "With you, my heart finds its steady, peaceful rhythm." },
    { time: 76, text: "You are the melody I never want to stop playing." },
    { time: 92, text: "Hand in hand, we write our own quiet chapters." },
    { time: 110, text: "Thank you for being my light and my anchor, Rekha." },
    { time: 130, text: "Under this sky, my heart will always belong to yours." },
    { time: 155, text: "Forever and always." }
  ],
  1: [ // Chopin Nocturne
    { time: 0, text: "🎵 Nocturne in E-flat — Frédéric Chopin" },
    { time: 5, text: "A nighttime melody under a canopy of stars..." },
    { time: 15, text: "Your eyes hold a warmth that guides me home." },
    { time: 28, text: "I see our future shining in the quiet keys..." },
    { time: 42, text: "A promise of warmth, comfort, and safety." },
    { time: 58, text: "You make the ordinary moments feel extraordinary." },
    { time: 74, text: "I love you for your kind heart and brave spirit." },
    { time: 92, text: "In every season, in every quiet evening..." },
    { time: 112, text: "...I will choose you, again and again." },
    { time: 135, text: "Our paths aligned by destiny, bound by devotion." },
    { time: 160, text: "Two hearts, one infinity." }
  ],
  2: [ // Debussy Clair de Lune
    { time: 0, text: "🎵 Clair de Lune — Claude Debussy" },
    { time: 5, text: "Clair de Lune... Moonlight painting our memories." },
    { time: 18, text: "I remember the first time I held your hand." },
    { time: 35, text: "A spark that quieted the entire universe around us." },
    { time: 55, text: "You are my moonlit sanctuary, my peaceful harbor." },
    { time: 75, text: "In the storms, you are my calm; in the dark, my light." },
    { time: 98, text: "No distance, no time can ever dim what we share." },
    { time: 120, text: "I promise to protect your dreams and cherish your smile." },
    { time: 145, text: "You make my soul dance to a sweet, timeless rhythm." },
    { time: 175, text: "Rekha, you are my greatest miracle." }
  ],
  3: [ // Beethoven Für Elise
    { time: 0, text: "🎵 Für Elise — Ludwig van Beethoven" },
    { time: 4, text: "A classic, playful, and passionate rhythm..." },
    { time: 12, text: "Echoing the joy and laughter we bring each other." },
    { time: 22, text: "Your smile rewrites even my heaviest days." },
    { time: 34, text: "You inspire me to be the person I am still becoming." },
    { time: 48, text: "I cherish every adventure, every shared look, every tease." },
    { time: 64, text: "Thank you for walking this path hand-in-hand with me." },
    { time: 82, text: "Our story is my favorite composition in the world." },
    { time: 105, text: "Loving you more with every beat of my heart." }
  ]
};

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

export default function UsContent() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [expandedTimelineNode, setExpandedTimelineNode] = useState<number | null>(null);
  
  // Constellation Game State
  const [connectedStars, setConnectedStars] = useState<number[]>([]);
  const [constellationUnlocked, setConstellationUnlocked] = useState(false);
  
  // Vinyl Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0); // in seconds
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

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
  const [flippedDreams, setFlippedDreams] = useState<string[]>([]);
  const [capsuleUnlocked, setCapsuleUnlocked] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [oracleSpinning, setOracleSpinning] = useState(false);
  const [oracleResult, setOracleResult] = useState<string | null>(null);

  // Automatically scroll active lyrics line into focus
  useEffect(() => {
    const container = lyricsContainerRef.current;
    if (container) {
      const activeEl = container.querySelector(".us-lyric-line.active");
      if (activeEl) {
        container.scrollTo({
          top: (activeEl as HTMLElement).offsetTop - container.clientHeight / 2 + (activeEl as HTMLElement).clientHeight / 2,
          behavior: "smooth"
        });
      }
    }
  }, [trackProgress, currentTrackIndex]);

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

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
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

  // Initialize HTML5 Audio instance in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(TRACKS[currentTrackIndex].url);
      const audio = audioRef.current;

      const onTimeUpdate = () => {
        setTrackProgress(audio.currentTime);
      };

      const onEnded = () => {
        handleNextTrack();
      };

      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("ended", onEnded);

      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("ended", onEnded);
      };
    }
  }, []);

  // Sync isPlaying state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch((err) => {
          console.warn("Audio playback gesture lock or failure:", err);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  // Handle track source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const wasPlaying = isPlaying;
      audio.pause();
      audio.src = TRACKS[currentTrackIndex].url;
      audio.load();
      setTrackProgress(0);
      if (wasPlaying) {
        audio.play().catch((err) => {
          console.warn("Audio track swap play error:", err);
        });
      }
    }
  }, [currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const formatProgress = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
    <div className="us-page">
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

      {/* Dreams Board Section */}
      <section className="us-dreams-section py-20 bg-[rgba(10,10,12,0.3)]">
        <div className="text-center max-w-2xl mx-auto mb-12 px-4">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Future Horizons
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            Our Shared Dreams
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Click on any dream card to flip it and read a secret promise for our future.
          </p>
        </div>

        <div className="us-dreams-grid max-w-5xl mx-auto px-4 us-reveal">
          {DREAMS_LIST.map((dream) => {
            const isFlipped = flippedDreams.includes(dream.id);
            return (
              <div
                key={dream.id}
                className={`us-dream-card-wrapper ${isFlipped ? "flipped" : ""}`}
                onClick={() => {
                  setFlippedDreams(prev =>
                    prev.includes(dream.id) ? prev.filter(id => id !== dream.id) : [...prev, dream.id]
                  );
                }}
              >
                <div className="us-dream-card">
                  {/* Front side */}
                  <div className="us-dream-card-front">
                    <span className="text-4xl mb-4 block">{dream.icon}</span>
                    <h3 className="font-display font-bold text-lg text-white mb-2">{dream.title}</h3>
                    <p className="text-xs text-[rgba(253,246,227,0.5)] uppercase tracking-wider mb-3">
                      Status: <span className={dream.status === "Completed" ? "text-green-400" : "text-[#d4a853]"}>{dream.status}</span>
                    </p>
                    <p className="text-sm text-[rgba(253,246,227,0.65)]">{dream.descShort}</p>
                    <span className="text-xs text-[#d4a853] mt-auto block font-semibold">Tap to reveal...</span>
                  </div>
                  {/* Back side */}
                  <div className="us-dream-card-back">
                    <span className="text-2xl mb-2 block">{dream.icon}</span>
                    <h3 className="font-display font-bold text-base text-[#d4a853] mb-3">{dream.title}</h3>
                    <p className="text-sm leading-relaxed text-[rgba(253,246,227,0.85)]">{dream.descLong}</p>
                    <span className="text-[10px] text-[rgba(253,246,227,0.4)] mt-auto block uppercase tracking-widest font-bold">Tap to flip back</span>
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

      {/* Section 5 — Cinema Vinyl Music Player */}
      <section className="us-player-section">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-display font-bold text-[#d4a853] tracking-widest text-xs uppercase">
            Our Soundtrack
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 text-white">
            The Rhythm of Us
          </h2>
          <p className="text-[rgba(253,246,227,0.6)] mt-4">
            Listen to a collection of songs that echo the harmony of our hearts. Click play to spin the vinyl.
          </p>
        </div>

        <div className={`us-player-container us-reveal ${isPlaying ? "playing" : ""}`}>
          <div className="us-player-left">
            <div className="us-vinyl-deck">
              <div className="us-vinyl-jacket">
                <span className="text-[10px] text-[#d4a853] tracking-widest uppercase font-bold block mb-1">
                  Side A
                </span>
                <span className="font-display font-bold text-sm text-[rgba(253,246,227,0.85)] truncate block max-w-full">
                  {TRACKS[currentTrackIndex].title}
                </span>
                <span className="text-xs text-[rgba(253,246,227,0.5)] truncate block max-w-full">
                  {TRACKS[currentTrackIndex].artist}
                </span>
              </div>
              <div className="us-vinyl-record">
                <div className="us-vinyl-label">
                  <div className="us-vinyl-label-center"></div>
                </div>
              </div>
            </div>

            {/* Audio equalizers */}
            <div className="us-audio-equalizer">
              <div className="us-equalizer-bar"></div>
              <div className="us-equalizer-bar"></div>
              <div className="us-equalizer-bar"></div>
              <div className="us-equalizer-bar"></div>
              <div className="us-equalizer-bar"></div>
              <div className="us-equalizer-bar"></div>
              <div className="us-equalizer-bar"></div>
              <div className="us-equalizer-bar"></div>
            </div>

            <div className="mt-4 text-xs font-semibold text-[rgba(253,246,227,0.4)] tracking-widest uppercase">
              {isPlaying ? "Playing Track" : "Player Paused"}
            </div>

            <div className="us-player-controls">
              <button className="us-player-btn" onClick={handlePrevTrack} aria-label="Previous Track">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.83a1 1 0 001.555-.832V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM16.445 14.83a1 1 0 001.555-.832V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              <button 
                className="us-player-btn play-btn" 
                onClick={handlePlayPause}
                aria-label={isPlaying ? "Pause Track" : "Play Track"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button className="us-player-btn" onClick={handleNextTrack} aria-label="Next Track">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4zM11.555 5.168A1 1 0 0010 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                </svg>
              </button>
            </div>
            
            {/* progress bar */}
            <div className="w-full max-w-xs mt-6">
              <div className="flex justify-between text-[10px] text-[rgba(253,246,227,0.4)] font-bold uppercase tracking-wider mb-2">
                <span>{formatProgress(trackProgress)}</span>
                <span>{TRACKS[currentTrackIndex].duration}</span>
              </div>
              <div className="w-full h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div 
                  className="h-full us-player-progress-bar"
                  style={{
                    width: `${
                      (trackProgress /
                        (Number(TRACKS[currentTrackIndex].duration.split(":")[0]) * 60 +
                          Number(TRACKS[currentTrackIndex].duration.split(":")[1]))) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Synchronized Lyrics Panel */}
          <div ref={lyricsContainerRef} className="us-lyrics-panel text-left">
            {TRACK_LYRICS[currentTrackIndex]?.map((lyric, idx) => {
              const lyrics = TRACK_LYRICS[currentTrackIndex];
              const isActive = trackProgress >= lyric.time && (idx === lyrics.length - 1 || trackProgress < lyrics[idx + 1].time);
              return (
                <div
                  key={idx}
                  className={`us-lyric-line ${isActive ? "active" : ""}`}
                >
                  {lyric.text}
                </div>
              );
            })}
          </div>

          <div className="us-playlist">
            <h3 className="font-display font-extrabold text-lg text-white mb-4 border-b border-[rgba(212,168,83,0.15)] pb-3 text-left">
              Playlist Records
            </h3>
            {TRACKS.map((track, index) => (
              <div 
                key={track.title}
                className={`us-playlist-track ${currentTrackIndex === index ? "active" : ""}`}
                onClick={() => {
                  if (currentTrackIndex === index) {
                    setIsPlaying(true);
                    if (audioRef.current && audioRef.current.paused) {
                      audioRef.current.play().catch((err) => console.warn(err));
                    }
                  } else {
                    setCurrentTrackIndex(index);
                    setIsPlaying(true);
                  }
                }}
              >
                <div className="us-playlist-track-num">0{index + 1}</div>
                <div className="us-playlist-track-info text-left">
                  <div className="us-playlist-track-title">{track.title}</div>
                  <div className="us-playlist-track-artist">{track.artist}</div>
                </div>
                <div className="us-playlist-track-duration">{track.duration}</div>
              </div>
            ))}
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
            <div key={i} className="us-stat-card border border-[rgba(212,168,83,0.12)] bg-[rgba(18,18,22,0.4)] backdrop-filter blur-md p-5 rounded-2xl flex flex-col items-center text-center">
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

        <div 
          className={`us-jar-container us-reveal ${isJarAnimating ? "scale-90" : ""}`}
          onClick={handleJarClick}
        >
          <div className="us-jar-lid"></div>
          <div className="us-jar-body">
            <div className="us-jar-glow"></div>
            <div className="us-jar-hearts-inside">
              <div className="us-jar-heart-inside">❤️</div>
              <div className="us-jar-heart-inside">💖</div>
              <div className="us-jar-heart-inside">✨</div>
            </div>
          </div>
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
              <div className="p-5 border border-[rgba(212,168,83,0.15)] bg-[rgba(18,18,22,0.6)] backdrop-filter blur-md rounded-2xl animate-fade-in">
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
              <div className="us-parchment-scroll p-6 sm:p-10 border border-[rgba(212,168,83,0.2)] bg-[#1e1b15] text-[#362719] rounded-xl shadow-2xl relative text-left">
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
