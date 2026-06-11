import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { TableResponsive } from "../../Components/AdminUI";

type PeriodTab = "Hari Ini" | "Minggu Ini" | "Bulan Ini" | "Kustom";

const unitBadgeColor: Record<string, string> = {
    Doorsmeer: "bg-primary/15 text-secondary border border-primary/30",
    Bengkel: "bg-orange-100 text-orange-700 border border-orange-200",
    "Coffee Shop": "bg-amber-100 text-amber-700 border border-amber-200",
    "Rental PS": "bg-purple-100 text-purple-700 border border-purple-200",
    "Vape Store": "bg-indigo-100 text-indigo-700 border border-indigo-200",
};

export default function Laporan({ 
    initialTransactions = [], 
    initialRevenueByUnit = [], 
    initialPeriod = "Hari Ini",
    kpi = { totalRevenue: 0, totalBookings: 0, pendingAmount: 0, pendingCount: 0 },
    chartData = [],
    filters = {}
}: any) {
    const [activePeriod, setActivePeriod] = useState<PeriodTab>(
        filters.start_date && filters.end_date ? "Kustom" : (initialPeriod as PeriodTab)
    );
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");

    const periods: PeriodTab[] = ["Hari Ini", "Minggu Ini", "Bulan Ini"];

    const totalRevenue = kpi?.totalRevenue || 0;
    const totalBookings = kpi?.totalBookings || 0;
    const maxChartValue = Math.max(...(chartData || []).map((d: any) => d.value || 0), 1);

    const handlePeriodChange = (p: PeriodTab) => {
        setActivePeriod(p);
        setStartDate("");
        setEndDate("");
        router.get('/admin/laporan', { period: p }, { preserveState: true, preserveScroll: true });
    };

    const handleCustomFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        setActivePeriod("Kustom");
        router.get('/admin/laporan', { 
            period: 'Kustom',
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true, preserveScroll: true });
    };

    const handleExportPdf = () => {
        let url = `/admin/laporan/export?period=${activePeriod}`;
        if (activePeriod === "Kustom" && startDate && endDate) {
            url += `&start_date=${startDate}&end_date=${endDate}`;
        }
        window.location.href = url;
    };

    return (
        <AdminLayout>
            <Head title="Laporan Eksekutif – Venus Space" />
            
            {/* Header Mewah */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 relative">
                {/* Decorative background blur */}
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-super-black to-foreground/70 tracking-tight">
                        Laporan Eksekutif
                    </h1>
                    <p className="text-foreground/60 mt-2 font-medium">Ringkasan performa bisnis dan aliran pendapatan terpusat.</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto xl:justify-end">
                    {/* Period Tabs */}
                    <div className="flex bg-card/60 backdrop-blur-md p-1.5 rounded-full border border-border shadow-sm">
                        {periods.map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePeriodChange(p)}
                                className={`px-4 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-semibold ${
                                    activePeriod === p 
                                    ? "bg-secondary text-white shadow-md transform scale-105" 
                                    : "text-foreground/60 hover:text-super-black hover:bg-surface"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    {/* Custom Date Form */}
                    <form onSubmit={handleCustomFilterSubmit} className="flex flex-wrap items-center gap-2 bg-card/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-border shadow-sm w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-background border border-border rounded-venus px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                                required
                            />
                            <span className="text-xs text-foreground/40">s/d</span>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-background border border-border rounded-venus px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-venus hover:bg-primary/95 transition-all"
                        >
                            Filter
                        </button>
                    </form>

                    {/* Download PDF Button */}
                    <button 
                        onClick={handleExportPdf}
                        className="flex items-center gap-2 border border-border text-foreground/70 px-6 py-2.5 rounded-full hover:bg-surface hover:text-super-black transition-all text-sm font-bold w-full md:w-auto justify-center shrink-0"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Unduh PDF
                    </button>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                    {
                        label: "Total Pendapatan",
                        value: `Rp ${(totalRevenue).toLocaleString("id-ID")}`,
                        sub: "Dari status Lunas",
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                        gradient: "from-primary to-primary/80",
                        glow: "group-hover:shadow-primary/20",
                        positive: true,
                    },
                    {
                        label: "Total Transaksi",
                        value: totalBookings,
                        sub: `${initialTransactions.length} tercatat`,
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
                        gradient: "from-secondary to-secondary/80",
                        glow: "group-hover:shadow-secondary/20",
                        positive: true,
                    },
                    {
                        label: "Rata-rata Transaksi",
                        value: totalBookings > 0 ? `Rp ${Math.round(totalRevenue / totalBookings).toLocaleString("id-ID")}` : 'Rp 0',
                        sub: "Per transaksi",
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                        gradient: "from-primary/60 to-primary",
                        glow: "group-hover:shadow-primary/20",
                        positive: true,
                    },
                    {
                        label: "Pending Pembayaran",
                        value: `Rp ${(kpi?.pendingAmount || 0).toLocaleString("id-ID")}`,
                        sub: `${kpi?.pendingCount || 0} transaksi menunggu`,
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                        gradient: "from-rose-500 to-red-600",
                        glow: "group-hover:shadow-rose-500/20",
                        positive: false,
                    },
                ].map((k, i) => (
                    <div
                        key={i}
                        className={`group relative bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${k.glow} overflow-hidden`}
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${k.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                        
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${k.gradient} text-white flex items-center justify-center shadow-md`}>
                                {k.icon}
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-surface border border-border ${k.positive ? "text-foreground/70" : "text-rose-500"}`}>
                                {k.sub}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-1">
                                {k.label}
                            </p>
                            <p className="text-2xl font-extrabold text-super-black tracking-tight truncate">
                                {k.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue by Unit */}
                <div className="lg:col-span-1 bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        <h3 className="text-xl font-extrabold text-super-black tracking-tight">
                            Distribusi Unit
                        </h3>
                    </div>
                    
                    <div className="space-y-5 flex-1">
                        {initialRevenueByUnit.length > 0 ? (
                            initialRevenueByUnit.map((u: any) => (
                                <div key={u.unit} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-foreground group-hover:text-super-black transition-colors">
                                            {u.unit}
                                        </span>
                                        <span className="text-sm font-extrabold text-super-black">
                                            Rp {u.amount.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-surface rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full ${u.color} rounded-full transition-all duration-1000 ease-out relative`}
                                            style={{ width: `${u.pct}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_infinite]" />
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-foreground/40 mt-1.5 flex justify-between">
                                        <span>{u.bookings} transaksi</span>
                                        <span>{u.pct}%</span>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-foreground/40 italic text-center py-6">Tidak ada unit transaksi.</p>
                        )}
                    </div>
                    
                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground/50 uppercase tracking-wider">
                            Total Pendapatan
                        </span>
                        <span className="text-xl font-extrabold text-secondary">
                            Rp {totalRevenue.toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-6 bg-gradient-to-b from-secondary to-primary rounded-full" />
                            <h3 className="text-lg sm:text-xl font-extrabold text-super-black tracking-tight">
                                Tren Transaksi
                            </h3>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-full border border-primary/20">
                            {activePeriod === "Kustom" ? `${startDate} s/d ${endDate}` : activePeriod}
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                        <div className="flex items-end gap-1 sm:gap-3 h-48 sm:h-56 mt-auto" style={{ minWidth: chartData.length > 7 ? `${chartData.length * 44}px` : 'auto' }}>
                            {chartData.length > 0 ? (
                                chartData.map((d: any, i: number) => {
                                    const heightPct = (d.value / maxChartValue) * 100;
                                    const gradients = [
                                        "from-primary to-primary/80",
                                        "from-secondary to-secondary/80",
                                        "from-primary/70 to-primary/50",
                                        "from-secondary/70 to-secondary/50",
                                    ];
                                    const currentGradient = gradients[i % gradients.length];
                                    
                                    return (
                                        <div
                                            key={d.label}
                                            className="flex-1 flex flex-col items-center gap-2 group min-w-[28px] sm:min-w-[36px]"
                                        >
                                            <div
                                                className="w-full relative flex items-end justify-center"
                                                style={{ height: "100%" }}
                                            >
                                                <div className={`absolute -bottom-2 w-full h-4 bg-gradient-to-r ${currentGradient} blur-md opacity-0 group-hover:opacity-40 transition-opacity`} />
                                                <div
                                                    className={`w-full max-w-[32px] sm:max-w-[40px] rounded-t-lg bg-gradient-to-t ${currentGradient} opacity-70 group-hover:opacity-100 transition-all duration-300 cursor-pointer relative shadow-inner`}
                                                    style={{ height: `${heightPct || 3}%` }}
                                                    title={`${d.label}: ${d.value} transaksi`}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-super-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                        {d.value} trx
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[9px] sm:text-xs font-semibold text-foreground/50 group-hover:text-super-black transition-colors whitespace-nowrap">
                                                {d.label}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-foreground/40 italic w-full text-center py-20">Tidak ada tren transaksi.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* List Detail Transaksi */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-lg font-bold text-super-black">Rincian Transaksi</h3>
                </div>
                <TableResponsive>
                    <table className="w-full text-sm">
                        <thead className="bg-surface/50 border-b border-border">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">No</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">Kode</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">Waktu</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">Pelanggan</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">Unit</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">Layanan / Item</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">Nominal</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-foreground/50 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialTransactions.length > 0 ? (
                                initialTransactions.map((tx: any, idx: number) => (
                                    <tr key={tx.id} className="border-b border-border/50 hover:bg-background/40 transition-colors">
                                        <td className="px-6 py-4 text-foreground/60">{idx + 1}</td>
                                        <td className="px-6 py-4 text-super-black font-semibold">{tx.id}</td>
                                        <td className="px-6 py-4 text-foreground/60">{tx.time}</td>
                                        <td className="px-6 py-4 text-super-black font-semibold">{tx.customer}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${unitBadgeColor[tx.unit] || 'bg-gray-100 text-gray-700'}`}>
                                                {tx.unit}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-foreground/70">{tx.service}</td>
                                        <td className="px-6 py-4 text-super-black font-semibold">Rp {tx.amount.toLocaleString("id-ID")}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold ${tx.status === 'Lunas' ? 'text-emerald-500' : (tx.status === 'Batal' ? 'text-red-500' : 'text-orange-500')}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-foreground/40 italic">
                                        Tidak ada transaksi tercatat dalam rentang waktu terpilih.
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
