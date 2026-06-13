import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';
import { useFlashToast } from '../hooks/useFlashToast';

// ── Notification Sound (Web Audio API) ────────────────────────────────────────
function playNotificationSound() {
    console.log("playNotificationSound dipicu!");
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume context jika di-suspend oleh kebijakan autoplay browser
        if (ctx.state === 'suspended') {
            ctx.resume().then(() => {
                console.log("AudioContext berhasil di-resume.");
            });
        }
        
        // Note 1: High ting
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.1);
        gain1.gain.setValueAtTime(0.35, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.6);

        // Note 2: Lower follow-up note
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
        gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.16);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
        console.error("Gagal memutar suara notifikasi:", e);
    }
}

// ── Icons ────────────────────────────────────────────────────────────────────
const IconDashboard = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
);
const IconDoorsmeer = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
        <rect x="9" y="11" width="14" height="10" rx="2" />
        <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    </svg>
);
const IconBengkel = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
);
const IconPS = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4M8 10v4M15 11h2M18 11h2" />
    </svg>
);
const IconCoffee = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 010 8h-1" /><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4z" />
        <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
    </svg>
);
const IconVape = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="6" height="16" rx="1" /><rect x="14" y="6" width="6" height="16" rx="1" />
        <path d="M7 6V4a1 1 0 011-1h0a1 1 0 011 1v2M17 6V4a1 1 0 011-1h0a1 1 0 011 1v2" />
    </svg>
);
const IconJadwal = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconLaporan = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
);
const IconSettings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);
const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconBell = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);
const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconPesanan = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);
const IconWalkIn = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);
const IconTeam = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

// ── Nav Items Definition per Role ────────────────────────────────────────────

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    notificationKey?: string;
}

function getNavItemsForRole(role: string, unit: string | null): NavItem[] {
    const dashboard: NavItem = { href: '/admin/dashboard', label: 'Dashboard', icon: <IconDashboard /> };
    const laporan: NavItem = { href: '/admin/laporan', label: 'Laporan', icon: <IconLaporan /> };

    // Owner: Dashboard, Laporan, Tim, Pengaturan
    if (role === 'owner') {
        return [dashboard, laporan, { href: '/admin/tim', label: 'Tim', icon: <IconTeam /> }];
    }

    // Admin Doorsmeer
    if (unit === 'doorsmeer') {
        return [
            dashboard,
            { href: '/admin/booking-doorsmeer', label: 'Booking Doorsmeer', icon: <IconDoorsmeer />, notificationKey: 'doorsmeerCount' },
            { href: '/admin/doorsmeer/walk-in', label: 'Walk-in Doorsmeer', icon: <IconWalkIn /> },
            laporan,
        ];
    }

    // Admin Bengkel
    if (unit === 'bengkel') {
        return [
            dashboard,
            { href: '/admin/booking-bengkel', label: 'Booking Bengkel', icon: <IconBengkel />, notificationKey: 'bengkelCount' },
            { href: '/admin/bengkel/walk-in', label: 'Walk-in Bengkel', icon: <IconWalkIn /> },
            laporan,
        ];
    }

    // Admin Rental PS
    if (unit === 'rental_ps') {
        return [
            dashboard,
            { href: '/admin/booking-rental-ps', label: 'Booking Rental PS', icon: <IconPS />, notificationKey: 'rentalCount' },
            { href: '/admin/rental-ps/walk-in', label: 'Walk-in Rental PS', icon: <IconWalkIn /> },
            laporan,
        ];
    }

    // Kasir Vape Store
    if (unit === 'vape_store') {
        return [
            dashboard,
            { href: '/admin/katalog-vape', label: 'Katalog Vape Store', icon: <IconVape /> },
            { href: '/admin/pesanan-store', label: 'Pesanan Vape', icon: <IconPesanan />, notificationKey: 'storeCount' },
            laporan,
        ];
    }

    // Kasir Coffee Shop
    if (unit === 'coffee_shop') {
        return [
            dashboard,
            { href: '/admin/katalog-coffee', label: 'Katalog Coffee Shop', icon: <IconCoffee /> },
            { href: '/admin/pesanan-store', label: 'Pesanan Coffee', icon: <IconPesanan />, notificationKey: 'storeCount' },
            laporan,
        ];
    }

    // Fallback (jika admin tanpa unit / tidak dikenal, hanya tampilkan dashboard & laporan saja)
    return [
        dashboard,
        laporan,
    ];
}

function getRoleLabel(role: string, unit: string | null): { title: string; subtitle: string } {
    if (role === 'owner') {
        return { title: 'Venus Hub', subtitle: 'Pemilik' };
    }
    if (role === 'kasir') {
        const unitName = unit === 'vape_store' ? 'Vape Store' : 'Coffee Shop';
        return { title: 'Venus Hub', subtitle: `Kasir ${unitName}` };
    }
    // Admin
    const unitMap: Record<string, string> = {
        doorsmeer: 'Doorsmeer',
        bengkel: 'Bengkel',
        rental_ps: 'Rental PS',
    };
    const unitName = unit ? unitMap[unit] || unit : '';
    return { title: 'Venus Hub', subtitle: `Admin ${unitName}` };
}

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    useFlashToast();
    const { url } = usePage();
    const currentPath = url.split('?')[0];
    
    // Get role & unit from auth
    const authUser = (usePage().props.auth as any)?.user;
    const role = authUser?.role || 'admin';
    const unit = authUser?.business_unit || null;

    // Dynamic nav & label
    const navItems = getNavItemsForRole(role, unit);
    const { title: sidebarTitle, subtitle: sidebarSubtitle } = getRoleLabel(role, unit);

    // Controlled search input
    const initialSearch = new URLSearchParams(url.split('?')[1] || '').get('search') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    
    const notifications = (usePage().props.notifications as any);
    const currentCount = notifications?.pendingItems?.length ?? 0;
    const prevCountRef = useRef<number | null>(null);

    // ── Sound notification on new item ────────────────────────────────────────
    useEffect(() => {
        console.log("Pengecekan Notifikasi Baru - Sebelumnya:", prevCountRef.current, "| Sekarang:", currentCount);
        if (prevCountRef.current !== null && currentCount > prevCountRef.current) {
            playNotificationSound();
        }
        prevCountRef.current = currentCount;
    }, [currentCount]);

    useEffect(() => {
        setSearchTerm(new URLSearchParams(url.split('?')[1] || '').get('search') || '');
        setIsMobileMenuOpen(false); // Close menu on route change
        setIsNotificationOpen(false); // Close notification dropdown on route change
    }, [url]);

    // ── Polling notifications every 15 seconds for real-time sound ────────────
    useEffect(() => {
        if (role === 'owner') return;

        const interval = setInterval(() => {
            router.reload({
                only: ['notifications'],
            });
        }, 15000); // 15 detik
 

        return () => clearInterval(interval);
    }, [role]);

    const isActive = (href: string) => url.startsWith(href);

    const showSearch = !['/admin/dashboard', '/admin/laporan', '/admin/pengaturan'].includes(currentPath);

    // Contextual placeholders
    let searchPlaceholder = "Ketik untuk mencari (tekan Enter)...";
    if (currentPath === '/admin/pesanan-store') {
        searchPlaceholder = "Cari ID Pesanan / Nama Pelanggan...";
    } else if (currentPath.startsWith('/admin/booking')) {
        searchPlaceholder = "Cari ID Booking / Nama / Nopol...";
    } else if (currentPath.startsWith('/admin/katalog')) {
        searchPlaceholder = "Cari Nama Produk / Kategori...";
    }

    // Header display name
    const headerName = authUser?.name || sidebarTitle;

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                @keyframes bell-ring {
                    0%, 100% { transform: rotate(0); }
                    20%, 60% { transform: rotate(12deg); }
                    40%, 80% { transform: rotate(-12deg); }
                }
                .hover-shake:hover svg {
                    animation: bell-ring 0.6s ease-in-out;
                }
            `}</style>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside className={`fixed inset-y-0 left-0 w-36 bg-secondary flex flex-col shrink-0 z-40 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <p className="font-heading font-bold text-white text-[15px] leading-tight">{sidebarTitle}</p>
                        <p className="text-white/50 text-[10px] mt-0.5 leading-tight">{sidebarSubtitle}</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto hide-scrollbar relative" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                    <div className="pt-3">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const notifData = (usePage().props.notifications as any) || {};
                            let count = 0;
                            if (item.notificationKey) {
                                count = notifData[item.notificationKey] || 0;
                            }
                            
                            const displayCount = count >= 10 ? '9+' : count;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center gap-1.5 px-2 py-3 mx-2 my-0.5 rounded-venus transition-all text-center ${
                                        active
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <div className="relative">
                                        <span className={active ? 'text-white' : 'text-white/60'}>{item.icon}</span>
                                        {count > 0 && (
                                            <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded-full px-0.5 border border-[#1b434d] shadow-sm">
                                                {displayCount}
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '10px', lineHeight: '13px', fontWeight: 500 }} className="leading-tight">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                        {/* Spacer at the bottom to guarantee no clipping on scroll limit */}
                        <div className="h-6" />
                    </div>
                </nav>

                {/* Bottom */}
                <div className="pb-4 border-t border-white/10 pt-3">
                    <Link
                        href="/admin/pengaturan"
                        className="flex flex-col items-center gap-1.5 px-2 py-2.5 mx-2 rounded-venus text-white/60 hover:bg-white/10 hover:text-white transition-all text-center"
                    >
                        <IconSettings />
                        <span style={{ fontSize: '10px', fontWeight: 500 }}>Pengaturan</span>
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex flex-col items-center gap-1.5 px-2 py-2.5 mx-0 rounded-venus text-red-400 hover:bg-red-500/10 transition-all text-center"
                    >
                        <IconLogout />
                        <span style={{ fontSize: '10px', fontWeight: 500 }}>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* ── Main Area ───────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Top Bar */}
                <header className="h-14 bg-background border-b border-border flex items-center px-4 md:px-6 gap-3 shrink-0">
                    
                    {/* Hamburger Mobile Toggle */}
                    <button 
                        className="md:hidden p-2 -ml-2 text-foreground/60 hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    {/* Search */}
                    {showSearch ? (
                        <div className="flex-1 max-w-md relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30">
                                <IconSearch />
                            </span>
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                className="w-full bg-card border border-border rounded-venus pl-9 pr-4 py-2 text-body-reg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        router.get(currentPath, { search: searchTerm }, { preserveState: true, preserveScroll: true });
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex-1" />
                    )}

                    <div className="flex items-center gap-3 ml-auto relative">
                        {role !== 'owner' && (
                            <>
                                <button 
                                    onClick={() => {
                                        setIsNotificationOpen(!isNotificationOpen);
                                        playNotificationSound();
                                    }}
                                    className={`w-9 h-9 flex items-center justify-center rounded-venus text-foreground/60 hover:bg-card hover:text-foreground hover-shake transition-all border border-border relative ${isNotificationOpen ? 'bg-card text-foreground' : ''}`}
                                >
                                    <IconBell />
                                    {(((usePage().props.notifications as any)?.pendingItems?.length) > 0) && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
                                            {(usePage().props.notifications as any).pendingItems.length}
                                        </span>
                                    )}
                                </button>
                                
                                {/* Dropdown Overlay (for clicking outside) */}
                                {isNotificationOpen && (
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsNotificationOpen(false)}
                                    />
                                )}
                                
                                {/* Notification Dropdown */}
                                <div className={`absolute top-12 right-0 w-[calc(100vw-2rem)] sm:w-80 bg-card/95 backdrop-blur-md border border-border rounded-venus shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 ease-out ${
                                    isNotificationOpen 
                                        ? 'opacity-100 translate-y-0 scale-100' 
                                        : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                                }`}>
                                    <div className="px-4 py-3 border-b border-border bg-background flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-super-black">Notifikasi Baru</h3>
                                        <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full uppercase">
                                            Butuh Tindakan
                                        </span>
                                    </div>
                                    <div className="max-h-[360px] overflow-y-auto">
                                        {((usePage().props.notifications as any)?.pendingItems?.length > 0) ? (
                                            <div className="flex flex-col">
                                                {(usePage().props.notifications as any).pendingItems.map((item: any) => (
                                                    <Link 
                                                        key={item.id} 
                                                        href={item.link}
                                                        className="px-4 py-3 border-b border-border/50 hover:bg-background/50 transition-colors block group"
                                                    >
                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                                                {item.title}
                                                            </span>
                                                            <span className="text-[10px] text-foreground/40 whitespace-nowrap">
                                                                {item.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-super-black font-semibold mb-0.5">
                                                            {item.customer} <span className="text-foreground/40 font-normal">({item.code})</span>
                                                        </p>
                                                        <p className="text-[10px] text-foreground/60 truncate">
                                                            {item.detail}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-bold text-super-black">Tidak ada notifikasi</p>
                                                <p className="text-xs text-foreground/50 mt-1">
                                                    Semua booking dan pesanan telah diproses.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-border ml-2">
                            <div className="flex flex-col items-end">
                                <span className="text-body-m text-foreground font-semibold">{headerName}</span>
                                <span className="text-[10px] text-foreground/50">{sidebarSubtitle}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs">
                                {headerName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
