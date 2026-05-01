'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CategoryList({ categories }) {
  const router = useRouter();

  return (
    <section className="bg-primary py-12 px-6 border-b-2 border-black">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-start gap-0">
        
        {/* Left Side: Circular Logo with simple white border */}
        <div className="flex-shrink-0">
          <div className="w-64 h-64 md:w-[450px] md:h-[450px] rounded-full border-2 border-white overflow-hidden bg-black group relative">
            <img 
              src="/nafhalogo.webp" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Logo" 
            />
          </div>
        </div>

        {/* Right Side: Category List (Tighter to logo) */}
        <div className="flex-1 w-full md:ml-4">
          <div className="border-t-2 border-black">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.name)}`)}
                className="w-full text-left py-8 md:py-10 border-b-2 border-black group relative transition-all duration-300 hover:bg-[#0f172b] cursor-pointer overflow-hidden"
              >
                <div className="flex items-center px-6 transition-all duration-300 group-hover:translate-x-4">
                  <span className="text-2xl md:text-5xl font-bold uppercase italic tracking-tighter text-black group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </span>
                </div>
              </button>
            ))}
            
            <button
              onClick={() => router.push('/shop')}
              className="w-full text-left py-8 md:py-10 border-b-2 border-black group relative transition-all duration-300 hover:bg-[#0f172b] cursor-pointer overflow-hidden"
            >
              <div className="flex items-center px-6 transition-all duration-300 group-hover:translate-x-4">
                <span className="text-2xl md:text-5xl font-bold uppercase italic tracking-tighter text-black group-hover:text-primary transition-colors duration-300">
                  VIEW ALL
                </span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
