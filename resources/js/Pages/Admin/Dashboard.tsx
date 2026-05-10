import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import {
    PageHeader,
    StatCard,
    PrimaryButton,
    IconButton,
    Badge,
    TableResponsive,
} from "../../Components/AdminUI";

// ── Types ────────────────────────────────────────────────────────────────────
interface Booking {
    id: number;
    customer: string;
    service: string;
    unit: "DOORSMEER" | "BENGKEL" | "COFFEE SHOP" | "RENTAL PS";
    time: string;
    status: "PENDING" | "SELESAI" | "IN PROGRESS";
}

// ── Mock Data ────────────────────────────────────────────────────────────────
const stats = [
    {
        label: "HARI INI",
        title: "Total Booking",
        value: "12",
        icon: (
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        iconBg: "bg-primary/10 text-primary",
    },
    {
        label: "PENDING",
        title: "Booking Pending",
        value: "5",
        icon: (
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        iconBg: "bg-orange-100 text-orange-500",
    },
    {
        label: "SELESAI",
        title: "Booking Selesai",
        value: "7",
        icon: (
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        iconBg: "bg-emerald-100 text-emerald-600",
    },
];

const recentBookings: Booking[] = [
    {
        id: 1,
        customer: "Budi Kusuma",
        service: "Cuci Salju",
        unit: "DOORSMEER",
        time: "14:00",
        status: "PENDING",
    },
    {
        id: 2,
        customer: "Andi Siregar",
        service: "Servis Ringan",
        unit: "BENGKEL",
        time: "14:30",
        status: "PENDING",
    },
    {
        id: 3,
        customer: "Citra Lestari",
        service: "Americano",
        unit: "COFFEE SHOP",
        time: "14:45",
        status: "SELESAI",
    },
    {
        id: 4,
        customer: "Doni Pratama",
        service: "Rental PS5 (2 Jam)",
        unit: "RENTAL PS",
        time: "15:00",
        status: "SELESAI",
    },
    {
        id: 5,
        customer: "Alex Ferguson",
        service: "Rental PS5 (1 Jam)",
        unit: "RENTAL PS",
        time: "15:10",
        status: "SELESAI",
    },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const unitBadgeVariant: Record<
    Booking["unit"],
    "default" | "warning" | "success" | "danger"
> = {
    DOORSMEER: "default",
    BENGKEL: "warning",
    "COFFEE SHOP": "default",
    "RENTAL PS": "warning",
};

const StatusBadge = ({ status }: { status: Booking["status"] }) => {
    const variants: Record<
        Booking["status"],
        "default" | "warning" | "success" | "danger"
    > = {
        PENDING: "warning",
        SELESAI: "success",
        "IN PROGRESS": "default",
    };
    return <Badge text={status} variant={variants[status]} />;
};

const IconEdit = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconX = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const IconRevenue = () => (
    <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
);

const IconPlus = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Dashboard – Venus Hub Admin" />

            {/* Header */}
            <PageHeader
                title="Selamat Datang! 👋"
                subtitle="Berikut adalah ringkasan aktivitas hari ini."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {/* Regular stats */}
                {stats.map((s, i) => (
                    <StatCard
                        key={i}
                        label={s.label}
                        title={s.title}
                        value={s.value}
                        icon={s.icon}
                        iconBg={s.iconBg}
                    />
                ))}

                {/* Revenue Card (dark) */}
                <div className="bg-secondary rounded-venus p-4 md:p-5 flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
                    <div className="flex items-start justify-between relative">
                        <span className="w-10 h-10 rounded-venus flex items-center justify-center bg-white/15 text-white">
                            <IconRevenue />
                        </span>
                        <span className="text-[11px] md:text-label-sm text-white/50">
                            LIVE REVENUE
                        </span>
                    </div>
                    <div className="relative">
                        <p className="text-xs md:text-body-reg text-white/60">
                            Revenue Hari Ini
                        </p>
                        <p className="text-lg md:text-card-title text-white font-bold mt-1">
                            Rp 2.450.000
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-card border border-border rounded-venus overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border">
                    <h2 className="text-lg md:text-h4 text-super-black font-bold">
                        Booking Terbaru (Semua Unit)
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href="/admin/booking-doorsmeer"
                            className="text-xs md:text-label-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-semibold"
                        >
                            Booking Unit →
                        </Link>
                        <Link
                            href="/admin/pesanan-store"
                            className="text-xs md:text-label-sm text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1 font-semibold"
                        >
                            Pesanan Store →
                        </Link>
                    </div>
                </div>
                <TableResponsive>
                    <table className="w-full text-xs md:text-body-reg">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b border-border">
                                {[
                                    "NO",
                                    "NAMA PELANGGAN",
                                    "LAYANAN",
                                    "UNIT USAHA",
                                    "WAKTU",
                                    "STATUS",
                                    "AKSI",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 md:px-6 py-3 text-[10px] md:text-label-sm text-foreground/40 font-bold"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((b) => (
                                <tr
                                    key={b.id}
                                    className="border-b border-border/50 hover:bg-background/40 transition-colors flex md:table-row flex-col md:flex-row gap-2 md:gap-0 p-4 md:p-0"
                                >
                                    <td
                                        className="md:px-6 md:py-4 text-foreground/60 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="NO"
                                    >
                                        {b.id}
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 text-super-black font-semibold before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="NAMA"
                                    >
                                        {b.customer}
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 text-foreground/70 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="LAYANAN"
                                    >
                                        {b.service}
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="UNIT"
                                    >
                                        <Badge
                                            text={b.unit}
                                            variant={unitBadgeVariant[b.unit]}
                                        />
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 text-foreground/70 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="WAKTU"
                                    >
                                        {b.time}
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="STATUS"
                                    >
                                        <StatusBadge status={b.status} />
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="AKSI"
                                    >
                                        {b.status === "PENDING" ? (
                                            <div className="flex items-center gap-2">
                                                <IconButton
                                                    icon={<IconEdit />}
                                                    variant="primary"
                                                />
                                                <IconButton
                                                    icon={<IconX />}
                                                    variant="danger"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-foreground/30 text-xs md:text-body-reg">
                                                —
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableResponsive>
            </div>

            {/* FAB */}
            <button
                className="fixed bottom-6 md:bottom-8 right-6 md:right-8 w-14 h-14 rounded-full bg-secondary text-white shadow-lg md:shadow-xl flex items-center justify-center hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-secondary/30"
                title="Tambah booking"
            >
                <IconPlus />
            </button>
        </AdminLayout>
    );
}
