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
        console.log("Mesh gradient initialized successfully");
      } catch (error) {
        console.error("Error initializing mesh gradient:", error);
      }
    };
    
    // Small delay to ensure DOM is ready
    setTimeout(initMeshGradient, 100);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    const runSequence = async () => {
      // Wait for orb to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 1) Spin continuously, gradually slowing down
      await orbControls.start({
        rotate: [0, 720], // continuous rotation with gradual slowdown
        transition: {
          duration: 2.0,
          ease: [0.4, 0, 0.2, 1], // cubic-bezier for smooth gradual slowdown
          type: "tween", // use tween instead of spring for smoother animation
        },
      });

      // 2) Continue slow spin and start bringing in text/logo simultaneously
      await Promise.all([
        orbControls.start({
          rotate: [1080, 1120], // continue slow spin (40 degrees)
          transition: {
            duration: 5,
            ease: "easeInOut",
            type: "tween", // use tween instead of spring for smoother animation
          },
        }),
        // Start aurora reveal after a short delay
        new Promise(resolve => setTimeout(resolve, 1000)).then(() => 
          revealControls.start({
            opacity: [0, 1],
            transition: {
              duration: 3,
              ease: "easeInOut",
            },
          })
        ),
        // Start text/logo appearing during slow spin
        new Promise(resolve => setTimeout(resolve, 1500)).then(() =>
          textControls.start({
            opacity: [0, 1],
            y: [15, 0],
            transition: {
              duration: 1,
              ease: "easeOut",
            },
          })
        ),
      ]);
    };

    runSequence();
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
          onError={(e) => console.error('Image failed to load:', e)}
          onLoad={() => console.log('Image loaded successfully')}
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
