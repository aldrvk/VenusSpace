import { Link, usePage } from "@inertiajs/react";
import ButtonInitiate from "./Buttons/ButtonInitiate";
import ButtonLogout from "./Buttons/ButtonLogout";

interface NavbarProps {
    onOpenAuthModal?: (type: "login" | "register") => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps = {}) {
    const { auth } = usePage<any>().props;
    const { url } = usePage();
    const isVapeStore = url.startsWith('/vape-store');

    const navItems = [
        { name: 'Home', href: '/', active: url === '/' },
        { name: 'Doorsmeer', href: '#', active: false },
        { name: 'Coffee Shop', href: '#', active: false },
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
                                className={`text-body-m transition-colors relative ${
                                    item.active ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
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
                    <div className="flex items-center space-x-4">
                        {isVapeStore && (
                            <div className="flex items-center gap-6 mr-2 md:mr-6 text-foreground">
                                <button aria-label="Search" className="hover:text-primary transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                                <button aria-label="Cart" className="relative hover:text-primary transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                    <span className="absolute -top-1 -right-2 w-3 h-3 bg-primary rounded-full"></span>
                                </button>
                            </div>
                        )}
                        {auth?.user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-body-m font-semibold mr-4 hover:text-primary transition-colors hidden sm:block"
                                >
                                    {auth.user.name}
                                </Link>
                                
                                {/* Fallback Logout menggunakan Link bawaan Inertia */}
                                <Link 
                                    href="/logout" 
                                    method="post" 
                                    as="button"
                                    className="text-red-500 hover:text-red-700 text-body-m font-semibold"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : onOpenAuthModal ? (
                            <>
                                <button
                                    onClick={() => onOpenAuthModal("login")}
                                    className="text-body-m font-semibold mr-4 hover:text-primary transition-colors"
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
                                    className="text-body-m font-semibold mr-4 hover:text-primary transition-colors"
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