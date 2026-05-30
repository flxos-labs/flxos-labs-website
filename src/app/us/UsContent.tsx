"use client";

import { useEffect, useState, useRef } from "react";
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
    date: "June 15, 2024",
    title: "Our Paths Align",
    desc: "A chance conversation that changed the course of our lives forever.",
    memory: "We talked about everything under the sun, and I knew right away you were incredibly special. The connection was instant and undeniable."
  },
  {
    date: "August 4, 2024",
    title: "The First Meet",
    desc: "Seeing you in person for the first time made my heart skip a beat.",
    memory: "The way you smiled when you saw me... I'll never forget that moment. Time seemed to stand completely still."
  },
  {
    date: "October 18, 2024",
    title: "Our Safe Haven",
    desc: "Realizing we'd found a home in each other, a quiet sanctuary from the noise of the world.",
    memory: "Rainy days, soft music, and feeling perfectly at peace holding your hand. Silence became our favorite language."
  },
  {
    date: "February 14, 2025",
    title: "Adventures & Laughter",
    desc: "Explores, inside jokes, and creating a lifetime of memories in every city we visited.",
    memory: "Taking photos, laughing until our stomachs hurt, and planning our next dream trip. Every journey is beautiful with you."
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
}

const TRACKS: Track[] = [
  { title: "Perfect", artist: "Ed Sheeran", duration: "4:23" },
  { title: "At Last", artist: "Etta James", duration: "3:00" },
  { title: "Make You Feel My Love", artist: "Adele", duration: "3:32" },
  { title: "Say You Won't Let Go", artist: "James Arthur", duration: "4:31" }
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

// Constellation star interface
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
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    const startDate = new Date("2024-06-15T00:00:00").getTime();

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

  // Music Player mock tracking
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setTrackProgress((prev) => {
          const track = TRACKS[currentTrackIndex];
          const [m, s] = track.duration.split(":").map(Number);
          const totalSec = m * 60 + s;
          if (prev >= totalSec) {
            // Move to next
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setTrackProgress(0);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setTrackProgress(0);
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

  // Render SVG connection lines for active stars
  const renderConstellationLines = () => {
    if (connectedStars.length < 2) return null;
    
    const lines: JSX.Element[] = [];
    for (let i = 0; i < connectedStars.length - 1; i++) {
      const fromStar = CONSTELLATION_STARS.find((s) => s.id === connectedStars[i]);
      const toStar = CONSTELLATION_STARS.find((s) => s.id === connectedStars[i + 1]);
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

    // Connect last star to first if fully connected to complete the shape
    if (constellationUnlocked) {
      const firstStar = CONSTELLATION_STARS.find((s) => s.id === connectedStars[0]);
      const lastStar = CONSTELLATION_STARS.find((s) => s.id === connectedStars[connectedStars.length - 1]);
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
    <div className="us-page bg-[#0a0a0c]">
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

        <div className="us-sky-canvas-wrapper us-reveal">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {renderConstellationLines()}
          </svg>

          {/* Render Star Dots */}
          {CONSTELLATION_STARS.map((star) => {
            const isConnected = connectedStars.includes(star.id);
            const isNextToConnect = connectedStars.length === 0 ? star.id === 1 : star.id === connectedStars[connectedStars.length - 1] + 1;
            
            return (
              <div
                key={star.id}
                className={`us-sky-star ${isConnected ? "connected" : ""} ${isNextToConnect ? "animate-pulse" : ""}`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: `translate(-50%, -50%) ${isConnected ? "scale(1.3)" : "scale(1)"}`,
                }}
                onClick={() => {
                  // Only allow connecting in order to make it a game
                  if (connectedStars.length === 0 && star.id === 1) {
                    handleStarClick(star.id);
                  } else if (connectedStars.length > 0 && connectedStars[connectedStars.length - 1] === star.id - 1) {
                    handleStarClick(star.id);
                  }
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

          <div className="us-playlist">
            <h3 className="font-display font-extrabold text-lg text-white mb-4 border-b border-[rgba(212,168,83,0.15)] pb-3 text-left">
              Playlist Records
            </h3>
            {TRACKS.map((track, index) => (
              <div 
                key={track.title}
                className={`us-playlist-track ${currentTrackIndex === index ? "active" : ""}`}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setTrackProgress(0);
                  setIsPlaying(true);
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
