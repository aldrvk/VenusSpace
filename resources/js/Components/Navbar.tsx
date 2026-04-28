import { Link, usePage } from "@inertiajs/react";
import ButtonInitiate from "./Buttons/ButtonInitiate";
import ButtonLogout from "./Buttons/ButtonLogout";

interface NavbarProps {
    onOpenAuthModal?: (type: "login" | "register") => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps = {}) {
    const { auth } = usePage<any>().props;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* LOGO: Menggunakan Hierarki H3 atau Card Title */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href="/"
                            className="text-card-title text-primary tracking-tighter"
                        >
                            VENUS
                            <span className="text-super-black dark:text-foreground">
                                HUB
                            </span>
                        </Link>
                    </div>

                    {/* NAV LINKS: Menggunakan Body Medium agar bersih */}
                    <div className="hidden md:flex space-x-10">
                        <Link
                            href="#"
                            className="text-body-m hover:text-primary transition-colors"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="#"
                            className="text-body-m hover:text-primary transition-colors"
                        >
                            Layanan
                        </Link>
                        <Link
                            href="#"
                            className="text-body-m hover:text-primary transition-colors"
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="#"
                            className="text-body-m hover:text-primary transition-colors"
                        >
                            Kontak
                        </Link>
                    </div>

                    {/* CTA: Hubungkan ke halaman Login dan Register */}
                    <div className="flex items-center space-x-4">
                        {auth?.user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-body-m font-semibold mr-4 hover:text-primary transition-colors"
                                >
                                    Beranda Dashboard ({auth.user.name})
                                </Link>
                                <ButtonLogout
                                    variant="danger"
                                    className="scale-90"
                                />
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
