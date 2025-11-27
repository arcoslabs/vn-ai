'use client'; // <--- ADD THIS LINE AT THE VERY TOP

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Zap, Shield, Cpu, Sparkles, Menu, X, CheckCircle2, Gavel } from 'lucide-react';
import HeroCollage from './components/HeroCollage';

// --- Components ---

const Reveal = ({ children, delay = 0, triggerAt = 'early' }: { children: React.ReactNode; delay?: number; triggerAt?: 'early' | 'center' | 'twoThirds' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (triggerAt === 'center') {
      // For center trigger, check scroll position
      const checkPosition = () => {
        if (ref.current && !isVisible) {
          const rect = ref.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          // Trigger when top of element reaches 50% of viewport
          if (rect.top <= viewportHeight * 0.5 && rect.bottom >= 0) {
            setIsVisible(true);
          }
        }
      };
      
      checkPosition(); // Check immediately
      window.addEventListener('scroll', checkPosition, { passive: true });
      return () => window.removeEventListener('scroll', checkPosition);
    } else if (triggerAt === 'twoThirds') {
      // For two-thirds trigger, check scroll position
      const checkPosition = () => {
        if (ref.current && !isVisible) {
          const rect = ref.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          // Trigger when top of element reaches 2/3 (66.67%) of viewport
          if (rect.top <= viewportHeight * 0.667 && rect.bottom >= 0) {
            setIsVisible(true);
          }
        }
      };
      
      checkPosition(); // Check immediately
      window.addEventListener('scroll', checkPosition, { passive: true });
      return () => window.removeEventListener('scroll', checkPosition);
    } else {
      // For early trigger, use IntersectionObserver
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '50px' }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [triggerAt, isVisible]);

  return (
    <div ref={ref} style={{ 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
      transition: delay === 0 && ref.current?.closest('section')?.id !== 'features' ? `all 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s` : `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s` // Smoother, longer for quote section
    }}>
      {children}
    </div>
  );
};

// Sequential Reveal - children animate one after another
const SequentialReveal = ({ children }: { children: React.ReactNode[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {React.Children.map(children, (child, index) => (
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
          transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s` // Faster, smoother
        }}>
          {child}
        </div>
      ))}
    </div>
  );
};

// Image Wheel with fade-in and delayed spin
const ImageWheelReveal = ({ delay = 0 }: { delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldSpin, setShouldSpin] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start spinning after fade-in completes (0.6s transition + delay)
          setTimeout(() => {
            setShouldSpin(true);
          }, (delay + 0.6) * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`absolute pointer-events-none image-wheel-position ${shouldSpin ? 'image-wheel-spin' : ''}`}
      style={{
        width: '600px',
        height: '600px',
        backgroundImage: 'url(/image-wheel.png)',
        backgroundSize: '600px 600px',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        transformOrigin: '300px 300px'
      }}
    ></div>
  );
};

// Smooth fade-in for quote glass card
const QuoteGlassCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s, transform 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
      }}
    >
      {children}
    </div>
  );
};

// Line-by-line reveal for quote
const QuoteLineReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.5s ease-out'
    }}>
      {children}
    </div>
  );
};

// Typewriter effect for text
const TypewriterReveal = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30 + delay);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, currentIndex, text, delay]);

  return <span ref={ref} className={className}>{displayText}</span>;
};

// Cascade reveal for images (left to right)
const CascadeReveal = ({ children, delay = 0.1 }: { children: React.ReactNode[]; delay?: number }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {React.Children.map(children, (child, index) => (
        <div style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.4s ease-out ${index * delay}s`
        }}>
          {child}
        </div>
      ))}
    </div>
  );
};

const GradientBtn = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
  <button 
    onClick={onClick}
    className={`font-mono-brand relative overflow-hidden rounded-full group px-8 py-4 text-sm font-medium text-black shadow-lg transition-all hover:shadow-xl ${className}`}
    style={{ background: '#ffffff' }}
  >
    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-purple)] to-[var(--color-pink)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
    <span className="relative flex items-center gap-2">{children}</span>
  </button>
);

// --- Main App ---

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden" style={{ backgroundColor: '#010101' }}>
      {/* Global Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden">
        <div className="gradient-blob blob-blue w-[500px] h-[500px] top-[-10%] left-[-10%] opacity-10"></div>
        <div className="gradient-blob blob-pink w-[600px] h-[600px] bottom-[-10%] left-[20%] opacity-30" style={{ animationDelay: '2s' }}></div>
        <div className="gradient-blob blob-yellow w-[400px] h-[400px] top-[20%] right-[-10%] opacity-40" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? 'top-[40px]' : 'top-[32px]'
        }`}
      >
        <div className={`px-6 mx-auto transition-all duration-300 ease-in-out ${
          isScrolled ? 'max-w-[68rem]' : 'max-w-7xl'
        }`}>
          {/* Desktop Navigation */}
          <div className="hidden md:flex relative">
            {/* Pill Background - Only visible when scrolled */}
            <div 
              className={`absolute inset-0 rounded-full px-4 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
                isScrolled ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(167, 167, 167, 0.4)',
              }}
            />
            
            {/* Content Container */}
            <div 
              className={`relative w-full flex justify-between items-center transition-all duration-300 ease-in-out ${
                isScrolled ? 'pl-6 pr-4' : 'px-0'
              }`}
              style={{ height: '64px' }}
            >
              {/* Logo */}
              <img 
                src="/VN-Logo-White.svg" 
                alt="VN Logo" 
                style={{ 
                  maxHeight: '40px',
                  height: 'auto',
                  display: 'block'
                }}
              />

              {/* Center Links */}
              <div className="flex items-center gap-12">
                <button 
                  onClick={() => scrollTo('features')} 
                  className="font-mono-brand text-sm text-white font-normal hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Solution
                </button>
                <button 
                  onClick={() => scrollTo('quote')} 
                  className="font-mono-brand text-sm text-white font-normal hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Impact
                </button>
                <button 
                  onClick={() => scrollTo('product-features')} 
                  className="font-mono-brand text-sm text-white font-normal hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Features
                </button>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => scrollTo('waitlist')}
                className="font-mono-brand bg-white text-black px-5 rounded-full text-xs hover:bg-[var(--color-blue)] hover:text-white transition-colors"
                style={{ height: '40px' }}
              >
                JOIN WAITLIST
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div 
              className="rounded-full px-4 backdrop-blur-md flex justify-between items-center"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(167, 167, 167, 0.4)',
                height: '56px'
              }}
            >
              <img 
                src="/VN-Logo-White.svg" 
                alt="VN Logo" 
                style={{ 
                  maxHeight: '32px',
                  height: 'auto',
                  display: 'block'
                }}
              />

              <button 
                className="text-white" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div 
                className="absolute top-16 left-6 right-6 rounded-3xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-2xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(167, 167, 167, 0.4)'
                }}
              >
                <button 
                  onClick={() => scrollTo('features')} 
                  className="text-left text-lg font-mono-brand text-white hover:opacity-80 transition-opacity"
                >
                  Solution
                </button>
                <button 
                  onClick={() => scrollTo('quote')} 
                  className="text-left text-lg font-mono-brand text-white hover:opacity-80 transition-opacity"
                >
                  Impact
                </button>
                <button 
                  onClick={() => scrollTo('product-features')} 
                  className="text-left text-lg font-mono-brand text-white hover:opacity-80 transition-opacity"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollTo('waitlist')} 
                  className="w-full py-4 bg-white text-black font-mono-brand rounded-xl hover:bg-[var(--color-blue)] hover:text-white transition-colors"
                >
                  JOIN WAITLIST
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Gradient - Fixed background, positioned at root level */}
      <img 
        src="/hero-gradient.svg" 
        alt="" 
        className="hero-gradient-responsive"
      />
      
      {/* Hero Section */}
      <header id="home" className="hero-section">
        {/* Collage items positioned on the right - Desktop only - OVERLAPS gradient */}
        <div className="hero-collage-wrapper-desktop">
          <HeroCollage />
        </div>

        {/* Mobile: Hero Collage First - positioned absolutely to not affect gradient - OVERLAPS gradient */}
        <div className="hero-collage-wrapper-mobile">
          <HeroCollage />
        </div>

        {/* Text Content - Below collage, constrained to avoid overlap */}
        <div className="hero-text-content">
          <SequentialReveal>
            <h1 className="hero-heading">
              Your IP is Fueling the AI Boom. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-purple)]">
                It's Time You Got Paid For It.
              </span>
            </h1>
            <p className="hero-paragraph">
            From training data through generated output, we ensure your IP is protected, authorized, and monetized. Take control of how AI uses your work.
            </p>
            <div className="hero-button-wrapper">
              <GradientBtn onClick={() => scrollTo('waitlist')}>
                JOIN THE WAITLIST <ArrowRight size={16} />
              </GradientBtn>
            </div>
          </SequentialReveal>
        </div>
      </header>

      {/* Value Props / "Complete Solution" */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal triggerAt="twoThirds">
            <div className="mb-20">
              <h2 className="text-3xl lg:text-5xl leading-[1.3em] font-normal mb-6 text-white">The Complete IP Solution <br /> for the New Era of Gen AI</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Enforce Your Rights",
              desc: "Identify unauthorized usage with forensic proof to force settlements, win judgments, and calculate the damages you are owed for past infringement.",
              image: "/VP1-Illo.png"
            },
            {
              title: "Take Control of AI Training",
              desc: "We facilitate authorized licensing frameworks, ensuring models can only train on your catalog with explicit consent and compensation.",
              image: "/VP2-Illo.png"
            },
            {
              title: "Secure New Revenue",
              desc: "Our state of the art engine tracks likeness and style in AI-generated images, ensuring you are paid every time your work inspires a generation.",
              image: "/VP3-Illo.png"
            }
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1} triggerAt="twoThirds">
              <div className="h-full">
                {/* Value Prop Illustration */}
                <div className="w-full h-50% mb-8 overflow-hidden relative">
                   <img 
                     src={item.image}
                     alt={item.title}
                     className="w-full h-full object-cover"
                     loading="lazy"
                   />
                </div>
                <h2 className="text-3xl font-normal mb-3 text-white">{item.title}</h2>
                <p className="text-md mb-4 leading-relaxed" style={{ color: '#B8B8B8' }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section 
        id="quote"
        className="py-24 px-6 max-w-5xl mx-auto text-center relative"
        style={{
          backgroundImage: 'url(/quote-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '600px'
        }}
      >
        <QuoteGlassCard>
        <div
          className="relative z-10 shadow-xl"
          style={{
            borderRadius: '24px',
            padding: '1px',
            background: 'linear-gradient(to right, rgba(94, 80, 93, 0.2), rgba(245, 92, 92, 0.2), rgba(255, 53, 218, 0.2), rgba(94, 58, 121, 0.2))'
          }}
        >
              <div
                className="p-20"
                style={{
                  borderRadius: '23px',
                  background: 'linear-gradient(193deg, rgba(255, 255, 255, 0.05) 10.93%, rgba(255, 255, 255, 0.15) 50.14%, rgba(255, 255, 255, 0.05) 90.1%)',
                  backdropFilter: 'blur(50px)',
                  WebkitBackdropFilter: 'blur(50px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
                }}
              >
                <h3 className="text-2xl md:text-2xl font-normal leading-[1.5em] text-white  mb-8">
                "The <span style={{ backgroundColor: 'white', color: 'black', padding: '2px 4px' }}>unauthorized</span> and <span style={{ backgroundColor: 'white', color: 'black', padding: '2px 4px' }}>uncompensated</span> <span style={{ fontWeight: 'bold' }}>use of copyrighted works</span> to train generative AI systems is a profound threat to the entire creative ecosystem. If we allow this practice to continue{' '}
                <img 
                  src="/icon-unchecked.svg" 
                  alt="" 
                  style={{ 
                    display: 'inline-block', 
                    verticalAlign: 'middle', 
                    height: '1.3em', 
                    marginLeft: '2px', 
                    marginRight: '2px' 
                  }} 
                />
                {' '}unchecked, <span style={{ backgroundColor: 'white', color: 'black', padding: '2px 4px' }}>we risk</span> <span style={{ textDecoration: 'underline' }}>undermining</span> the very foundation of our copyright system and the <span style={{ fontWeight: 'bold' }}>livelihoods of the creators</span> it is meant to protect."
                </h3>
                <div className="font-mono-brand text-white">
                  <div className="text-base font-bold tracking-widest uppercase mb-2">MARIA A. PALLANTE</div>
                  <div className="text-xs font-normal tracking-widest uppercase leading-normal">
                    President and CEO, Association of American Publishers<br></br> (Former U.S. Register of Copyrights)
                  </div>
                </div>
              </div>
        </div>
        </QuoteGlassCard>
      </section>

      {/* Feature Grid (Bento Box Style) */}
      <section id="product-features" className="py-32 px-6 relative" style={{ backgroundColor: '#010101' }}>
        {/* Gradient Streak Background - starts 3/4 down and spans into waitlist section */}
        <div 
          className="absolute left-0 right-0 w-full pointer-events-none overflow-visible"
          style={{
            top: '50%',
            height: '200vh',
            backgroundImage: 'url(/gradient-streak.svg)',
            backgroundSize: '100% auto',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
           <Reveal>
             <div className="mb-12">
               <h3 className="font-mono-brand text-[var(--color-pink)] mb-4">PRODUCT FEATURES</h3>
               <h2 className="text-5xl text-white font-regular pb-4">Engineered for Control and Compensation</h2>
             </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Box 1: Top-left, 2/3 width - LSS */}
              <Reveal delay={0.2}>
              <div className="col-span-1 md:col-span-2 h-[400px] rounded-3xl relative overflow-hidden group bg-black">
                 <img 
                   src="/feature-lss.png" 
                   className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity duration-700" 
                   alt="Forensic Litigation Suite" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent z-10"></div>
                 <div className="relative z-20 h-full flex flex-col justify-end p-10">
                    <h3 className="text-2xl font-bold mb-2 text-white">Forensic Litigation Suite</h3>
                    <p className="max-w-[600px]" style={{ color: '#B8B8B8' }}>Scan AI model outputs continuously to generate infringement reports and calculate statutory damages with mathematical certainty.</p>
                 </div>
              </div>
              </Reveal>

              {/* Box 2: Top-right, 1/3 width - Engine */}
              <Reveal delay={0.3}>
              <div className="col-span-1 h-[400px] rounded-3xl relative overflow-hidden group bg-black">
                 <img 
                   src="/feature-engine.png" 
                   className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity duration-700" 
                   alt="The Attribution Engine" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
                 <div className="relative z-20 h-full flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold mb-2 text-white">The Attribution Engine</h3>
                    <p className="text-sm" style={{ color: '#B8B8B8' }}>Quantify the precise degree of similarity in AI-generated outputs, unlocking recurring monetization opportunities from your catalog.</p>
                 </div>
              </div>
              </Reveal>

              {/* Box 3: Bottom-left, 1/3 width - Impact */}
              <Reveal delay={0.4}>
              <div className="col-span-1 h-[400px] rounded-3xl relative overflow-hidden group bg-black">
                 <img 
                   src="/feature-impact.png" 
                   className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity duration-700" 
                   alt="Economic impact modeling" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
                 <div className="relative z-20 h-full flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold mb-2 text-white">Economic Impact Modeling</h3>
                    <p className="text-sm" style={{ color: '#B8B8B8' }}>Visualize the complete economic impact ranging from potential litigation damages to projected revenue from future data licensing opportunities.</p>
                 </div>
              </div>
              </Reveal>

              {/* Box 4: Bottom-right, 2/3 width - Data */}
              <Reveal delay={0.5}>
              <div className="col-span-1 md:col-span-2 h-[400px] rounded-3xl relative overflow-hidden group bg-black">
                 <img 
                   src="/feature-data.png" 
                   className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity duration-700" 
                   alt="Authorized Licensing Portal" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
                 <div className="relative z-20 h-full flex flex-col justify-end p-10">
                    <h3 className="text-2xl font-bold mb-2 text-white">Authorized Licensing Portal</h3>
                    <p className="max-w-lg" style={{ color: '#B8B8B8' }}>Register, fingerprint, and manage licensing permissions for your catalog to ensure AI models only train on authorized data.</p>
                 </div>
              </div>
              </Reveal>
           </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist" className="pb-32 px-6 mb-40 relative" style={{ zIndex: 1 }}>
        {/* Image Wheel Background - above gradient streak - animates last */}
        <ImageWheelReveal delay={0.8} />
 
        
        <div className="relative" style={{ zIndex: 10, overflow: 'visible' }}>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start" style={{ overflow: 'visible' }}>
          <SequentialReveal>
            <div>
              <h2 className="text-4xl md:text-6xl font-normal mb-6 text-white">Turn the existential threat of AI into your greatest opportunity</h2>
            </div>
            <div>
              <p className="text-xl mb-8 mr-12" style={{ color: '#B8B8B8' }}>
              The age of unauthorized usage is ending. We provide the essential infrastructure to control how your IP is used to ensure you are compensated every step of the way.
              </p>
            </div>
            <div>
              <img 
                src="/Royalty-UI.png" 
                alt="Royalty UI" 
                className="w-[50%] max-w-full"
                style={{ marginTop: '72px', marginLeft: '80px'}}
              />
            </div>
          </SequentialReveal>

          <Reveal delay={0.3}>
          <div 
            className="relative"
            style={{
              paddingLeft: '10%',
              paddingRight: '10%',
              backgroundColor: 'transparent'
            }}
          >
            <div 
              className="relative py-8 px-[40px] md:py-12 md:px-[56px]"
              style={{
                backgroundImage: 'url(/form-glass-card.svg)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
               <Reveal delay={0}>
                 <h3 className="text-4xl font-normal text-white mb-6">Gain Early Access</h3>
               </Reveal>
               <Reveal delay={0.1}>
                 <div>
                   {/* <label className="block text-xs font-mono-brand font-normal text-white mb-2 uppercase">First Name</label> */}
                   <input type="text" className="w-full bg-white rounded-xl p-4 text-black/70 focus:outline-none focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)] transition-all" placeholder="First Name" />
                 </div>
               </Reveal>
               <Reveal delay={0.15}>
                 <div>
                  {/* <label className="block text-xs font-mono-brand font-normal text-white mb-2 uppercase">Last Name</label> */}
                   <input type="text" className="w-full bg-white rounded-xl p-4 text-black/70 focus:outline-none focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)] transition-all" placeholder="Last Name" />
                 </div>
               </Reveal>
               <Reveal delay={0.2}>
                 <div>
                   {/* <label className="block text-xs font-mono-brand font-normal text-white mb-2 uppercase">Company Name</label> */}
                   <input type="text" className="w-full bg-white rounded-xl p-4 text-black/70 focus:outline-none focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)] transition-all" placeholder="Company Name" />
                 </div>
               </Reveal>
               <Reveal delay={0.25}>
                 <div>
                   {/* <label className="block text-xs font-mono-brand font-normal text-white mb-2 uppercase">Work Email</label> */}
                   <input type="email" className="w-full bg-white rounded-xl p-4 text-black/70 mb-4 focus:outline-none focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)] transition-all" placeholder="Work Email" />
                 </div>
               </Reveal>
               <Reveal delay={0.3}>
                 <button className="w-full bg-white text-black font-mono-brand font-normal rounded-4xl py-5 hover:bg-slate-200 transition-all shadow-xl hover:shadow-2xl flex justify-center items-center gap-3 group">
                   JOIN THE WAITLIST
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               </Reveal>
               <Reveal delay={0.35}>
                 <p className="text-center text-xs" style={{ color: '#B8B8B8' }}>
                   Limited spots available for the Beta V1 cohort.
                 </p>
               </Reveal>
            </form>
            </div>
          </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 text-slate-400 text-xs font-mono-brand" style={{ backgroundColor: '#010101' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
           <div>© 2025 LIGHTBOX INC.</div>
           <div className="flex gap-8">
             <a href="#" className="hover:text-white">PRIVACY</a>
             <a href="#" className="hover:text-white">TERMS</a>
             <a href="#" className="hover:text-white">CONTACT</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;