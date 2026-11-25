"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./SplashIntro.module.css";

type Phase = "play" | "exit" | "done";

const WORDS = ["SHAFA’S", "DESSERT", "HOUSE"];
const DRIPS = [
  { d: 0.05, t: 1.0 }, { d: 0.3, t: 1.2 }, { d: 0.0, t: 0.9 }, { d: 0.45, t: 1.3 }, { d: 0.15, t: 1.0 },
  { d: 0.4, t: 1.1 }, { d: 0.1, t: 1.25 }, { d: 0.35, t: 0.95 }, { d: 0.2, t: 1.15 }, { d: 0.5, t: 1.0 },
  { d: 0.05, t: 1.2 },
];
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 8) % 96, size: 3 + (i % 4) * 2, delay: 1.6 + (i % 7) * 0.35, dur: 3 + (i % 5) * 0.6,
}));

function shouldSkipIntro() {
  if (new URLSearchParams(window.location.search).get("intro") === "1") return false;
  try {
    return sessionStorage.getItem("shafa-intro-seen") === "1";
  } catch {
    return false;
  }
}

export default function SplashIntro({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<Phase>("play");
  const timers = useRef<number[]>([]);
  const leaving = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const leave = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    setPhase("exit");
    later(() => {
      setPhase("done");
      onComplete?.();
    }, 1000);
  }, [later, onComplete]);

  useEffect(() => {
    if (shouldSkipIntro()) {
      leaving.current = true;
      setPhase("done");
      onComplete?.();
      return undefined;
    }

    document.getElementById("shafa-intro-gate")?.remove();
    try {
      sessionStorage.setItem("shafa-intro-seen", "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    later(leave, reduce ? 1500 : 4500);

    const all = timers.current;
    return () => all.forEach(clearTimeout);
  }, [later, leave, onComplete]);

  useEffect(() => {
    if (phase === "done" || document.getElementById("shafa-intro-gate")) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  if (phase === "done") return null;

  let letter = 0;
  return (
    <div data-splash-intro className={`${styles.splash} ${phase === "exit" ? styles.exit : ""}`} role="dialog" aria-modal="true" aria-label="Welcome to Shafa’s Dessert House">
      <div className={styles.drips} aria-hidden="true">
        {DRIPS.map((x, i) => (
          <span key={i} className={styles.drip}
            style={{ left: `${i * 9.1 - 0.5}%`, animationDelay: `${x.d}s`, animationDuration: `${x.t}s` }} />
        ))}
      </div>

      <div className={styles.sparks} aria-hidden="true">
        {SPARKS.map((s, i) => (
          <i key={i} style={{ left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />
        ))}
      </div>

      <div className={styles.center}>
        <div className={styles.logoWrap}>
          <span className={styles.glow} aria-hidden="true" />
          <span className={styles.ring} aria-hidden="true" />
          <Image src="/shafa-menu/logo.png" alt="Shafa’s Dessert House logo" width={240} height={240} priority className={styles.logo} />
        </div>

        <h1 className={styles.title} aria-label="Shafa’s Dessert House">
          {WORDS.map((word) => (
            <span key={word} className={styles.word} aria-hidden="true">
              {[...word].map((character) => {
                const index = letter++;
                return <span key={index} className={styles.letter} style={{ "--i": index } as CSSProperties}>{character}</span>;
              })}
            </span>
          ))}
        </h1>

        <p className={styles.tagline}>Homemade · Made with love</p>
      </div>
    </div>
  );
}
