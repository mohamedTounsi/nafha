'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import CategoryList from '@/components/CategoryList';
import Newsletter from '@/components/Newsletter';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Car } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 md:px-10 pt-6 pb-0">
        <div className="max-w-[2000px] mx-auto h-[50vh] md:h-[calc(100vh-96px)] relative rounded-t-[2rem] rounded-b-none overflow-hidden group border-2 border-black border-b-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img src="/nafhahero.webp" className="w-full h-full object-cover hidden md:block" alt="Hero Desktop" />
            <img src="/nafhaherophone.webp" className="w-full h-full object-cover md:hidden" alt="Hero Mobile" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 right-8 hidden md:block"
          >
            <Link href="/shop" className="bg-black text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#2ef2c9] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer">
              <img src="/nafhaiconlight.png" className="w-5 h-5 object-contain" alt="Icon" />
              BROWSE COLLECTION
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="bg-primary py-16 md:py-24 px-6 md:px-10 border-y-2 border-black">
        <div className="max-w-[2000px] mx-auto">
          <h2 className="text-center text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 italic text-black">
            SHOP BY CATEGORY
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.name)}`)}
                className="group flex flex-col items-center gap-4 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="aspect-square w-full rounded-[2rem] overflow-hidden border-2 border-black shadow-[8px_8px_0px_#ffffff,10px_10px_0px_#0f172b] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                  <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs md:text-sm text-black group-hover:text-white group-hover:bg-black group-hover:px-4 group-hover:py-1 group-hover:rounded-full transition-all">
                  {cat.name}
                </span>
              </button>
            ))}
            <button
              onClick={() => router.push('/shop')}
              className="group flex flex-col items-center gap-4 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="aspect-square w-full rounded-[2rem] overflow-hidden border-2 border-black bg-white flex items-center justify-center shadow-[8px_8px_0px_#ffffff,10px_10px_0px_#0f172b] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                <span className="text-4xl md:text-6xl font-black italic">ALL</span>
              </div>
              <span className="font-black uppercase tracking-widest text-xs md:text-sm text-black group-hover:text-white group-hover:bg-black group-hover:px-4 group-hover:py-1 group-hover:rounded-full transition-all">
                Everything
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-[2000px] mx-auto px-3 md:px-10 pt-16 md:pt-24 mb-12 md:mb-17">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 border-b-2 border-black pb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-black" />
              <span className="text-black font-black uppercase tracking-[0.3em] text-xs">Tactical Loadout</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-black">
              STRESS LESS - <span className="opacity-40">PLAY MORE</span>
            </h2>
          </motion.div>
          <div className="text-black font-black uppercase tracking-widest text-sm flex items-center gap-4">
            Our Top Selections
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-12 items-stretch">
          {products.slice(0, 8).map((product) => (
            <div key={product._id} className="h-full">
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-20 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-6 md:px-12 py-3 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest md:tracking-[0.2em] italic text-[10px] md:text-base border-2 border-black hover:bg-primary hover:text-black transition-all shadow-[4px_4px_0px_#ffffff,6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#ffffff,10px_10px_0px_#0f172b] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer group">
            <img src="/nafhaiconlight.png" className="w-5 h-5 md:w-8 md:h-8 object-contain transition-all" alt="Icon" />
            Browse All Equipment
          </Link>
        </div>
      </section>

      <Marquee />
      <CategoryList categories={categories} />
      <Newsletter />
      <Footer />

      {/* Floating Cart Button (bottom left) */}
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
          fetchData();
        }}
      />
    </main>
  );
}
