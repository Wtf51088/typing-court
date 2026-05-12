import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTE_BANK = {
  short: [
    "Fast typing is just panic with better branding.",
    "The keyboard knows what you did.",
    "Backspace is a confession booth.",
    "Tiny typo. Massive courtroom drama.",
    "The sentence looks nervous.",
    "Your fingers have entered sport mode.",
  ],
  medium: [
    "The suspicious fox typed elegant nonsense while the keyboard silently judged every mistake.",
    "Your fingers are not slow, they are simply waiting for the sentence to deserve them.",
    "Reality is just a loading screen with better lighting and worse customer support.",
    "Every typo is a small tragedy performed by your fingertips.",
    "The sentence did nothing wrong, but your keyboard attacked it anyway.",
    "A calm person types carefully, but a chaotic person types like the floor is lava.",
  ],
  long: [
    "A professional-looking website can make even the dumbest idea feel funded by venture capital, especially when the buttons are rounded and the statistics pretend to matter.",
    "Somewhere in the cloud, a server is laughing at this typing session while your keyboard tries to explain that none of this was its fault.",
    "Your hands are writing checks your accuracy cannot cash, but the interface is polite enough to call it performance data instead of public embarrassment.",
    "The backspace key is not just a tool; it is a tiny emotional support button for every sentence that survived your first attempt.",
    "Typing quickly feels powerful until one wrong letter causes the entire paragraph to look like it was assembled by a raccoon during a thunderstorm.",
  ],
};

const TEXT_LENGTH_OPTIONS = [
  { key: "short", label: "Short" },
  { key: "medium", label: "Medium" },
  { key: "long", label: "Long" },
  { key: "random", label: "Random" },
];

function getQuotePool(mode) {
  if (mode === "short") return QUOTE_BANK.short;
  if (mode === "medium") return QUOTE_BANK.medium;
  if (mode === "long") return QUOTE_BANK.long;
  return [...QUOTE_BANK.short, ...QUOTE_BANK.medium, ...QUOTE_BANK.long];
}

const TEST_DURATIONS = [15, 30, 60];

const THEMES = {
  midnight: {
    label: "Midnight",
    background:
      "bg-[radial-gradient(circle_at_top_left,#f97316,transparent_24%),radial-gradient(circle_at_bottom_right,#7c3aed,transparent_28%),linear-gradient(135deg,#020617,#111827_48%,#020617)]",
  },
  rain: {
    label: "Rainy Desk",
    background:
      "bg-[radial-gradient(circle_at_top_left,#38bdf8,transparent_24%),radial-gradient(circle_at_bottom_right,#0f766e,transparent_28%),linear-gradient(135deg,#020617,#0f172a_52%,#042f2e)]",
  },
  cafe: {
    label: "Café",
    background:
      "bg-[radial-gradient(circle_at_top_left,#f59e0b,transparent_24%),radial-gradient(circle_at_bottom_right,#7c2d12,transparent_28%),linear-gradient(135deg,#1c1917,#292524_52%,#0c0a09)]",
  },
  library: {
    label: "Library",
    background:
      "bg-[radial-gradient(circle_at_top_left,#a3e635,transparent_20%),radial-gradient(circle_at_bottom_right,#166534,transparent_26%),linear-gradient(135deg,#0f172a,#1f2937_52%,#052e16)]",
  },
};

const KEYBOARD_SOUND_PROFILES = {
  creamy: { label: "Creamy", frequency: 520, type: "triangle", duration: 0.045, gain: 0.12 },
  mechanical: { label: "Mechanical", frequency: 820, type: "square", duration: 0.03, gain: 0.09 },
  laptop: { label: "Laptop", frequency: 640, type: "sine", duration: 0.025, gain: 0.1 },
  typewriter: { label: "Typewriter", frequency: 420, type: "sawtooth", duration: 0.06, gain: 0.14 },
  silent: { label: "Silent", silent: true },
};

const insults = [
  "Your keyboard just requested a transfer.",
  "That typo had emotional damage.",
  "Even autocorrect looked away.",
  "Your fingers are committing literature crimes.",
  "The spacebar is carrying this team.",
  "A pigeon with Wi-Fi could type cleaner.",
  "Your keyboard deserves hazard pay.",
  "That sentence needs a lawyer.",
  "Your backspace key is developing trust issues.",
  "This is not typing. This is keyboard vandalism.",
];

const praise = [
  "Okay, Shakespeare with caffeine.",
  "Your fingers have entered sport mode.",
  "Suspiciously competent typing detected.",
  "The keyboard is scared, but impressed.",
  "That streak was almost employable.",
];

const idleMessages = [
  "Start typing. The judge is already disappointed.",
  "The keyboard is silent, but the courtroom is open.",
  "Begin whenever your fingers stop negotiating.",
  "Type the sentence. Try not to emotionally injure it.",
  "The text is waiting. It looks nervous.",
];

const featureCards = [
  { label: "Typing fact", text: "The average person types around 35–45 WPM. Internet goblins somehow type 120." },
  { label: "Keyboard history", text: "The QWERTY layout became popular in the typewriter era, partly to reduce key-jamming chaos." },
  { label: "Spacebar fact", text: "The spacebar is usually the most abused key on the keyboard." },
  { label: "Monkey brain mode", text: "Your brain reads entire word shapes, not every single letter." },
  { label: "Fast typing", text: "Professional typists can exceed 150 WPM without setting the keyboard on fire." },
  { label: "Weakness report", text: "Most typing mistakes happen because the brain is faster than the fingers." },
  { label: "Backspace therapy", text: "Backspace is basically Ctrl+Z for regret." },
  { label: "Accuracy court", text: "People usually overestimate their typing accuracy by a lot." },
  { label: "Speed drama", text: "Typing too fast often lowers accuracy more than people expect." },
  { label: "Keyboard gossip", text: "Mechanical keyboards became popular partly because humans enjoy loud click sounds." },
  { label: "Panic detector", text: "Raw speed measures how quickly you can create chaos." },
  { label: "Human hardware", text: "Your fingers can react faster than your conscious thoughts in repetitive typing." },
];

const rankPools = {
  legendary: [
    { rank: "Keyboard Demigod", emoji: "⚡", comparison: "Faster than most people replying 'ok' to messages." },
    { rank: "CEO of Fingers", emoji: "💼", comparison: "Your keyboard might need a union after that." },
    { rank: "Typing Final Boss", emoji: "👾", comparison: "This looked less like typing and more like a cutscene." },
  ],
  cracked: [
    { rank: "Sweaty Discord Moderator", emoji: "🔥", comparison: "Could probably argue online professionally." },
    { rank: "Caffeinated Hacker Scene", emoji: "🧃", comparison: "You type like someone is tracing your IP in a movie." },
    { rank: "Keyboard Speedrunner", emoji: "🏁", comparison: "Skipped the tutorial and started abusing the keyboard." },
  ],
  good: [
    { rank: "Caffeinated Human", emoji: "☕", comparison: "Fast enough to look productive in public." },
    { rank: "Office Ninja", emoji: "🥷", comparison: "Quietly dangerous in Google Docs." },
    { rank: "Email Warrior", emoji: "📨", comparison: "Could survive a corporate Monday." },
  ],
  mid: [
    { rank: "Confused Office Worker", emoji: "🧍", comparison: "About as fast as someone renaming PDFs." },
    { rank: "Casual Keyboard Civilian", emoji: "🫡", comparison: "Not fast, not tragic. Deeply average energy." },
    { rank: "Homework Survivor", emoji: "📚", comparison: "Typed like the deadline is tomorrow, not today." },
  ],
  low: [
    { rank: "Distracted Grandpa Mode", emoji: "🐢", comparison: "Outpaced by a fridge typing with magnets." },
    { rank: "Sleepy Turtle Typist", emoji: "🥱", comparison: "A snail just opened LinkedIn to challenge you." },
    { rank: "Keyboard Tourist", emoji: "🧳", comparison: "You visited the keys, but did not commit to the journey." },
    { rank: "One-Finger Philosopher", emoji: "☝️", comparison: "Slow, thoughtful, and slightly concerning." },
  ],
};

function randomItem(items, fallback = "") {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items[Math.floor(Math.random() * items.length)];
}

function randomDifferentIndex(length, currentIndex) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === currentIndex) next = Math.floor(Math.random() * length);
  return next;
}

function getRotatingCards(seed) {
  return [0, 1, 2].map((offset) => featureCards[(seed + offset * 2) % featureCards.length]);
}

function calculateWpm(correctChars, startedAt, finishedAt = null) {
  if (!startedAt || correctChars <= 0) return 0;
  const end = finishedAt || Date.now();
  const minutes = Math.max((end - startedAt) / 1000 / 60, 1 / 60);
  return Math.round(correctChars / 5 / minutes);
}

function calculateRawWpm(charsTyped, startedAt, finishedAt = null) {
  if (!startedAt || charsTyped <= 0) return 0;
  const end = finishedAt || Date.now();
  const minutes = Math.max((end - startedAt) / 1000 / 60, 1 / 60);
  return Math.round(charsTyped / 5 / minutes);
}

function countTypos(input, target) {
  let mistakes = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== target[i]) mistakes += 1;
  }
  return mistakes;
}

function countCorrectChars(input, target) {
  let correct = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] === target[i]) correct += 1;
  }
  return correct;
}

function findWeakKeys(input, target) {
  const map = {};
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== target[i]) {
      const expected = target[i] || "extra";
      map[expected] = (map[expected] || 0) + 1;
    }
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

function getTypingMood(wpm, typoCount, hasStarted, isDone) {
  if (isDone) return "done";
  if (!hasStarted) return "idle";
  if (typoCount > 0) return "typo";
  if (wpm < 20) return "bored";
  if (wpm > 85) return "fire";
  if (wpm > 58) return "fast";
  return "calm";
}

function getMoodLabel(mood) {
  const labels = {
    idle: "Waiting for fingers",
    bored: "Bored font syndrome",
    calm: "Acceptably human",
    fast: "Keyboard warming up",
    fire: "Letters on fire",
    typo: "Typo detected. Shame deployed.",
    done: "The court has reached a verdict",
  };
  return labels[mood] || labels.idle;
}

function verdictFor(wpm, accuracy) {
  if (accuracy < 40) return "Your keyboard is filing a restraining order.";
  if (accuracy < 70) return "A raccoon fighting a microwave could type cleaner.";
  if (wpm > 110 && accuracy > 96) return "You type like a hacker in a movie montage.";
  if (wpm > 85 && accuracy > 94) return "Fast enough to scare office workers nearby.";
  if (wpm > 60 && accuracy > 90) return "Your fingers have achieved minor celebrity status.";
  if (wpm < 25) return "This sentence experienced multiple seasons while waiting.";
  return "Technically acceptable. Emotionally questionable.";
}

function pickFromPool(pool, seed) {
  if (!pool || pool.length === 0) return { rank: "Unknown Typist", emoji: "?", comparison: "The judge is confused." };
  return pool[Math.abs(seed) % pool.length];
}

function calculateFinalScore(wpm, accuracy) {
  const speedScore = Math.min(100, Math.round((wpm / 80) * 100));
  return Math.max(0, Math.min(100, Math.round(speedScore * 0.55 + accuracy * 0.45)));
}

function getTypingRank(wpm, accuracy, seed = 0) {
  const score = calculateFinalScore(wpm, accuracy);
  if (score >= 92) return pickFromPool(rankPools.legendary, seed);
  if (score >= 82) return pickFromPool(rankPools.cracked, seed);
  if (score >= 68) return pickFromPool(rankPools.good, seed);
  if (score >= 45) return pickFromPool(rankPools.mid, seed);
  return pickFromPool(rankPools.low, seed);
}

function hasReachedEnd(input, target) {
  return input.length >= target.length;
}

function getSoundGain(profile, volume) {
  if (!profile || profile.silent) return 0;
  return profile.gain * volume;
}

function runTinyTests() {
  console.assert(countTypos("abc", "abc") === 0, "Same text should have zero typos");
  console.assert(countTypos("axc", "abc") === 1, "One wrong character should count as one typo");
  console.assert(countCorrectChars("axc", "abc") === 2, "Correct character count should work");
  console.assert(getTypingMood(10, 0, true, false) === "bored", "Slow typing should become bored");
  console.assert(getTypingMood(90, 0, true, false) === "fire", "Very fast typing should become fire");
  console.assert(getTypingMood(40, 1, true, false) === "typo", "Typo should override speed mood");
  console.assert(getTypingMood(40, 1, true, true) === "done", "Done should override all moods");
  console.assert(hasReachedEnd("abc", "abc") === true, "Exact length should end the test");
  console.assert(hasReachedEnd("abcd", "abc") === true, "Longer input should end the test");
  console.assert(hasReachedEnd("ab", "abc") === false, "Shorter input should not end the test");
  console.assert(randomDifferentIndex(1, 0) === 0, "Single item index should be safe");
  console.assert(getRotatingCards(0).length === 3, "Rotating cards should always return three cards");
  console.assert(getTypingRank(0, 0, 0).rank !== getTypingRank(0, 0, 1).rank, "Low rank should vary by seed");
  console.assert(calculateFinalScore(80, 100) === 100, "80 WPM with perfect accuracy should score 100");
  console.assert(calculateFinalScore(40, 100) >= 70, "40 WPM with perfect accuracy should not be punished too hard");
  console.assert(calculateFinalScore(60, 95) >= 80, "Good speed and accuracy should score high");
  console.assert(randomItem(["x"], "fallback") === "x", "randomItem should return the only item");
  console.assert(randomItem([], "fallback") === "fallback", "randomItem should return fallback for empty arrays");
  console.assert(KEYBOARD_SOUND_PROFILES.creamy.label === "Creamy", "Keyboard sound profiles should exist");
  console.assert(KEYBOARD_SOUND_PROFILES.creamy.gain > 0.05, "Default keyboard sound should be audible");
  console.assert(getSoundGain(KEYBOARD_SOUND_PROFILES.creamy, 0.5) > 0, "Sound gain should scale with volume");
  console.assert(getSoundGain(KEYBOARD_SOUND_PROFILES.silent, 1) === 0, "Silent profile should have zero gain");
  console.assert(Object.keys(KEYBOARD_SOUND_PROFILES).length >= 5, "Sound catalog should have multiple choices");
  console.assert(THEMES.rain.label === "Rainy Desk", "Themes should exist");
  console.assert(getQuotePool("short").every((quote) => quote.length < 90), "Short quote pool should contain short text");
  console.assert(getQuotePool("medium").length > 0, "Medium quote pool should exist");
  console.assert(getQuotePool("long").some((quote) => quote.length > 120), "Long quote pool should contain longer text");
  console.assert(getQuotePool("random").length > getQuotePool("short").length, "Random quote pool should combine options");
}

const isDevelopment =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV !== "production";

if (typeof window !== "undefined" && isDevelopment) runTinyTests();

function GlassCard({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-2xl ${className}`}>
      {children}
    </div>
  );
}

function FireParticles({ active }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        duration: 1.4 + Math.random() * 1.8,
        size: 12 + Math.random() * 14,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-[-30px] select-none"
          style={{ left: `${p.left}%`, fontSize: p.size }}
          initial={{ y: 0, opacity: 0, scale: 0.8 }}
          animate={{ y: "-105vh", opacity: [0, 1, 0], scale: [0.8, 1.2, 0.5], rotate: [0, 18, -18] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        >
          🔥
        </motion.div>
      ))}
    </div>
  );
}

function Metric({ label, value, sub, compact = false }) {
  return (
    <GlassCard className="min-w-0">
      <div className={compact ? "p-3 md:p-5" : "p-4 md:p-5"}>
        <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-white/45 md:mb-2 md:text-sm md:tracking-[0.25em]">{label}</div>
        <div className={compact ? "break-words text-xl font-black tracking-tight md:text-4xl" : "break-words text-2xl font-black tracking-tight md:text-4xl"}>{value}</div>
        {sub && <div className={compact ? "mt-1 text-[11px] leading-snug text-white/55 md:mt-2 md:text-sm md:leading-relaxed" : "mt-2 text-xs leading-relaxed text-white/55 md:text-sm"}>{sub}</div>}
      </div>
    </GlassCard>
  );
}

function CharacterStream({ target, input, currentIndex }) {
  const currentCharRef = useRef(null);

  useEffect(() => {
    currentCharRef.current?.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  }, [currentIndex]);

  return (
    <div className="relative max-h-[210px] overflow-y-auto rounded-[1.5rem] border border-white/10 bg-black/20 p-3 font-mono text-base leading-[1.85] text-white/35 shadow-inner sm:text-lg md:max-h-[260px] md:rounded-[2rem] md:p-5 md:text-2xl md:leading-relaxed">
      <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
        {target.split("").map((char, index) => {
          const typed = input[index];
          const isCurrent = index === currentIndex;
          const isCorrect = typed === char;
          const isTyped = typed !== undefined;
          const visibleChar = isTyped && !isCorrect ? typed : char;
          const displayChar = visibleChar === " " ? "·" : visibleChar;

          return (
            <span
              key={`${char}-${index}`}
              ref={isCurrent ? currentCharRef : null}
              className={[
                "relative mx-[0.5px] rounded px-[1px] transition-all duration-150 md:mx-[1px] md:rounded-md md:px-[2px]",
                isTyped && isCorrect ? "text-white" : "",
                isTyped && !isCorrect ? "bg-red-500/30 text-red-100 underline decoration-red-300" : "",
                isCurrent ? "bg-white/20 text-white shadow-[0_0_18px_rgba(255,255,255,0.22)]" : "",
              ].join(" ")}
              title={isTyped && !isCorrect ? `Expected: ${char === " " ? "space" : char}` : ""}
            >
              {displayChar}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function JudgeMyTypingApp() {
  const [textLengthMode, setTextLengthMode] = useState("random");
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * getQuotePool("random").length));
  const [text, setText] = useState("");
  const [duration, setDuration] = useState(30);
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [lastInsult, setLastInsult] = useState(() => randomItem(idleMessages, "Start typing. The judge is already disappointed."));
  const [wpm, setWpm] = useState(0);
  const [cardSeed, setCardSeed] = useState(0);
  const [resultSeed, setResultSeed] = useState(0);
  const [soundProfile, setSoundProfile] = useState("creamy");
  const [soundVolume, setSoundVolume] = useState(0.85);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeKey, setThemeKey] = useState("midnight");
  const audioContextRef = useRef(null);
  const inputRef = useRef(null);

  const quotePool = useMemo(() => getQuotePool(textLengthMode), [textLengthMode]);
  const safeQuoteIndex = quotePool.length > 0 ? quoteIndex % quotePool.length : 0;
  const target = quotePool[safeQuoteIndex] || "";
  const reachedEnd = target.length > 0 && hasReachedEnd(text, target);
  const complete = text === target;
  const timedOut = Boolean(startedAt) && timeLeft <= 0;
  const done = reachedEnd || timedOut || Boolean(finishedAt);
  const typoCount = useMemo(() => countTypos(text, target), [text, target]);
  const correctChars = useMemo(() => countCorrectChars(text, target), [text, target]);
  const rawWpm = useMemo(() => calculateRawWpm(text.length, startedAt, finishedAt), [text.length, startedAt, finishedAt, timeLeft]);
  const accuracy = text.length === 0 ? 100 : Math.max(0, Math.round((correctChars / text.length) * 100));
  const progress = Math.min(100, Math.round((text.length / target.length) * 100));
  const mood = getTypingMood(wpm, typoCount, Boolean(startedAt), done);
  const weakKeys = useMemo(() => findWeakKeys(text, target), [text, target]);
  const verdict = verdictFor(wpm, accuracy);
  const typingRank = getTypingRank(wpm, accuracy, resultSeed);
  const visibleCards = useMemo(() => getRotatingCards(cardSeed), [cardSeed]);
  const activeTheme = THEMES[themeKey] || THEMES.midnight;

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!startedAt || finishedAt) return;
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const nextLeft = Math.max(0, duration - elapsed);
      setTimeLeft(nextLeft);
      setWpm(calculateWpm(correctChars, startedAt));
      if (nextLeft <= 0) {
        setResultSeed((seed) => seed + 1);
        setFinishedAt(Date.now());
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, [startedAt, finishedAt, duration, correctChars]);

  useEffect(() => {
    if (reachedEnd && !finishedAt) {
      const endTime = Date.now();
      setResultSeed((seed) => seed + 1);
      setFinishedAt(endTime);
      setWpm(calculateWpm(correctChars, startedAt || endTime, endTime));
      setLastInsult(complete ? "Fine. That was actually clean. Don’t get arrogant." : "You reached the end, but the sentence needs medical attention.");
    }
  }, [reachedEnd, complete, finishedAt, correctChars, startedAt]);

  function playKeySound(keyType = "normal") {
    const profile = KEYBOARD_SOUND_PROFILES[soundProfile];
    if (!profile || profile.silent || typeof window === "undefined") return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass();

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = profile.type;
      oscillator.frequency.value = profile.frequency + Math.random() * 35;
      if (keyType === "backspace") oscillator.frequency.value -= 120;
      if (keyType === "error") oscillator.frequency.value += 160;
      gainNode.gain.value = getSoundGain(profile, soundVolume);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + profile.duration);
      oscillator.stop(ctx.currentTime + profile.duration);
    } catch (error) {
      console.warn("Keyboard sound failed", error);
    }
  }

  function addCharacter(char) {
    if (done || text.length >= target.length) return;
    if (!startedAt) setStartedAt(Date.now());

    const next = text + char;
    const oldTypos = countTypos(text, target);
    const newTypos = countTypos(next, target);

    if (newTypos > oldTypos) {
      playKeySound("error");
      setLastInsult(randomItem(insults));
    } else {
      playKeySound("normal");
      if (next.length > text.length && Math.random() > 0.9) setLastInsult(randomItem(praise));
    }

    setText(next);
  }

  function handleMobileTextChange(e) {
    if (done) return;

    const nextValue = e.target.value.slice(0, target.length);
    const startTime = startedAt || (nextValue.length > 0 ? Date.now() : null);

    if (!startedAt && startTime) {
      setStartedAt(startTime);
    }

    if (nextValue.length < text.length) {
      playKeySound("backspace");
      setText(nextValue);
      return;
    }

    if (nextValue.length > text.length) {
      const oldTypos = countTypos(text, target);
      const newTypos = countTypos(nextValue, target);

      playKeySound(newTypos > oldTypos ? "error" : "normal");

      if (newTypos > oldTypos) {
        setLastInsult(randomItem(insults));
      } else if (Math.random() > 0.9) {
        setLastInsult(randomItem(praise));
      }
    }

    setText(nextValue);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      reset();
      return;
    }

    if (done) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      playKeySound("backspace");
      setText((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      addCharacter("\n");
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      addCharacter(e.key);
    }
  }

  function reset(nextQuote = null, nextDuration = duration, nextMode = textLengthMode) {
    const pool = getQuotePool(nextMode);
    const currentSafeIndex = pool.length > 0 ? quoteIndex % pool.length : 0;
    const selectedQuote = nextQuote === null ? randomDifferentIndex(pool.length, currentSafeIndex) : Math.min(nextQuote, pool.length - 1);
    setTextLengthMode(nextMode);
    setQuoteIndex(selectedQuote);
    setDuration(nextDuration);
    setText("");
    setStartedAt(null);
    setFinishedAt(null);
    setTimeLeft(nextDuration);
    setWpm(0);
    setLastInsult(randomItem(idleMessages, "Start typing. The judge is already disappointed."));
    setCardSeed((seed) => seed + 1);
    setResultSeed((seed) => seed + 1);
    if (typeof window !== "undefined") {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function nextQuote() {
    reset(null, duration, textLengthMode);
  }

  function changeTextLengthMode(nextMode) {
    reset(null, duration, nextMode);
  }

  const editorShellClass = [
    "relative rounded-[1.5rem] border bg-black/25 p-3 outline-none transition-all duration-300 md:rounded-[2rem] md:p-5",
    "border-white/15 shadow-inner focus-within:border-white/35",
    mood === "bored" ? "scale-[0.98] opacity-70" : "",
    mood === "fire" ? "animate-[shake_0.12s_infinite] border-orange-300/70 shadow-[0_0_45px_rgba(251,146,60,0.35)]" : "",
    mood === "typo" ? "border-red-400/70 shadow-[0_0_45px_rgba(248,113,113,0.25)]" : "",
  ].join(" ");

  return (
    <div className={`min-h-screen overflow-x-hidden ${activeTheme.background} px-3 py-4 text-white md:px-5 md:py-8`}>
      <style>{`
        @keyframes shake {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(1px, -1px) rotate(-0.4deg); }
          50% { transform: translate(-1px, 1px) rotate(0.4deg); }
          75% { transform: translate(1px, 1px) rotate(0deg); }
          100% { transform: translate(-1px, -1px) rotate(-0.4deg); }
        }
        .overflow-wrap-anywhere { overflow-wrap: anywhere; }
      `}</style>

      <FireParticles active={mood === "fire"} />

      <main className="relative z-10 mx-auto w-full max-w-6xl overflow-visible">
        <nav className="relative z-[500] mb-4 flex flex-col gap-3 overflow-visible rounded-3xl border border-white/10 bg-white/10 px-4 py-4 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between md:mb-8 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl shadow-inner">⌨</div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.35em] text-white/50 md:text-sm">Typing Court</div>
              <div className="truncate text-xl font-semibold">Judge My Typing</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TEST_DURATIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => reset(safeQuoteIndex, item)}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold transition active:scale-[0.98] md:px-4 md:py-3 md:text-base ${duration === item ? "bg-white text-slate-950" : "bg-white/10 text-white hover:bg-white/15"}`}
              >
                {item}s
              </button>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen((open) => !open)}
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.98] md:px-5 md:py-3 md:text-base"
              >
                Settings
              </button>

              <AnimatePresence>
                {settingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(6px)" }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+0.65rem)] z-[9999] w-[calc(100vw-2rem)] max-w-80 rounded-[1.5rem] border border-white/15 bg-slate-950/95 p-4 shadow-[0_25px_90px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
                  >
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/40">Theme</div>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(THEMES).map(([key, theme]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setThemeKey(key)}
                              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition active:scale-[0.98] ${themeKey === key ? "bg-white text-slate-950" : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"}`}
                            >
                              {theme.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/40">Text length</div>
                        <div className="grid grid-cols-1 gap-2">
                          {TEXT_LENGTH_OPTIONS.map((option) => (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() => changeTextLengthMode(option.key)}
                              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition active:scale-[0.98] ${textLengthMode === option.key ? "bg-white text-slate-950" : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/40">Keyboard sound</div>
                    <div className="grid gap-2">
                      {Object.entries(KEYBOARD_SOUND_PROFILES).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSoundProfile(key)}
                          className={[
                            "flex items-center justify-between rounded-2xl px-4 py-3 text-left font-semibold transition-all active:scale-[0.98]",
                            soundProfile === key ? "bg-white text-slate-950 shadow-lg" : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                          ].join(" ")}
                        >
                          <span>{value.label}</span>
                          {soundProfile === key && <span>✓</span>}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 rounded-2xl bg-white/5 p-4">
                      <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                        <span>Volume</span>
                        <span>{Math.round(soundVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={soundVolume}
                        onChange={(e) => setSoundVolume(Number(e.target.value))}
                        className="h-1 w-full accent-white"
                        aria-label="Keyboard sound volume"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => reset()}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-white/90 active:scale-[0.98] md:px-5 md:py-3 md:text-base"
            >
              Restart
            </button>
          </div>
        </nav>

        <section className="relative z-0 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] md:gap-6">
          <motion.div
            animate={mood === "fire" ? { x: [0, -3, 4, -2, 0] } : { x: 0 }}
            transition={{ duration: 0.25, repeat: mood === "fire" ? Infinity : 0 }}
            className="min-w-0 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl md:rounded-[2rem] md:p-8"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="mb-5 flex flex-col justify-between gap-3 md:mb-7 md:flex-row md:items-end">
              <div className="min-w-0">
                <div className="mb-2 text-[10px] uppercase tracking-[0.32em] text-white/45 md:mb-3 md:text-sm md:tracking-[0.45em]">Current Verdict</div>
                <h1 className="break-words text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl md:text-6xl xl:text-7xl">{getMoodLabel(mood)}</h1>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextQuote();
                }}
                className="shrink-0 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.98] md:px-5 md:text-base"
              >
                New sentence
              </button>
            </div>

            <div className={editorShellClass}>
              <CharacterStream target={target} input={text} currentIndex={text.length} />
              <textarea
                ref={inputRef}
                value={text}
                onKeyDown={handleKeyDown}
                onChange={handleMobileTextChange}
                autoFocus
                spellCheck="false"
                autoCapitalize="none"
                autoCorrect="off"
                className="absolute inset-0 z-10 h-full w-full resize-none bg-transparent text-transparent opacity-0 caret-transparent outline-none"
                aria-label="Typing input"
              />
              <div className="mt-3 text-xs leading-relaxed text-white/45 md:mt-4 md:text-sm">Tap here and type. Wrong keys appear in red. Backspace fixes shame.</div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10 md:mt-5 md:h-3">
              <motion.div
                className="h-full rounded-full bg-white"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
              />
            </div>
          </motion.div>

          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-1 md:gap-4">
            <Metric compact label="Time left" value={`${timeLeft}s`} sub={startedAt ? "Trial time left." : "Starts on first key."} />
            <Metric compact label="Clean speed" value={wpm} sub="Correct WPM." />
            <Metric compact label="Raw speed" value={rawWpm} sub="All typed chars." />
            <Metric compact label="Accuracy" value={`${accuracy}%`} sub={`${typoCount} typo${typoCount === 1 ? "" : "s"}.`} />
          </div>
        </section>

        <AnimatePresence>
          {done && (
            <motion.section
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              className="mt-6 rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl md:p-6"
            >
              <div className="mb-5 text-sm uppercase tracking-[0.35em] text-white/45">Final Judgment</div>
              <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 text-center">
                <div className="text-6xl">{typingRank.emoji}</div>
                <div className="mt-3 text-4xl font-black tracking-tight">{typingRank.rank}</div>
                <div className="mt-3 text-lg text-white/70">{typingRank.comparison}</div>
                <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 text-xl font-bold">
                  Final Score:
                  <span className="text-3xl text-white">{calculateFinalScore(wpm, accuracy)}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Metric label="Typing speed" value={`${wpm} WPM`} sub={wpm > 80 ? "Your keyboard is overheating." : "Average humans are somewhere around 35-45."} />
                <Metric label="Accuracy" value={`${accuracy}%`} sub={accuracy > 95 ? "Suspiciously clean typing." : "Some letters died during the process."} />
                <Metric label="Mistakes" value={typoCount} sub={typoCount < 5 ? "Minimal keyboard crimes." : "The evidence is overwhelming."} />
              </div>

              <div className="mt-5 rounded-3xl bg-black/20 p-5 text-center text-2xl font-black tracking-tight">{verdict}</div>

              <div className="mt-4 rounded-3xl bg-black/20 p-5">
                <div className="mb-3 text-sm uppercase tracking-[0.25em] text-white/45">Weak keys</div>
                {weakKeys.length === 0 ? (
                  <div className="text-white/70">No obvious weak keys. Suspicious.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {weakKeys.map(([key, count]) => (
                      <span key={key} className="rounded-2xl bg-red-400/20 px-4 py-2 font-mono text-red-100">
                        {key === " " ? "space" : key}: {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="mt-4 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
          {visibleCards.map((card, index) => (
            <GlassCard key={`${card.label}-${cardSeed}-${index}`}>
              <motion.div
                className="p-4 md:p-5"
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45 md:text-sm md:tracking-[0.25em]">{card.label}</div>
                <div className="text-base font-bold md:text-xl">{card.text}</div>
              </motion.div>
            </GlassCard>
          ))}
        </section>

        <footer className="mt-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-center text-sm font-semibold text-white shadow-2xl backdrop-blur-2xl md:mt-6 md:rounded-[2rem] md:p-6 md:text-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={lastInsult}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.25 }}
            >
              {lastInsult}
            </motion.div>
          </AnimatePresence>
        </footer>
      </main>
    </div>
  );
}
