"use client";

import { motion } from "framer-motion";
import styles from "./spinningOrb.module.css";

export function SpinningOrb({ animate }: { animate: any }) {
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
        <img src="/VN Landing Page bckg.svg" alt="orb" className={styles.orbSvg} />
      </motion.div>
    </div>
  );
}
