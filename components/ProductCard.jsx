'use client';
import { ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductCard({ product, onAddToCart }) {
  const isSoldOut = product.stock <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-[4px_4px_0px_#000000] md:shadow-[8px_8px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col h-full relative"
    >
      {/* Image — fixed height */}
      <Link href={`/product/${product._id}`} className="relative h-44 md:h-64 overflow-hidden bg-zinc-100 block border-b-2 border-black flex-shrink-0 cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x400?text=Product+Image';
          }}
        />

        {/* Desktop View Details Indicator */}
        <div className="absolute inset-0 bg-primary/40 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-black text-white font-black px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 md:group-hover:translate-y-0 transition-transform text-[10px] tracking-widest">
            <Eye className="w-4 h-4 text-primary" />
            VIEW DETAILS
          </div>
        </div>
      </Link>

      {/* Content — grows to fill remaining height */}
      <div className="p-3 md:p-6 flex flex-col flex-1">
        <div className="flex-1">
          <Link href={`/product/${product._id}`} className="cursor-pointer block mb-2">
            <h3 className="text-sm md:text-xl font-black uppercase italic tracking-tighter text-black group-hover:text-zinc-600 transition-colors leading-tight line-clamp-2 md:line-clamp-1">
              {product.name}
            </h3>
            <p className="hidden md:block text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
              {Array.isArray(product.category) ? product.category.join(' · ') : product.category}
            </p>
          </Link>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg md:text-xl font-black text-black italic">
              {product.price}<span className="text-[10px] ml-1 uppercase not-italic">TND</span>
            </span>
            
            {/* Mobile Cart Button — Inline with Price */}
            {!isSoldOut && (
              <button
                onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                className="md:hidden w-8 h-8 bg-black text-white rounded-full border border-black flex items-center justify-center active:bg-primary active:text-black transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="hidden md:block text-zinc-500 text-[10px] font-bold line-clamp-1 leading-tight flex-1">
          {product.description}
        </p>

        {/* Desktop Footer — Hidden on Mobile */}
        <div className="hidden md:flex items-center justify-between pt-4 border-t-2 border-black mt-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-primary'} border border-black animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-black">
              {isSoldOut ? 'Sold Out' : 'Available'}
            </span>
          </div>
          
          {!isSoldOut && (
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer border-2 border-black active:scale-95"
            >
              <img src="/nafhaiconlight.png" className="w-4 h-4 object-contain" alt="Icon" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
