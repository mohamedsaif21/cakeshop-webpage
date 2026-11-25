"use client";
import { useCallback, useState } from "react";
import SplashIntro from "@/components/shafa-menu/SplashIntro";
import MenuSection from "./MenuSection";
import styles from "./menu.module.css";

export default function MenuExperience() {
  const [ready, setReady] = useState(false);
  const handleComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <SplashIntro onComplete={handleComplete} />
      <main data-shafa-menu className={`${styles.menu} ${ready ? styles.ready : ""}`}>
        <MenuSection />
      </main>
    </>
  );
}
