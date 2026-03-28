/**
 * About Us / Story Page Component
 *
 * This page tells the story of Hatemalo Bakery.
 * It includes:
 * - Background story about the bakery's founding and mission
 * - Years of heritage and experience information
 * - Percentage of artisanal process
 * - Number of happy customers
 * - Beautiful imagery representing the bakery
 *
 * This page helps customers understand the bakery's values and history.
 */

import React from 'react';

const Story = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 mt-10 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1">
          {/* Founding year of the bakery */}
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-secondary mb-6 lowercase">Since 2081 B.S.</span>

          {/* Page title */}
          <h2 className="font-display text-6xl font-bold text-primary mb-10">Baking with <br/><span className="text-secondary italic">Heart & Soul</span></h2>

          {/* Bakery mission and story paragraphs */}
          <div className="space-y-6 text-primary leading-relaxed font-body">
            <p>At Hatemalo Bakery, we believe that the best things in life are made by hand. Our journey started in a small kitchen in Dhanusha, driven by a passion for authentic flavors and traditional baking techniques.</p>
            <p>Every loaf of bread, every delicate pastry, and every celebration cake is crafted with the highest quality ingredients, sourced locally whenever possible.</p>
          </div>

          {/* Key statistics showcasing bakery achievements */}
          <div className="grid grid-cols-3 gap-8 mt-12 border-t border-primary/5 pt-12">
            <div>
              {/* Years of experience */}
              <h4 className="text-3xl font-display font-bold text-primary mb-2">1+</h4>
              <p className="text-[8px] font-bold uppercase tracking-widest text-primary">Years of Heritage</p>
            </div>
            <div>
              {/* Quality metric */}
              <h4 className="text-3xl font-display font-bold text-primary mb-2">100%</h4>
              <p className="text-[8px] font-bold uppercase tracking-widest text-primary">Artisanal Process</p>
            </div>
            <div>
              {/* Customer count */}
              <h4 className="text-3xl font-display font-bold text-primary mb-2">5k+</h4>
              <p className="text-[8px] font-bold uppercase tracking-widest text-primary">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Visual illustration of the bakery chef */}
        <div className="order-1 lg:order-2 aspect-square bg-cardBg rounded-[4rem] flex items-center justify-center text-[15rem] shadow-inner">
          <span className="animate-float">👨‍🍳</span>
        </div>
      </div>
    </div>
  );
};

export default Story;
