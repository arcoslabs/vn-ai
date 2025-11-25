'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CollageItem {
  name: string;
  pos: {
    left: number; // percentage
    top: number; // percentage
    height: number; // percentage - height is controlled, width calculated from aspect ratio
  };
}

// Parse filename to extract dimensions and check if it's a crown
const parseImageName = (name: string) => {
  // Format: "img-sq-[SEQUENCE]-[SUBJECT]-[WIDTH]x[HEIGHT]"
  const match = name.match(/img-sq-(\d+)-(.+)-(\d+)x(\d+)/);
  if (!match) return null;
  
  const [, sequence, subject, width, height] = match;
  return {
    sequence: parseInt(sequence),
    subject,
    width: parseInt(width),
    height: parseInt(height),
    isCrown: subject.toLowerCase().includes('crown'),
  };
};

const HeroCollage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal all images at once
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Collage items with hardcoded positions based on column logic
  // Arc moved down ~200px and made steeper
  // Using height instead of width for better vertical arc control
  const collageItems: CollageItem[] = [
    // --- COLUMN 1 (Far Left, Bottom Tail) ---
    // Approx Left: 0-10%
    // Moved down ~200px (from 85% to 110%)
    { name: "img-sq-1-crown-60x60", pos: { left: 5.5, top: 118, height: 8 } },
    
    // --- COLUMN 2 ---
    // Approx Left: 10-20%
    // Steeper progression
    { name: "img-sq-2-superhero-88x88", pos: { left: 15, top: 112, height: 10 } },
    
    // --- COLUMN 3 ---
    // Approx Left: 20-35%
    // Steeper progression
    { name: "img-sq-3-flowers-80x80", pos: { left: 26.5, top: 102.5, height: 9 } },
    { name: "img-sq-4-geisha-80x80", pos: { left: 26.5, top: 120, height: 9 } },
    
    // --- COLUMN 4 ---
    // Approx Left: 35-50%
    // Steeper progression
    { name: "img-sq-5-crown-80x80", pos: { left: 38.7, top: 79.5, height: 8 } },
    { name: "img-sq-6-spacegirl-96x88", pos: { left: 36.75, top: 95, height: 9.2 } },
    { name: "img-sq-7-lake-88x88", pos: { left: 36.75, top: 112.5, height: 10 } },
    
    // --- COLUMN 5 (The "Body" - Wider Cluster) ---
    // Approx Left: 50-75%
    // Steeper progression
    { name: "img-sq-8-femmes-184x160", pos: { left: 48, top: -3, height: 18 } },
    { name: "img-sq-9-planet-96x96", pos: { left: 48, top: 29, height: 10 } },
    { name: "img-sq-10-eyes-96x96", pos: { left: 58, top: 27.5, height: 12.5 } },
    { name: "img-sq-11-bulbs-180x144", pos: { left: 48, top: 48, height: 16.75 } },
    { name: "img-sq-12-throne-180x160", pos: { left: 48, top: 78.5, height: 19 } },
    { name: "img-sq-13-walrus-104x96", pos: { left: 48, top: 112.5, height: 12.5 } },
    { name: "img-sq-14-crown-60x60", pos: { left: 62.75, top: 112.5, height: 7 } },
    
    // --- COLUMN 6 (The "Head" - Top Right) ---
    // Approx Left: 75-100%
    // Steeper progression - can go negative with overflow-visible
    { name: "img-sq-15-crown-112x112", pos: { left: 70.5, top: -2, height: 12 } },
    { name: "img-sq-16-desert-184x160", pos: { left: 70.5, top: 20.5, height: 19 } },
    { name: "img-sq-17-astronaut-88x88", pos: { left: 70.5, top: 55, height: 10 } },
    { name: "img-sq-18-crown-88x88", pos: { left: 82, top: 55, height: 10 } },
    { name: "img-sq-19-tunnel-190x160", pos: { left: 70.5, top: 74, height: 16 } },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[700px] lg:min-h-[800px] overflow-visible">
      {/* Collage Items */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {collageItems.map((item, index) => {
          const parsed = parseImageName(item.name);
          if (!parsed) return null;
          
          const { width, height, isCrown } = parsed;
          const aspectRatio = width / height;
          
          // Adjust top position for mobile (compress arc to top) vs desktop (full arc)
          // On mobile, scale the top values to be in the top 60% of container
          // On desktop, use full range
          const mobileTop = (item.pos.top / 100) * 60; // Compress to top 60%
          const desktopTop = item.pos.top;
          
          return (
            <div
              key={item.name}
              className={`absolute rounded-2xl overflow-hidden collage-item ${
                isCrown ? 'crown-card' : ''
              }`}
              style={{
                '--mobile-top': `${mobileTop}%`,
                '--desktop-top': `${desktopTop}%`,
                left: `${item.pos.left}%`,
                top: `var(--mobile-top)`,
                height: `${item.pos.height}%`,
                aspectRatio: aspectRatio,
                zIndex: isCrown ? 10 : 5,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              } as React.CSSProperties}
            >
              <img
                src={`/${item.name}.png`}
                alt={parsed.subject}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroCollage;

