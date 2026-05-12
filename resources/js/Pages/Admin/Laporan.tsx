import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import {
    PageHeader,
} from "../../Components/AdminUI";

type PeriodTab = "Hari Ini" | "Minggu Ini" | "Bulan Ini";



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
    chartData = []
}: any) {
    const [activePeriod, setActivePeriod] = useState<PeriodTab>(initialPeriod as PeriodTab);
    const periods: PeriodTab[] = ["Hari Ini", "Minggu Ini", "Bulan Ini"];

    const totalRevenue = kpi?.totalRevenue || 0;
    const totalBookings = kpi?.totalBookings || 0;
    const maxChartValue = Math.max(...(chartData || []).map((d: any) => d.value || 0), 1);

    const handlePeriodChange = (p: PeriodTab) => {
        setActivePeriod(p);
        router.get('/admin/laporan', { period: p }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Laporan – Venus Hub Admin" />

            <PageHeader
                title="Laporan"
                subtitle="Ringkasan performa dan pendapatan semua unit usaha."
                action={
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="flex gap-1 bg-surface rounded-full p-1 border border-border text-xs md:text-label-sm">
                            {periods.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePeriodChange(p)}
                                    className={`px-3 md:px-4 py-1.5 rounded-full transition-all ${activePeriod === p ? "bg-secondary text-white shadow" : "text-foreground/60 hover:text-foreground"}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => window.location.href = `/admin/laporan/export?period=${activePeriod}`}
                            className="flex items-center gap-2 border border-border text-foreground/70 px-3 md:px-4 py-2 md:py-2.5 rounded-full hover:bg-surface transition-all text-xs md:text-label-sm font-semibold whitespace-nowrap"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Export PDF
                        </button>
                    </div>
                }
            />

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                    {
                        label: "Total Pendapatan",
                        value: `Rp ${(totalRevenue / 1000).toFixed(0)}k`,
                        sub: "Dari status Lunas",
                        icon: "💰",
                        positive: true,
                    },
                    {
                        label: "Total Transaksi",
                        value: totalBookings,
                        sub: `${initialTransactions.length} tercatat`,
                        icon: "🧾",
                        positive: true,
                    },
                    {
                        label: "Rata-rata Transaksi",
                        value: totalBookings > 0 ? `Rp ${Math.round(totalRevenue / totalBookings / 1000)}k` : 'Rp 0',
                        sub: "Per booking",
                        icon: "📊",
                        positive: true,
                    },
                    {
                        label: "Pending Pembayaran",
                        value: `Rp ${((kpi?.pendingAmount || 0) / 1000).toFixed(0)}k`,
                        sub: `${kpi?.pendingCount || 0} transaksi menunggu`,
                        icon: "⏱",
                        positive: false,
                    },
                ].map((k, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded-venus p-4 md:p-5"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-venus bg-surface flex items-center justify-center text-lg">
                                {k.icon}
                            </div>
                            <span
                                className={`text-[10px] font-semibold ${k.positive ? "text-primary" : "text-orange-500"}`}
                            >
                                {k.sub}
                            </span>
                        </div>
                        <p className="text-xs md:text-body-reg text-foreground/50">
                            {k.label}
                        </p>
                        <p className="text-lg md:text-h3 text-super-black mt-1 font-bold">
                            {k.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
                {/* Revenue by Unit */}
                <div className="lg:col-span-1 bg-card border border-border rounded-venus p-4 md:p-5">
                    <h3 className="text-lg md:text-h4 text-super-black mb-4 md:mb-5 font-bold">
                        Pendapatan per Unit
                    </h3>
                    <div className="space-y-4">
                        {initialRevenueByUnit.map((u: any) => (
                            <div key={u.unit}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-body-m text-foreground font-semibold">
                                        {u.unit}
                                    </span>
                                    <span className="text-body-m text-super-black font-bold">
                                        Rp {(u.amount / 1000).toFixed(0)}k
                                    </span>
                                </div>
                                <div className="h-2 bg-surface rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${u.color} rounded-full transition-all`}
                                        style={{ width: `${u.pct}%` }}
                                    />
                                </div>
                                <p className="text-body-reg text-foreground/40 mt-1">
                                    {u.bookings} booking · {u.pct}%
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Total */}
                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-body-m text-foreground/70 font-semibold">
                            Total
                        </span>
                        <span className="text-card-title text-secondary">
                            Rp {(totalRevenue / 1000).toFixed(0)}k
                        </span>
                    </div>
                </div>

                {/* Bar Chart (visual representation) */}
                <div className="col-span-2 bg-card border border-border rounded-venus p-5">
                    <h3 className="text-h4 text-super-black mb-5">
                        Grafik Transaksi Harian
                    </h3>
                    <div className="flex items-end justify-between gap-2 h-44">
                        {chartData.map((d: any, i: number) => {
                            const heightPct = (d.value / maxChartValue) * 100;
                            const colors = [
                                "bg-primary",
                                "bg-orange-400",
                                "bg-amber-400",
                                "bg-purple-400",
                            ];
                            return (
                                <div
                                    key={d.label}
                                    className="flex-1 flex flex-col items-center gap-1 group"
                                >
                                    <div
                                        className="w-full relative flex items-end justify-center"
                                        style={{ height: "160px" }}
                                    >
                                        <div
                                            className={`w-full rounded-t-venus ${colors[i % colors.length]} opacity-80 group-hover:opacity-100 transition-all cursor-pointer`}
                                            style={{ height: `${heightPct || 5}%` }}
                                            title={`${d.label}: ${d.value} transaksi`}
                                        />
                                    </div>
                                    <span className="text-[9px] text-foreground/30 font-medium">
                                        {d.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-body-reg text-foreground/40">
                            Data berdasarkan transaksi masuk
                        </p>
                        <p className="text-body-reg text-foreground/40">
                            Periode: {activePeriod}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-card border border-border rounded-venus overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-h4 text-super-black">
                        Daftar Transaksi
                    </h2>
                    <span className="text-label-sm text-foreground/40">
                        {initialTransactions.length} transaksi
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {[
                                    "ID",
                                    "WAKTU",
                                    "PELANGGAN",
                                    "UNIT",
                                    "LAYANAN",
                                    "JUMLAH",
                                    "STATUS",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-6 py-3 text-label-sm text-foreground/40"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {initialTransactions.map((t: any, i: number) => (
                                <tr
                                    key={i}
                                    className="border-b border-border/50 hover:bg-background/60 transition-colors"
                                >
                                    <td className="px-6 py-4 text-body-reg text-foreground/50 font-mono">
                                        {t.id}
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-foreground/70">
                                        {t.time}
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-super-black font-semibold">
                                        {t.customer}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest ${unitBadgeColor[t.unit]}`}
                                        >
                                            {t.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-foreground/70">
                                        {t.service}
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-super-black font-bold">
                                        Rp {(t.amount || 0).toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest ${t.status === "Lunas" ? "bg-primary/15 text-secondary border border-primary/30" : "bg-orange-100 text-orange-600 border border-orange-200"}`}
                                        >
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
