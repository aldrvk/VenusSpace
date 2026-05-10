import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

interface CartItem {
    cartItemId: string;
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    optionsStr: string;
}

export default function Receipt() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const orderNumber = "VNX-" + Math.floor(100000 + Math.random() * 900000);
    const date = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('venus_cart') || '[]');
        setCartItems(cart);
        setIsLoaded(true);
        
        // Clear cart after showing receipt
        // localStorage.removeItem('venus_cart');
        // window.dispatchEvent(new Event('cart_updated'));
    }, []);

    const params = new URLSearchParams(window.location.search);
    const method = params.get('method') || 'qris';

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal;

    const formatPrice = (price: number) => {
        return 'Rp' + price.toLocaleString('id-ID');
    };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Head title="Vape Store - Bukti Pembayaran" />
            <Navbar />

            <main className="flex-grow max-w-3xl mx-auto px-6 py-16 w-full">
                <div className="bg-card rounded-venus border border-border shadow-2xl overflow-hidden">
                    {/* Receipt Header */}
                    <div className={`${method === 'qris' ? 'bg-primary' : 'bg-secondary'} p-8 text-center text-primary-foreground`}>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            {method === 'qris' ? (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                        </div>
                        <h1 className="text-h2 uppercase tracking-widest font-bold">
                            {method === 'qris' ? 'Pesanan Berhasil' : 'Pesanan Diterima'}
                        </h1>
                        <p className="text-primary-foreground/80 mt-2">
                            {method === 'qris' ? 'Terima kasih atas pembelian Anda di Vape Store' : 'Silakan lakukan pembayaran di kasir'}
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Order Info */}
                        <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-border pb-8">
                            <div>
                                <p className="text-label-sm text-foreground/40 uppercase tracking-widest mb-1">Nomor Pesanan</p>
                                <p className="text-h3 text-super-black">{orderNumber}</p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-label-sm text-foreground/40 uppercase tracking-widest mb-1">Tanggal</p>
                                <p className="text-body-m font-bold text-super-black">{date}</p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                            <p className="text-label-sm text-foreground/40 uppercase tracking-widest">Rincian Produk</p>
                            {cartItems.map((item) => (
                                <div key={item.cartItemId} className="flex justify-between items-center py-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-surface border border-border overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-body-m font-bold text-super-black">{item.name}</p>
                                            <p className="text-label-sm text-foreground/40">{item.quantity} x {formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                    <span className="text-body-m font-bold text-super-black">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="border-t-2 border-dashed border-border pt-6 mt-6">
                            <div className="flex justify-between items-center">
                                <span className="text-h3 text-super-black uppercase tracking-widest font-bold">Total Pembayaran</span>
                                <span className="text-h2 text-secondary">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="bg-surface p-6 rounded-2xl border border-border text-center space-y-2">
                            <p className="text-body-reg text-foreground/60">
                                {method === 'qris' 
                                    ? 'Tunjukkan bukti pembayaran ini kepada petugas kami di toko saat pengambilan.' 
                                    : 'Tunjukkan nomor pesanan ini kepada kasir untuk melakukan pembayaran dan memproses pesanan.'}
                            </p>
                            <div className="pt-4 flex justify-center gap-4">
                                <button onClick={() => window.print()} className="px-6 py-2 border border-border rounded-full text-label-sm hover:bg-white transition-colors uppercase font-bold">Cetak</button>
                                <Link href="/vape-store" className="px-6 py-2 bg-super-black text-white rounded-full text-label-sm hover:bg-super-black/80 transition-colors uppercase font-bold">Kembali Belanja</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
