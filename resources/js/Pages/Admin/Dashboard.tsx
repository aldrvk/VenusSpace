import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import {
    PageHeader,
    StatCard,
    Badge,
    TableResponsive,
} from "../../Components/AdminUI";

// ── Types ────────────────────────────────────────────────────────────────────
interface Booking {
    id: number;
    customer: string;
    service: string;
    unit: "DOORSMEER" | "BENGKEL" | "COFFEE SHOP" | "RENTAL PS" | "VAPE STORE";
    time: string;
    status: "PENDING" | "SELESAI" | "IN PROGRESS" | "BATAL";
}

interface UnitPerf {
    key: string;
    label: string;
    color: string;
    revenueToday: number;
    totalToday: number;
    pendingToday: number;
    completedToday: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const unitBadgeVariant: Record<
    Booking["unit"],
    "default" | "warning" | "success" | "danger"
> = {
    DOORSMEER: "default",
    BENGKEL: "warning",
    "COFFEE SHOP": "default",
    "RENTAL PS": "warning",
    "VAPE STORE": "success",
};

const StatusBadge = ({ status }: { status: Booking["status"] }) => {
    const variants: Record<
        Booking["status"],
        "default" | "warning" | "success" | "danger"
    > = {
        PENDING: "warning",
        SELESAI: "success",
        "IN PROGRESS": "default",
        BATAL: "danger",
    };
    return <Badge text={status} variant={variants[status] || "default"} />;
};

const unitIconMap: Record<string, React.ReactNode> = {
    doorsmeer: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" /><rect x="9" y="11" width="14" height="10" rx="2" /><circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>,
    bengkel: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
    rental_ps: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4M8 10v4M15 11h2M18 11h2" /></svg>,
    coffee_shop: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 010 8h-1" /><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>,
    vape_store: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="6" height="16" rx="1" /><rect x="14" y="6" width="6" height="16" rx="1" /><path d="M7 6V4a1 1 0 011-1h0a1 1 0 011 1v2M17 6V4a1 1 0 011-1h0a1 1 0 011 1v2" /></svg>,
};

const unitColorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    doorsmeer: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", gradient: "from-primary to-primary/70" },
    bengkel: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", gradient: "from-orange-400 to-orange-500" },
    rental_ps: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", gradient: "from-purple-400 to-purple-500" },
    coffee_shop: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", gradient: "from-amber-400 to-amber-500" },
    vape_store: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", gradient: "from-indigo-400 to-indigo-500" },
};

// ── Gauge Component ──────────────────────────────────────────────────────────
function GaugeCircle({ pct, size = 56 }: { pct: number; size?: number }) {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const color = pct >= 70 ? 'stroke-emerald-500' : pct >= 40 ? 'stroke-amber-500' : 'stroke-red-500';
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" className={`${color} transition-all duration-1000`}
                strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
        </svg>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard({ stats: dbStats, recentBookings: dbRecentBookings, roleInfo, unitPerformance, employeeCount }: any) {
    const role = roleInfo?.role || 'admin';
    const unit = roleInfo?.unit || null;
    const roleLabel = roleInfo?.roleLabel || 'Admin';
    const unitLabel = roleInfo?.unitLabel || 'Venus Hub';
    const userName = roleInfo?.userName || 'User';
    const isOwner = role === 'owner';

    const pageTitle = isOwner 
        ? "Dashboard Owner" 
        : (role === 'kasir' ? `Dashboard Kasir ${unitLabel}` : `Dashboard Admin ${unitLabel}`);

    const welcomeSubtitle = isOwner
        ? "Ringkasan aktivitas global seluruh unit usaha hari ini."
        : `Ringkasan aktivitas unit ${unitLabel} hari ini.`;

    const bookingsToDisplay: Booking[] = dbRecentBookings || [];
    const showBookingLink = isOwner || ['doorsmeer', 'bengkel', 'rental_ps'].includes(unit || '');
    const showStoreLink = isOwner || ['vape_store', 'coffee_shop'].includes(unit || '');

    // Revenue comparison
    const revenueToday = dbStats?.revenueToday || 0;
    const revenueYesterday = dbStats?.revenueYesterday || 0;
    const revenueDiff = revenueToday - revenueYesterday;
    const revenuePct = revenueYesterday > 0 ? Math.round((revenueDiff / revenueYesterday) * 100) : (revenueToday > 0 ? 100 : 0);
    const completionRate = dbStats?.completionRate || 0;

    if (isOwner) {
        return (
            <AdminLayout>
                <Head title={`${pageTitle} – Venus Space`} />

                {/* Owner Header */}
                <div className="relative mb-8">
                    <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-super-black to-foreground/70 tracking-tight">
                        Selamat Datang, {userName}
                    </h1>
                    <p className="text-foreground/60 mt-2 font-medium">{welcomeSubtitle}</p>
                </div>

                {/* Hero KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Revenue Today */}
                    <div className="group relative bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-primary to-primary/80 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
                        <div className="flex items-start justify-between mb-3 relative z-10">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-md">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${revenueDiff >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                {revenueDiff >= 0 ? '↑' : '↓'} {Math.abs(revenuePct)}% vs kemarin
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">Revenue Hari Ini</p>
                        <p className="text-2xl font-extrabold text-super-black tracking-tight">
                            Rp {revenueToday.toLocaleString("id-ID")}
                        </p>
                    </div>

                    {/* Total Transaksi Hari Ini */}
                    <div className="group relative bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-secondary to-secondary/80 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
                        <div className="flex items-start justify-between mb-3 relative z-10">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-white flex items-center justify-center shadow-md">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>
                            </div>
                            <div className="flex gap-1.5">
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    {dbStats?.completedToday || 0}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    {dbStats?.pendingToday || 0}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">Total Transaksi Hari Ini</p>
                        <p className="text-2xl font-extrabold text-super-black tracking-tight">{dbStats?.totalToday || 0}</p>
                    </div>

                    {/* Completion Rate */}
                    <div className="group relative bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
                        <div className="flex items-start justify-between mb-3 relative z-10">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-md">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                            <div className="relative">
                                <GaugeCircle pct={completionRate} size={44} />
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-super-black">{completionRate}%</span>
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">Completion Rate</p>
                        <p className="text-lg font-extrabold text-super-black tracking-tight">{dbStats?.completedToday || 0} / {dbStats?.totalToday || 0} selesai</p>
                    </div>

                    {/* Pending */}
                    <div className={`group relative bg-card/80 backdrop-blur-lg border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden ${(dbStats?.pendingToday || 0) > 0 ? 'border-orange-200' : 'border-border'}`}>
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-500 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
                        <div className="flex items-start justify-between mb-3 relative z-10">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center shadow-md">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            {(dbStats?.pendingToday || 0) > 0 && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Butuh Perhatian
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">Pending Sekarang</p>
                        <p className="text-2xl font-extrabold text-super-black tracking-tight">{dbStats?.pendingToday || 0}</p>
                    </div>
                </div>

                {/* Unit Performance Grid */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-5 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        <h2 className="text-lg font-extrabold text-super-black tracking-tight">Performa Unit Hari Ini</h2>
                        <span className="text-[10px] font-bold bg-surface text-foreground/40 px-2 py-0.5 rounded-full border border-border">{unitPerformance?.length || 0} unit</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {(unitPerformance || []).map((up: UnitPerf) => {
                            const colors = unitColorMap[up.key] || unitColorMap.doorsmeer;
                            const hasActivity = up.totalToday > 0;
                            return (
                                <Link
                                    key={up.key}
                                    href={`/admin/laporan?filter_unit=${encodeURIComponent(up.label)}`}
                                    className={`group relative bg-card/80 backdrop-blur-lg border ${colors.border} rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer`}
                                >
                                    <div className={`absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-25 transition-opacity`} />
                                    
                                    <div className="flex items-center justify-between mb-3 relative z-10">
                                        <div className={`w-9 h-9 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
                                            {unitIconMap[up.key]}
                                        </div>
                                        {up.pendingToday > 0 ? (
                                            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50" />
                                        ) : up.completedToday > 0 ? (
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                        ) : (
                                            <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                                        )}
                                    </div>

                                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">{up.label}</p>
                                    <p className={`text-lg font-extrabold tracking-tight ${hasActivity ? 'text-super-black' : 'text-foreground/30'}`}>
                                        Rp {up.revenueToday.toLocaleString("id-ID")}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] font-bold text-foreground/40">{up.totalToday} trx</span>
                                        {up.pendingToday > 0 && <span className="text-[10px] font-bold text-orange-500">{up.pendingToday} pending</span>}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Link href="/admin/laporan" className="group flex items-center gap-4 bg-card/80 border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-super-black group-hover:text-primary transition-colors">Laporan Lengkap</p>
                            <p className="text-xs text-foreground/40">Analisis mendalam & unduh data</p>
                        </div>
                        <span className="ml-auto text-foreground/20 group-hover:text-primary transition-colors">→</span>
                    </Link>

                    <Link href="/admin/tim" className="group flex items-center gap-4 bg-card/80 border border-border rounded-2xl p-5 hover:border-secondary/30 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-super-black group-hover:text-secondary transition-colors">Kelola Tim</p>
                            <p className="text-xs text-foreground/40">{employeeCount || 0} karyawan aktif</p>
                        </div>
                        <span className="ml-auto text-foreground/20 group-hover:text-secondary transition-colors">→</span>
                    </Link>

                    <Link href="/admin/pengaturan" className="group flex items-center gap-4 bg-card/80 border border-border rounded-2xl p-5 hover:border-foreground/20 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-foreground/70 to-foreground/50 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-super-black group-hover:text-foreground/70 transition-colors">Pengaturan</p>
                            <p className="text-xs text-foreground/40">Konfigurasi sistem</p>
                        </div>
                        <span className="ml-auto text-foreground/20 group-hover:text-foreground/50 transition-colors">→</span>
                    </Link>
                </div>

                {/* Recent Activity (Compact) */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-super-black">Aktivitas Terbaru</h2>
                            <span className="text-[10px] font-bold bg-surface text-foreground/40 px-2 py-0.5 rounded-full border border-border">{bookingsToDisplay.length} terbaru</span>
                        </div>
                        <Link href="/admin/laporan" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                            Lihat semua di Laporan →
                        </Link>
                    </div>
                    <TableResponsive>
                        <table className="w-full text-xs md:text-sm">
                            <thead className="hidden md:table-header-group">
                                <tr className="border-b border-border">
                                    {["NO", "NAMA PELANGGAN", "LAYANAN / ITEM", "UNIT", "WAKTU", "STATUS"].map((h) => (
                                        <th key={h} className="text-left px-4 md:px-6 py-3 text-[10px] md:text-xs text-foreground/40 font-bold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {bookingsToDisplay.length > 0 ? (
                                    bookingsToDisplay.slice(0, 5).map((b: Booking, idx: number) => (
                                        <tr key={`${b.unit}-${b.id}`} className="border-b border-border/50 hover:bg-background/40 transition-colors">
                                            <td className="px-4 md:px-6 py-3 text-foreground/60">{idx + 1}</td>
                                            <td className="px-4 md:px-6 py-3 text-super-black font-semibold">{b.customer}</td>
                                            <td className="px-4 md:px-6 py-3 text-foreground/70 max-w-[180px] truncate">{b.service}</td>
                                            <td className="px-4 md:px-6 py-3"><Badge text={b.unit} variant={unitBadgeVariant[b.unit]} /></td>
                                            <td className="px-4 md:px-6 py-3 text-foreground/70">{b.time}</td>
                                            <td className="px-4 md:px-6 py-3"><StatusBadge status={b.status} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-foreground/40 italic">
                                            Belum ada data aktivitas terbaru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TableResponsive>
                </div>
            </AdminLayout>
        );
    }

    // ── Non-Owner Dashboard (Admin/Kasir) ─────────────────────────────────────
    const displayStats = [
        {
            label: "TOTAL TRANSAKSI", title: "Semua Transaksi", value: dbStats?.totalAllTime || "0",
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>,
            iconBg: "bg-primary/10 text-primary",
        },
        {
            label: "PENDING HARI INI", title: "Proses Pending", value: dbStats?.pendingToday || "0",
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
            iconBg: "bg-orange-100 text-orange-500",
        },
        {
            label: "SELESAI HARI INI", title: "Transaksi Selesai", value: dbStats?.completedToday || "0",
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
            iconBg: "bg-emerald-100 text-emerald-600",
        },
    ];

    return (
        <AdminLayout>
            <Head title={`${pageTitle} – Venus Space`} />
            <PageHeader title={`Halo, ${userName}!`} subtitle={welcomeSubtitle} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {displayStats.map((s, i) => (
                    <StatCard key={i} label={s.label} title={s.title} value={s.value} icon={s.icon} iconBg={s.iconBg} />
                ))}
                <div className="bg-secondary rounded-venus p-4 md:p-5 flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
                    <div className="flex items-start justify-between relative">
                        <span className="w-10 h-10 rounded-venus flex items-center justify-center bg-white/15 text-white">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                        </span>
                        <span className="text-[11px] md:text-xs text-white/50">LIVE REVENUE</span>
                    </div>
                    <div className="relative">
                        <p className="text-xs md:text-sm text-white/60">Total Pendapatan ({unit ? unitLabel : 'Global'})</p>
                        <p className="text-lg md:text-xl text-white font-bold mt-1">Rp {(dbStats?.revenueAllTime || 0).toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-venus overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border">
                    <h2 className="text-lg md:text-xl text-super-black font-bold">
                        Aktivitas Terbaru {unit ? `(${unitLabel})` : '(Semua Unit)'}
                    </h2>
                    <div className="flex gap-4">
                        {showBookingLink && (
                            <Link href={unit === 'bengkel' ? '/admin/booking-bengkel' : (unit === 'rental_ps' ? '/admin/booking-rental-ps' : '/admin/booking-doorsmeer')}
                                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-semibold">
                                Booking Unit →
                            </Link>
                        )}
                        {showStoreLink && (
                            <Link href="/admin/pesanan-store" className="text-xs text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1 font-semibold">
                                Pesanan Store →
                            </Link>
                        )}
                    </div>
                </div>
                <TableResponsive>
                    <table className="w-full text-xs md:text-sm">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b border-border">
                                {["NO", "NAMA PELANGGAN", "LAYANAN / ITEM", "UNIT USAHA", "WAKTU", "STATUS"].map((h) => (
                                    <th key={h} className="text-left px-4 md:px-6 py-3 text-[10px] md:text-xs text-foreground/40 font-bold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bookingsToDisplay.length > 0 ? (
                                bookingsToDisplay.map((b: Booking, idx: number) => (
                                    <tr key={`${b.unit}-${b.id}`} className="border-b border-border/50 hover:bg-background/40 transition-colors flex md:table-row flex-col md:flex-row gap-2 md:gap-0 p-4 md:p-0">
                                        <td className="md:px-6 md:py-4 text-foreground/60" data-label="NO">{idx + 1}</td>
                                        <td className="md:px-6 md:py-4 text-super-black font-semibold" data-label="NAMA">{b.customer}</td>
                                        <td className="md:px-6 md:py-4 text-foreground/70" data-label="LAYANAN">{b.service}</td>
                                        <td className="md:px-6 md:py-4" data-label="UNIT"><Badge text={b.unit} variant={unitBadgeVariant[b.unit]} /></td>
                                        <td className="md:px-6 md:py-4 text-foreground/70" data-label="WAKTU">{b.time}</td>
                                        <td className="md:px-6 md:py-4" data-label="STATUS"><StatusBadge status={b.status} /></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-foreground/40 italic">
                                        Belum ada data aktivitas atau pesanan terbaru untuk unit ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableResponsive>
                <div className="px-4 md:px-6 py-3 border-t border-border">
                    <p className="text-foreground/40 text-xs">Menampilkan hingga 10 aktivitas terbaru</p>
                </div>
            </div>
        </AdminLayout>
    );
}
