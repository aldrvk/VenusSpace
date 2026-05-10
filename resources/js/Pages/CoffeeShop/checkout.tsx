import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { useOperationalStatus } from '../../hooks/useOperationalStatus';

interface CartItem {
    cartItemId: string;
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    optionsStr: string;
}

export default function Checkout() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('qris');
    const [isLoaded, setIsLoaded] = useState(false);
    const { isOpen, message } = useOperationalStatus('Coffee Shop');

    const { auth } = usePage().props as any;
    const customerName = auth?.user?.name || 'Walk-in Customer';
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('venus_cart_coffee') || '[]');
        setCartItems(cart);
        setIsLoaded(true);
    }, []);

    const handleCheckout = async () => {
        if (!isOpen || cartItems.length === 0 || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const res = await axios.post('/store/order', {
                unit: 'COFFEE SHOP',
                customer_name: customerName,
                payment_method: paymentMethod,
                items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });
            
            // Clear cart
            localStorage.removeItem('venus_cart_coffee');
            window.dispatchEvent(new Event('cart_updated'));
            
            // Redirect
            window.location.href = `/coffee-shop/receipt?order_code=${res.data.order_code}&method=${paymentMethod}`;
        } catch (error) {
            console.error("Failed to submit order", error);
            setIsSubmitting(false);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax example
    const total = subtotal + tax;

    const formatPrice = (price: number) => {
        return 'Rp' + price.toLocaleString('id-ID');
    };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Head title="Coffee Shop - Checkout" />
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="mb-12">
                    <h1 className="text-h1 text-super-black mb-4">Pembayaran</h1>
                    <p className="text-body-l text-foreground/80">Selesaikan pesanan kopi dan makanan Anda dengan metode pembayaran yang aman.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Details & Payment */}
                    <div className="flex-1 space-y-10">
                        
                        {/* Section 1: Catatan */}
                        <div className="bg-card rounded-venus p-8 border border-border shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                                <h2 className="text-h3 text-super-black">Catatan Pesanan</h2>
                            </div>
                            <div className="space-y-2">
                                <label className="text-label-sm text-foreground/60 uppercase">Catatan Tambahan (Opsional)</label>
                                <textarea 
                                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]" 
                                    placeholder="Contoh: Kurangi gula, atau instruksi khusus lainnya..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Section 2: Payment Method */}
                        <div className="bg-card rounded-venus p-8 border border-border shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                                <h2 className="text-h3 text-super-black">Metode Pembayaran</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* QRIS Option */}
                                <button 
                                    onClick={() => setPaymentMethod('qris')}
                                    className={`relative p-6 rounded-venus border-2 transition-all flex flex-col items-center gap-4 ${paymentMethod === 'qris' ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-surface hover:border-primary/50'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center absolute top-4 right-4 ${paymentMethod === 'qris' ? 'border-primary' : 'border-border'}`}>
                                        {paymentMethod === 'qris' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                    </div>
                                    <svg className={`w-12 h-12 ${paymentMethod === 'qris' ? 'text-primary' : 'text-foreground/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                    <div className="text-center">
                                        <p className="text-card-title text-super-black">QRIS</p>
                                        <p className="text-label-sm text-foreground/50 uppercase tracking-widest mt-1">Pembayaran Instan</p>
                                    </div>
                                </button>

                                {/* Cash Option */}
                                <button 
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`relative p-6 rounded-venus border-2 transition-all flex flex-col items-center gap-4 ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-surface hover:border-primary/50'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center absolute top-4 right-4 ${paymentMethod === 'cash' ? 'border-primary' : 'border-border'}`}>
                                        {paymentMethod === 'cash' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                    </div>
                                    <svg className={`w-12 h-12 ${paymentMethod === 'cash' ? 'text-primary' : 'text-foreground/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    <div className="text-center">
                                        <p className="text-card-title text-super-black">Tunai</p>
                                        <p className="text-label-sm text-foreground/50 uppercase tracking-widest mt-1">Bayar di Kasir</p>
                                    </div>
                                </button>
                            </div>

                            {paymentMethod === 'qris' && (
                                <div className="mt-8 p-6 bg-surface rounded-2xl border border-dashed border-primary/30 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-inner mb-4">
                                        {/* Mock QR Code */}
                                        <div className="w-full h-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                                            <svg className="w-32 h-32 text-neutral-300" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h4v4H3V3zm14 0h4v4h-4V3zM3 17h4v4H3v-4zm14 0h4v4h-4v-4zM8 8H4v2h2v2h2V8zm10 0h-4v2h2v2h2V8zM8 18H4v2h2v2h2v-4zm10 0h-4v2h2v2h2v-4zM10 10h4v4h-4v-4zm0 11h4v-2h-2v-2h-2v4zM2 2h6v6H2V2zm14 0h6v6h-6V2zM2 16h6v6H2v-6zm14 0h6v6h-6v-6zm-7-7h6v6H9V9z"></path></svg>
                                        </div>
                                    </div>
                                    <p className="text-body-reg text-foreground/60 text-center">Scan kode QR di atas dengan aplikasi pembayaran Anda.</p>
                                </div>
                            )}

                            {paymentMethod === 'cash' && (
                                <div className="mt-8 p-6 bg-surface rounded-2xl border border-dashed border-primary/30 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center gap-4 text-foreground/70">
                                        <svg className="w-6 h-6 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <p className="text-body-reg">Silakan lanjutkan pemesanan dan tunjukkan nomor pesanan Anda ke barista/kasir untuk melakukan pembayaran tunai.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-surface rounded-venus p-8 sticky top-24 border border-border shadow-lg">
                            <h2 className="text-card-title text-super-black mb-8">Ringkasan Pesanan</h2>
                            
                            <div className="space-y-4 mb-8">
                                {cartItems.map((item) => (
                                    <div key={item.cartItemId} className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-body-m font-bold text-super-black">{item.name}</p>
                                            <p className="text-label-sm text-foreground/40">{item.quantity} x {formatPrice(item.price)}</p>
                                        </div>
                                        <span className="text-body-m text-super-black">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-border/50 pt-8 mb-8">
                                <div className="flex justify-between items-center text-body-m text-foreground/60">
                                    <span>Subtotal</span>
                                    <span className="text-super-black">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                                    <span className="text-card-title text-super-black">Total</span>
                                    <span className="text-h2 text-secondary">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            {isOpen ? (
                                <button 
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-primary-foreground py-4 rounded-venus text-label-sm tracking-widest text-center hover:bg-primary/90 transition-all font-bold shadow-lg uppercase group inline-flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                    {!isSubmitting && <svg className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                                </button>
                            ) : (
                                <div className="w-full bg-surface border border-border text-foreground/40 py-4 rounded-venus text-label-sm tracking-widest text-center font-bold shadow-none uppercase cursor-not-allowed">
                                    Toko Tutup ({message})
                                </div>
                            )}
                            
                            <Link href="/coffee-shop/cart" className="block text-center mt-6 text-label-sm text-foreground/40 hover:text-primary transition-colors uppercase tracking-widest">
                                Kembali ke Keranjang
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
