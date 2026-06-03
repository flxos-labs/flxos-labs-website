import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const REASONS = [
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

const TIMELINE_EVENTS = [
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

const FUTURE_LETTER_CONTENT = `My Dearest Rekha,

As you read this scroll, know that my heart is, and will always be, anchored in yours. I wrote this message as a small promise to our future—a promise that no matter how many chapters we write, how many days pass, or how much the world changes around us, my devotion to you will remain constant.

I look forward to all the tomorrows we haven't seen yet. To the ordinary mornings, the sudden adventures, the quiet evenings, and the dreams we are building day by day. You are my greatest miracle in this vast universe, and I am infinitely grateful to walk this path hand-in-hand with you.

Yours forever and always,
Akash`;

const QUIZ_QUESTIONS = [
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

const FLIP_CARDS = [
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

const DEEP_QUESTIONS = [
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

const LOVE_STATS = [
  { label: "Days Admiring You", val: "100%", percent: 100, icon: "👀" },
  { label: "Laughter Shared", val: "Infinite", percent: 100, icon: "😂" },
  { label: "Tea Envisioned", val: "10,000+", percent: 95, icon: "☕" },
  { label: "Hugs Needed Daily", val: "∞", percent: 100, icon: "🤗" }
];

const ENVELOPE_LETTER_PARAGRAPHS = [
  "Rekha, from the moment our paths crossed, the world seemed to shift into a warmer, more vibrant focus. You brought a quiet grace and an undeniable magic into my life that I didn't know I was searching for, but now cannot imagine living without.",
  "In the noise of the everyday, you are my sanctuary. The ease with which we share both laughter and comfortable silence is a rare gift that I cherish more with each passing day. You have this beautiful way of turning ordinary moments into extraordinary memories.",
  "Thank you for being my constant anchor, my source of inspiration, and the keeper of my heart. I promise to stand by you through every season, celebrating your triumphs, supporting your dreams, and loving you more fiercely with every beat of my heart."
];

function verifyToken(token: string, secret: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length !== 2) return false;
    const [timestamp, signature] = parts;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(timestamp);
    const expectedSignature = hmac.digest("hex");

    const signatureBuffer = Buffer.from(signature, "utf-8");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "utf-8");

    if (signatureBuffer.length !== expectedSignatureBuffer.length) {
      return false;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
      return false;
    }

    // Check expiration (30 days validity)
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime)) return false;

    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTime > thirtyDaysMs) {
      return false; // Expired
    }

    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required." },
        { status: 400 }
      );
    }

    const secret = process.env.US_PAGE_PASSCODE;
    if (!secret) {
      console.error("US_PAGE_PASSCODE environment variable is not set.");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const isValid = verifyToken(token, secret);

    if (isValid) {
      return NextResponse.json(
        {
          success: true,
          data: {
            REASONS,
            TIMELINE_EVENTS,
            COMPLIMENTS,
            PROMISES,
            FUTURE_LETTER_CONTENT,
            QUIZ_QUESTIONS,
            FLIP_CARDS,
            DEEP_QUESTIONS,
            ORACLE_PREDICTIONS,
            LOVE_STATS,
            ENVELOPE_LETTER_PARAGRAPHS
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in content API:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
