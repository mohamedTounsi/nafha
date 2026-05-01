'use client';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart({ isOpen, onClose, cart, onRemove, onCheckout }) {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 8;
  const total = subtotal + deliveryFee;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#fafafa] border-l-2 border-black z-[70] flex flex-col shadow-[-12px_0px_40px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="p-8 border-b-2 border-black flex justify-between items-center flex-shrink-0 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-black italic leading-none">Your Loadout</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mt-1">{cart.length} tactical assets</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black hover:text-white rounded-full transition-all border-2 border-black cursor-pointer active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <div className="w-24 h-24 bg-zinc-100 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-dashed border-black/10">
                    <ShoppingBag className="w-10 h-10 text-black/10" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-black mb-2">Inventory Empty</h3>
                  <p className="text-xs font-bold text-black/40 uppercase tracking-widest leading-relaxed mb-8">Your tactical squad is waiting for new gear. Start scouting now.</p>
                  <button onClick={onClose} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-white hover:text-black transition-all cursor-pointer shadow-[6px_6px_0px_#2ef2c9]">
                    Browse Inventory
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item._id || index}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-5 p-4 bg-white rounded-2xl border-2 border-black group transition-all"
                    >
                      <div className="w-24 h-24 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 border-2 border-black group-hover:scale-105 transition-transform">
                        <img 
                          src={item.image} 
                          className="w-full h-full object-cover" 
                          alt={item.name} 
                          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-black text-black text-base uppercase italic tracking-tighter leading-tight line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase text-black/40 border border-black/10 px-2 rounded">QTY: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-black text-black text-lg">{item.price} <span className="text-[10px] uppercase">TND</span></p>
                          <button 
                            onClick={() => onRemove(item._id)}
                            className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer opacity-40 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-white border-t-2 border-black space-y-6 flex-shrink-0 shadow-[0px_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Subtotal</span>
                    <span className="font-black text-black">{subtotal} TND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Logistics Fee</span>
                    <span className="font-black text-black">{deliveryFee} TND</span>
                  </div>
                  <div className="pt-4 border-t border-black/10 flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Total Amount</span>
                    <span className="text-3xl font-black text-black italic tracking-tighter leading-none">{total} <span className="text-xs not-italic uppercase tracking-normal">TND</span></span>
                  </div>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 border-2 border-black shadow-[6px_6px_0px_#2ef2c9] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Confirm Deployment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
