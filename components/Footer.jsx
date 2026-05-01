'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, Check, Loader2 } from 'lucide-react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
        toast.success('Message sent!');
      } else {
        toast.error('Failed to send message');
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t-2 border-black bg-primary">

      {/* Main Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-black">

        {/* Col 1 — Brand */}
        <div className="p-6 md:p-10 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-between gap-8">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black mb-4">NAFHA.TN</h2>
            <p className="text-black/70 font-bold text-sm leading-relaxed uppercase tracking-tighter">
              Your daily dose of cool<br />
              Fidgets • Gadgets • Fun stuff
            </p>
          </div>

          <div className="space-y-3 text-black font-bold text-sm">
            <a href="tel:+21658539630" className="flex items-center gap-3 hover:opacity-60 transition-opacity cursor-pointer">
              <Phone className="w-4 h-4" /> +216 58 539 630
            </a>
            <a href="mailto:azizlouati220805@gmail.com" className="flex items-center gap-3 hover:opacity-60 transition-opacity cursor-pointer">
              <Mail className="w-4 h-4" /> azizlouati220805@gmail.com
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/nafha.tn/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl hover:bg-white hover:text-black border-2 border-black transition-all cursor-pointer"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@nafha.tn4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl hover:bg-white hover:text-black border-2 border-black transition-all cursor-pointer"
            >
              <FaTiktok className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div className="p-6 md:p-10 border-b-2 md:border-b-0 md:border-r-2 border-black">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-8">Quick Links</h3>
          <nav className="space-y-4">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: 'All Products', href: '/shop' },
              { label: 'Contact', href: '#contact' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="block font-black uppercase text-xl tracking-tighter text-black hover:translate-x-2 transition-transform cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Col 3 — Contact Form */}
        <div className="p-6 md:p-10" id="contact">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-8">Send a Message</h3>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-48 gap-4"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="font-black uppercase text-black text-center">Message Received!<br /><span className="text-sm opacity-60">We'll get back to you soon.</span></p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border-2 border-black p-3 rounded-xl font-bold text-black placeholder-black/30 outline-none focus:shadow-[4px_4px_0px_#000000] transition-all"
              />
              <input
                required
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border-2 border-black p-3 rounded-xl font-bold text-black placeholder-black/30 outline-none focus:shadow-[4px_4px_0px_#000000] transition-all"
              />
              <textarea
                required
                rows={4}
                placeholder="Your message..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white border-2 border-black p-3 rounded-xl font-bold text-black placeholder-black/30 outline-none resize-none focus:shadow-[4px_4px_0px_#000000] transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-[4px_4px_0px_#ffffff]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between px-10 py-5 gap-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-black/60">
          COPYRIGHT © 2026 NAFHA.TN — ALL RIGHTS RESERVED
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-black/60">
          DEVELOPED BY{' '}
          <a
            href="https://portfoliomt-kohl.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black transition-colors cursor-pointer"
          >
            MOHAMED TOUNSI
          </a>
        </p>
      </div>
    </footer>
  );
}
