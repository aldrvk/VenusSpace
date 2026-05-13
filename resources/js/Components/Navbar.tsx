import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import ButtonInitiate from "./Buttons/ButtonInitiate";
import UserProfileDropdown from "./UserProfileDropdown";
import { useFlashToast } from "../hooks/useFlashToast";
import { useFavorites } from "../hooks/useFavorites";

interface NavbarProps {
    onOpenAuthModal?: (type: "login" | "register") => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps = {}) {
    useFlashToast();
    const { auth } = usePage<any>().props;
    const { url = '' } = usePage();
    const isVapeStore = url.startsWith('/vape-store');
    const isDoorsmeer = url.startsWith('/doorsmeer');
    const isBengkel = url.startsWith('/bengkel');
    const isRentalPs = url.startsWith('/rental-ps');
    const isCoffeeShop = url.startsWith('/coffee-shop');
    
    const [cartCount, setCartCount] = useState(0);
    const { favoriteIds, favoriteMeta, toggleFavorite } = useFavorites();
    const [favOpen, setFavOpen] = useState(false);
    const favRef = useRef<HTMLDivElement>(null);

    // Close favorites dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (favRef.current && !favRef.current.contains(e.target as Node)) {
                setFavOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isVapeStore && !isCoffeeShop) return;
        
        const updateCartCount = () => {
            try {
                const storageKey = isVapeStore ? 'venus_cart' : 'venus_cart_coffee';
                const cart = JSON.parse(localStorage.getItem(storageKey) || '[]');
                setCartCount(Array.isArray(cart) ? cart.length : 0);
            } catch (e) {
                setCartCount(0);
            }
        };
        
        updateCartCount();
        window.addEventListener('cart_updated', updateCartCount);
        return () => window.removeEventListener('cart_updated', updateCartCount);
    }, [isVapeStore, isCoffeeShop]);

    const navItems = [
        { name: 'Home', href: '/', active: url === '/' },
        { name: 'Doorsmeer', href: '/doorsmeer', active: isDoorsmeer },
        { name: 'Coffee Shop', href: '/coffee-shop', active: isCoffeeShop },
        { name: 'Vape Store', href: '/vape-store', active: isVapeStore },
        { name: 'Bengkel', href: '/bengkel', active: isBengkel },
        { name: 'Rental PS', href: '/rental-ps', active: isRentalPs },
        // { name: 'Contact', href: '#', active: false },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-card-title text-primary tracking-tighter">
                            VENUS
                            <span className="text-super-black dark:text-foreground">
                                HUB
                            </span>
                        </Link>
                    </div>

                    {/* NAV LINKS */}
                    <div className="hidden md:flex space-x-6 lg:space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-bodyM transition-colors relative ${
                                    item.active ? 'text-primary font-bold' : 'text-foreground hover:text-primary'
                                }`}
                            >
                                {item.name}
                                {item.active && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* CTA & AUTH LOGIC */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        
                        {/* Favorites Icon */}
                        {(isVapeStore || isCoffeeShop) && (
                            <div ref={favRef} className="relative">
                                <button
                                    onClick={() => setFavOpen(prev => !prev)}
                                    aria-label="Favorites"
                                    className="relative text-foreground hover:text-error transition-colors flex items-center"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={favoriteIds.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={favoriteIds.length > 0 ? 'text-error' : ''}>
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                    {favoriteIds.length > 0 && (
                                        <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                                            {favoriteIds.length}
                                        </span>
                                    )}
                                </button>

                                {/* Favorites Dropdown */}
                                {favOpen && (
                                    <div className="absolute right-0 top-full mt-3 w-80 bg-card rounded-venus border border-border shadow-2xl z-50 overflow-hidden">
                                        <div className="p-4 border-b border-border flex items-center justify-between">
                                            <h3 className="text-h4 text-super-black">Favorit Saya</h3>
                                            <span className="text-label-sm text-foreground/50">{favoriteIds.length} item</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {favoriteIds.length === 0 ? (
                                                <div className="p-6 text-center">
                                                    <svg className="w-10 h-10 mx-auto text-foreground/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                                    </svg>
                                                    <p className="text-body-reg text-foreground/40">Belum ada produk favorit</p>
                                                </div>
                                            ) : (
                                                favoriteIds.map(id => {
                                                    const meta = favoriteMeta[id];
                                                    const formatPrice = (p: number) => 'Rp' + p.toLocaleString('id-ID');
                                                    return (
                                                        <div key={id} className="flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors border-b border-border/30 last:border-0">
                                                            <Link
                                                                href={`${isVapeStore ? '/vape-store' : '/coffee-shop'}/product/${id}`}
                                                                className="flex-1 mr-3 min-w-0"
                                                                onClick={() => setFavOpen(false)}
                                                            >
                                                                <p className="text-body-m font-semibold text-super-black hover:text-primary transition-colors truncate">
                                                                    {meta?.name || `Produk #${id}`}
                                                                </p>
                                                                {meta?.price && (
                                                                    <p className="text-label-sm text-foreground/50 mt-0.5">{formatPrice(meta.price)}</p>
                                                                )}
                                                            </Link>
                                                            <button
                                                                onClick={() => toggleFavorite(id)}
                                                                className="text-error hover:text-error/70 transition-colors shrink-0 p-1"
                                                                aria-label="Hapus dari favorit"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                        {favoriteIds.length > 0 && (
                                            <div className="p-3 border-t border-border bg-surface/50">
                                                <Link
                                                    href={isVapeStore ? '/vape-store' : '/coffee-shop'}
                                                    className="block text-center text-label-sm text-primary hover:text-primary/80 font-bold transition-colors"
                                                    onClick={() => setFavOpen(false)}
                                                >
                                                    LIHAT DI KATALOG
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cart Icon */}
                        {(isVapeStore || isCoffeeShop) && (
                            <Link 
                                href={auth?.user ? (isVapeStore ? "/vape-store/cart" : "/coffee-shop/cart") : "/login"} 
                                onClick={(e) => {
                                    if (!auth?.user) {
                                        if (onOpenAuthModal) {
                                            e.preventDefault();
                                            onOpenAuthModal("login");
                                        }
                                    }
                                }}
                                aria-label="Cart" 
                                className="relative text-foreground hover:text-primary transition-colors flex items-center"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 w-3 h-3 bg-primary rounded-full border-2 border-background"></span>
                                )}
                            </Link>
                        )}

                        {/* Doorsmeer: My Bookings link */}
                        {isDoorsmeer && auth?.user && (
                            <Link
                                href="/doorsmeer/my-bookings"
                                className="flex items-center gap-1.5 text-label-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Booking Saya
                            </Link>
                        )}

                        {/* Bengkel: My Bookings link */}
                        {isBengkel && auth?.user && (
                            <Link
                                href="/bengkel/my-bookings"
                                className="flex items-center gap-1.5 text-label-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Booking Saya
                            </Link>
                        )}

                        {/* Rental PS: My Bookings link */}
                        {isRentalPs && auth?.user && (
                            <Link
                                href="/rental-ps/my-bookings"
                                className="flex items-center gap-1.5 text-label-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Booking Saya
                            </Link>
                        )}

                        {/* Coffee Shop: Riwayat Pesanan link */}
                        {isCoffeeShop && auth?.user && (
                            <Link
                                href="/coffee-shop/my-orders"
                                className="flex items-center gap-1.5 text-label-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                                </svg>
                                Riwayat Pesanan
                            </Link>
                        )}

                        {/* Vape Store: Riwayat Pesanan link */}
                        {isVapeStore && auth?.user && (
                            <Link
                                href="/vape-store/my-orders"
                                className="flex items-center gap-1.5 text-label-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                                </svg>
                                Riwayat Pesanan
                            </Link>
                        )}
                        
                        {auth?.user ? (
                            <UserProfileDropdown user={auth.user} />
                        ) : onOpenAuthModal ? (
                            <>
                                <button
                                    onClick={() => onOpenAuthModal("login")}
                                    className="text-bodyM font-bold hover:text-primary transition-colors"
                                >
                                    Masuk
                                </button>
                                <button
                                    onClick={() => onOpenAuthModal("register")}
                                >
                                    <ButtonInitiate
                                        variant="primary"
                                        className="scale-90"
                                    >
                                        Mulai Sekarang
                                    </ButtonInitiate>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-bodyM font-bold hover:text-primary transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link href="/register">
                                    <ButtonInitiate
                                        variant="primary"
                                        className="scale-90"
                                    >
                                        Mulai Sekarang
                                    </ButtonInitiate>
                                </Link>
                            </>
                        )}
                    </div>
                    
                </div>
            </div>
        </nav>
    );
}
