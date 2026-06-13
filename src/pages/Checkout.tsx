import React, { useState } from 'react';
import { useCartStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CreditCard, Truck, Check, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';
type PaymentMethod = 'esewa' | 'khalti' | 'cod';

export const Checkout = () => {
  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: 'Kathmandu',
    area: '',
  });

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <p className="font-display uppercase tracking-widest text-gray-500">Your bag is empty.</p>
        <Link to="/shop" className="btn-primary">Go to Shop</Link>
      </div>
    );
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') setStep('payment');
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product.id,
            variant: item.variant,
            quantity: item.quantity,
            price: item.product.basePrice
          })),
          shippingDetails: formData,
          paymentMethod,
          total: total() + 100
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (paymentMethod === 'esewa') {
        // Simulated eSewa Redirection
        console.log('Redirecting to eSewa...', data.paymentInfo);
        window.location.href = `${data.paymentInfo.url}?amount=${total() + 100}&merchant=${data.paymentInfo.merchantCode}`;
        return;
      }

      setIsProcessing(false);
      setStep('confirmation');
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Form Flow */}
        <div className="lg:col-span-7 space-y-12">
          {step !== 'confirmation' && (
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold overflow-x-auto pb-4 lg:pb-0">
               <button 
                  onClick={() => setStep('shipping')}
                  className={step === 'shipping' ? 'text-brand-black' : 'text-gray-300'}
                >
                  01 Shipping
                </button>
               <ChevronRight size={12} className="text-gray-200" />
               <button 
                  disabled={!formData.email}
                  onClick={() => setStep('payment')}
                  className={step === 'payment' ? 'text-brand-black' : 'text-gray-300'}
                >
                  02 Payment
                </button>
               <ChevronRight size={12} className="text-gray-200" />
               <span className="text-gray-300">03 Confirm</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="Phone Number (Nepal)" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-brand-black">Shipping Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" 
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Full Address (e.g., House No, Street)" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <select 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-brand-black bg-transparent"
                     >
                        <option value="Kathmandu">Kathmandu</option>
                        <option value="Lalitpur">Lalitpur</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Pokhara">Pokhara</option>
                        <option value="Butwal">Butwal</option>
                     </select>
                     <input 
                      type="text" 
                      placeholder="Area (e.g., Boudha)" 
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                      className="w-full border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" 
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button onClick={() => setStep('payment')} className="btn-primary w-full flex items-center justify-center gap-2">
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Payment Method</h2>
                    <button onClick={() => setStep('shipping')} className="text-[10px] uppercase font-bold tracking-widest underline decoration-gray-300 underline-offset-4">Change Details</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {/* COD */}
                    <button 
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-between p-6 border rounded-sm transition-all text-left ${paymentMethod === 'cod' ? 'border-brand-black bg-gray-50' : 'border-gray-100'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-black' : 'border-gray-300'}`}>
                           {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-brand-black rounded-full" />}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold uppercase tracking-tight">Cash on Delivery</p>
                          <p className="text-xs text-gray-400">Pay when you receive your drop.</p>
                        </div>
                      </div>
                      <Truck size={20} className="text-gray-300" />
                    </button>

                    {/* eSewa */}
                    <button 
                      onClick={() => setPaymentMethod('esewa')}
                      className={`flex items-center justify-between p-6 border rounded-sm transition-all text-left ${paymentMethod === 'esewa' ? 'border-[#60bb46] bg-[#f0f9ed]' : 'border-gray-100'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'esewa' ? 'border-[#60bb46]' : 'border-gray-300'}`}>
                           {paymentMethod === 'esewa' && <div className="w-2.5 h-2.5 bg-[#60bb46] rounded-full" />}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold uppercase tracking-tight">eSewa Mobile Wallet</p>
                          <p className="text-xs text-gray-500">Fast & Local Digital Payment.</p>
                        </div>
                      </div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Esewa_logo.png" className="h-4" />
                    </button>

                    {/* Khalti */}
                    <button 
                      onClick={() => setPaymentMethod('khalti')}
                      className={`flex items-center justify-between p-6 border rounded-sm transition-all text-left ${paymentMethod === 'khalti' ? 'border-[#5c2d91] bg-[#f2eef8]' : 'border-gray-100'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'khalti' ? 'border-[#5c2d91]' : 'border-gray-300'}`}>
                           {paymentMethod === 'khalti' && <div className="w-2.5 h-2.5 bg-[#5c2d91] rounded-full" />}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold uppercase tracking-tight">Khalti Digital Wallet</p>
                          <p className="text-xs text-gray-500">Seamless, secure checkout.</p>
                        </div>
                      </div>
                      <img src="https://khalti.com/static/img/logo1.png" className="h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <button 
                    disabled={isProcessing}
                    onClick={processPayment}
                    className="btn-primary w-full h-16 flex items-center justify-center gap-3 text-base"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={24} className="animate-spin" /> 
                        {paymentMethod === 'cod' ? 'Finalizing Order...' : `Connecting to ${paymentMethod}...`}
                      </>
                    ) : (
                      <>Place Order — Rs. {total()}</>
                    )}
                  </button>
                  <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">By clicking "Place Order" you agree to our terms of service.</p>
                </div>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="w-20 h-20 bg-brand-black text-white rounded-full flex items-center justify-center shadow-xl">
                    <Check size={40} strokeWidth={3} />
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] font-bold text-gray-400">Order Successful</p>
                  <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Welcome to the Tribe</h2>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                    Thank you for choosing Arlo Boudha. We've received your order and are preparing your drop. You'll receive a confirmation call shortly.
                  </p>
                </div>
                <div className="pt-4 space-y-4">
                  <Link to="/shop" className="btn-primary flex items-center gap-2">
                    Back to Shop <ArrowLeft size={16} />
                  </Link>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">#ArloBoudha #KtmStreetwear</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Summary */}
        {step !== 'confirmation' && (
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-brand-gray/50 p-8 rounded-sm space-y-8 sticky top-32">
              <h3 className="text-xs uppercase tracking-widest font-bold border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.variant.sku} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-xs overflow-hidden flex-shrink-0 border border-black/5">
                      <img src={item.product.images[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold uppercase tracking-tight">{item.product.name}</p>
                        <p className="text-xs font-medium">Rs. {item.product.basePrice * item.quantity}</p>
                      </div>
                      <div className="flex justify-between items-center">
                         <p className="text-[10px] text-gray-400 uppercase">{item.variant.color} / {item.variant.size} / x{item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                  <p>Subtotal</p>
                  <p>Rs. {total()}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                  <p>Shipping (Valley Standard)</p>
                  <p>Rs. 100</p>
                </div>
                <div className="flex justify-between items-center pt-4 text-brand-black">
                   <p className="font-display font-bold uppercase tracking-widest">Order Total</p>
                   <p className="text-2xl font-display font-bold">Rs. {total() + 100}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-sm border border-black/5 space-y-2">
                 <p className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2"> <Truck size={12} /> Delivery Note</p>
                 <p className="text-[10px] text-gray-500 leading-relaxed uppercase">
                   Orders inside Kathmandu valley are delivered within 48 hours. Outside valley delivery may take 3-5 days.
                 </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
