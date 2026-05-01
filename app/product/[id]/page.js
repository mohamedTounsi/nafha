'use client';
import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Zap, ArrowLeft, Package, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProductDetails({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    isCartOpen, 
    setIsCartOpen, 
    isCheckoutOpen, 
    setIsCheckoutOpen,
    clearCart 
  } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const buyNow = (product) => {
    addToCart(product);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Item Not Found</h1>
        <Link href="/" className="game-button">Go Back to Base</Link>
      </div>
    );
  }

  const isSoldOut = product.stock <= 0;

  return (
    <main className="min-h-screen">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      <div className="max-w-6xl mx-auto px-6 py-0 md:py-16 pb-24 md:pb-32">
        <div className="py-8 md:p-0">
          <Link href="/shop" className="inline-flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-12 text-[10px] font-black uppercase tracking-[0.3em] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Shop
          </Link>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image Column — Tactical Card Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="aspect-square bg-zinc-50 border-2 border-black rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <img 
                src={product.image} 
                className="w-full h-full object-cover" 
                alt={product.name} 
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x800?text=Asset+Image';
                }}
              />
            </div>
          </motion.div>

          {/* Details Column — Clean & Pro */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col px-6 md:px-0"
          >
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4 block">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-6 leading-tight text-black">
                {product.name}
              </h1>
              <p className="text-zinc-600 text-sm leading-relaxed font-bold max-w-md">
                {product.description}
              </p>
            </div>

            <div className="mb-12 border-t-2 border-black/5 pt-10">
              <div className="flex items-end gap-3 mb-8">
                <span className="text-5xl md:text-6xl font-black text-black italic tracking-tighter">
                  {product.price * selectedQuantity}
                </span>
                <span className="text-lg font-bold text-black uppercase italic mb-2">TND</span>
              </div>
              
              {!isSoldOut && (
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4 bg-zinc-50 p-1 rounded-xl border-2 border-black">
                    <button 
                      onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white rounded-lg transition-all text-black active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-black w-8 text-center tabular-nums text-black">{selectedQuantity}</span>
                    <button 
                      onClick={() => {
                        if (selectedQuantity >= product.stock) {
                          toast.error(`Stock limit reached!`);
                          return;
                        }
                        setSelectedQuantity(prev => prev + 1);
                      }}
                      className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white rounded-lg transition-all text-black active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Select Quantity</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <button 
                disabled={isSoldOut}
                onClick={() => addToCart(product, selectedQuantity)}
                className="bg-black text-white py-5 rounded-2xl border-2 border-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-[4px_4px_0px_#000000]"
              >
                <img src="/nafhaiconlight.png" className="w-5 h-5 object-contain" alt="Icon" />
                Add to Cart
              </button>
              <button 
                disabled={isSoldOut}
                onClick={() => {
                  addToCart(product, selectedQuantity);
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="bg-primary text-black py-5 rounded-2xl border-2 border-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer shadow-[4px_4px_0px_#000000]"
              >
                <img src="/nafhaicon.webp" className="w-5 h-5 object-contain" alt="Icon" />
                Buy Now
              </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t-2 border-black/5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-black" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Guaranteed Asset</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-black" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Rapid Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-black" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Secured Payload</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart} 
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cart={cart} 
        onOrderSuccess={() => {
          setIsCheckoutOpen(false);
          clearCart();
          fetchProduct();
        }}
      />

      <Footer />
    </main>
  );
}
