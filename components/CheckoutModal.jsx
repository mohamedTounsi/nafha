'use client';
import { useState } from 'react';
import { X, CheckCircle2, Loader2, Send, MapPin, Phone, User, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CheckoutModal({ isOpen, onClose, cart, onOrderSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 8;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price
          })),
          total: total
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Order placed successfully!');
        onOrderSuccess();
        router.push('/thank-you');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] cursor-pointer"
          />

          {/* Slide-in Drawer — same style as Cart */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l-2 border-black z-[90] flex flex-col shadow-[-12px_0px_40px_rgba(0,0,0,0.2)] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b-2 border-black flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6 text-black" />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black italic">Checkout</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black hover:text-white rounded-full transition-colors border-2 border-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-b-2 border-black bg-zinc-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">Order Summary</p>
              <div className="space-y-3">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-black">
                    <div className="w-12 h-12 rounded-xl border-2 border-black overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.src='https://placehold.co/100x100?text=img'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-black text-sm uppercase italic block truncate">{item.name}</span>
                      <span className="text-black/40 text-xs">x{item.quantity}</span>
                    </div>
                    <span className="font-black text-sm whitespace-nowrap">{(item.price * item.quantity)} TND</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-black flex justify-between">
                <span className="font-black text-black uppercase text-sm">Delivery</span>
                <span className="font-black text-black text-sm">{deliveryFee} TND</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-black text-black uppercase text-xl italic">TOTAL</span>
                <span className="font-black text-black text-xl">{total} TND</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Delivery Information</p>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input 
                  required type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <input 
                  required type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none text-black font-bold focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="+216 55 123 456"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> City
                </label>
                <select 
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none text-black font-bold cursor-pointer focus:ring-2 focus:ring-black/20 transition-all"
                >
                  <option value="">Select City</option>
                  <option>Tunis</option>
                  <option>Sousse</option>
                  <option>Sfax</option>
                  <option>Bizerte</option>
                  <option>Gabes</option>
                  <option>Nabeul</option>
                  <option>Kairouan</option>
                  <option>Monastir</option>
                  <option>Gafsa</option>
                  <option>Kasserine</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                  <Home className="w-3 h-3" /> Full Address
                </label>
                <textarea 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-black p-4 rounded-xl outline-none text-black font-bold h-24 resize-none focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="Street, Apartment, Postcode..."
                />
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="game-button w-full py-5 text-base cursor-pointer mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    CONFIRM ORDER — {total} TND
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
