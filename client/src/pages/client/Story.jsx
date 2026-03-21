import React from 'react';

const Story = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 mt-10 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-secondary mb-6 lowercase">Since 1980</span>
          <h2 className="font-display text-6xl font-bold text-primary mb-10">Baking with <br/><span className="text-secondary italic">Heart & Soul</span></h2>
          <div className="space-y-6 text-primary leading-relaxed font-body">
            <p>At Hatemalo Bakery, we believe that the best things in life are made by hand. Our journey started in a small kitchen in Dhanusha, driven by a passion for authentic flavors and traditional baking techniques.</p>
            <p>Every loaf of bread, every delicate pastry, and every celebration cake is crafted with the highest quality ingredients, sourced locally whenever possible.</p>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-12 border-t border-primary/5 pt-12">
            <div>
               <h4 className="text-3xl font-display font-bold text-primary mb-2">40+</h4>
               <p className="text-[8px] font-bold uppercase tracking-widest text-primary">Years of Heritage</p>
            </div>
            <div>
               <h4 className="text-3xl font-display font-bold text-primary mb-2">100%</h4>
               <p className="text-[8px] font-bold uppercase tracking-widest text-primary">Artisanal Process</p>
            </div>
            <div>
               <h4 className="text-3xl font-display font-bold text-primary mb-2">50k+</h4>
               <p className="text-[8px] font-bold uppercase tracking-widest text-primary">Happy Customers</p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 aspect-square bg-cardBg rounded-[4rem] flex items-center justify-center text-[15rem] shadow-inner">
           <span className="animate-float">👨‍🍳</span>
        </div>
      </div>
    </div>
  );
};

export default Story;
