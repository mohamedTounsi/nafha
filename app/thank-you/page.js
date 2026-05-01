'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Share2, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen  bg-white flex flex-col">
      <Navbar cartCount={0} onCartClick={() => { }} />

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Tactical Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] select-none">
          <p className="text-[30vw] font-black uppercase leading-none tracking-tighter absolute -top-10 -left-10">SUCCESS</p>
        </div>

        <div className="max-w-2xl py-20 md:py-0  w-full text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-4 border-black shadow-[12px_12px_0px_#000000] rotate-3"
          >
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-black" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-black mb-6 leading-none">
              MISSION <br /> ACCOMPLISHED
            </h1>
            <p className="text-sm md:text-base font-bold text-black/60 uppercase tracking-[0.3em] mb-12 max-w-md mx-auto leading-relaxed">
              Tactical assets successfully deployed. Your order has been received and is now being processed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/shop" className="w-full sm:w-auto game-button py-5 px-10 text-xs flex items-center justify-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              Return to SHOP
            </Link>


          </motion.div>


        </div>
      </div>

      <Footer />
    </main>
  );
}
