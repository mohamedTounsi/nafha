'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, User, Send, MapPin, Phone, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('MESSAGE DEPLOYED SUCCESSFULLY');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('TRANSMISSION FAILED');
      }
    } catch (error) {
      toast.error('SIGNAL LOST. TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-black" />
              <span className="text-black font-black uppercase tracking-[0.3em] text-xs">Communication Hub</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-black mb-8">
              CONTACT <br /> <span className="opacity-40">THE SQUAD</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm mb-12 leading-relaxed max-w-md">
              Need tactical assistance or custom gear intel? Our logistics and support team is on standby 24/7.
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Intel Email', value: 'intel@nafha.tn' },
                { icon: MapPin, label: 'HQ Location', value: 'Tactical District, Tunisia' },
                { icon: Phone, label: 'Direct Line', value: '+216 22 000 000' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{item.label}</p>
                    <p className="text-xl font-black uppercase italic text-black">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="game-card p-8 md:p-12 bg-white border-2 border-black shadow-[15px_15px_0px_#000000] relative">
              <div className="absolute -top-4 -right-4 bg-primary px-4 py-2 border-2 border-black font-black text-xs uppercase tracking-widest -rotate-2">
                Priority: High
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Identification (Name)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input 
                      required
                      className="w-full bg-zinc-50 border-2 border-black p-4 pl-12 rounded-2xl outline-none focus:bg-white transition-all font-bold"
                      placeholder="ENTER NAME"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Terminal Address (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input 
                      required
                      type="email"
                      className="w-full bg-zinc-50 border-2 border-black p-4 pl-12 rounded-2xl outline-none focus:bg-white transition-all font-bold"
                      placeholder="EMAIL@TERMINAL.COM"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Transmission (Message)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-black/20" />
                    <textarea 
                      required
                      rows={5}
                      className="w-full bg-zinc-50 border-2 border-black p-4 pl-12 rounded-2xl outline-none focus:bg-white transition-all font-bold resize-none"
                      placeholder="ENTER INTEL HERE..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="game-button w-full py-5 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Zap className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      DEPLOY MESSAGE
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
