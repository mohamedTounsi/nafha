'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Target, Zap, Users, Boxes, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest mb-8">
              <Shield className="w-3 h-3 text-primary" /> Established 2024
            </div>
            <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-black mb-8">
              THE <span className="opacity-30">MISSION</span> <br /> IS NAFHA
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-500 font-bold uppercase tracking-widest text-xs md:text-sm leading-relaxed mb-12">
              We are a tactical deployment squad specialized in high-fidelity gear and accessories. Our mission is to equip the community with the most advanced assets in the district.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-zinc-50 py-24 border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Target, title: 'Precision', desc: 'Every asset is selected with surgical accuracy for the highest performance.' },
              { icon: Zap, title: 'High Voltage', desc: 'Energy and impact are at the core of our design language and gear selection.' },
              { icon: Boxes, title: 'Modularity', desc: 'Build your loadout your way. Modularity is key to tactical success.' }
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="game-card p-10 bg-white border-2 border-black shadow-[8px_8px_0px_#000000] hover:-translate-y-2 transition-all"
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-8">
                  <v.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{v.title}</h3>
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Units Deployed', value: '50k+', icon: Zap },
            { label: 'Active Squad', value: '12k+', icon: Users },
            { label: 'Nafha Awards', value: '15', icon: Award },
            { label: 'Global Intel', value: '24/7', icon: Shield }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center gap-2 text-black/10 mb-4">
                <s.icon className="w-4 h-4" />
                <div className="w-12 h-[1px] bg-black/10" />
              </div>
              <h4 className="text-4xl md:text-5xl font-black italic uppercase text-black mb-2">{s.value}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary p-12 md:p-24 rounded-[3rem] border-2 border-black shadow-[15px_15px_0px_#000000] relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
              <div className="absolute top-10 left-10 text-4xl font-black italic -rotate-12">NAFHA</div>
              <div className="absolute bottom-10 right-10 text-4xl font-black italic rotate-12">SQUAD</div>
            </div>
            
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-black mb-10 leading-tight">
              JOIN THE <br /> TACTICAL REVOLUTION
            </h2>
            <Link href="/shop" className="game-button py-6 px-12 text-sm">
              BROWSE THE ARSENAL
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
