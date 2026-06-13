import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";

type PeriodTab = "Hari Ini" | "Minggu Ini" | "Bulan Ini" | "Kustom";

const unitBadgeColor: Record<string, string> = {
    Doorsmeer: "bg-primary/15 text-secondary border border-primary/30",
    Bengkel: "bg-orange-100 text-orange-700 border border-orange-200",
    "Coffee Shop": "bg-amber-100 text-amber-700 border border-amber-200",
    "Rental PS": "bg-purple-100 text-purple-700 border border-purple-200",
    "Vape Store": "bg-indigo-100 text-indigo-700 border border-indigo-200",
};

const UNITS = ["Semua", "Doorsmeer", "Bengkel", "Coffee Shop", "Rental PS", "Vape Store"];
const STATUSES = ["Semua", "Lunas", "Pending", "Batal"];
const PAGE_SIZES = [10, 20, 50, 100];

// ── Donut Chart Component ────────────────────────────────────────────────────
function formatCompact(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}jt`;
    if (n >= 100_000) return `${(n / 1_000).toFixed(0)}rb`;
    return n.toLocaleString('id-ID');
}

function DonutChart({ data, total }: { data: { unit: string; amount: number; pct: number; color: string; bookings: number }[]; total: number }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const radius = 85;
    const cx = 120;
    const cy = 120;
    const strokeWidth = 36;

    const colorMap: Record<string, string> = {
        'bg-primary': 'hsl(var(--primary))',
        'bg-orange-400': '#fb923c',
        'bg-amber-400': '#fbbf24',
        'bg-purple-400': '#c084fc',
        'bg-indigo-400': '#818cf8',
    };

    let cumulativePct = 0;
    const segments = data.map((d, i) => {
        const pct = total > 0 ? (d.amount / total) * 100 : 0;
        const startAngle = (cumulativePct / 100) * 360 - 90;
        const endAngle = ((cumulativePct + pct) / 100) * 360 - 90;
        cumulativePct += pct;

        const largeArc = pct > 50 ? 1 : 0;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);

        const pathD = pct >= 99.9
            ? `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`
            : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;

        return { ...d, pathD, pct, index: i, fillColor: colorMap[d.color] || '#94a3b8' };
    });

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative">
                <svg viewBox="0 0 240 240" className="w-56 h-56">
                    {segments.map((seg) => (
                        <path
                            key={seg.unit}
                            d={seg.pathD}
                            fill="none"
                            stroke={seg.fillColor}
                            strokeWidth={hovered === seg.index ? strokeWidth + 6 : strokeWidth}
                            strokeLinecap="butt"
                            className="transition-all duration-300 cursor-pointer"
                            style={{ opacity: hovered !== null && hovered !== seg.index ? 0.4 : 1 }}
                            onMouseEnter={() => setHovered(seg.index)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {hovered !== null && segments[hovered] ? (
                        <>
                            <span className="text-[9px] font-bold text-foreground/50 uppercase">{segments[hovered].unit}</span>
                            <span className="text-sm font-extrabold text-super-black">Rp {formatCompact(segments[hovered].amount)}</span>
                            <span className="text-[10px] font-bold text-foreground/40">{Math.round(segments[hovered].pct)}%</span>
                        </>
                    ) : (
                        <>
                            <span className="text-[9px] font-bold text-foreground/50 uppercase">Total</span>
                            <span className="text-sm font-extrabold text-super-black">Rp {formatCompact(total)}</span>
                        </>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                {segments.map((seg) => (
                    <div
                        key={seg.unit}
                        className="flex items-center gap-2 cursor-pointer group"
                        onMouseEnter={() => setHovered(seg.index)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.fillColor }} />
                        <span className="text-xs font-semibold text-foreground/70 group-hover:text-super-black transition-colors truncate">{seg.unit}</span>
                        <span className="text-xs font-bold text-foreground/40 ml-auto">{seg.bookings}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Area Chart Component ─────────────────────────────────────────────────────
function AreaChart({ data, revenueData, label }: { data: { label: string; value: number }[]; revenueData?: { label: string; value: number }[]; label: string }) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    if (!data || data.length === 0) return <p className="text-xs text-foreground/40 italic text-center py-16">Tidak ada data tren.</p>;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const maxRev = revenueData ? Math.max(...revenueData.map(d => d.value), 1) : 1;

    const W = 680;
    const H = 200;
    const padL = 10, padR = 10, padT = 30, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const points = data.map((d, i) => ({
        x: padL + (i / Math.max(data.length - 1, 1)) * chartW,
        y: padT + chartH - (d.value / maxVal) * chartH,
        ...d,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

    let revPoints: typeof points = [];
    let revLinePath = '';
    if (revenueData && revenueData.length > 0) {
        revPoints = revenueData.map((d, i) => ({
            x: padL + (i / Math.max(revenueData.length - 1, 1)) * chartW,
            y: padT + chartH - (d.value / maxRev) * chartH,
            ...d,
        }));
        revLinePath = revPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    }

    return (
        <div className="relative w-full overflow-visible">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
                <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="revAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map(frac => (
                    <line key={frac} x1={padL} y1={padT + chartH - frac * chartH} x2={W - padR} y2={padT + chartH - frac * chartH}
                        stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4,4" />
                ))}
                <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="hsl(var(--border))" strokeWidth="1" />

                {/* Revenue area (behind) */}
                {revenueData && revPoints.length > 0 && (
                    <>
                        <path d={`${revLinePath} L ${revPoints[revPoints.length - 1].x} ${padT + chartH} L ${revPoints[0].x} ${padT + chartH} Z`} fill="url(#revAreaFill)" />
                        <path d={revLinePath} fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                    </>
                )}

                {/* Transaction area */}
                <path d={areaPath} fill="url(#areaFill)" />
                <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

                {/* Data points + labels */}
                {points.map((p, i) => (
                    <g key={p.label}>
                        <rect x={p.x - 20} y={padT} width={40} height={chartH + padB} fill="transparent" className="cursor-pointer"
                            onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
                        <circle cx={p.x} cy={p.y} r={hoveredIdx === i ? 5 : 3}
                            fill={hoveredIdx === i ? "hsl(var(--primary))" : "white"} stroke="hsl(var(--primary))" strokeWidth="2"
                            className="transition-all duration-200" />
                        {hoveredIdx === i && (
                            <g>
                                <line x1={p.x} y1={p.y} x2={p.x} y2={padT + chartH} stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                                <rect x={p.x - 40} y={p.y - 32} width={80} height={22} rx="4" fill="hsl(var(--super-black))" />
                                <text x={p.x} y={p.y - 17} textAnchor="middle" fill="white" className="text-[10px] font-bold">{p.value} trx</text>
                            </g>
                        )}
                        {(data.length <= 14 || i % Math.ceil(data.length / 10) === 0 || i === data.length - 1) && (
                            <text x={p.x} y={padT + chartH + 16} textAnchor="middle" className="text-[9px] font-semibold"
                                style={{ fill: hoveredIdx === i ? "hsl(var(--super-black))" : "hsl(var(--foreground) / 0.4)" }}>
                                {p.label}
                            </text>
                        )}
                    </g>
                ))}
            </svg>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 justify-end">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/50">
                    <span className="w-3 h-0.5 bg-primary rounded-full inline-block" /> Transaksi
                </span>
                {revenueData && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/50">
                        <span className="w-3 h-0.5 bg-secondary rounded-full inline-block opacity-50" style={{ borderTop: '1px dashed' }} /> Revenue
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Enhanced Bar Chart ───────────────────────────────────────────────────────
function EnhancedBarChart({ data, viewBoxW, barW = 32, highlightMax = true, gradientId, primaryColor, secondaryColor }: {
    data: { label: string; value: number }[];
    viewBoxW: number; barW?: number; highlightMax?: boolean;
    gradientId: string; primaryColor: string; secondaryColor: string;
}) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    if (!data || data.length === 0) return <p className="text-xs text-foreground/40 italic text-center py-16">Tidak ada data.</p>;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const maxIdx = data.reduce((mi, d, i, arr) => d.value > arr[mi].value ? i : mi, 0);
    const chartH = 110;
    const topPad = 30;
    const baseLine = topPad + chartH;

    return (
        <div className="relative w-full overflow-visible">
            <svg viewBox={`0 0 ${viewBoxW} ${baseLine + 40}`} className="w-full h-auto overflow-visible">
                <defs>
                    <linearGradient id={`${gradientId}P`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={primaryColor} />
                        <stop offset="100%" stopColor={primaryColor} stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id={`${gradientId}S`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={secondaryColor} />
                        <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id={`${gradientId}Max`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={primaryColor} />
                        <stop offset="100%" stopColor={secondaryColor} />
                    </linearGradient>
                </defs>
                <line x1="10" y1={baseLine} x2={viewBoxW - 10} y2={baseLine} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3,3" />

                {data.map((d, i) => {
                    const barH = (d.value / maxVal) * chartH;
                    const x = 15 + (i / Math.max(data.length - 1, 1)) * (viewBoxW - 30 - barW);
                    const y = baseLine - barH;
                    const isHovered = hoveredIdx === i;
                    const isMax = highlightMax && i === maxIdx && d.value > 0;
                    const fillId = isMax ? `url(#${gradientId}Max)` : (i % 2 === 0 ? `url(#${gradientId}P)` : `url(#${gradientId}S)`);

                    return (
                        <g key={d.label}>
                            <rect x={x - 4} y={topPad - 10} width={barW + 8} height={chartH + 20} fill="transparent" className="cursor-pointer"
                                onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
                            {isMax && <rect x={x - 2} y={y - 2} width={barW + 4} height={Math.max(barH, 3) + 4} rx="6" fill={primaryColor} opacity="0.15" />}
                            <rect x={x} y={y} width={barW} height={Math.max(barH, 3)} rx="4" fill={fillId}
                                className="transition-all duration-300 cursor-pointer" style={{ opacity: isHovered ? 1 : isMax ? 0.95 : 0.7 }}
                                onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
                            {/* Value label on top */}
                            {(isHovered || isMax) && d.value > 0 && (
                                <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="text-[10px] font-bold" fill="hsl(var(--super-black))">
                                    {d.value}
                                </text>
                            )}
                            {isMax && d.value > 0 && (
                                <text x={x + barW / 2} y={baseLine + 30} textAnchor="middle" className="text-[8px] font-bold" fill={primaryColor}>PEAK</text>
                            )}
                            <text x={x + barW / 2} y={baseLine + 16} textAnchor="middle" className="text-[10px] font-semibold transition-colors"
                                style={{ fill: isHovered || isMax ? "hsl(var(--super-black))" : "hsl(var(--foreground) / 0.4)" }}>
                                {d.label.split(":")[0]}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Laporan({ 
    initialTransactions = [], 
    initialRevenueByUnit = [], 
    initialPeriod = "Hari Ini",
    kpi = { totalRevenue: 0, totalBookings: 0, pendingAmount: 0, pendingCount: 0 },
    chartData = [],
    revenueChartData = [],
    busiestDays = [],
    busiestHours = [],
    filters = {} as any,
}: any) {
    const [activePeriod, setActivePeriod] = useState<PeriodTab>(
        filters.start_date && filters.end_date ? "Kustom" : (initialPeriod as PeriodTab)
    );
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    
    // Card-level filters for Rincian Transaksi
    const [filterUnit, setFilterUnit] = useState(filters.filter_unit || "Semua");
    const [filterStatus, setFilterStatus] = useState(filters.filter_status || "Semua");
    const [sortNominal, setSortNominal] = useState<"default" | "asc" | "desc">("default");
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Download dropdown
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    const periods: PeriodTab[] = ["Hari Ini", "Minggu Ini", "Bulan Ini"];

    const totalRevenue = kpi?.totalRevenue || 0;
    const totalBookings = kpi?.totalBookings || 0;

    // Build query params for all requests
    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            period: activePeriod,
            ...overrides,
        };
        if ((overrides.period || activePeriod) === "Kustom" && (overrides.start_date || startDate) && (overrides.end_date || endDate)) {
            params.start_date = overrides.start_date || startDate;
            params.end_date = overrides.end_date || endDate;
        }
        const unit = overrides.filter_unit ?? filterUnit;
        const status = overrides.filter_status ?? filterStatus;
        if (unit && unit !== "Semua") params.filter_unit = unit;
        if (status && status !== "Semua") params.filter_status = status;
        return params;
    };

    const handlePeriodChange = (p: PeriodTab) => {
        setActivePeriod(p);
        setStartDate(""); setEndDate("");
        setCurrentPage(1);
        router.get('/admin/laporan', buildParams({ period: p, start_date: undefined, end_date: undefined }), { preserveState: true, preserveScroll: true });
    };

    const handleCustomFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        setActivePeriod("Kustom");
        setCurrentPage(1);
        router.get('/admin/laporan', buildParams({ period: 'Kustom', start_date: startDate, end_date: endDate }), { preserveState: true, preserveScroll: true });
    };

    const handleCardFilterChange = (unit: string, status: string) => {
        setFilterUnit(unit);
        setFilterStatus(status);
        setCurrentPage(1);
        router.get('/admin/laporan', buildParams({ filter_unit: unit, filter_status: status }), { preserveState: true, preserveScroll: true });
    };

    // Client-side sorting of already-filtered server data
    const sortedTransactions = useMemo(() => {
        let txs = [...initialTransactions];
        if (sortNominal === "asc") txs.sort((a: any, b: any) => a.amount - b.amount);
        else if (sortNominal === "desc") txs.sort((a: any, b: any) => b.amount - a.amount);
        return txs;
    }, [initialTransactions, sortNominal]);

    // Pagination
    const totalTx = sortedTransactions.length;
    const totalPages = Math.max(1, Math.ceil(totalTx / pageSize));
    const paginatedTx = sortedTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Export URLs
    const buildExportUrl = (type: 'pdf' | 'excel') => {
        const base = type === 'pdf' ? '/admin/laporan/export' : '/admin/laporan/export-excel';
        const params = new URLSearchParams();
        params.set('period', activePeriod);
        if (activePeriod === "Kustom" && startDate && endDate) {
            params.set('start_date', startDate);
            params.set('end_date', endDate);
        }
        if (filterUnit && filterUnit !== "Semua") params.set('filter_unit', filterUnit);
        if (filterStatus && filterStatus !== "Semua") params.set('filter_status', filterStatus);
        return `${base}?${params.toString()}`;
    };

    // Active filter badges
    const activeFilters: string[] = [];
    if (filterUnit !== "Semua") activeFilters.push(`Unit: ${filterUnit}`);
    if (filterStatus !== "Semua") activeFilters.push(`Status: ${filterStatus}`);

    return (
        <AdminLayout>
            <Head title="Laporan Eksekutif – Venus Space" />
            
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-super-black to-foreground/70 tracking-tight">
                        Laporan Eksekutif
                    </h1>
                    <p className="text-foreground/60 mt-2 font-medium">Ringkasan performa bisnis dan aliran pendapatan terpusat.</p>
                    {/* Active filter indicator */}
                    {activeFilters.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="text-xs font-bold text-foreground/40">Filter aktif:</span>
                            {activeFilters.map(f => (
                                <span key={f} className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{f}</span>
                            ))}
                            <button onClick={() => handleCardFilterChange("Semua", "Semua")} className="text-[10px] font-bold text-red-500 hover:text-red-700 underline transition-colors">Reset</button>
                        </div>
                    )}
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
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                className="bg-background border border-border rounded-venus px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary" required />
                            <span className="text-xs text-foreground/40">s/d</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                className="bg-background border border-border rounded-venus px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary" required />
                        </div>
                        <button type="submit" className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-venus hover:bg-primary/95 transition-all">Filter</button>
                    </form>

                    {/* Download Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                            className="flex items-center gap-2 border border-border text-foreground/70 px-6 py-2.5 rounded-full hover:bg-surface hover:text-super-black transition-all text-sm font-bold w-full md:w-auto justify-center shrink-0"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Unduh Laporan
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                        {showDownloadMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} />
                                <div className="absolute right-0 top-12 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden min-w-[180px]">
                                    <a href={buildExportUrl('pdf')} className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors group" onClick={() => setShowDownloadMenu(false)}>
                                        <span className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-xs font-extrabold group-hover:bg-red-100 transition-colors">PDF</span>
                                        <div>
                                            <p className="text-sm font-bold text-super-black">Unduh PDF</p>
                                            <p className="text-[10px] text-foreground/40">Laporan cetak formal</p>
                                        </div>
                                    </a>
                                    <div className="border-t border-border" />
                                    <a href={buildExportUrl('excel')} className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors group" onClick={() => setShowDownloadMenu(false)}>
                                        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-extrabold group-hover:bg-emerald-100 transition-colors">XLS</span>
                                        <div>
                                            <p className="text-sm font-bold text-super-black">Unduh Excel</p>
                                            <p className="text-[10px] text-foreground/40">Spreadsheet untuk olah data</p>
                                        </div>
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                    {
                        label: "Total Pendapatan", value: `Rp ${(totalRevenue).toLocaleString("id-ID")}`,
                        sub: "Dari status Lunas",
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                        gradient: "from-primary to-primary/80", glow: "group-hover:shadow-primary/20", positive: true,
                    },
                    {
                        label: "Total Transaksi", value: totalBookings,
                        sub: `${totalTx} tercatat`,
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                        gradient: "from-secondary to-secondary/80", glow: "group-hover:shadow-secondary/20", positive: true,
                    },
                    {
                        label: "Rata-rata Transaksi",
                        value: totalBookings > 0 ? `Rp ${Math.round(totalRevenue / totalBookings).toLocaleString("id-ID")}` : 'Rp 0',
                        sub: "Per transaksi",
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                        gradient: "from-primary/60 to-primary", glow: "group-hover:shadow-primary/20", positive: true,
                    },
                    {
                        label: "Pending Pembayaran",
                        value: `Rp ${(kpi?.pendingAmount || 0).toLocaleString("id-ID")}`,
                        sub: `${kpi?.pendingCount || 0} transaksi menunggu`,
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                        gradient: "from-rose-500 to-red-600", glow: "group-hover:shadow-rose-500/20", positive: false,
                    },
                ].map((k, i) => (
                    <div key={i} className={`group relative bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${k.glow} overflow-hidden`}>
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${k.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${k.gradient} text-white flex items-center justify-center shadow-md`}>{k.icon}</div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-surface border border-border ${k.positive ? "text-foreground/70" : "text-rose-500"}`}>{k.sub}</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className="text-2xl font-extrabold text-super-black tracking-tight truncate">{k.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 2: Donut Chart + Area Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Donut Chart - Distribusi Unit */}
                <div className="lg:col-span-1 bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        <h3 className="text-xl font-extrabold text-super-black tracking-tight">Distribusi Unit</h3>
                        <span className="ml-auto text-[10px] font-bold bg-surface text-foreground/40 px-2 py-0.5 rounded-full border border-border">{initialRevenueByUnit.length} unit</span>
                    </div>
                    {initialRevenueByUnit.length > 0 ? (
                        <DonutChart data={initialRevenueByUnit} total={totalRevenue} />
                    ) : (
                        <p className="text-xs text-foreground/40 italic text-center py-6">Tidak ada unit transaksi.</p>
                    )}
                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground/50 uppercase tracking-wider">Total Pendapatan</span>
                        <span className="text-xl font-extrabold text-secondary">Rp {totalRevenue.toLocaleString("id-ID")}</span>
                    </div>
                </div>

                {/* Area Chart - Tren Transaksi + Revenue */}
                <div className="lg:col-span-2 bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-6 bg-gradient-to-b from-secondary to-primary rounded-full" />
                            <h3 className="text-lg sm:text-xl font-extrabold text-super-black tracking-tight">Tren Transaksi</h3>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-full border border-primary/20">
                            {activePeriod === "Kustom" ? `${startDate} s/d ${endDate}` : activePeriod}
                        </span>
                    </div>
                    <AreaChart data={chartData} revenueData={revenueChartData} label={activePeriod} />
                </div>
            </div>

            {/* Row 3: Hari Terpopuler + Jam Sibuk */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col relative overflow-visible">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        <h3 className="text-lg sm:text-xl font-extrabold text-super-black tracking-tight">Hari Terpopuler</h3>
                        <span className="ml-auto text-[10px] font-bold bg-surface text-foreground/40 px-2 py-0.5 rounded-full border border-border">7 hari</span>
                    </div>
                    <EnhancedBarChart data={busiestDays} viewBoxW={350} barW={32} highlightMax={true}
                        gradientId="day" primaryColor="hsl(var(--primary))" secondaryColor="hsl(var(--secondary))" />
                </div>

                <div className="lg:col-span-2 bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col relative overflow-visible">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-6 bg-gradient-to-b from-secondary to-primary rounded-full" />
                            <h3 className="text-lg sm:text-xl font-extrabold text-super-black tracking-tight">Jam Sibuk</h3>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">08:00 - 22:00</span>
                    </div>
                    <EnhancedBarChart data={busiestHours} viewBoxW={700} barW={32} highlightMax={true}
                        gradientId="hour" primaryColor="hsl(var(--secondary))" secondaryColor="hsl(var(--primary))" />
                </div>
            </div>

            {/* Rincian Transaksi */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
                {/* Header + Card-level Filters */}
                <div className="px-6 py-4 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-super-black">Rincian Transaksi</h3>
                            <span className="text-[10px] font-bold bg-surface text-foreground/40 px-2 py-0.5 rounded-full border border-border">{totalTx} data</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Unit Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase">Unit</label>
                            <select value={filterUnit} onChange={(e) => handleCardFilterChange(e.target.value, filterStatus)}
                                className="bg-background border border-border rounded-venus px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold">
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase">Status</label>
                            <select value={filterStatus} onChange={(e) => handleCardFilterChange(filterUnit, e.target.value)}
                                className="bg-background border border-border rounded-venus px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold">
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {/* Sort Nominal */}
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase">Nominal</label>
                            <select value={sortNominal} onChange={(e) => { setSortNominal(e.target.value as any); setCurrentPage(1); }}
                                className="bg-background border border-border rounded-venus px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold">
                                <option value="default">Default</option>
                                <option value="desc">Tertinggi</option>
                                <option value="asc">Terendah</option>
                            </select>
                        </div>
                        {(filterUnit !== "Semua" || filterStatus !== "Semua") && (
                            <button onClick={() => handleCardFilterChange("Semua", "Semua")} className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors ml-auto">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
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
                            {paginatedTx.length > 0 ? (
                                paginatedTx.map((tx: any, idx: number) => (
                                    <tr key={`${tx.id}-${idx}`} className="border-b border-border/50 hover:bg-background/40 transition-colors">
                                        <td className="px-6 py-4 text-foreground/60">{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td className="px-6 py-4 text-super-black font-semibold font-mono text-xs">{tx.id}</td>
                                        <td className="px-6 py-4 text-foreground/60">{tx.date && `${tx.date} `}{tx.time}</td>
                                        <td className="px-6 py-4 text-super-black font-semibold">{tx.customer}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${unitBadgeColor[tx.unit] || 'bg-gray-100 text-gray-700'}`}>
                                                {tx.unit}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-foreground/70 max-w-[200px] truncate">{tx.service}</td>
                                        <td className="px-6 py-4 text-super-black font-semibold">Rp {tx.amount.toLocaleString("id-ID")}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                tx.status === 'Lunas' ? 'bg-emerald-50 text-emerald-600' : (tx.status === 'Batal' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500')
                                            }`}>
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
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-foreground/50 text-xs">
                        Menampilkan {totalTx > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, totalTx)} dari {totalTx} transaksi
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-foreground/40">Per halaman</label>
                            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                className="bg-background border border-border rounded-venus px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary font-semibold">
                                {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}
                                className="px-2.5 py-1 rounded-venus border border-border text-xs font-bold hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                «
                            </button>
                            <span className="text-xs font-bold text-foreground/60 px-3">
                                {currentPage} / {totalPages}
                            </span>
                            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages}
                                className="px-2.5 py-1 rounded-venus border border-border text-xs font-bold hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
