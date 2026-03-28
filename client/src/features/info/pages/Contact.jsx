/**
 * Contact Us Page Component
 *
 * This page displays bakery contact information and location.
 * It includes:
 * - Bakery location address in Dhanusha, Nepal
 * - Phone number for customer inquiries
 * - Embedded Google Map showing the bakery location
 *
 * This is a simple informational page for customers to find how to reach the bakery.
 */

import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 mt-20 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-secondary mb-6">Find Our Bakery</span>
          <h2 className="font-display text-5xl font-bold text-primary mb-8">Visit Us for <br/><span className="text-secondary italic">Fresh Breads</span></h2>
          <div className="space-y-10">
            <div className="flex gap-6">
              <span className="text-4xl">📍</span>
              <div>
                <h4 className="font-bold text-primary uppercase text-[10px] tracking-widest mb-2">Location</h4>
                <p className="text-primary text-sm leading-relaxed font-body">Hatemalo Bakery Road, Chure,<br/>Dhanusha, Nepal</p>
              </div>
            </div>
            <div className="flex gap-6">
              <span className="text-4xl">📞</span>
              <div>
                <h4 className="font-bold text-primary uppercase text-[10px] tracking-widest mb-2">Call Us</h4>
                <p className="text-primary text-sm leading-relaxed font-body">+977 9812198432</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="aspect-square bg-cardBg rounded-[3rem] border border-primary/5 overflow-hidden shadow-xl">
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57187.39169620456!2d85.91890184863281!3d26.732912499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec401a00000001%3A0xe5a3c9e6e6e6e6e6!2sJanakpur%20Nepal!5e0!3m2!1sen!2snp!4v1710834244567!5m2!1sen!2snp" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen="" 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
           ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
