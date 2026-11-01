/**
 * CAN WE GO ON A DATE? 💗
 * Full Interactive Valentine's Day Invitation & Private Owner Dashboard
 * Vanilla JavaScript (No React, No Frameworks, GitHub Pages Compatible)
 */

// ========================================================
// 1. DEFAULT CONFIGURATION & APPLICATION STATE
// ========================================================
const DEFAULT_CONFIG = {
  websiteTitle: "CAN WE GO ON A DATE? 💗",
  invitationHeading: "CAN WE GO ON A DATE?",
  invitationSubtitle: "I've been wanting to ask you something special. Sooo... 🥺",
  recipientName: "My Favorite Person",
  senderName: "Your Secret Admirer",
  btnYesLabel: "YES! 💗",
  btnNoLabel: "NO 😭",
  runawayMessages: [
    "HAHAHA! Too slow! 😂",
    "Oops! You missed me! 🏃",
    "You can't catch me! 🙈",
    "Are you really saying NO? 🥺",
    "The NO button is shy! 💗",
    "Waittt, think about it again! 😭",
    "Just click YES already! HAHAHA",
    "Love is calling! Answer it! 💘"
  ],
  loveLetter: {
    to: "To: My Favorite Person 💗",
    from: "With all my love,\nYour Secret Admirer ✨",
    body: `Ever since I met you, ordinary days became so much brighter and full of laughter.\n\nI've been looking forward to spending Valentine's Day with you, enjoying yummy food, sharing silly stories, and creating memories that make us smile for a long, long time.\n\nThank you for being so wonderful, kind, and uniquely you.`
  },
  celebrationTitle: "YAAAAAYYYYY! 💘",
  celebrationSubtitle: "IT'S A DATE!!!",
  celebrationText: "I'M SO HAPPY YOU SAID YES! 🥹💕\nNow comes the super fun part... let's design our dream date together!",
  colorTheme: "pink",
  activities: [
    { id: "coffee", label: "Coffee date", icon: "☕" },
    { id: "dinner", label: "Dinner date", icon: "🍝" },
    { id: "movie", label: "Movie date", icon: "🎬" },
    { id: "beach", label: "Beach date", icon: "🏖️" },
    { id: "picnic", label: "Picnic date", icon: "🧺" },
    { id: "arcade", label: "Arcade date", icon: "🎮" },
    { id: "mall", label: "Mall date", icon: "🛍️" },
    { id: "surprise", label: "Surprise me!", icon: "🎁" }
  ],
  foods: [
    { id: "pizza", label: "Pizza", icon: "🍕" },
    { id: "pasta", label: "Pasta", icon: "🍝" },
    { id: "burger", label: "Burger", icon: "🍔" },
    { id: "sushi", label: "Sushi", icon: "🍣" },
    { id: "icecream", label: "Ice cream", icon: "🍦" },
    { id: "cake", label: "Cake", icon: "🍰" }
  ],
  drinks: [
    { id: "coffee", label: "Coffee", icon: "☕" },
    { id: "milktea", label: "Milk tea", icon: "🧋" },
    { id: "matcha", label: "Matcha", icon: "🍵" },
    { id: "strawberry", label: "Strawberry drink", icon: "🍓" },
    { id: "juice", label: "Juice", icon: "🧃" }
  ],
  outfits: [
    { id: "casual", label: "Casual", icon: "👕" },
    { id: "cute", label: "Cute outfit", icon: "👗" },
    { id: "formal", label: "Formal", icon: "👔" },
    { id: "cozy", label: "Whatever makes you comfy", icon: "🧸" }
  ],
  quizQuestions: [
    {
      question: "What's your ideal date vibe?",
      options: ["Cozy café & deep chats ☕", "Candlelit romantic dinner 🍝", "Exciting arcade & games 🎮", "Sunset beach walk 🏖️"]
    },
    {
      question: "What's your favorite love language?",
      options: ["Quality time together ⏳", "Sweet little gifts & surprises 🎁", "Warm tight hugs & cuddles 🤗", "Words of affirmation & love notes 💌"]
    },
    {
      question: "What would you do if I surprised you?",
      options: ["Blush and give a huge hug 🥺", "Pretend to be shocked then laugh 😊", "Take a bunch of cute pictures 📸", "Melt completely on the spot 🫠"]
    },
    {
      question: "What's your favorite romantic activity?",
      options: ["Cooking yummy treats together 🍳", "Binge-watching movies bundled up 🍿", "Late night snack road trips 🚗", "Strolling under sparkling lights ✨"]
    },
    {
      question: "Choose one: sunset, stargazing, or rainy coffee date?",
      options: ["Golden hour beach sunset 🌅", "Blanket stargazing under constellations 🌌", "Warm rainy coffee shop corner 🌧️", "A cozy rooftop with fairy lights 🕯️"]
    }
  ]
};

// Global App State
let websiteConfig = { ...DEFAULT_CONFIG };
let visitorState = {
  responseType: "YES",
  visitorName: "",
  preferredDate: "",
  dateActivity: "Dinner date 🍝",
  foodChoice: "Pizza 🍕",
  drinkChoice: "Milk tea 🧋",
  outfitChoice: "Cute outfit 👗",
  personalMessage: "",
  quizAnswers: [],
  quizScore: 100
};

// Local storage keys
const STORAGE_KEYS = {
  CONFIG: "valentine_website_config_v1",
  SUPABASE_URL: "valentine_supabase_url",
  SUPABASE_KEY: "valentine_supabase_anon_key",
  LOCAL_RESPONSES: "valentine_local_responses_backup",
  AUTH_SESSION: "valentine_owner_session"
};

// Supabase client instance
let supabaseClient = null;
let currentOwnerUser = null;
let cachedResponses = [];
let activeInboxFilter = "all";
let activeInboxSearch = "";

// ========================================================
// 2. WEB AUDIO API SYNTHESIZER (No external audio files)
// ========================================================
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.initContext();
  }

  initContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !this.ctx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  ensureContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Soft wooden bubble pop
  playPop() {
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Playful slide whistle / boing when NO button flees
  playRunaway() {
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(740, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.28);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Romantic harp chord celebration fanfare
  playCelebration() {
    this.ensureContext();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.07;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }

  // Sweet chime for quiz selection
  playChime() {
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Paper rustle and chime when opening letter
  playEnvelope() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Soft chime
    [659.25, 880, 1318.51].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.09;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  // Gentle synthesized romantic lofi chord progression (Cmaj7 - Am7 - Fmaj7 - G7)
  toggleBgm() {
    this.ensureContext();
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  startBgm() {
    this.bgmPlaying = true;
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
      [174.61, 261.63, 329.63, 349.23], // Fmaj7 (F3, C4, E4, F4)
      [196.00, 246.94, 293.66, 349.23]  // G7 (G3, B3, D4, F4)
    ];
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = chords[chordIdx % chords.length];

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + i * 0.12;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.035, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 1.8);
      });

      chordIdx++;
    };

    playChordStep();
    this.bgmInterval = setInterval(playChordStep, 2400);
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

const audio = new SoundSynthesizer();

// ========================================================
// 3. BACKGROUND FLOATING HEARTS CANVAS ENGINE
// ========================================================
class FloatingHeartsCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.numParticles = 30;
    this.resize();
    this.init();
    window.addEventListener("resize", () => this.resize());
    this.animate();

    // Click/touch spawns extra hearts
    window.addEventListener("pointerdown", (e) => {
      this.spawnBurst(e.clientX, e.clientY);
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createHeart(true));
    }
  }

  createHeart(randomY = false) {
    const colors = [
      "rgba(251, 113, 133, ",  // rose
      "rgba(244, 63, 94, ",   // pink
      "rgba(249, 168, 212, ", // soft pink
      "rgba(216, 180, 254, "  // lavender
    ];
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 30,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 0.8 + 0.4,
      drift: (Math.random() - 0.5) * 0.5,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.25,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  spawnBurst(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size: Math.random() * 16 + 12,
        speedY: (Math.random() * 2 + 1) * -1,
        drift: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.05,
        opacity: 0.85,
        color: "rgba(225, 29, 72, "
      });
    }
  }

  drawHeartShape(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.y -= p.speedY;
      p.x += Math.sin(p.angle) * p.drift;
      p.angle += p.spinSpeed;

      this.ctx.save();
      this.ctx.fillStyle = `${p.color}${p.opacity})`;
      this.ctx.shadowColor = "rgba(255, 182, 193, 0.4)";
      this.ctx.shadowBlur = 8;
      this.drawHeartShape(this.ctx, p.x, p.y, p.size);
      this.ctx.restore();

      if (p.y < -40) {
        if (this.particles.length > this.numParticles) {
          this.particles.splice(i, 1);
        } else {
          this.particles[i] = this.createHeart(false);
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ========================================================
// 4. CELEBRATION CONFETTI CANVAS ENGINE
// ========================================================
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.confettiPieces = [];
    this.active = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(amount = 120) {
    this.active = true;
    const colors = ["#ff4d6d", "#f43f5e", "#fb7185", "#ffd166", "#fda4af", "#c084fc", "#ffffff"];

    for (let i = 0; i < amount; i++) {
      this.confettiPieces.push({
        x: this.canvas.width * (0.3 + Math.random() * 0.4),
        y: this.canvas.height * 0.4,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() * -14) - 6,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "heart"
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.animate();
    }
  }

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const h = size * 0.4;
    ctx.moveTo(x, y + h);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + h);
    ctx.bezierCurveTo(x - size / 2, y + (size + h) / 2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + h) / 2, x + size / 2, y + h);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + h);
    ctx.closePath();
    ctx.fill();
  }

  animate() {
    if (!this.active && this.confettiPieces.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animating = false;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
      const c = this.confettiPieces[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= 0.98;
      c.rotation += c.rotationSpeed;
      c.opacity -= 0.007;

      if (c.opacity <= 0 || c.y > this.canvas.height + 50) {
        this.confettiPieces.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, c.opacity);
      this.ctx.fillStyle = c.color;

      if (c.shape === "rect") {
        this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      } else {
        this.drawHeart(this.ctx, -c.size / 2, -c.size / 2, c.size);
      }

      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

let confettiEngine = null;

// ========================================================
// 5. RUNAWAY NO BUTTON CONTROLLER
// ========================================================
class RunawayButtonController {
  constructor() {
    this.btnNo = document.getElementById("btn-no-action");
    this.btnWrapper = document.getElementById("no-container");
    this.btnYes = document.getElementById("btn-yes-action");
    this.arena = document.getElementById("decision-arena");
    this.speechBubble = document.getElementById("runaway-bubble");
    this.counterEl = document.getElementById("escape-counter-text");
    this.pleaBanner = document.getElementById("plea-banner");

    this.escapeCount = 0;
    this.hasMoved = false;
    this.messages = [...websiteConfig.runawayMessages];

    this.initEvents();
  }

  initEvents() {
    if (!this.btnNo || !this.btnWrapper) return;

    // Desktop hover & approach detection
    this.arena.addEventListener("mousemove", (e) => this.handleApproach(e));

    // Direct pointer / hover / touch events
    this.btnNo.addEventListener("mouseenter", () => this.runAway());
    this.btnNo.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.runAway();
    });
    this.btnNo.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.runAway();
    }, { passive: false });

    // Click fallback
    this.btnNo.addEventListener("click", (e) => {
      e.preventDefault();
      this.runAway();
    });
  }

  handleApproach(e) {
    if (!this.btnNo) return;
    const rect = this.btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    // If mouse gets within 60px of the NO button center
    if (dist < 75) {
      this.runAway();
    }
  }

  runAway() {
    audio.playRunaway();
    this.escapeCount++;
    this.hasMoved = true;

    // Arena and bounds
    const arenaRect = this.arena.getBoundingClientRect();
    const yesRect = this.btnYes.getBoundingClientRect();
    const btnWidth = this.btnNo.offsetWidth || 110;
    const btnHeight = this.btnNo.offsetHeight || 50;

    // Mark as running (uses absolute positioning)
    this.btnNo.classList.add("running");

    // Container width and height
    const maxW = Math.max(arenaRect.width, 320);
    const maxH = Math.max(arenaRect.height, 140);

    let randomX = 0;
    let randomY = 0;
    let attempts = 0;
    let safe = false;

    // Find random safe coordinates inside arena that DO NOT overlap YES button
    while (!safe && attempts < 25) {
      attempts++;
      randomX = Math.floor(Math.random() * (maxW - btnWidth - 30)) + 15;
      randomY = Math.floor(Math.random() * (maxH - btnHeight - 30)) + 15;

      // Translate coordinates to screen to check distance from YES button
      const screenCandidateX = arenaRect.left + randomX + btnWidth / 2;
      const screenCandidateY = arenaRect.top + randomY + btnHeight / 2;
      const yesCenterX = yesRect.left + yesRect.width / 2;
      const yesCenterY = yesRect.top + yesRect.height / 2;

      const distFromYes = Math.hypot(screenCandidateX - yesCenterX, screenCandidateY - yesCenterY);

      // Distance from YES button must be at least 130px
      if (distFromYes > 130) {
        safe = true;
      }
    }

    // Set position
    this.btnNo.style.left = `${randomX}px`;
    this.btnNo.style.top = `${randomY}px`;

    // Show funny speech bubble
    const msg = this.messages[(this.escapeCount - 1) % this.messages.length];
    this.speechBubble.textContent = msg;
    this.speechBubble.style.display = "block";

    // Update escape count
    if (this.counterEl) {
      this.counterEl.textContent = `NO button escaped: ${this.escapeCount} times! 🏃💨`;
    }

    // After 5 escape attempts, show the special reconsideration plea
    if (this.escapeCount >= 5 && this.pleaBanner) {
      this.pleaBanner.style.display = "block";
      this.speechBubble.textContent = "Okay fineeee! I'll stop running... BUT WILL YOU RECONSIDER? 🥺💗";
    }
  }

  reset() {
    this.escapeCount = 0;
    this.hasMoved = false;
    this.btnNo.classList.remove("running");
    this.btnNo.style.left = "";
    this.btnNo.style.top = "";
    this.speechBubble.style.display = "none";
    if (this.counterEl) this.counterEl.textContent = "";
    if (this.pleaBanner) this.pleaBanner.style.display = "none";
  }
}

let runawayController = null;

// ========================================================
// 6. LOVE QUIZ ENGINE
// ========================================================
class LoveQuizController {
  constructor() {
    this.currentQuestionIdx = 0;
    this.answers = [];
    this.questions = websiteConfig.quizQuestions;

    this.counterEl = document.getElementById("quiz-counter-display");
    this.questionEl = document.getElementById("quiz-question-text");
    this.optionsContainer = document.getElementById("quiz-options-list");
    this.progressBar = document.getElementById("quiz-progress-bar");
    this.cardEl = document.getElementById("quiz-question-card");
    this.resultBox = document.getElementById("quiz-result-box");
    this.navRow = document.getElementById("quiz-nav-row");

    this.btnRetake = document.getElementById("btn-quiz-retake");
    this.btnContinue = document.getElementById("btn-quiz-continue");

    if (this.btnRetake) {
      this.btnRetake.addEventListener("click", () => this.restartQuiz());
    }
    if (this.btnContinue) {
      this.btnContinue.addEventListener("click", () => {
        audio.playPop();
        navigateToStep(4);
      });
    }
  }

  load() {
    this.questions = websiteConfig.quizQuestions;
    this.currentQuestionIdx = 0;
    this.answers = [];
    this.showQuestion();
    if (this.cardEl) this.cardEl.style.display = "block";
    if (this.resultBox) this.resultBox.style.display = "none";
    if (this.navRow) this.navRow.style.display = "flex";
  }

  showQuestion() {
    if (this.currentQuestionIdx >= this.questions.length) {
      this.showResults();
      return;
    }

    const q = this.questions[this.currentQuestionIdx];
    this.counterEl.textContent = `Question ${this.currentQuestionIdx + 1} of ${this.questions.length}`;
    this.questionEl.textContent = q.question;

    const progress = ((this.currentQuestionIdx + 1) / this.questions.length) * 100;
    this.progressBar.style.width = `${progress}%`;

    this.optionsContainer.innerHTML = "";
    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.innerHTML = `<span>${optText}</span> <span>👉</span>`;
      btn.addEventListener("click", () => this.selectAnswer(optText, btn));
      this.optionsContainer.appendChild(btn);
    });
  }

  selectAnswer(answerText, btnElement) {
    audio.playChime();
    btnElement.classList.add("selected");
    btnElement.innerHTML = `<span>${answerText}</span> <span>💗</span>`;

    this.answers.push({
      question: this.questions[this.currentQuestionIdx].question,
      answer: answerText
    });

    visitorState.quizAnswers = this.answers;

    // Smooth transition to next question
    setTimeout(() => {
      this.currentQuestionIdx++;
      this.showQuestion();
    }, 380);
  }

  showResults() {
    audio.playCelebration();
    confettiEngine.burst(50);

    if (this.cardEl) this.cardEl.style.display = "none";
    if (this.resultBox) this.resultBox.style.display = "block";
    if (this.navRow) this.navRow.style.display = "none";

    visitorState.quizScore = 100;
    const badge = document.getElementById("quiz-score-badge");
    const summary = document.getElementById("quiz-result-summary");

    if (badge) badge.textContent = "100% Soulmate Match! 💘";
    if (summary) {
      summary.innerHTML = `Based on your romantic answers, our chemistry is through the roof! Every detail points to an extraordinary Valentine's Day. ✨`;
    }
  }

  restartQuiz() {
    audio.playPop();
    this.load();
  }
}

let quizController = null;

// ========================================================
// 7. STEPPER & PAGE NAVIGATION
// ========================================================
function navigateToStep(stepNumber) {
  // Update step indicators
  document.querySelectorAll(".step-indicator").forEach((el) => {
    const s = parseInt(el.getAttribute("data-step"), 10);
    el.classList.remove("active", "completed");
    if (s === stepNumber) {
      el.classList.add("active");
    } else if (s < stepNumber) {
      el.classList.add("completed");
    }
  });

  // Toggle active section
  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.remove("active");
  });

  const targetSec = document.getElementById(`page-${stepNumber}`);
  if (targetSec) {
    targetSec.classList.add("active");
  }

  // Scroll to top of view
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Hook step specifics
  if (stepNumber === 3 && quizController) {
    quizController.load();
  } else if (stepNumber === 5) {
    renderConfirmationTicket();
  }
}

// ========================================================
// 8. DATE PLANNER LOGIC & DOM POPULATION
// ========================================================
function renderPlannerChoices() {
  // Activities Grid
  const actGrid = document.getElementById("grid-activities");
  if (actGrid) {
    actGrid.innerHTML = "";
    websiteConfig.activities.forEach((act) => {
      const card = document.createElement("div");
      card.className = `choice-card ${visitorState.dateActivity === `${act.label} ${act.icon}` ? "selected" : ""}`;
      card.innerHTML = `
        <div class="choice-icon">${act.icon}</div>
        <div class="choice-text">${act.label}</div>
        <div class="choice-check">✓</div>
      `;
      card.addEventListener("click", () => {
        audio.playPop();
        actGrid.querySelectorAll(".choice-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        visitorState.dateActivity = `${act.label} ${act.icon}`;
      });
      actGrid.appendChild(card);
    });
  }

  // Foods Grid
  const foodGrid = document.getElementById("grid-foods");
  if (foodGrid) {
    foodGrid.innerHTML = "";
    websiteConfig.foods.forEach((f) => {
      const card = document.createElement("div");
      card.className = `choice-card ${visitorState.foodChoice === `${f.label} ${f.icon}` ? "selected" : ""}`;
      card.innerHTML = `
        <div class="choice-icon">${f.icon}</div>
        <div class="choice-text">${f.label}</div>
        <div class="choice-check">✓</div>
      `;
      card.addEventListener("click", () => {
        audio.playPop();
        foodGrid.querySelectorAll(".choice-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        visitorState.foodChoice = `${f.label} ${f.icon}`;
      });
      foodGrid.appendChild(card);
    });
  }

  // Drinks Grid
  const drinkGrid = document.getElementById("grid-drinks");
  if (drinkGrid) {
    drinkGrid.innerHTML = "";
    websiteConfig.drinks.forEach((d) => {
      const card = document.createElement("div");
      card.className = `choice-card ${visitorState.drinkChoice === `${d.label} ${d.icon}` ? "selected" : ""}`;
      card.innerHTML = `
        <div class="choice-icon">${d.icon}</div>
        <div class="choice-text">${d.label}</div>
        <div class="choice-check">✓</div>
      `;
      card.addEventListener("click", () => {
        audio.playPop();
        drinkGrid.querySelectorAll(".choice-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        visitorState.drinkChoice = `${d.label} ${d.icon}`;
      });
      drinkGrid.appendChild(card);
    });
  }

  // Outfits Grid
  const outfitGrid = document.getElementById("grid-outfits");
  if (outfitGrid) {
    outfitGrid.innerHTML = "";
    websiteConfig.outfits.forEach((o) => {
      const card = document.createElement("div");
      card.className = `choice-card ${visitorState.outfitChoice === `${o.label} ${o.icon}` ? "selected" : ""}`;
      card.innerHTML = `
        <div class="choice-icon">${o.icon}</div>
        <div class="choice-text">${o.label}</div>
        <div class="choice-check">✓</div>
      `;
      card.addEventListener("click", () => {
        audio.playPop();
        outfitGrid.querySelectorAll(".choice-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        visitorState.outfitChoice = `${o.label} ${o.icon}`;
      });
      outfitGrid.appendChild(card);
    });
  }

  // Set min date to today
  const dateInput = document.getElementById("preferred-date-input");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    if (!dateInput.value) {
      dateInput.value = today;
      visitorState.preferredDate = today;
    }
  }
}

// ========================================================
// 9. SECRET LOVE LETTER INTERACTION
// ========================================================
function setupSecretLetter() {
  const envelopeTrigger = document.getElementById("envelope-trigger");
  const envelopeObj = document.getElementById("envelope-object");
  const letterSheet = document.getElementById("unfolded-letter-view");

  if (!envelopeTrigger || !envelopeObj || !letterSheet) return;

  envelopeTrigger.addEventListener("click", () => {
    if (!envelopeObj.classList.contains("open")) {
      audio.playEnvelope();
      envelopeObj.classList.add("open");
      letterSheet.style.display = "block";
      confettiEngine.burst(35);
    }
  });

  const btnLetterContinue = document.getElementById("btn-letter-continue");
  if (btnLetterContinue) {
    btnLetterContinue.addEventListener("click", () => {
      audio.playPop();
      navigateToStep(5);
    });
  }
}

// ========================================================
// 10. FINAL DATE CONFIRMATION TICKET & SUBMISSION
// ========================================================
function renderConfirmationTicket() {
  const visitorNameInput = document.getElementById("visitor-name");
  const dateInput = document.getElementById("preferred-date-input");
  const msgInput = document.getElementById("personal-message-input");

  if (visitorNameInput) visitorState.visitorName = visitorNameInput.value.trim() || "My Special Guest";
  if (dateInput) visitorState.preferredDate = dateInput.value || "Anyday with you";
  if (msgInput) visitorState.personalMessage = msgInput.value.trim();

  document.getElementById("summary-visitor-name").textContent = visitorState.visitorName;
  document.getElementById("summary-preferred-date").textContent = visitorState.preferredDate;
  document.getElementById("summary-activity").textContent = visitorState.dateActivity;
  document.getElementById("summary-food").textContent = visitorState.foodChoice;
  document.getElementById("summary-drink").textContent = visitorState.drinkChoice;
  document.getElementById("summary-outfit").textContent = visitorState.outfitChoice;

  const noteEl = document.getElementById("summary-personal-message");
  if (noteEl) {
    noteEl.textContent = visitorState.personalMessage ? `“${visitorState.personalMessage}”` : "No extra note added, just pure excitement!";
  }
}

async function handleFinalSubmission() {
  const visitorNameInput = document.getElementById("visitor-name");
  const dateInput = document.getElementById("preferred-date-input");
  const msgInput = document.getElementById("personal-message-input");
  const errBanner = document.getElementById("submission-error-banner");

  if (errBanner) errBanner.style.display = "none";

  const vName = visitorNameInput ? visitorNameInput.value.trim() : "";
  if (!vName) {
    if (errBanner) {
      errBanner.textContent = "Please enter your name or nickname on Step 2 before submitting! 🥺";
      errBanner.style.display = "block";
    }
    navigateToStep(2);
    if (visitorNameInput) visitorNameInput.focus();
    return;
  }

  visitorState.visitorName = vName;
  if (dateInput) visitorState.preferredDate = dateInput.value;
  if (msgInput) visitorState.personalMessage = msgInput.value.trim();

  const submitBtn = document.getElementById("btn-submit-final-response");
  const submitText = document.getElementById("submit-btn-text");
  const submitSpinner = document.getElementById("submit-btn-spinner");

  // Prevent duplicate submissions & show loading
  submitBtn.disabled = true;
  submitText.textContent = "Sealing & Sending to Owner... 💌";
  submitSpinner.style.display = "inline";

  const responsePayload = {
    visitor_name: visitorState.visitorName,
    response_type: visitorState.responseType || "YES",
    date_activity: visitorState.dateActivity,
    food_choice: visitorState.foodChoice,
    drink_choice: visitorState.drinkChoice,
    outfit_choice: visitorState.outfitChoice,
    preferred_date: visitorState.preferredDate,
    personal_message: visitorState.personalMessage,
    quiz_summary: visitorState.quizAnswers.map(a => `${a.question}: ${a.answer}`).join(" | ") || "100% Soulmate Match",
    is_read: false,
    created_at: new Date().toISOString()
  };

  let savedSuccessfully = false;
  let backendErrorMessage = "";

  // 1. Try Supabase if configured
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("responses")
        .insert([responsePayload])
        .select();

      if (error) {
        backendErrorMessage = error.message;
        console.warn("Supabase insert error:", error);
      } else {
        savedSuccessfully = true;
      }
    } catch (err) {
      backendErrorMessage = err.message || "Network error connecting to Supabase.";
      console.warn("Supabase network exception:", err);
    }
  }

  // 2. Always store locally in backup buffer as well
  saveResponseToLocalBackup(responsePayload);

  // If Supabase wasn't configured or gave error
  if (!savedSuccessfully && !supabaseClient) {
    // If Supabase is not configured yet, save to local buffer and inform honestly
    savedSuccessfully = true; // Still show success with transparent note
  }

  // Reset button state
  submitBtn.disabled = false;
  submitText.textContent = "SUBMIT MY RESPONSE 💌";
  submitSpinner.style.display = "none";

  if (savedSuccessfully) {
    audio.playCelebration();
    confettiEngine.burst(150);

    document.getElementById("printable-ticket").style.display = "none";
    document.getElementById("submission-action-buttons").style.display = "none";
    document.getElementById("submission-success-card").style.display = "block";

    // Refresh inbox if owner window is active
    fetchInboxResponses();
  } else {
    if (errBanner) {
      errBanner.textContent = `Could not submit to cloud: ${backendErrorMessage}. Please retry or notify the owner!`;
      errBanner.style.display = "block";
    }
  }
}

// Local backup helper
function saveResponseToLocalBackup(item) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RESPONSES) || "[]");
    list.unshift({ ...item, id: item.id || `local-${Date.now()}` });
    localStorage.setItem(STORAGE_KEYS.LOCAL_RESPONSES, JSON.stringify(list));
  } catch (e) {
    console.error("Local storage save error:", e);
  }
}

function getLocalResponses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RESPONSES) || "[]");
  } catch (e) {
    return [];
  }
}

// ========================================================
// 11. SUPABASE CLIENT & AUTH INITIALIZATION
// ========================================================
function initSupabase() {
  const savedUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || "";
  const savedKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || "";

  const urlInput = document.getElementById("supabase-cfg-url");
  const keyInput = document.getElementById("supabase-cfg-key");
  const statusEl = document.getElementById("supabase-status-indicator");

  if (urlInput) urlInput.value = savedUrl;
  if (keyInput) keyInput.value = savedKey;

  if (savedUrl && savedKey && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(savedUrl, savedKey);
      if (statusEl) {
        statusEl.innerHTML = `🟢 Connected to Supabase Cloud (${savedUrl.substring(0, 28)}...)`;
        statusEl.style.color = "#16a34a";
      }

      // Check current session
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          currentOwnerUser = session.user;
          showAdminDashboard();
        }
      });

      // Setup Realtime listener for incoming responses
      setupSupabaseRealtime();
    } catch (e) {
      console.warn("Supabase client init failed:", e);
      if (statusEl) {
        statusEl.innerHTML = `⚠️ Invalid Supabase URL or Key`;
        statusEl.style.color = "#dc2626";
      }
    }
  } else {
    if (statusEl) {
      statusEl.innerHTML = `● Local Buffer Active (Enter Supabase credentials above to enable cloud sync)`;
      statusEl.style.color = "#0284c7";
    }
  }
}

function setupSupabaseRealtime() {
  if (!supabaseClient) return;

  try {
    supabaseClient
      .channel("public:responses")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "responses" }, (payload) => {
        audio.playCelebration();
        fetchInboxResponses();
      })
      .subscribe();
  } catch (e) {
    console.warn("Realtime channel subscription error:", e);
  }
}

// ========================================================
// 12. OWNER ADMIN DASHBOARD & INBOX LOGIC
// ========================================================
function setupAdminDashboard() {
  const modal = document.getElementById("modal-admin");
  const btnOpen = document.getElementById("btn-open-admin");
  const btnFooterOpen = document.getElementById("footer-btn-admin");
  const btnClose = document.getElementById("btn-close-admin-modal");

  const openModal = () => {
    audio.playPop();
    modal.classList.add("show");
    checkOwnerAuth();
  };

  if (btnOpen) btnOpen.addEventListener("click", openModal);
  if (btnFooterOpen) btnFooterOpen.addEventListener("click", openModal);
  if (btnClose) btnClose.addEventListener("click", () => modal.classList.remove("show"));

  // Also setup Guide button in footer
  const btnGuide = document.getElementById("footer-btn-guide");
  if (btnGuide) {
    btnGuide.addEventListener("click", () => {
      openModal();
      switchAdminTab("tab-database");
    });
  }

  // Admin tabs switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      audio.playPop();
      const tabId = btn.getAttribute("data-tab");
      switchAdminTab(tabId);
    });
  });

  // Supabase Config Save
  const btnSaveCfg = document.getElementById("btn-save-supabase-config");
  if (btnSaveCfg) {
    btnSaveCfg.addEventListener("click", () => {
      const url = document.getElementById("supabase-cfg-url").value.trim();
      const key = document.getElementById("supabase-cfg-key").value.trim();

      localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url);
      localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key);

      initSupabase();
      alert("Supabase credentials saved successfully! 💗");
      fetchInboxResponses();
    });
  }

  // Copy SQL button
  const btnCopySql = document.getElementById("btn-copy-sql");
  if (btnCopySql) {
    btnCopySql.addEventListener("click", () => {
      const code = document.getElementById("sql-schema-code").innerText;
      navigator.clipboard.writeText(code).then(() => {
        btnCopySql.textContent = "Copied! ✓";
        setTimeout(() => (btnCopySql.textContent = "Copy SQL"), 2000);
      });
    });
  }

  // Auth Form (Sign In / Sign Up)
  const authForm = document.getElementById("owner-login-form");
  const btnSignIn = document.getElementById("btn-owner-signin");
  const btnSignUp = document.getElementById("btn-owner-signup");
  const btnDirectAccess = document.getElementById("btn-test-preview-owner");
  const authErr = document.getElementById("auth-error-msg");

  if (btnSignIn) {
    btnSignIn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("owner-email").value.trim();
      const pass = document.getElementById("owner-password").value.trim();
      if (!email || !pass) {
        authErr.textContent = "Please enter both email and password.";
        authErr.style.display = "block";
        return;
      }

      if (supabaseClient) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
        if (error) {
          authErr.textContent = error.message;
          authErr.style.display = "block";
        } else {
          currentOwnerUser = data.user;
          authErr.style.display = "none";
          showAdminDashboard();
        }
      } else {
        // Direct local login
        currentOwnerUser = { email };
        showAdminDashboard();
      }
    });
  }

  if (btnSignUp) {
    btnSignUp.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("owner-email").value.trim();
      const pass = document.getElementById("owner-password").value.trim();
      if (!email || !pass) {
        authErr.textContent = "Please enter email and password to create account.";
        authErr.style.display = "block";
        return;
      }

      if (supabaseClient) {
        const { data, error } = await supabaseClient.auth.signUp({ email, password: pass });
        if (error) {
          authErr.textContent = error.message;
          authErr.style.display = "block";
        } else {
          alert("Account created! Please check your email or log in.");
        }
      } else {
        currentOwnerUser = { email };
        showAdminDashboard();
      }
    });
  }

  if (btnDirectAccess) {
    btnDirectAccess.addEventListener("click", () => {
      currentOwnerUser = { email: "owner@valentine.love" };
      showAdminDashboard();
    });
  }

  // Inbox Filters
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeInboxFilter = chip.getAttribute("data-filter");
      renderInboxItems();
    });
  });

  // Inbox Search
  const searchInput = document.getElementById("inbox-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeInboxSearch = e.target.value.toLowerCase().trim();
      renderInboxItems();
    });
  }

  // Refresh button
  const btnRefresh = document.getElementById("btn-refresh-inbox");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      audio.playPop();
      fetchInboxResponses();
    });
  }

  // Export CSV
  const btnExport = document.getElementById("btn-export-csv");
  if (btnExport) {
    btnExport.addEventListener("click", () => exportResponsesToCSV());
  }

  // Customizer live form
  setupCustomizerForm();
}

function checkOwnerAuth() {
  if (currentOwnerUser) {
    showAdminDashboard();
  } else {
    document.getElementById("admin-auth-gate").style.display = "block";
    document.getElementById("admin-dashboard-view").style.display = "none";
  }
}

function showAdminDashboard() {
  document.getElementById("admin-auth-gate").style.display = "none";
  document.getElementById("admin-dashboard-view").style.display = "block";
  fetchInboxResponses();
}

function switchAdminTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.id === tabId);
  });
}

// ========================================================
// 13. INBOX DATA FETCHING, FILTERING & CSV EXPORT
// ========================================================
async function fetchInboxResponses() {
  let responses = [];

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        responses = data;
      } else {
        console.warn("Supabase fetch error, fallback to local:", error);
        responses = getLocalResponses();
      }
    } catch (err) {
      responses = getLocalResponses();
    }
  } else {
    responses = getLocalResponses();
  }

  cachedResponses = responses;
  updateDashboardStats(responses);
  renderInboxItems();
}

function updateDashboardStats(responses) {
  const total = responses.length;
  const yes = responses.filter((r) => r.response_type === "YES").length;
  const maybe = responses.filter((r) => r.response_type === "MAYBE").length;
  const unread = responses.filter((r) => !r.is_read).length;

  document.getElementById("stat-total-responses").textContent = total;
  document.getElementById("stat-yes-responses").textContent = yes;
  document.getElementById("stat-maybe-responses").textContent = maybe;
  document.getElementById("stat-unread-responses").textContent = unread;

  // Header and Tab Badges
  const badge = document.getElementById("unread-counter-badge");
  const tabBadge = document.getElementById("tab-inbox-badge");

  if (unread > 0) {
    if (badge) {
      badge.textContent = unread;
      badge.style.display = "grid";
    }
    if (tabBadge) {
      tabBadge.textContent = unread;
      tabBadge.style.display = "grid";
    }
  } else {
    if (badge) badge.style.display = "none";
    if (tabBadge) tabBadge.style.display = "none";
  }

  // Analytics breakdown
  if (responses.length > 0) {
    const activityCounts = {};
    const foodCounts = {};
    const drinkCounts = {};
    const outfitCounts = {};

    responses.forEach((r) => {
      if (r.date_activity) activityCounts[r.date_activity] = (activityCounts[r.date_activity] || 0) + 1;
      if (r.food_choice) foodCounts[r.food_choice] = (foodCounts[r.food_choice] || 0) + 1;
      if (r.drink_choice) drinkCounts[r.drink_choice] = (drinkCounts[r.drink_choice] || 0) + 1;
      if (r.outfit_choice) outfitCounts[r.outfit_choice] = (outfitCounts[r.outfit_choice] || 0) + 1;
    });

    const getTop = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || "None yet";

    document.getElementById("analytics-top-activity").textContent = getTop(activityCounts);
    document.getElementById("analytics-top-food").textContent = getTop(foodCounts);
    document.getElementById("analytics-top-drink").textContent = getTop(drinkCounts);
    document.getElementById("analytics-top-outfit").textContent = getTop(outfitCounts);

    const feed = document.getElementById("recent-activity-feed");
    if (feed) {
      feed.innerHTML = responses.slice(0, 5).map(r => `
        <div style="background:white; padding:10px 14px; border-radius:12px; border:1px solid var(--pink-200); display:flex; justify-content:space-between;">
          <span>💌 <strong>${escapeHtml(r.visitor_name)}</strong> said <strong>${r.response_type}</strong>! (${escapeHtml(r.date_activity || '')})</span>
          <span style="font-size:0.8rem; color:var(--text-light);">${new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `).join("");
    }
  }
}

function renderInboxItems() {
  const container = document.getElementById("inbox-messages-container");
  if (!container) return;

  let filtered = [...cachedResponses];

  if (activeInboxFilter === "unread") {
    filtered = filtered.filter((r) => !r.is_read);
  } else if (activeInboxFilter === "yes") {
    filtered = filtered.filter((r) => r.response_type === "YES");
  } else if (activeInboxFilter === "maybe") {
    filtered = filtered.filter((r) => r.response_type === "MAYBE");
  }

  if (activeInboxSearch) {
    filtered = filtered.filter((r) =>
      (r.visitor_name && r.visitor_name.toLowerCase().includes(activeInboxSearch)) ||
      (r.personal_message && r.personal_message.toLowerCase().includes(activeInboxSearch))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💌</div>
        <h4>No responses found</h4>
        <p>Once your visitors submit their answers, they will show up here in real time!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  filtered.forEach((item) => {
    const el = document.createElement("div");
    el.className = `inbox-item ${!item.is_read ? "unread" : ""}`;

    const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently";

    el.innerHTML = `
      <div class="inbox-item-left">
        ${!item.is_read ? '<div class="status-unread-dot" title="Unread"></div>' : ""}
        <div>
          <div class="inbox-visitor-name">${escapeHtml(item.visitor_name)}</div>
          <div style="font-size:0.85rem; color:var(--text-muted); display:flex; gap:8px; align-items:center; margin-top:2px;">
            <span class="inbox-date-badge">${escapeHtml(item.response_type)}</span>
            <span>📅 ${escapeHtml(item.preferred_date || "No date")}</span>
            <span>🎡 ${escapeHtml(item.date_activity || "")}</span>
          </div>
        </div>
      </div>
      <div class="inbox-item-right">
        <span class="inbox-time">${dateStr}</span>
        <div class="inbox-actions">
          <button class="btn-tbl-action btn-view-item" title="View Details">👁️ View</button>
          <button class="btn-tbl-action btn-toggle-read" title="Toggle read/unread">${item.is_read ? "Mark Unread" : "Mark Read"}</button>
          <button class="btn-tbl-action danger btn-del-item" title="Delete Response">🗑️</button>
        </div>
      </div>
    `;

    // View detail
    el.querySelector(".btn-view-item").addEventListener("click", (e) => {
      e.stopPropagation();
      openResponseDetail(item);
    });

    // Toggle read
    el.querySelector(".btn-toggle-read").addEventListener("click", async (e) => {
      e.stopPropagation();
      toggleResponseReadStatus(item);
    });

    // Delete
    el.querySelector(".btn-del-item").addEventListener("click", async (e) => {
      e.stopPropagation();
      deleteResponseItem(item);
    });

    el.addEventListener("click", () => openResponseDetail(item));

    container.appendChild(el);
  });
}

function openResponseDetail(item) {
  audio.playPop();
  const detailModal = document.getElementById("inbox-detail-modal");
  if (!detailModal) return;

  document.getElementById("detail-name").textContent = `${item.visitor_name} (${item.response_type})`;
  document.getElementById("detail-timestamp").textContent = `Submitted on ${new Date(item.created_at).toLocaleString()}`;

  const grid = document.getElementById("detail-grid");
  grid.innerHTML = `
    <div class="ticket-item">
      <div class="ticket-label"><span>📅</span> Chosen Date</div>
      <div class="ticket-val">${escapeHtml(item.preferred_date || "Not specified")}</div>
    </div>
    <div class="ticket-item">
      <div class="ticket-label"><span>🎡</span> Date Activity</div>
      <div class="ticket-val">${escapeHtml(item.date_activity || "None")}</div>
    </div>
    <div class="ticket-item">
      <div class="ticket-label"><span>🍽️</span> Food Choice</div>
      <div class="ticket-val">${escapeHtml(item.food_choice || "None")}</div>
    </div>
    <div class="ticket-item">
      <div class="ticket-label"><span>🧋</span> Drink Choice</div>
      <div class="ticket-val">${escapeHtml(item.drink_choice || "None")}</div>
    </div>
    <div class="ticket-item">
      <div class="ticket-label"><span>👗</span> Outfit Style</div>
      <div class="ticket-val">${escapeHtml(item.outfit_choice || "None")}</div>
    </div>
    <div class="ticket-item">
      <div class="ticket-label"><span>💘</span> Quiz Summary</div>
      <div class="ticket-val">${escapeHtml(item.quiz_summary || "100% Match")}</div>
    </div>
  `;

  document.getElementById("detail-note").textContent = item.personal_message ? `“${item.personal_message}”` : "No sweet message included.";

  detailModal.style.display = "block";

  // Mark as read automatically when opened
  if (!item.is_read) {
    toggleResponseReadStatus(item, true);
  }

  // Detail buttons
  const btnToggle = document.getElementById("btn-detail-toggle-read");
  btnToggle.onclick = () => toggleResponseReadStatus(item);

  const btnDel = document.getElementById("btn-detail-delete");
  btnDel.onclick = () => {
    deleteResponseItem(item);
    detailModal.style.display = "none";
  };

  const btnClose = document.getElementById("btn-close-detail");
  btnClose.onclick = () => (detailModal.style.display = "none");
}

async function toggleResponseReadStatus(item, forceRead = null) {
  const newStatus = forceRead !== null ? forceRead : !item.is_read;
  item.is_read = newStatus;

  if (supabaseClient && item.id && !item.id.toString().startsWith("local-")) {
    await supabaseClient.from("responses").update({ is_read: newStatus }).eq("id", item.id);
  }

  // Update local storage too
  const localList = getLocalResponses();
  const idx = localList.findIndex((r) => r.id === item.id);
  if (idx !== -1) {
    localList[idx].is_read = newStatus;
    localStorage.setItem(STORAGE_KEYS.LOCAL_RESPONSES, JSON.stringify(localList));
  }

  updateDashboardStats(cachedResponses);
  renderInboxItems();
}

async function deleteResponseItem(item) {
  if (!confirm(`Are you sure you want to delete the response from "${item.visitor_name}"?`)) return;

  if (supabaseClient && item.id && !item.id.toString().startsWith("local-")) {
    await supabaseClient.from("responses").delete().eq("id", item.id);
  }

  // Remove from local list
  const localList = getLocalResponses().filter((r) => r.id !== item.id);
  localStorage.setItem(STORAGE_KEYS.LOCAL_RESPONSES, JSON.stringify(localList));

  cachedResponses = cachedResponses.filter((r) => r.id !== item.id);
  updateDashboardStats(cachedResponses);
  renderInboxItems();
}

function exportResponsesToCSV() {
  if (cachedResponses.length === 0) {
    alert("No responses available to export!");
    return;
  }

  const headers = [
    "Visitor Name",
    "Response Type",
    "Date Activity",
    "Food Choice",
    "Drink Choice",
    "Outfit Choice",
    "Preferred Date",
    "Personal Message",
    "Quiz Summary",
    "Read Status",
    "Submission Timestamp"
  ];

  const rows = cachedResponses.map((r) => [
    `"${(r.visitor_name || "").replace(/"/g, '""')}"`,
    `"${(r.response_type || "").replace(/"/g, '""')}"`,
    `"${(r.date_activity || "").replace(/"/g, '""')}"`,
    `"${(r.food_choice || "").replace(/"/g, '""')}"`,
    `"${(r.drink_choice || "").replace(/"/g, '""')}"`,
    `"${(r.outfit_choice || "").replace(/"/g, '""')}"`,
    `"${(r.preferred_date || "").replace(/"/g, '""')}"`,
    `"${(r.personal_message || "").replace(/"/g, '""')}"`,
    `"${(r.quiz_summary || "").replace(/"/g, '""')}"`,
    r.is_read ? "Read" : "Unread",
    `"${r.created_at || ""}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `valentine_responses_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ========================================================
// 14. WEBSITE CUSTOMIZATION CONTROLLER
// ========================================================
function setupCustomizerForm() {
  const form = document.getElementById("customizer-form");
  if (!form) return;

  // Populate form with current values
  const recInput = document.getElementById("cust-recipient-name");
  const senderInput = document.getElementById("cust-sender-name");
  const headInput = document.getElementById("cust-heading");
  const subInput = document.getElementById("cust-subtitle");
  const yesInput = document.getElementById("cust-btn-yes");
  const noInput = document.getElementById("cust-btn-no");
  const runawayInput = document.getElementById("cust-runaway-messages");
  const letterInput = document.getElementById("cust-love-letter");
  const themeInput = document.getElementById("cust-color-theme");
  const celebInput = document.getElementById("cust-celeb-title");

  if (recInput) recInput.value = websiteConfig.recipientName;
  if (senderInput) senderInput.value = websiteConfig.senderName;
  if (headInput) headInput.value = websiteConfig.invitationHeading;
  if (subInput) subInput.value = websiteConfig.invitationSubtitle;
  if (yesInput) yesInput.value = websiteConfig.btnYesLabel;
  if (noInput) noInput.value = websiteConfig.btnNoLabel;
  if (runawayInput) runawayInput.value = websiteConfig.runawayMessages.join("\n");
  if (letterInput) letterInput.value = websiteConfig.loveLetter.body;
  if (themeInput) themeInput.value = websiteConfig.colorTheme;
  if (celebInput) celebInput.value = websiteConfig.celebrationTitle;

  // Live preview button
  const btnPreview = document.getElementById("btn-preview-customization");
  if (btnPreview) {
    btnPreview.addEventListener("click", () => {
      applyCustomizationFromForm(false);
      document.getElementById("modal-admin").classList.remove("show");
    });
  }

  // Save form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    applyCustomizationFromForm(true);
    alert("Website customizations saved and published! 💗");
    document.getElementById("modal-admin").classList.remove("show");
  });
}

function applyCustomizationFromForm(persist = true) {
  const rec = document.getElementById("cust-recipient-name").value.trim() || DEFAULT_CONFIG.recipientName;
  const sender = document.getElementById("cust-sender-name").value.trim() || DEFAULT_CONFIG.senderName;
  const head = document.getElementById("cust-heading").value.trim() || DEFAULT_CONFIG.invitationHeading;
  const sub = document.getElementById("cust-subtitle").value.trim() || DEFAULT_CONFIG.invitationSubtitle;
  const yes = document.getElementById("cust-btn-yes").value.trim() || DEFAULT_CONFIG.btnYesLabel;
  const no = document.getElementById("cust-btn-no").value.trim() || DEFAULT_CONFIG.btnNoLabel;
  const runawayRaw = document.getElementById("cust-runaway-messages").value.trim();
  const letterBody = document.getElementById("cust-love-letter").value.trim() || DEFAULT_CONFIG.loveLetter.body;
  const theme = document.getElementById("cust-color-theme").value;
  const celeb = document.getElementById("cust-celeb-title").value.trim() || DEFAULT_CONFIG.celebrationTitle;

  const runawayList = runawayRaw
    ? runawayRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_CONFIG.runawayMessages;

  websiteConfig.recipientName = rec;
  websiteConfig.senderName = sender;
  websiteConfig.invitationHeading = head;
  websiteConfig.invitationSubtitle = sub;
  websiteConfig.btnYesLabel = yes;
  websiteConfig.btnNoLabel = no;
  websiteConfig.runawayMessages = runawayList;
  websiteConfig.loveLetter.body = letterBody;
  websiteConfig.colorTheme = theme;
  websiteConfig.celebrationTitle = celeb;

  applyConfigToDOM();

  if (runawayController) {
    runawayController.messages = runawayList;
  }

  if (persist) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(websiteConfig));

    // Save to Supabase website_settings if authenticated
    if (supabaseClient && currentOwnerUser) {
      supabaseClient
        .from("website_settings")
        .upsert({
          id: "default",
          owner_id: currentOwnerUser.id,
          website_title: websiteConfig.websiteTitle,
          invitation_heading: head,
          invitation_subtitle: sub,
          recipient_name: rec,
          sender_name: sender,
          love_letter: letterBody,
          color_theme: theme,
          customization_data: websiteConfig,
          updated_at: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase settings sync error:", error);
        });
    }
  }
}

function loadPersistedConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      websiteConfig = { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn("Error loading persisted config:", e);
  }
  applyConfigToDOM();
}

function applyConfigToDOM() {
  // Theme attribute
  document.body.setAttribute("data-theme", websiteConfig.colorTheme || "pink");

  // Headers and greetings
  const greetingEl = document.getElementById("display-greeting");
  if (greetingEl) {
    greetingEl.textContent = `HEY ${websiteConfig.recipientName.toUpperCase()}! 💗`;
  }

  const headEl = document.getElementById("display-main-heading");
  if (headEl) headEl.textContent = websiteConfig.invitationHeading;

  const subEl = document.getElementById("display-main-subtitle");
  if (subEl) subEl.textContent = websiteConfig.invitationSubtitle;

  const btnYesText = document.getElementById("display-btn-yes-text");
  if (btnYesText) btnYesText.textContent = websiteConfig.btnYesLabel;

  const btnNoText = document.getElementById("display-btn-no-text");
  if (btnNoText) btnNoText.textContent = websiteConfig.btnNoLabel;

  const celebTitleEl = document.getElementById("display-celeb-title");
  if (celebTitleEl) celebTitleEl.textContent = websiteConfig.celebrationTitle;

  // Letter display
  const letterTo = document.getElementById("display-letter-to");
  if (letterTo) letterTo.textContent = `To: ${websiteConfig.recipientName} 💗`;

  const letterBody = document.getElementById("display-letter-body");
  if (letterBody) letterBody.textContent = websiteConfig.loveLetter.body;

  const letterFrom = document.getElementById("display-letter-from");
  if (letterFrom) letterFrom.innerHTML = `With all my love,<br><span style="font-size:1.6rem">${websiteConfig.senderName} ✨</span>`;
}

// Escape HTML helper
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ========================================================
// 15. INITIALIZATION ON DOM READY
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load config
  loadPersistedConfig();

  // 2. Initialize Visual Engines
  new FloatingHeartsCanvas("hearts-canvas");
  confettiEngine = new ConfettiEngine("confetti-canvas");

  // 3. Initialize Runaway NO button
  runawayController = new RunawayButtonController();

  // 4. Initialize Quiz
  quizController = new LoveQuizController();

  // 5. Initialize Date Planner choices
  renderPlannerChoices();

  // 6. Initialize Secret Letter
  setupSecretLetter();

  // 7. Initialize Admin Dashboard & Supabase
  setupAdminDashboard();
  initSupabase();

  // 8. Top Navigation & Music Controls
  const musicBtn = document.getElementById("btn-toggle-music");
  const musicLabel = document.getElementById("music-label");
  const musicIcon = document.getElementById("music-icon");

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      const isPlaying = audio.toggleBgm();
      if (isPlaying) {
        musicBtn.classList.add("active");
        musicLabel.textContent = "Music: On 🎵";
        musicIcon.textContent = "🎶";
      } else {
        musicBtn.classList.remove("active");
        musicLabel.textContent = "Music: Off";
        musicIcon.textContent = "🎵";
      }
    });
  }

  // Teddy Bear Click Easter Egg
  const teddyHero = document.getElementById("teddy-hero");
  if (teddyHero) {
    teddyHero.addEventListener("click", () => {
      audio.playPop();
      confettiEngine.burst(25);
    });
  }

  // 9. YES BUTTON CELEBRATION
  const btnYes = document.getElementById("btn-yes-action");
  const celebModal = document.getElementById("celebration-overlay");
  const btnProceed = document.getElementById("btn-proceed-planner");

  if (btnYes) {
    btnYes.addEventListener("click", () => {
      audio.playCelebration();
      confettiEngine.burst(120);
      visitorState.responseType = "YES";
      celebModal.classList.add("show");
    });
  }

  if (btnProceed) {
    btnProceed.addEventListener("click", () => {
      audio.playPop();
      celebModal.classList.remove("show");
      navigateToStep(2);
    });
  }

  // 10. Planner Continue Button
  const btnPlannerContinue = document.getElementById("btn-planner-continue");
  if (btnPlannerContinue) {
    btnPlannerContinue.addEventListener("click", () => {
      const vName = document.getElementById("visitor-name")?.value.trim();
      const vDate = document.getElementById("preferred-date-input")?.value;

      if (!vName) {
        alert("Please let me know your name or nickname first! 🧸");
        document.getElementById("visitor-name")?.focus();
        return;
      }
      if (!vDate) {
        alert("Please pick a date on the calendar! 📅");
        document.getElementById("preferred-date-input")?.focus();
        return;
      }

      visitorState.visitorName = vName;
      visitorState.preferredDate = vDate;
      visitorState.personalMessage = document.getElementById("personal-message-input")?.value.trim();

      audio.playPop();
      navigateToStep(3);
    });
  }

  // Generic Step Back buttons
  document.querySelectorAll(".btn-step-back").forEach((btn) => {
    btn.addEventListener("click", () => {
      audio.playPop();
      const targetStep = parseInt(btn.getAttribute("data-target"), 10);
      navigateToStep(targetStep);
    });
  });

  // 11. Final Submission Button
  const btnSubmitFinal = document.getElementById("btn-submit-final-response");
  if (btnSubmitFinal) {
    btnSubmitFinal.addEventListener("click", () => {
      handleFinalSubmission();
    });
  }

  // Copy share link button
  const btnCopyShare = document.getElementById("btn-copy-share-link");
  if (btnCopyShare) {
    btnCopyShare.addEventListener("click", () => {
      const shareUrl = window.location.href.split("#")[0];
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert("Link copied to clipboard! Share it with your special someone 💗");
        });
      } else {
        alert(`Share this link: ${shareUrl}`);
      }
    });
  }

  // Print Date Ticket
  const btnPrint = document.getElementById("btn-print-ticket");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // Restart Experience
  const btnRestart = document.getElementById("btn-restart-experience");
  if (btnRestart) {
    btnRestart.addEventListener("click", () => {
      audio.playPop();
      if (runawayController) runawayController.reset();
      document.getElementById("printable-ticket").style.display = "block";
      document.getElementById("submission-action-buttons").style.display = "flex";
      document.getElementById("submission-success-card").style.display = "none";
      navigateToStep(1);
    });
  }
});
