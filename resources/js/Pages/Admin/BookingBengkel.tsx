import { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import {
    PageHeader,
    PrimaryButton,
    Badge,
    FilterTabs,
} from "../../Components/AdminUI";

type PitStatus = "sedang-service" | "tersedia" | "standby";
type QueueStatus = "IN PROGRESS" | "WAITING" | "SELESAI";
type FilterTab = "Semua" | "Menunggu" | "Proses" | "Selesai";

interface Pit {
    id: string;
    label: string;
    type: string;
    status: PitStatus;
    mechanic?: string;
    plate?: string;
    vehicle?: string;
    service?: string;
    eta?: string;
    note?: string;
}

interface QueueItem {
    time: string;
    plate: string;
    vehicle: string;
    serviceType: string;
    mechanic: string | null;
    pitName: string | null;
    status: QueueStatus;
}

const pits: Pit[] = [
    {
        id: "PIT MOBIL 01",
        label: "PIT MOBIL 01",
        type: "Mobil",
        status: "sedang-service",
        mechanic: "Anton",
        plate: "BK 1234 AB",
        vehicle: "Avanza",
        service: "Tune Up",
        eta: "Estimasi selesai: 15 mnt",
    },
    {
        id: "PIT MOTOR 01",
        label: "PIT MOTOR 01",
        type: "Motor",
        status: "standby",
        mechanic: "Budi",
        note: "Standby / Area siap digunakan",
    },
    {
        id: "PIT MOTOR 01B",
        label: "PIT MOTOR 01",
        type: "Motor",
        status: "sedang-service",
        mechanic: "Joko",
        plate: "BK 6780 BH",
        vehicle: "ZX25",
        service: "Service CVT",
        eta: "Estimasi selesai: 30 mnt",
    },
];

const queueData: QueueItem[] = [
    {
        time: "14:00",
        plate: "BK 1234 AB",
        vehicle: "Avanza",
        serviceType: "Tune Up & Ganti Oli",
        mechanic: "Anton",
        pitName: "Pit Mobil 01",
        status: "IN PROGRESS",
    },
    {
        time: "14:30",
        plate: "BK 9911 KL",
        vehicle: "Beat FI",
        serviceType: "Ganti Kampas Rem",
        mechanic: null,
        pitName: null,
        status: "WAITING",
    },
    {
        time: "15:00",
        plate: "BK 7742 XY",
        vehicle: "Nmax",
        serviceType: "Servis Berkala",
        mechanic: null,
        pitName: null,
        status: "WAITING",
    },
];

const StatusBadge = ({ status }: { status: QueueStatus }) => {
    const variantMap: Record<
        QueueStatus,
        "default" | "warning" | "success" | "danger"
    > = {
        "IN PROGRESS": "default",
        WAITING: "warning",
        SELESAI: "success",
    };
    const icons = { "IN PROGRESS": "▶", WAITING: "⏱", SELESAI: "✓" };
    return (
        <Badge
            text={`${icons[status]} ${status}`}
            variant={variantMap[status]}
        />
    );
};

export default function BookingBengkel() {
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
            <Head title="Booking Bengkel – Venus Hub Admin" />

            {/* Header */}
            <PageHeader
                title="Booking Bengkel"
                subtitle="Pantau antrean service, alokasi area kerja, dan penugasan mekanik."
                action={
                    <PrimaryButton>
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
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Tambah Service Baru
                    </PrimaryButton>
                }
            />

            {/* Pit Cards */}
            <div className="relative mb-6 md:mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {pits.map((pit) =>
                        pit.status === "sedang-service" ? (
                            <div
                                key={pit.id}
                                className="bg-secondary rounded-venus p-4 md:p-5 relative overflow-hidden text-white"
                            >
                                <div className="absolute bottom-2 right-3 opacity-10">
                                    <svg
                                        width="80"
                                        height="60"
                                        viewBox="0 0 80 60"
                                        fill="currentColor"
                                    >
                                        <path d="M5 40 L10 22 Q15 12 25 12 L55 12 Q65 12 70 22 L75 40 Q77 44 75 46 L5 46 Q3 44 5 40Z" />
                                        <rect
                                            x="12"
                                            y="44"
                                            width="12"
                                            height="6"
                                            rx="3"
                                        />
                                        <rect
                                            x="56"
                                            y="44"
                                            width="12"
                                            height="6"
                                            rx="3"
                                        />
                                    </svg>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs md:text-label-sm text-white/60">
                                        {pit.label}
                                    </span>
                                    <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest">
                                        Sedang Service
                                    </span>
                                </div>
                                <p className="text-xl md:text-h3 text-white font-extrabold mb-0.5">
                                    {pit.mechanic}
                                </p>
                                <p className="text-xs md:text-body-reg text-white/70 mb-4">
                                    {pit.plate} – {pit.vehicle}
                                    <br />
                                    <span className="text-white/50">
                                        ({pit.service})
                                    </span>
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <svg
                                        width="13"
                                        height="13"
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
                                    <span className="text-xs md:text-body-reg text-white/70">
                                        {pit.eta}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={pit.id}
                                className="bg-card border-2 border-dashed border-border rounded-venus p-4 md:p-5 flex flex-col items-center justify-center gap-3 min-h-[140px] md:min-h-[160px]"
                            >
                                <span className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-foreground/30">
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
                                </span>
                                <div className="text-center">
                                    <p className="text-xs md:text-label-sm text-foreground/40">
                                        {pit.label}
                                    </p>
                                    <p className="text-base md:text-h4 text-super-black mt-1 font-bold">
                                        {pit.mechanic}
                                    </p>
                                    <p className="text-xs md:text-body-reg text-foreground/50 mt-0.5">
                                        {pit.note}
                                    </p>
                                    <span className="inline-block mt-2 border border-border text-foreground/50 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">
                                        TERSEDIA
                                    </span>
                                </div>
                            </div>
                        ),
                    )}
                </div>
                <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-all z-10">
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
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            {/* Queue Table */}
            <div className="bg-card border border-border rounded-venus overflow-hidden flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 px-4 md:px-6 py-3 md:py-4 border-b border-border">
                    <h2 className="text-lg md:text-h4 text-super-black font-bold">
                        Antrean Hari Ini
                    </h2>
                    <FilterTabs
                        tabs={filters}
                        active={activeFilter}
                        onChange={(tab) => setActiveFilter(tab as FilterTab)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {[
                                    "WAKTU",
                                    "PLAT & KENDARAAN",
                                    "JENIS SERVIS",
                                    "MEKANIK / PIT",
                                    "STATUS",
                                    "AKSI",
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
                            {filteredQueue.map((q, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-border/50 hover:bg-background/60 transition-colors"
                                >
                                    <td className="px-6 py-4 text-body-m text-super-black font-semibold">
                                        {q.time}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-body-m text-super-black font-semibold">
                                            {q.plate}
                                        </p>
                                        <p className="text-body-reg text-foreground/50">
                                            {q.vehicle}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-foreground/70">
                                        {q.serviceType}
                                    </td>
                                    <td className="px-6 py-4">
                                        {q.mechanic ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xs">
                                                    {q.mechanic[0]}
                                                </div>
                                                <div>
                                                    <p className="text-body-m text-foreground font-semibold">
                                                        {q.mechanic}
                                                    </p>
                                                    <p className="text-body-reg text-foreground/50">
                                                        {q.pitName}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-body-reg text-foreground/40">
                                                Belum Ditugaskan
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={q.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {q.status === "IN PROGRESS" ? (
                                            <button className="bg-secondary text-white px-4 py-2 rounded-venus text-label-sm font-semibold hover:bg-secondary/90 transition-all">
                                                TANDAI SELESAI
                                            </button>
                                        ) : q.status === "WAITING" ? (
                                            <div className="flex items-center gap-2">
                                                <button className="border border-border text-foreground/70 px-3 py-2 rounded-venus text-label-sm font-semibold hover:bg-surface transition-all">
                                                    TUGASKAN MEKANIK
                                                </button>
                                                <button className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-all">
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
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                        />
                                                        <line
                                                            x1="15"
                                                            y1="9"
                                                            x2="9"
                                                            y2="15"
                                                        />
                                                        <line
                                                            x1="9"
                                                            y1="9"
                                                            x2="15"
                                                            y2="15"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-foreground/30 text-body-reg">
                                                —
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between px-6 py-3 border-t border-border">
                    <p className="text-body-reg text-foreground/40">
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
        </AdminLayout>
    );
}
