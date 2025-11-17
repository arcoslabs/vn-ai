"use client";

import { motion, useAnimation } from "framer-motion";
import styles from "./spinningOrb.module.css";

type AnimationControls = ReturnType<typeof useAnimation>;

export function SpinningOrb({ animate }: { animate: AnimationControls }) {
  return (
    <div className={styles.orbWrapperInternal}>
      <motion.div
        animate={animate}
        initial={{ rotate: 0, scale: 1, opacity: 1 }}
        style={{ 
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <img src="/VN-SpinningCircle-2.svg" alt="orb" className={styles.orbSvg} />
      </motion.div>
    </div>
  );
}
