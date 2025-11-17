"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./page.module.css";
import { SpinningOrb } from "./spinningOrb";
import { Gradient } from "./MeshGradient";

export default function Home() {
  const orbControls = useAnimation();
  const revealControls = useAnimation();
  const textControls = useAnimation();

  useEffect(() => {
    // Initialize mesh gradient - wait for canvas to be available
    const initMeshGradient = async () => {
      const canvas = document.querySelector("#mesh-gradient-canvas") as HTMLCanvasElement;
      if (!canvas) {
        // Wait for canvas to be available
        setTimeout(initMeshGradient, 100);
        return;
      }
      
      // Ensure canvas has dimensions
      if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = canvas.offsetWidth || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
      }
      
      try {
        const gradient = new Gradient();
        await gradient.initGradient("#mesh-gradient-canvas");
      } catch (error) {
        // Silently fail - gradient is optional visual enhancement
      }
    };
    
    // Small delay to ensure DOM is ready
    setTimeout(initMeshGradient, 100);
  }, []);

  useEffect(() => {
    // Orb animation: independent sequence
    const runOrbSequence = async () => {
      // Wait for orb to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // First phase: fast spin then gradual slowdown (single animation, no pause)
      // Fast spin for ~2s, then gradual slowdown to 1080° by 4s
      orbControls.start({
        rotate: [0, 1080],
        transition: {
          duration: 4, // total 4 seconds
          ease: [0.4, 0, 0.2, 1], // starts fast, smoothly slows down
          type: "tween",
          onComplete: () => {
            // Continue with slow perpetual spin seamlessly from 1080
            orbControls.start({
              rotate: [1080, 1440], // continue from 1080 (one full 360° rotation)
              transition: {
                duration: 60, // slow rotation speed (360 degrees in 60s - very slow)
                ease: "linear",
                type: "tween",
                repeat: Infinity, // perpetual slow spin
                repeatType: "loop", // continuous loop
              },
            });
          },
        },
      });
    };

    // Text/overlay animation: independent sequence (starts 3s after page load)
    const runTextSequence = async () => {
      // Wait 3 seconds after page load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fade in text and overlay simultaneously
      await Promise.all([
        revealControls.start({
          opacity: [0, 1],
          transition: {
            duration: 3,
            ease: "easeInOut",
          },
        }),
        textControls.start({
          opacity: [0, 1],
          y: [15, 0],
          transition: {
            duration: 1,
            ease: "easeOut",
          },
        }),
      ]);
    };

    // Run both sequences independently
    runOrbSequence();
    runTextSequence();
  }, [orbControls, revealControls, textControls]);

  return (
    <main className={styles.main}>
      {/* Orb loading stage */}
      <div className={styles.orbWrapper}>
        <SpinningOrb animate={orbControls} />
      </div>

      {/* Static hero image background */}
      <div className={styles.heroBackground} />

      {/* Mesh Gradient layer */}
      <motion.div className={styles.auroraLayer} animate={revealControls}>
        <canvas id="mesh-gradient-canvas" className={styles.meshGradient} />
      </motion.div>

      {/* Low opacity black overlay */}
      <motion.div 
        className={styles.blackOverlay} 
        animate={textControls} 
        initial={{ opacity: 0 }}
      />

      {/* Text content */}
      <motion.div 
        className={styles.textLayer} 
        animate={textControls} 
        initial={{ opacity: 0 }}
      >
        <img 
          src="/VN-Logo-White.svg" 
          alt="VN Logo" 
          className={styles.logo}
        />
        <h1>Where creativity regains value</h1>
        <p>
        Forging the new creative economy by connecting expression to the source
        </p>
      </motion.div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} VN.AI</span>
        <span className={styles.divider}>•</span>
        <a href="https://arcoslabs.co" target="_blank" rel="noreferrer" 
        style={{ color: '#ffffff', textDecoration: 'underline', opacity: 0.5 }}>
          An ARCOS Labs Company
        </a>
      </footer>
    </main>
  );
}
