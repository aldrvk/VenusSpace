import { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import {
    PageHeader,
    Badge,
    FilterTabs,
    PrimaryButton,
} from "../../Components/AdminUI";

type TableStatus = "sedang-main" | "tersedia";
type QueueStatus = "IN PROGRESS" | "WAITING" | "SELESAI";
type FilterTab = "Semua" | "Menunggu" | "Proses" | "Selesai";

interface ConsoleTable {
    id: string;
    label: string;
    console: string;
    status: TableStatus;
    customer?: string;
    package?: string;
    timeLeft?: string;
    progress?: number;
}

interface QueueItem {
    timeIn: string;
    table: string | null;
    customer: string;
    duration: string;
    status: QueueStatus;
}

const consoleTables: ConsoleTable[] = [
    {
        id: "MEJA 01",
        label: "MEJA 01 (PS5)",
        console: "PS5",
        status: "sedang-main",
        customer: "Raka Wijaya (Paket 2 Jam)",
        package: "Paket 2 Jam",
        timeLeft: "Sisa Waktu: 24 Menit",
        progress: 80,
    },
    {
        id: "MEJA 02",
        label: "MEJA 02 (VIP PS5)",
        console: "VIP PS5",
        status: "tersedia",
    },
    {
        id: "MEJA 03",
        label: "MEJA 03 (PS4)",
        console: "PS4",
        status: "sedang-main",
        customer: "Budi Kusuma (Paket Begadang)",
        package: "Paket Begadang",
        timeLeft: "Sisa Waktu: 2 Jam 15 Mnt",
        progress: 30,
    },
];

const queueData: QueueItem[] = [
    {
        timeIn: "14:00",
        table: "Meja 01 (PS5)",
        customer: "Raka Wijaya",
        duration: "2 Jam",
        status: "IN PROGRESS",
    },
    {
        timeIn: "14:30",
        table: null,
        customer: "Siti Aminah",
        duration: "1 Jam",
        status: "WAITING",
    },
    {
        timeIn: "15:00",
        table: null,
        customer: "Doni Pratama",
        duration: "3 Jam",
        status: "WAITING",
    },
];

// PS Controller SVG
const ControllerIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 60 40" fill="currentColor">
        <rect x="5" y="10" width="50" height="25" rx="12" />
        <rect
            x="12"
            y="18"
            width="4"
            height="4"
            rx="1"
            fill="white"
            opacity="0.6"
        />
        <rect
            x="18"
            y="13"
            width="4"
            height="4"
            rx="1"
            fill="white"
            opacity="0.6"
        />
        <rect
            x="18"
            y="23"
            width="4"
            height="4"
            rx="1"
            fill="white"
            opacity="0.6"
        />
        <rect
            x="24"
            y="18"
            width="4"
            height="4"
            rx="1"
            fill="white"
            opacity="0.6"
        />
        <circle cx="42" cy="16" r="2.5" fill="white" opacity="0.5" />
        <circle cx="48" cy="22" r="2.5" fill="white" opacity="0.5" />
        <circle cx="36" cy="22" r="2.5" fill="white" opacity="0.5" />
        <circle cx="42" cy="28" r="2.5" fill="white" opacity="0.5" />
    </svg>
);

export default function BookingRentalPS() {
    const [activeFilter, setActiveFilter] = useState<FilterTab>("Semua");
    const filters: FilterTab[] = ["Semua", "Menunggu", "Proses", "Selesai"];

    const filteredQueue = queueData.filter((q) => {
        if (activeFilter === "Semua") return true;
        if (activeFilter === "Menunggu") return q.status === "WAITING";
        if (activeFilter === "Proses") return q.status === "IN PROGRESS";
        if (activeFilter === "Selesai") return q.status === "SELESAI";
        return true;
    });

    return (
        <AdminLayout>
            <Head title="Booking Rental PS – Venus Hub Admin" />

            {/* Header */}
            <PageHeader
                title="Booking Rental PS"
                subtitle="Kelola ketersediaan meja, durasi bermain, dan antrean rental PlayStation."
                action={<PrimaryButton>Tambah Sewa Baru</PrimaryButton>}
            />

            {/* Console Table Status */}
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-4">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-foreground/50"
                    >
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <path d="M6 12h4M8 10v4M15 11h2M18 11h2" />
                    </svg>
                    <h2 className="text-lg md:text-h4 text-super-black font-bold">
                        Status Meja & Konsol
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                    {consoleTables.map((t) =>
                        t.status === "sedang-main" ? (
                            <div
                                key={t.id}
                                className="bg-card border border-border rounded-venus p-4 md:p-5 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs md:text-label-sm text-foreground/50 font-medium">
                                        {t.label}
                                    </span>
                                    <Badge
                                        text="SEDANG MAIN"
                                        variant="default"
                                    />
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-foreground/40"
                                    >
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <p className="text-body-m text-foreground/70">
                                        {t.customer}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <p className="text-body-m font-semibold text-primary">
                                        {t.timeLeft}
                                    </p>
                                </div>
                                {/* Progress bar */}
                                <div className="h-2 bg-surface rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${t.progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div
                                key={t.id}
                                className="bg-card border-2 border-dashed border-border rounded-venus p-4 md:p-5 flex flex-col items-center justify-center gap-3 min-h-[140px] md:min-h-[160px]"
                            >
                                <ControllerIcon className="w-16 h-10 text-foreground/10" />
                                <div className="text-center">
                                    <p className="text-xs md:text-label-sm text-foreground/40 font-medium">
                                        {t.label}
                                    </p>
                                    <p className="text-xs md:text-body-reg text-foreground/40 mt-1">
                                        Standby / Siap disewa
                                    </p>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>

            {/* Queue Table */}
            <div className="mb-6 md:mb-8">
                <div className="bg-card border border-border rounded-venus overflow-hidden flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 px-4 md:px-6 py-3 md:py-4 border-b border-border">
                        <h2 className="text-lg md:text-h4 text-super-black font-bold">
                            Antrean Hari Ini
                        </h2>
                        <FilterTabs
                            tabs={filters}
                            active={activeFilter}
                            onChange={(tab) =>
                                setActiveFilter(tab as FilterTab)
                            }
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs md:text-body-m">
                            <thead className="hidden md:table-header-group">
                                <tr className="border-b border-border">
                                    {[
                                        "WAKTU MASUK",
                                        "MEJA & KONSOL",
                                        "PELANGGAN",
                                        "DURASI",
                                        "STATUS",
                                        "AKSI",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-4 md:px-6 py-3 text-xs md:text-label-sm text-foreground/40"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQueue.map((q, i) => (
                                    <tr
                                        key={i}
                                        className="flex md:table-row flex-col md:flex-row gap-2 md:gap-0 p-4 md:p-0 border-b md:border-b md:border-border/50 md:hover:bg-background/60 md:transition-colors last:border-b-0"
                                    >
                                        <td
                                            className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                            data-label="WAKTU MASUK"
                                        >
                                            <span className="text-xs md:text-body-m text-super-black font-semibold">
                                                {q.timeIn}
                                            </span>
                                        </td>
                                        <td
                                            className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                            data-label="MEJA"
                                        >
                                            {q.table ? (
                                                <span className="text-xs md:text-body-m text-primary font-semibold">
                                                    {q.table}
                                                </span>
                                            ) : (
                                                <span className="text-xs md:text-body-m text-foreground/40">
                                                    Belum Ditentukan
                                                </span>
                                            )}
                                        </td>
                                        <td
                                            className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                            data-label="PELANGGAN"
                                        >
                                            <span className="text-xs md:text-body-m text-foreground">
                                                {q.customer}
                                            </span>
                                        </td>
                                        <td
                                            className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                            data-label="DURASI"
                                        >
                                            <span className="text-xs md:text-body-m text-foreground/70">
                                                {q.duration}
                                            </span>
                                        </td>
                                        <td
                                            className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                            data-label="STATUS"
                                        >
                                            <Badge
                                                text={q.status}
                                                variant={
                                                    q.status === "IN PROGRESS"
                                                        ? "default"
                                                        : q.status === "WAITING"
                                                          ? "warning"
                                                          : "success"
                                                }
                                            />
                                        </td>
                                        <td
                                            className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                            data-label="AKSI"
                                        >
                                            {q.status === "IN PROGRESS" ? (
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <button className="text-xs md:text-label-sm border border-border text-foreground/70 px-2 md:px-3 py-1.5 md:py-2 rounded-venus font-semibold hover:bg-surface transition-all">
                                                        + Waktu
                                                    </button>
                                                    <button className="text-xs md:text-label-sm bg-secondary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-venus font-semibold hover:bg-secondary/90 transition-all">
                                                        Selesai
                                                    </button>
                                                </div>
                                            ) : q.status === "WAITING" ? (
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <button className="text-xs md:text-label-sm bg-secondary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-venus font-semibold hover:bg-secondary/90 transition-all">
                                                        Pilih Meja
                                                    </button>
                                                    <button className="w-8 h-8 rounded-venus bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-all">
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
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                            <path d="M10 11v6M14 11v6" />
                                                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs md:text-body-reg text-foreground/30">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-border text-xs md:text-body-reg">
                        <p className="text-foreground/40">
                            Menampilkan 3 dari 12 antrean hari ini
                        </p>
                        <div className="flex gap-1">
                            <button className="w-7 h-7 rounded-venus border border-border flex items-center justify-center text-foreground/50 hover:bg-surface transition-all">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <button className="w-7 h-7 rounded-venus border border-border flex items-center justify-center text-foreground/50 hover:bg-surface transition-all">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
