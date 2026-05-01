'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { SlidersHorizontal, Car, ChevronDown } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

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

  const priceRanges = [
    { label: 'All Prices', val: 'ALL' },
    { label: '5 to 10 TND', val: '5-10' },
    { label: '10 to 20 TND', val: '10-20' },
    { label: '20 to 30 TND', val: '20-30' },
    { label: '30 to 50 TND', val: '30-50' },
    { label: '50 to 100 TND', val: '50-100' },
    { label: '100+ TND', val: '100-99999' },
  ];

  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategory === 'ALL' || (Array.isArray(p.category) ? p.category.includes(selectedCategory) : p.category === selectedCategory);
    let priceMatch = true;
    if (priceRange !== 'ALL') {
      const [min, max] = priceRange.split('-').map(Number);
      priceMatch = p.price >= min && p.price <= max;
    }
    return categoryMatch && priceMatch;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

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
            <img src="/discover.webp" className="w-full h-full object-cover hidden md:block" alt="Hero Desktop" />
            <img src="/discoverphone.webp" className="w-full h-full object-cover md:hidden" alt="Hero Mobile" />
            <div className="absolute inset-0 bg-black/10" />

            {/* Pro Scroll Down Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Discover</span>
              <div className="relative flex flex-col items-center">
                <div className="w-[1px] h-12 bg-white/20" />
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-1 bg-primary rounded-full absolute top-0"
                />
                <ChevronDown className="w-3 h-3 text-white/40 -mt-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[2000px] mx-auto px-3 md:px-10 py-12 md:py-24 flex flex-col md:flex-row gap-12">

        {/* Sidebar (Desktop only) */}
        <aside className="hidden md:block w-full md:w-[30%] space-y-12">
          <div className="bg-primary p-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_#000000]">
            <div className="flex items-center gap-3 mb-8">
              <SlidersHorizontal className="w-6 h-6" />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Tactical Filters</h2>
            </div>

            <div className="mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-black/60">Categories</h3>
              <div className="space-y-4">
                <FilterOption label="ALL" active={selectedCategory === 'ALL'} onClick={() => setSelectedCategory('ALL')} />
                {categories.map(cat => (
                  <FilterOption key={cat._id} label={cat.name} active={selectedCategory === cat.name} onClick={() => setSelectedCategory(cat.name)} />
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-black/60">Price Range</h3>
              <div className="space-y-4">
                {priceRanges.map(p => (
                  <FilterOption key={p.val} label={p.label} active={priceRange === p.val} onClick={() => setPriceRange(p.val)} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-black/60">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black text-white p-4 rounded-xl font-bold uppercase tracking-widest text-xs outline-none border-2 border-black cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid (70%) */}
        <div className="w-full md:w-[70%] min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-12 pb-6 border-b-2 border-black">
            <span className="text-xs font-black uppercase tracking-widest text-black/50">
              {selectedCategory === 'ALL' ? 'SHOP ALL' : selectedCategory} — {filteredProducts.length} ITEMS
            </span>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-black active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3 h-3 text-primary" />
              Filter
            </button>
          </div>

          {/* Mobile Filter Drawer Overlay */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-full max-w-xs bg-primary z-[90] md:hidden border-l-2 border-black p-8 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 border-2 border-black rounded-full active:scale-90 bg-white">
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-black/40">Categories</h3>
                    <div className="space-y-4">
                      <FilterOption label="ALL" active={selectedCategory === 'ALL'} onClick={() => { setSelectedCategory('ALL'); setIsFilterOpen(false); }} />
                      {categories.map(cat => (
                        <FilterOption key={cat._id} label={cat.name} active={selectedCategory === cat.name} onClick={() => { setSelectedCategory(cat.name); setIsFilterOpen(false); }} />
                      ))}
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-black/40">Price Range</h3>
                    <div className="space-y-4">
                      {priceRanges.map(p => (
                        <FilterOption key={p.val} label={p.label} active={priceRange === p.val} onClick={() => { setPriceRange(p.val); setIsFilterOpen(false); }} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-black/40">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setIsFilterOpen(false); }}
                      className="w-full bg-black text-white p-4 rounded-xl font-bold uppercase tracking-widest text-xs outline-none border-2 border-black"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-black/10 h-[400px] rounded-[2rem] animate-pulse border-2 border-black" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 items-stretch">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="h-full">
                    <ProductCard product={product} onAddToCart={addToCart} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-4 border-2 border-dashed border-black/10 rounded-[3rem]">
              <div className="text-4xl md:text-6xl opacity-20 font-black italic text-center">NO CURRENT PRODUCTS</div>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs text-center">Check back soon or try another filter</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Floating Cart Button */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onRemove={removeFromCart} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} onOrderSuccess={() => { setIsCheckoutOpen(false); clearCart(); fetchData(); }} />
    </main>
  );
}

function FilterOption({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-4 group w-full text-left cursor-pointer">
      <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center transition-all flex-shrink-0 ${active ? 'bg-black' : 'bg-white'}`}>
        {active && <div className="w-2 h-2 rounded-full bg-primary" />}
      </div>
      <span className={`text-sm font-black uppercase tracking-tighter transition-all ${active ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>
        {label}
      </span>
    </button>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-primary font-black uppercase italic text-black">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
