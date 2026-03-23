/**
 * Hero Component - Main banner section of the home page
 *
 * Displays:
 * - Attractive hero title highlighting the bakery's craft
 * - Descriptive subheading about fresh artisanal treats
 * - Call-to-action buttons to explore menu or learn about the bakery
 * - Large banner image showcasing the bakery
 * - Animated decorative background elements
 * - Scroll indicator at the bottom
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  // Use navigate hook to programmatically navigate to different pages
  const navigate = useNavigate();
  return (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-32 pb-12">
    <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
    <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
    
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10 animate-fade-in-up">
      <div className="text-left">
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-6 border-b border-secondary/20 pb-2">Crafted with Love</span>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-8 leading-[0.9]">
          The Art of <br />
          <span className="text-secondary italic">Perfect Baking</span>
        </h1>
        <p className="text-lg md:text-xl text-primary mb-12 max-w-xl font-body leading-relaxed">
          Experience the warmth of freshly baked artisanal treats, where every bite tells a story of tradition and quality.
        </p>
        <div className="flex flex-col sm:flex-row items-start justify-start gap-6">
          <button onClick={() => navigate('/menu')} className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-full hover:bg-secondary hover:translate-y-[-4px] transition-all shadow-2xl uppercase tracking-widest text-xs">Explore Menu</button>
          <button onClick={() => navigate('/story')} className="w-full sm:w-auto px-10 py-5 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-xs">Our Story</button>
        </div>
      </div>

      <div className="relative group p-4 md:p-0">
        <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl group-hover:bg-primary/10 transition-colors"></div>
        <img 
          src="/hatemalo-banner.jpg" 
          alt="Artisanal Bakery Banner" 
          className="relative w-full h-auto rounded-[2.5rem] shadow-2xl border-4 border-white/50 group-hover:scale-[1.02] transition-transform duration-700"
        />
      </div>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-primary animate-bounce">
      <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to taste</span>
      <span className="text-xl">↓</span>
    </div>
  </section>
  );
};

export default Hero;
