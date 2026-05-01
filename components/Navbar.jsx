'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Gamepad2, Sparkles, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { cart, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-primary px-4 md:px-10 py-4 border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto flex justify-between items-center">
        {/* Left Side: Logo & Desktop Links */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-black uppercase italic">
              NAFHA<span className="text-zinc-800">.TN</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-black/70 hover:text-black transition-colors">Home</Link>
            <Link href="/shop" className="text-[11px] font-black uppercase tracking-[0.2em] text-black/70 hover:text-black transition-colors">Shop</Link>
            <Link href="/about" className="text-[11px] font-black uppercase tracking-[0.2em] text-black/70 hover:text-black transition-colors">About</Link>
            <Link href="/contact" className="text-[11px] font-black uppercase tracking-[0.2em] text-black/70 hover:text-black transition-colors">Contact</Link>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-black/10 rounded-full hover:bg-black/20 transition-colors group"
          >
            <ShoppingBag className="w-5 h-5 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary">
                {cartCount}
              </span>
            )}
          </button>

          {/* Shop Now — Hidden on Mobile */}
          <Link href="/shop" className="hidden md:flex bg-[#0f172b] text-white px-6 py-2.5 rounded-xl items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
            <img src="/nafhaiconlight.png" className="w-5 h-5 object-contain" alt="Icon" />
            Shop Now
          </Link>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 bg-black text-white rounded-full border-2 border-black shadow-[4px_4px_0px_#ffffff]"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 w-full bg-primary border-b-2 border-black p-6 flex flex-col gap-6 z-40"
        >
          <Link onClick={() => setIsMenuOpen(false)} href="/" className="text-2xl font-black uppercase italic tracking-tighter text-black border-b-2 border-black pb-4">Home</Link>
          <Link onClick={() => setIsMenuOpen(false)} href="/shop" className="text-2xl font-black uppercase italic tracking-tighter text-black border-b-2 border-black pb-4">Shop</Link>
          <Link onClick={() => setIsMenuOpen(false)} href="/about" className="text-2xl font-black uppercase italic tracking-tighter text-black border-b-2 border-black pb-4">About</Link>
          <Link onClick={() => setIsMenuOpen(false)} href="/contact" className="text-2xl font-black uppercase italic tracking-tighter text-black pb-4">Contact</Link>
        </motion.div>
      )}
    </nav>
  );
}
