import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ButtonInitiate from "./Buttons/ButtonInitiate";
import UserProfileDropdown from "./UserProfileDropdown";

interface NavbarProps {
    onOpenAuthModal?: (type: "login" | "register") => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps = {}) {
    const { auth } = usePage<any>().props;
    const { url } = usePage();
    const isVapeStore = url.startsWith('/vape-store');
    const isCoffeeShop = url.startsWith('/coffee-shop');
    const isStorePage = isVapeStore || isCoffeeShop;
    
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (!isStorePage) return;
        
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('venus_cart') || '[]');
            setCartCount(cart.length);
        };
        
        updateCartCount();
        window.addEventListener('cart_updated', updateCartCount);
        return () => window.removeEventListener('cart_updated', updateCartCount);
    }, [isStorePage]);

    const navItems = [
        { name: 'Home', href: '/', active: url === '/' },
        { name: 'Doorsmeer', href: '#', active: false },
        { name: 'Coffee Shop', href: '/coffee-shop', active: isCoffeeShop },
        { name: 'Vape Store', href: '/vape-store', active: isVapeStore },
        { name: 'Bengkel', href: '#', active: false },
        { name: 'Rental PS', href: '#', active: false },
        { name: 'Contact', href: '#', active: false },
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
                        
                        {/* Cart Icon */}
                        {isStorePage && (
                            <Link href={isCoffeeShop ? '/coffee-shop/cart' : '/vape-store/cart'} aria-label="Cart" className="relative text-foreground hover:text-primary transition-colors flex items-center">
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