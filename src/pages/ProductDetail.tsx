import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, Ruler, Share2, ArrowLeft } from 'lucide-react';
import { PRODUCTS, ProductVariant } from '../constants';
import { useCartStore } from '../store';

export const ProductDetail = () => {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const { addItem } = useCartStore();

  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeImage, setActiveImage] = useState(0);

  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizesForSelectedColor = product.variants
    .filter((v) => v.color === selectedVariant.color)
    .map((v) => v.size);

  const handleColorChange = (color: string) => {
    const firstVariantWithColor = product.variants.find((v) => v.color === color);
    if (firstVariantWithColor) setSelectedVariant(firstVariantWithColor);
  };

  const handleSizeChange = (size: string) => {
    const variant = product.variants.find(
      (v) => v.color === selectedVariant.color && v.size === size
    );
    if (variant) setSelectedVariant(variant);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-70 transition-opacity">
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-brand-gray rounded-xs overflow-hidden sticky top-40 border border-brand-border">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover transition-transform duration-1000"
              />
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square bg-brand-gray rounded-xs overflow-hidden border transition-all ${
                  activeImage === idx ? 'border-brand-black p-1' : 'border-brand-border opacity-60'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div className="space-y-6 pb-12 border-b border-brand-border">
              <p className="text-[11px] text-gray-400 uppercase tracking-[0.4em] font-bold underline decoration-brand-black/20 underline-offset-8 inline-block mb-2">{product.category}</p>
              <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-[0.9]">
                {product.name}
              </h1>
              <p className="text-3xl font-display font-bold">Rs. {product.basePrice}</p>
            </div>

            <div className="space-y-10">
              {/* Color Selector */}
              <div className="space-y-6">
                <p className="text-[11px] uppercase tracking-[0.2em] font-black">Color: <span className="text-gray-400 font-normal ml-3 tracking-widest uppercase">{selectedVariant.color}</span></p>
                <div className="flex gap-4">
                  {colors.map((color) => {
                    const variant = product.variants.find((v) => v.color === color);
                    return (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorChange(color)}
                        className={`w-12 h-12 rounded-full border p-1.5 transition-all ${
                          selectedVariant.color === color ? 'border-brand-black' : 'border-brand-border'
                        }`}
                      >
                        <div className="w-full h-full rounded-full flex items-center justify-center shadow-inner" style={{ backgroundColor: variant?.colorHex }} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-black">Size: <span className="text-gray-400 font-normal ml-3 tracking-widest uppercase">{selectedVariant.size}</span></p>
                  <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-black opacity-40 hover:opacity-100 transition-opacity">
                    <span className="border-b border-brand-black pb-0.5">Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizesForSelectedColor.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSizeChange(size)}
                      className={`min-w-[70px] h-14 border px-6 flex items-center justify-center font-display text-[13px] transition-all uppercase tracking-widest font-bold ${
                        selectedVariant.size === size 
                          ? 'bg-brand-black text-white border-brand-black' 
                          : 'bg-white text-brand-black border-brand-border hover:border-brand-black'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedVariant.stock === 0}
                  onClick={() => addItem(product, selectedVariant, 1)}
                  className="btn-primary flex-1 shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                    {selectedVariant.stock > 0 ? 'Add to Bag' : 'Sold Out'}
                  </span>
                </motion.button>
              <Link 
                to="/checkout"
                onClick={() => {
                  if (selectedVariant.stock > 0) {
                    addItem(product, selectedVariant, 1);
                  }
                }}
                className="btn-secondary flex-1 flex items-center justify-center"
              >
                Buy it Now
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                <div className="bg-brand-beige p-5 rounded-xs border border-brand-border flex items-center justify-center text-center">
                  Free Express Shipping
                </div>
                <div className="bg-brand-beige p-5 rounded-xs border border-brand-border flex items-center justify-center text-center">
                  100% Genuine Cotton
                </div>
            </div>
          </div>

          <div className="space-y-10 pt-16 border-t border-brand-border">
            <div className="space-y-4">
               <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-l-2 border-brand-black pl-4">Description</h3>
               <p className="text-[14px] text-gray-500 leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="space-y-8 border-y border-brand-border py-12">
               <div className="flex justify-between items-end">
                 <h3 className="text-[11px] uppercase tracking-[0.3em] font-black">Reviews (12)</h3>
                 <div className="flex gap-1 text-brand-black">
                   {[1,2,3,4,5].map(i => <span key={i} className="text-[10px]">★</span>)}
                 </div>
               </div>
               
               <div className="space-y-10">
                 {[
                   { name: 'Sameer K.', date: 'Dec 12, 2025', text: 'The weight of this hoodie is incredible. Best streetwear quality in KTM by far.', rating: 5 },
                   { name: 'Pranisha P.', date: 'Nov 28, 2025', text: 'Perfect oversized fit. Love the minimal Boudha embroidery.', rating: 5 }
                 ].map((rev, idx) => (
                   <div key={idx} className="space-y-3">
                     <div className="flex justify-between items-center">
                       <p className="text-[10px] font-bold uppercase tracking-widest">{rev.name} <span className="ml-2 text-green-600">✓ Verified</span></p>
                       <p className="text-[9px] text-gray-400 uppercase tracking-widest">{rev.date}</p>
                     </div>
                     <p className="text-[13px] text-gray-500 leading-relaxed font-light italic">"{rev.text}"</p>
                   </div>
                 ))}
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-l-2 border-brand-black pl-4">Fabric & Care</h3>
               <ul className="text-[14px] text-gray-500 list-disc list-inside space-y-2 font-light decoration-brand-black/10">
                 <li>100% Premium Terry Cotton</li>
                 <li>Heavyweight 400 GSM</li>
                 <li>Screen-printed graphics</li>
                 <li>Machine wash cold / inside out</li>
               </ul>
            </div>
          </div>
        </motion.div>
      </div>

       {/* Related Products Section */}
       <section className="mt-32 pt-20 border-t border-gray-100 space-y-12">
          <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-center">Complete the Fit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.slice(0, 4).map((p) => (
               <div key={p.id} className="scale-90 opacity-80 hover:scale-100 hover:opacity-100 transition-all duration-500">
                 <Link to={`/product/${p.slug}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-4 rounded-xs">
                       <img src={p.images[0]} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-bold">{p.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Rs. {p.basePrice}</p>
                 </Link>
               </div>
            ))}
          </div>
       </section>
    </div>
  );
};
