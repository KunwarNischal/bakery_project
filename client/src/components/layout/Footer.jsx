import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-cardBg border-t border-primary/5 py-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                <div>
                    <h3 className="text-2xl font-display font-bold text-primary">Hatemalo Bakery</h3>
                    <p className="text-secondary mt-2 text-[10px] font-bold uppercase tracking-widest opacity-60">Baking happiness every day.</p>
                </div>
                <div className="text-primary text-[10px] font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Hatemalo Bakery. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
