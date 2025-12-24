/*
  UFO Burgers — Cinematic Landing Page
  
  Features:
  - Cosmic background with stars, nebula, vignette, and film grain
  - Large UFO hero with glow effect
  - Warm beam spotlight with active burger centered
  - Carousel with prev/next navigation and keyboard support
  - Additional content sections: Legend, Planets, Why Wallsend, Join the Crew
*/

"use client";

import { useState, useEffect, useCallback } from "react";
import Galaxy from "./components/Galaxy";

/* Burger data — each burger represents a planet */
const burgers = [
  { id: "neptun", name: "Neptune", tagline: "The Mysterious Deep Blue" },
  { id: "uranus", name: "Uranus", tagline: "Cool & Uniquely Tilted" },
  { id: "saturn", name: "Saturn", tagline: "Ringed Perfection" },
  { id: "jupiter", name: "Jupiter", tagline: "The Mighty Giant" },
  { id: "erde", name: "Earth", tagline: "The Home Classic" },
  { id: "venus", name: "Venus", tagline: "Hot & Spicy Inferno" },
  { id: "mars", name: "Mars", tagline: "The Red Pioneer" },
  { id: "merkur", name: "Mercury", tagline: "Small but Mighty" },
];


export default function Home() {
  /* Whether the experience has started (user clicked enter) */
  const [hasStarted, setHasStarted] = useState(false);
  
  /* Whether the spotlight/carousel is visible (user clicked UFO) */
  const [isOpen, setIsOpen] = useState(false);
  
  /* Which burger is currently selected (index) */
  const [activeIndex, setActiveIndex] = useState(3);
  
  /* Whether the info card should be shown (user clicked a burger) */
  const [showInfo, setShowInfo] = useState(false);

  /* Dynamic spacing for mobile responsiveness */
  const [burgerSpacing, setBurgerSpacing] = useState(480);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setBurgerSpacing(390);
      } else {
        setBurgerSpacing(480);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  /* Intro animation states */
  const [introPhase, setIntroPhase] = useState(0);
  // Phase 0: Only background visible (waiting for user to start)
  // Phase 1: UFO flying in
  // Phase 2: UFO landed, title appearing
  // Phase 3: Everything visible
  
  /* Calculate horizontal offset to center the active burger */
  const getCarouselOffset = useCallback(() => {
    // Offset to move the active burger to center
    return -activeIndex * burgerSpacing;
  }, [activeIndex, burgerSpacing]);

  /* Navigate to a specific burger */
  const goToBurger = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, burgers.length - 1));
    setActiveIndex(clamped);
    setShowInfo(true);
  }, []);

  /* Navigate to previous burger */
  const goToPrev = useCallback(() => {
    goToBurger(activeIndex - 1);
  }, [activeIndex, goToBurger]);

  /* Navigate to next burger */
  const goToNext = useCallback(() => {
    goToBurger(activeIndex + 1);
  }, [activeIndex, goToBurger]);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowInfo(false);
      }
    };
    
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goToNext, goToPrev]);

  /* Intro animation sequence - starts after user clicks enter */
  useEffect(() => {
    if (!hasStarted) return;
    
    // Phase 1: Start UFO flying in after 0.5 seconds
    const timer1 = setTimeout(() => {
      setIntroPhase(1);
    }, 500);

    // Phase 2: UFO landed, show title after UFO animation (0.5s delay + 6s animation)
    const timer2 = setTimeout(() => {
      setIntroPhase(2);
    }, 6500);

    // Phase 3: Show click hint after title appears
    const timer3 = setTimeout(() => {
      setIntroPhase(3);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [hasStarted]);

  /* Play cosmic sound when UFO flies in */
  useEffect(() => {
    if (introPhase !== 1) return;
    
    // Create audio context
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Main oscillator - deep bass drone
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(60, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 4);
    
    // Harmonic oscillator - ethereal high tone
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 5);
    
    // Noise generator for "whoosh" effect
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    // Lowpass filter for smoother noise
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2000, audioCtx.currentTime);
    lowpass.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 5);
    
    // Gain nodes for volume envelopes
    const gainOsc1 = audioCtx.createGain();
    gainOsc1.gain.setValueAtTime(0, audioCtx.currentTime);
    gainOsc1.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1);
    gainOsc1.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 5);
    gainOsc1.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 6);
    
    const gainOsc2 = audioCtx.createGain();
    gainOsc2.gain.setValueAtTime(0, audioCtx.currentTime);
    gainOsc2.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.5);
    gainOsc2.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 4);
    gainOsc2.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 6);
    
    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNoise.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.3);
    gainNoise.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 4);
    gainNoise.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 6);
    
    // Connect audio graph
    osc1.connect(gainOsc1).connect(audioCtx.destination);
    osc2.connect(gainOsc2).connect(audioCtx.destination);
    noise.connect(lowpass).connect(gainNoise).connect(audioCtx.destination);
    
    // Start all sound sources
    osc1.start();
    osc2.start();
    noise.start();
    
    // Stop after 6 seconds (matches UFO animation duration)
    osc1.stop(audioCtx.currentTime + 6);
    osc2.stop(audioCtx.currentTime + 6);
    noise.stop(audioCtx.currentTime + 6);
    
    return () => {
      audioCtx.close();
    };
  }, [introPhase]);

  return (
    <>
      {/* ===== ENTER SPLASH SCREEN ===== */}
      {!hasStarted && (
        <div className="splash-screen">
          <div className="splash-content">
            <h1 className="splash-title">UFO BURGERS</h1>
            <p className="splash-subtitle">A Cosmic Experience</p>
            <button 
              className="splash-enter"
              onClick={() => setHasStarted(true)}
            >
              Enter
            </button>
          </div>
        </div>
      )}

      {/* ===== COSMIC BACKGROUND LAYERS ===== */}
      <div className="cosmos-bg" />
      <div className="galaxy-wrapper">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.2}
          glowIntensity={0.4}
          saturation={0.6}
          hueShift={220}
          speed={0.5}
          twinkleIntensity={0.4}
          rotationSpeed={0.02}
          transparent={true}
        />
      </div>
      <div className="nebula-layer" />
      <div className="vignette" />
      <div className="film-grain" />

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-wrapper">
        
        {/* ===== HERO SECTION ===== */}
        <section className="hero-section">
          
          {/* Header */}
          <header className={`hero-header ${introPhase >= 2 ? "intro-visible" : "intro-hidden"}`}>
            <h1 className="hero-title">UFO BURGERS</h1>
            <p className="hero-subtitle">A Cosmic Experience Landing in Wallsend</p>
          </header>

          {/* Click hint */}
          <p className={`click-hint ${isOpen ? "click-hint-hidden" : ""} ${introPhase >= 3 ? "intro-hint-visible" : "intro-hint-hidden"}`}>
            Click the UFO
          </p>

          {/* UFO + Beam + Carousel Container */}
          <div className="ufo-beam-wrapper">
            {/* UFO - clickable */}
            <button 
              className={`ufo-container ${introPhase >= 1 ? "ufo-flying-in" : "ufo-hidden"} ${introPhase >= 2 ? "ufo-landed" : ""}`}
              onClick={() => {
                if (introPhase < 2) return; // Don't allow click during intro
                setIsOpen(!isOpen);
                if (isOpen) setShowInfo(false);
              }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <div className="ufo-glow" />
              <img
                src="/ufo.png"
                alt="UFO Spaceship"
                className="ufo-image"
                draggable={false}
              />
            </button>
            
            {/* Warm Beam / Spotlight - directly under UFO */}
            <div className={`beam-container ${isOpen ? "beam-visible" : "beam-hidden"}`}>
              <div className="beam-atmosphere" />
              <div className="beam-cone" />
              <div className="beam-core" />
              <div className="beam-dust" />
              <div className="beam-hotspot" />
              
              {/* Burger Carousel - inside beam area */}
              <div className={`carousel-wrapper ${isOpen ? "carousel-visible" : "carousel-hidden"}`}>
                {/* Previous Button */}
                <button 
                  onClick={goToPrev}
                  className="carousel-nav carousel-nav-prev"
                  aria-label="Previous burger"
                  disabled={activeIndex === 0}
                  style={{ opacity: activeIndex === 0 ? 0.3 : 1 }}
                >
                  ‹
                </button>

                {/* Carousel Track */}
                <div
                  className="carousel-track"
                  style={{
                    transform: `translateX(${getCarouselOffset()}px)`,
                  }}
                >
                  {burgers.map((burger, index) => {
                    const isActive = index === activeIndex;
                    
                    return (
                      <button
                        key={burger.id}
                        onClick={() => goToBurger(index)}
                        className={`burger-item ${isActive ? "burger-active" : "burger-inactive"}`}
                      >
                        <div className="burger-image-wrapper">
                          <img
                            src={`/burgers/${burger.id}.png`}
                            alt={burger.name}
                            draggable={false}
                          />
                        </div>
                        <span className="burger-label">{burger.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button 
                  onClick={goToNext}
                  className="carousel-nav carousel-nav-next"
                  aria-label="Next burger"
                  disabled={activeIndex === burgers.length - 1}
                  style={{ opacity: activeIndex === burgers.length - 1 ? 0.3 : 1 }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Info Card - erscheint nur wenn ein Burger geklickt wurde */}
          <div className={`info-card ${showInfo && isOpen ? "info-visible" : "info-hidden"}`}>
            <span className="info-label">Now Featuring</span>
            <h2 className="info-name">{burgers[activeIndex].name}</h2>
            <p className="info-tagline">{burgers[activeIndex].tagline}</p>
            <button className="info-button">Explore Menu</button>
          </div>

          {/* Scroll Indicator - only visible when menu is open */}
          <div className={`scroll-indicator ${isOpen ? "" : "scroll-indicator-hidden"}`}>
            <span />
            Scroll
          </div>
        </section>

        {/* ===== THE LEGEND SECTION ===== */}
        <section className="content-section">
          <div className="section-divider" />
          <h2 className="section-title">The Legend</h2>
          <p className="section-subtitle">How It All Began</p>
          <p className="section-text">
            In the summer of 1987, a mysterious light descended upon Wallsend. 
            What locals thought was a fallen star turned out to be something far more extraordinary — 
            a craft from beyond our galaxy, carrying recipes from eight distant worlds. 
            The visitors shared their culinary secrets before departing, leaving behind 
            the blueprints for what would become the most otherworldly burgers on Earth. 
            Each creation is named after a planet, honoring the cosmic journey that brought 
            these flavors to our humble corner of the universe.
          </p>
        </section>

        {/* ===== WHY WALLSEND SECTION ===== */}
        <section className="content-section">
          <div className="section-divider" />
          <h2 className="section-title">Why Wallsend?</h2>
          <p className="section-subtitle">The Landing Site</p>
          <p className="section-text">
            They could have landed anywhere — Paris, New York, Tokyo. But they chose Wallsend. 
            Perhaps it was the ancient Roman wall that once marked the edge of an empire, 
            a beacon visible from space. Perhaps it was the warmth of its people, 
            known throughout the North East for their hospitality. Or perhaps, 
            as the visitors cryptically noted before departing, "Great burgers require 
            great foundations — and nowhere on Earth has foundations quite like this." 
            Whatever the reason, Wallsend became ground zero for a culinary revolution 
            that continues to draw visitors from across the galaxy.
          </p>
        </section>

        {/* ===== JOIN THE CREW SECTION ===== */}
        <section className="content-section">
          <div className="section-divider" />
          <h2 className="section-title">Join the Crew</h2>
          <p className="section-subtitle">Stay Connected</p>
          <p className="section-text" style={{ marginBottom: '40px' }}>
            Be the first to know about new planetary discoveries, 
            exclusive events, and cosmic deals. Join our crew of 
            intergalactic burger enthusiasts.
          </p>
          
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Your Name</label>
              <input 
                type="text" 
                id="name"
                className="form-input" 
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                className="form-input" 
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="message">Message (Optional)</label>
              <textarea 
                id="message"
                className="form-textarea" 
                placeholder="Tell us about your favorite planet..."
              />
            </div>
            <button type="submit" className="form-submit">
              Transmit Message
            </button>
          </form>
        </section>

        {/* ===== STRATEGIC EXPANSION (INVESTOR SECTION) ===== */}
        <section className="content-section expansion-section">
          <div className="section-divider" />
          <h2 className="section-title">Strategic Expansion</h2>
          <p className="section-subtitle">Wallsend was just the Alpha Site</p>
          
          <div className="expansion-grid">
            <div className="expansion-card completed">
              <div className="expansion-status">Alpha Site: Established</div>
              <h3>Wallsend, UK</h3>
              <p>Initial landing confirmed. Core operations and flavor testing at 100% efficiency.</p>
            </div>
            
            <div className="expansion-card pending">
              <div className="expansion-status">Expansion Zone: Target 02</div>
              <h3>London, UK</h3>
              <p>Orbital scanning complete. High-density consumer clusters identified. Scheduled landing: Q4 2025.</p>
            </div>

            <div className="expansion-card pending">
              <div className="expansion-status">Expansion Zone: Target 03</div>
              <h3>New York, USA</h3>
              <p>Intercontinental trajectory planned. Global scaling architecture ready for deployment.</p>
            </div>
          </div>

          <div className="mission-control-cta">
            <p>Ready to fuel the mothership?</p>
            <button className="info-button investor-button">Mission Control: Access Pitch Deck</button>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="footer">
          <p className="footer-text">
            © 2024 <span className="footer-brand">UFO BURGERS</span> · Wallsend, UK · 
            All rights across the known universe reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
