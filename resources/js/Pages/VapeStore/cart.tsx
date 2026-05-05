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

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('venus_cart') || '[]');
        setCartItems(cart);
        setIsLoaded(true);
    }, []);

    const updateQuantity = (cartItemId: string, newQty: number) => {
        if (newQty < 1) return;
        const newCart = cartItems.map(item => 
            item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
        );
        setCartItems(newCart);
        localStorage.setItem('venus_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart_updated'));
    };

    const removeItem = (cartItemId: string) => {
        const newCart = cartItems.filter(item => item.cartItemId !== cartItemId);
        setCartItems(newCart);
        localStorage.setItem('venus_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart_updated'));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal;

    const formatPrice = (price: number) => {
        return 'Rp' + price.toLocaleString('id-ID');
    };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Head title="Vape Store - Cart" />
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
                {/* Header Section */}
                <div className="mb-16">
                    <h1 className="text-h1 text-super-black mb-4">Your Items</h1>
                    <p className="text-body-l text-foreground/80 max-w-2xl">
                        Review your cart. Each piece is selected for its technical precision and aesthetic harmony.
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-24 bg-card rounded-venus border border-border">
                        <svg className="w-16 h-16 mx-auto text-border mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <h2 className="text-h3 text-super-black mb-4">Your cart is empty</h2>
                        <p className="text-body-m text-foreground/60 mb-8">Discover our premium selection of devices and liquids.</p>
                        <Link href="/vape-store" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-label-sm transition-all hover:bg-secondary/90 shadow-lg">
                            CONTINUE SHOPPING
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Column: Cart Items */}
                        <div className="flex-1">
                            {/* Desktop Headers */}
                            <div className="hidden md:flex items-center px-8 mb-4">
                                <div className="flex-[2] text-label-sm text-foreground/60 uppercase tracking-widest">Product Details</div>
                                <div className="flex-1 text-center text-label-sm text-foreground/60 uppercase tracking-widest">Quantity</div>
                                <div className="flex-1 text-right text-label-sm text-foreground/60 uppercase tracking-widest">Subtotal</div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.cartItemId} className="bg-card rounded-venus p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 border border-border shadow-sm">
                                        {/* Product Info */}
                                        <div className="flex-[2] flex items-center gap-6 w-full">
                                            <div className="w-24 h-24 md:w-32 md:h-32 bg-super-black rounded-venus flex-shrink-0 flex items-center justify-center p-2 shadow-inner border border-border overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-card-title text-super-black">{item.name}</h3>
                                                <p className="text-label-sm text-secondary uppercase tracking-widest">{item.optionsStr}</p>
                                                <button 
                                                    onClick={() => removeItem(item.cartItemId)}
                                                    className="text-label-sm text-error flex items-center gap-1 hover:underline w-fit mt-1 uppercase tracking-widest"
                                                >
                                                    <span className="text-lg leading-none">&times;</span> Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex-1 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                                            <div className="flex items-center bg-surface rounded-full h-12 border border-border w-32">
                                                <button 
                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                    className="w-10 h-full flex items-center justify-center text-super-black hover:text-primary transition-colors text-h4"
                                                >
                                                    -
                                                </button>
                                                <span className="flex-1 text-center text-body-m font-bold">
                                                    {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                    className="w-10 h-full flex items-center justify-center text-super-black hover:text-primary transition-colors text-h4"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="flex-1 text-right w-full md:w-auto flex justify-between md:block mt-2 md:mt-0">
                                            <span className="md:hidden text-label-sm text-foreground/60">Subtotal:</span>
                                            <span className="text-h3 text-secondary">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="w-full lg:w-[400px] flex-shrink-0">
                            <div className="bg-surface rounded-venus p-8 sticky top-24 border border-border">
                                <h2 className="text-card-title text-super-black mb-8">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-body-m text-foreground/80">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-super-black">{formatPrice(subtotal)}</span>
                                    </div>
                                    {/* Add tax/shipping here if needed in future */}
                                </div>
                                
                                <div className="border-t border-border/50 my-6 pt-6 flex justify-between items-end">
                                    <span className="text-card-title text-super-black">Total</span>
                                    <span className="text-h2 text-secondary">{formatPrice(total)}</span>
                                </div>

                                <button className="w-full bg-primary text-primary-foreground py-4 rounded-venus text-label-sm tracking-widest text-center hover:bg-primary/90 transition-all font-bold shadow-lg mt-8">
                                    PROCEED TO CHECKOUT
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 mt-6 text-label-sm text-foreground/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    SECURE SSL ENCRYPTED PAYMENT
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
