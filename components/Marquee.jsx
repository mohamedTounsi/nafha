'use client';
import { motion } from 'framer-motion';

const items = [
  "KILL TIME",
  "BEAT STRESS",
  "HAVE FUN",
  "NAFHA.TN",
  "FIDGET",
  "PLAY",
  "RELAX",
  "TACTICAL",
  "LEVEL UP"
];

export default function Marquee() {
  return (
    <div className="bg-primary border-y-2 border-black py-8 md:py-12 overflow-hidden flex whitespace-nowrap">
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ 
          duration: 35, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex items-center gap-16 pr-16"
      >
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-16">
            <span className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black leading-none">
              {item}
            </span>
            <img 
              src="/iconmarquee.png" 
              alt="Icon" 
              className="w-10 h-10 md:w-16 md:h-16 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
