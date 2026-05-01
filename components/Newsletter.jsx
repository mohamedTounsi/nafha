'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        toast.success('Welcome to the tactical squad!');
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden ">
      {/* Top Transition - Massive Word clipped perfectly, no overflow */}
      <div className="bg-primary border-b-2 border-black overflow-hidden flex items-end justify-center h-[120px] md:h-[280px]">
        <h2 className="text-[22vw] font-black uppercase tracking-tighter leading-[0.75] text-black select-none whitespace-nowrap">
          NAFHA
        </h2>
      </div>

      {/* Main Newsletter Section */}
      <div className="bg-[#0a0a0a] py-24 px-6 md:py-32 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-12"
          >
            <div>
              <h3 className="text-3xl md:text-7xl font-black uppercase tracking-tight text-primary leading-none mb-6 italic">
                STAY IN THE LOOP WITH <br className="hidden md:block" /> OUR WEEKLY NEWSLETTER
              </h3>
              <p className="text-primary/60 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2">
                *** WE ARE NOT GOING TO SAVE YOUR DATA FOREVER.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-4 max-w-4xl w-full">
              <input
                type="email"
                placeholder="Business Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-2 border-primary/20 rounded-full px-8 py-5 text-primary font-bold focus:outline-none focus:border-primary transition-all placeholder:text-primary/30"
                required
              />
              <button
                disabled={loading || subscribed}
                className="bg-primary text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest italic border-2 border-black hover:bg-black hover:text-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer whitespace-nowrap shadow-[8px_8px_0px_#ffffff,10px_10px_0px_#0f172b] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : subscribed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="flex items-center gap-3 font-black italic">
                    SUBSCRIBE <img src="/nafhaicon.webp" className="w-5 h-5 object-contain" alt="Icon" />
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Decorative background element - contained, no overflow */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </div>
    </section>
  );
}