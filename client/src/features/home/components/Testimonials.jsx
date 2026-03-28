/**
 * Testimonials Component - Displays customer reviews and ratings
 *
 * Features:
 * - Shows customer quotes and reviews
 * - Displays 5-star ratings for each testimonial
 * - Shows customer name and role/description
 * - Responsive grid layout for multiple testimonials
 * - Highlights the bakery's quality and customer satisfaction
 */

import React from 'react';

const Testimonials = () => (
  <section className="py-24 px-6 max-w-5xl mx-auto text-center">
    <h2 className="font-display text-3xl font-bold text-primary mb-6">What Our Customers Say</h2>
    <h3 className="font-display text-4xl font-bold text-primary mb-20 italic">"The smell of freshly baked bread is like heaven on earth."</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        { text: "The crossiants are better than any I've had in Paris!", author: "Sangeeta R.", role: "Cheese Lover" },
        { text: "My kids won't eat any other bread. Hatemalo is our daily ritual.", author: "Pramod K.", role: "Regular Customer" },
        { text: "Authentic, warm, and absolutely delicious every single time.", author: "Sita T.", role: "Professional Foodie" }
      ].map((t, idx) => (
        <div key={idx} className="space-y-4">
          <div className="flex justify-center gap-1 text-accent mb-4">{"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}</div>
          <p className="text-primary font-body italic leading-relaxed">"{t.text}"</p>
          <div className="pt-4">
            <p className="font-bold text-primary text-sm">{t.author}</p>
            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
