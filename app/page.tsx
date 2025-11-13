"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./page.module.css";

export default function Home() {
  const orbControls = useAnimation();
  const revealControls = useAnimation();
  const textControls = useAnimation();

  useEffect(() => {
    const runSequence = async () => {
      // 1) Spin fast then slow to stop
      await orbControls.start({
        rotate: [0, 720, 900], // fast then easing out
        transition: {
          duration: 3,
          ease: "easeOut",
        },
      });

      // 2) Expand + fade out (disperse)
      await orbControls.start({
        scale: [1, 3, 6],
        opacity: [1, 0.7, 0],
        transition: {
          duration: 1.6,
          ease: "easeInOut",
        },
      });

      // 3) Start aurora reveal
      await revealControls.start({
        opacity: [0, 1],
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      });

      // 4) Bring in headline/subtext
      textControls.start({
        opacity: [0, 1],
        y: [20, 0],
        transition: {
          duration: 1.4,
          ease: "easeOut",
        },
      });
    };

    runSequence();
  }, [orbControls, revealControls, textControls]);

  return (
    <main className={styles.main}>
      {/* Orb loading stage */}
      <motion.div className={styles.orbWrapper} animate={orbControls}>
        <div className={styles.orbCore} />
        <div className={styles.orbGlow} />
        <div className={styles.orbRays} />
      </motion.div>

      {/* Aurora reveal layer */}
      <motion.div className={styles.auroraLayer} animate={revealControls}>
        <div className={styles.auroraGradient} />
      </motion.div>

      {/* Text content */}
      <motion.div className={styles.textLayer} animate={textControls}>
        <h1>VN.AI</h1>
        <p>
          A vision interface in motion.  
          Observation, nuance, and intelligence in a single frame.
        </p>
      </motion.div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} VN.AI</span>
        <span className={styles.divider}>•</span>
        <a href="https://arcoslabs.co" target="_blank" rel="noreferrer">
          An ARCOS Labs Company
        </a>
      </footer>
    </main>
  );
}
