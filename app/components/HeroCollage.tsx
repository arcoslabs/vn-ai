'use client';

import React, { useState, useEffect, useRef } from 'react';

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
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = [
    // --- THIN COLUMNS (The Tail) ---
    {
      id: 1,
      pos: { left: '0px', top: '688px', width: '60px' }, // Very thin
      items: [{ name: 'img-sq-1-crown-60x60' }]
    },
    {
      id: 2,
      pos: { left: '76px', top: '660px', width: '88px' }, // Slightly wider
      items: [{ name: 'img-sq-2-superhero-88x88' }]
    },
    {
      id: 3,
      pos: { left: '180px', top: '600px', width: '80px' },
      items: [
        { name: 'img-sq-3-flowers-80x80' },
        { name: 'img-sq-4-geisha-80x80' }
      ]
    },
    {
      id: 4,
      pos: { left: '276px', top: '450px', width: '96px' },
      items: [
        { name: 'img-sq-5-crown-80x80' },
        { name: 'img-sq-6-spacegirl-96x88' },
        { name: 'img-sq-7-lake-88x88' }
      ]
    },

    // --- WIDE COLUMNS (The Body & Head) ---
    {
      id: 5,
      pos: { left: '388px', top: '-50px', width: '200px' }, // Big jump in size
      items: [
        {
          type: 'row',
          items: [
            { name: 'img-sq-8-femmes-184x160', width: '90%' }
            // Aligned to the right, leaving left side empty
          ]
        },
        { 
          type: 'row', 
          items: [
            { name: 'img-sq-9-planet-96x96', width: '50%' },
            { name: 'img-sq-10-eyes-96x96', width: '50%' }
          ]
        },
        { name: 'img-sq-11-bulbs-180x144' },
        { name: 'img-sq-12-throne-180x160' },
        { 
          type: 'row', 
          items: [
            { name: 'img-sq-13-walrus-104x96', width: '70%' },
            { name: 'img-sq-14-crown-60x60', width: '30%' }
          ]
        }
      ]
    },
    {
      id: 6,
      pos: { left: '604px', top: '-60px', width: '240px' },
      items: [
        // Row 1: Crown (50%) + Empty Space
        { 
          type: 'row',
          items: [
            { name: 'img-sq-15-crown-112x112', width: '50%' } 
            // Flex-start aligns it left, leaving right side empty
          ]
        },
        // Row 2: Desert (Full Width)
        { name: 'img-sq-16-desert-184x160' },
        
        // Row 3: Astronaut + Crown (50/50)
        { 
          type: 'row',
          items: [
            { name: 'img-sq-17-astronaut-88x88', width: '50%' },
            { name: 'img-sq-18-crown-88x88', width: '50%' }
          ]
        },
        
        // Row 4: Tunnel (Full Width)
        { name: 'img-sq-19-tunnel-190x160' }
      ]
    }
  ];

  // Helper function to get the file extension based on image name
  const getImageExtension = (imageName: string, isCrown: boolean): string => {
    if (isCrown) {
      // Special cases for crown images with different SVG filenames
      if (imageName === 'img-sq-15-crown-112x112') return '.svg'; // Uses img-sq-15-crown-120x120.svg
      if (imageName === 'img-sq-18-crown-88x88') return '.svg'; // Uses img-sq-18-crown-96x96.svg
      // All other crown images use SVG
      return '.svg';
    }
    return '.png';
  };

  // Helper function to get the actual filename (handles special crown cases)
  const getImageFilename = (imageName: string, isCrown: boolean): string => {
    if (isCrown) {
      if (imageName === 'img-sq-15-crown-112x112') return 'img-sq-15-crown-120x120';
      if (imageName === 'img-sq-18-crown-88x88') return 'img-sq-18-crown-96x96';
    }
    return imageName;
  };

  const renderItem = (item: any, columnWidth: string) => {
    if (item.type === 'row') {
      // Check if this row contains the femmes image (should align right)
      const containsFemmes = item.items.some((i: any) => i.name === 'img-sq-8-femmes-184x160');
      const rowClass = containsFemmes ? 'hero-collage-row-right' : 'hero-collage-row';
      return (
        <div key={`row-${item.items.map((i: any) => i.name).join('-')}`} className={rowClass}>
          {item.items.map((rowItem: any) => {
            const parsed = parseImageName(rowItem.name);
            if (!parsed) return null;
            
            const aspectRatio = parsed.width / parsed.height;
            const filename = getImageFilename(rowItem.name, parsed.isCrown);
            const extension = getImageExtension(rowItem.name, parsed.isCrown);
            const itemClass = parsed.isCrown ? 'hero-collage-item hero-collage-item-crown' : 'hero-collage-item';
            
            return (
              <div
                key={rowItem.name}
                className={itemClass}
                style={{
                  width: rowItem.width || '100%',
                  aspectRatio: aspectRatio,
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s ease-out',
                }}
              >
                <img
                  src={`/${filename}${extension}`}
                  alt={parsed.subject}
                  className="hero-collage-image"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      );
    }

    // Single item
    const parsed = parseImageName(item.name);
    if (!parsed) return null;
    
    const isDesert = item.name === 'img-sq-16-desert-184x160';
    const aspectRatio = `${parsed.width} / ${parsed.height}`;
    const filename = getImageFilename(item.name, parsed.isCrown);
    const extension = getImageExtension(item.name, parsed.isCrown);
    const itemClass = isDesert 
      ? 'hero-collage-item-desert' 
      : parsed.isCrown 
        ? 'hero-collage-item hero-collage-item-crown' 
        : 'hero-collage-item';
    
    return (
      <div
        key={item.name}
        className={itemClass}
        style={{
          ...(isDesert ? { height: 'auto' } : { aspectRatio: aspectRatio }),
          zIndex: parsed.isCrown ? 10 : 5,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s ease-out',
          flexShrink: 0,
        }}
      >
        <img
          src={`/${filename}${extension}`}
          alt={parsed.subject}
          className={isDesert ? "hero-collage-image-desert" : "hero-collage-image"}
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="hero-collage-container"
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className="hero-collage-column"
          style={{
            left: column.pos.left,
            top: column.pos.top,
            width: column.pos.width,
          }}
        >
          {column.items.map((item) => renderItem(item, column.pos.width))}
        </div>
      ))}
    </div>
  );
};

export default HeroCollage;
