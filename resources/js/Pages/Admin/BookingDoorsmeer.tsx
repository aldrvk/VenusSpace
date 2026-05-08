import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import { useFlashToast } from "../../hooks/useFlashToast";
import AdminLayout from "../../Layouts/AdminLayout";
import {
    PageHeader,
    Badge,
    FilterTabs,
} from "../../Components/AdminUI";

// ── Types ────────────────────────────────────────────────────────────────────
type BookingStatus =
    | "pending"
    | "verified"
    | "rejected"
    | "in_queue"
    | "washing"
    | "rinsing"
    | "done";

type FilterTab = "Semua" | "Pending" | "Aktif" | "Selesai" | "Ditolak";

interface Booking {
    id: number;
    booking_code: string;
    service_name: string;
    service_subtitle: string;
    service_price: number;
    service_duration: string;
    vehicle_class: string;
    license_plate: string;
    appointment_date: string;
    time_slot: string;
    status: BookingStatus;
    progress_label: string;
    progress_step: number;
    stall: string | null;
    admin_notes: string | null;
    verified_at: string | null;
    done_at: string | null;
    created_at: string;
    customer_name: string;
    customer_email: string;
}

interface Stall {
    id: string;
    label: string;
    status: "terisi" | "tersedia";
    plate?: string;
    vehicle?: string;
    progress?: string;
}

interface Props {
    bookings: Booking[];
    stalls: Stall[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<BookingStatus, "default" | "warning" | "success" | "danger"> = {
    pending:  "warning",
    verified: "default",
    rejected: "danger",
    in_queue: "warning",
    washing:  "default",
    rinsing:  "default",
    done:     "success",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
    pending:  "⏱ Pending",
    verified: "✓ Dikonfirmasi",
    rejected: "✗ Ditolak",
    in_queue: "● Antrian",
    washing:  "▶ Dicuci",
    rinsing:  "▶ Finishing",
    done:     "✓ Selesai",
};

// ── Car Silhouette ────────────────────────────────────────────────────────────
const CarSilhouette = () => (
    <svg
        style={{ opacity: 0.07 }}
        width="100"
        height="50"
        viewBox="0 0 100 50"
        fill="currentColor"
    >
        <path d="M10 35 L15 20 Q20 12 30 12 L70 12 Q80 12 85 20 L90 35 Q92 38 90 40 L10 40 Q8 38 10 35Z" />
        <rect x="20" y="38" width="15" height="5" rx="2.5" />
        <rect x="65" y="38" width="15" height="5" rx="2.5" />
    </svg>
);

// ── Modal: Verify ─────────────────────────────────────────────────────────────
function VerifyModal({
    booking,
    onClose,
}: {
    booking: Booking;
    onClose: () => void;
}) {
    const [stall, setStall] = useState("Stall 1");
    const [loading, setLoading] = useState(false);

    const handle = () => {
        setLoading(true);
        router.post(
            `/admin/doorsmeer/verify/${booking.id}`,
            { stall },
            {
                onFinish: () => { setLoading(false); onClose(); },
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border rounded-venus p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-h4 text-super-black mb-1">Verifikasi Booking</h3>
                <p className="text-body-reg text-foreground/60 mb-5">
                    <span className="font-semibold text-foreground">{booking.booking_code}</span> –{" "}
                    {booking.customer_name} · {booking.license_plate}
                </p>

                <label className="block text-label-sm text-foreground/60 uppercase mb-2">
                    Tugaskan ke Stall
                </label>
                <select
                    value={stall}
                    onChange={(e) => setStall(e.target.value)}
                    className="w-full bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground focus:outline-none focus:border-primary mb-6"
                >
                    {["Stall 1", "Stall 2", "Stall 3"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-border rounded-venus py-2.5 text-label-sm font-semibold text-foreground/70 hover:bg-surface transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handle}
                        disabled={loading}
                        className="flex-1 bg-secondary text-secondary-foreground rounded-venus py-2.5 text-label-sm font-semibold hover:bg-secondary/90 disabled:opacity-70 transition-all"
                    >
                        {loading ? "Memproses…" : "✓ Konfirmasi"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Modal: Reject ─────────────────────────────────────────────────────────────
function RejectModal({
    booking,
    onClose,
}: {
    booking: Booking;
    onClose: () => void;
}) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handle = () => {
        setLoading(true);
        router.post(
            `/admin/doorsmeer/reject/${booking.id}`,
            { admin_notes: notes },
            {
                onFinish: () => { setLoading(false); onClose(); },
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border rounded-venus p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-h4 text-super-black mb-1">Tolak Booking</h3>
                <p className="text-body-reg text-foreground/60 mb-5">
                    <span className="font-semibold text-foreground">{booking.booking_code}</span> –{" "}
                    {booking.customer_name}
                </p>

                <label className="block text-label-sm text-foreground/60 uppercase mb-2">
                    Alasan Penolakan (opsional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Contoh: Slot waktu sudah penuh."
                    className="w-full bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary resize-none mb-6"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-border rounded-venus py-2.5 text-label-sm font-semibold text-foreground/70 hover:bg-surface transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handle}
                        disabled={loading}
                        className="flex-1 bg-red-500 text-white rounded-venus py-2.5 text-label-sm font-semibold hover:bg-red-600 disabled:opacity-70 transition-all"
                    >
                        {loading ? "Memproses…" : "✗ Tolak Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Progress Dropdown ──────────────────────────────────────────────────────────
function ProgressDropdown({ booking }: { booking: Booking }) {
    const [loading, setLoading] = useState(false);
    const progressOptions: { value: BookingStatus; label: string }[] = [
        { value: "in_queue", label: "Dalam Antrian" },
        { value: "washing",  label: "Sedang Dicuci" },
        { value: "rinsing",  label: "Finishing / Bilas" },
        { value: "done",     label: "Selesai" },
    ];

    const updateProgress = (newStatus: BookingStatus) => {
        if (newStatus === booking.status) return;
        setLoading(true);
        router.post(
            `/admin/doorsmeer/progress/${booking.id}`,
            { status: newStatus },
            {
                onFinish: () => setLoading(false),
                preserveScroll: true,
            }
        );
    };

    if (!["verified", "in_queue", "washing", "rinsing"].includes(booking.status)) {
        return (
            <span className="text-foreground/30 text-xs">—</span>
        );
    }

    return (
        <select
            value={booking.status}
            onChange={(e) => updateProgress(e.target.value as BookingStatus)}
            disabled={loading}
            className="appearance-none bg-secondary/10 border border-secondary/30 text-secondary rounded-venus px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-secondary cursor-pointer hover:bg-secondary/20 transition-all disabled:opacity-60"
        >
            {progressOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookingDoorsmeer({ bookings, stalls }: Props) {
    useFlashToast();
    const [activeFilter, setActiveFilter] = useState<FilterTab>("Semua");
    const [verifyTarget, setVerifyTarget] = useState<Booking | null>(null);
    const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);
    const filters: FilterTab[] = ["Semua", "Pending", "Aktif", "Selesai", "Ditolak"];

    const filteredBookings = bookings.filter((b) => {
        if (activeFilter === "Semua")    return true;
        if (activeFilter === "Pending")  return b.status === "pending";
        if (activeFilter === "Aktif")    return ["verified", "in_queue", "washing", "rinsing"].includes(b.status);
        if (activeFilter === "Selesai")  return b.status === "done";
        if (activeFilter === "Ditolak")  return b.status === "rejected";
        return true;
    });

    const pendingCount = bookings.filter((b) => b.status === "pending").length;

    return (
        <AdminLayout>
            <Head title="Booking Doorsmeer – Venus Hub Admin" />
            <Toaster position="top-center" />

            {/* Header */}
            <PageHeader
                title="Booking Doorsmeer"
                subtitle={
                    pendingCount > 0
                        ? `⚠ ${pendingCount} booking menunggu verifikasi Anda.`
                        : "Kelola antrean dan status area pencucian kendaraan hari ini."
                }
                action={
                    pendingCount > 0 ? (
                        <span className="bg-amber-100 text-amber-600 border border-amber-200 text-label-sm font-bold px-4 py-2 rounded-full animate-pulse">
                            {pendingCount} Pending
                        </span>
                    ) : undefined
                }
            />

            {/* Stall Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {stalls.map((stall) =>
                    stall.status === "terisi" ? (
                        <div
                            key={stall.id}
                            className="bg-secondary rounded-venus p-4 md:p-5 relative overflow-hidden text-white"
                        >
                            <div className="absolute bottom-0 right-0 text-white">
                                <CarSilhouette />
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-white/60">{stall.label}</span>
                                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest">
                                    Terisi
                                </span>
                            </div>
                            <p className="text-xl md:text-h3 text-white font-extrabold mb-0.5">
                                {stall.plate}
                            </p>
                            <p className="text-xs text-white/70 mb-2">{stall.vehicle}</p>
                            <span className="inline-block bg-white/15 text-white/90 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                                {stall.progress}
                            </span>
                        </div>
                    ) : (
                        <div
                            key={stall.id}
                            className="bg-card border-2 border-dashed border-border rounded-venus p-4 md:p-5 flex flex-col items-center justify-center gap-3 min-h-[130px]"
                        >
                            <span className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-foreground/30">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </span>
                            <div className="text-center">
                                <p className="text-xs text-foreground/40">{stall.label}</p>
                                <p className="text-base md:text-h4 text-super-black font-bold mt-1">Tersedia</p>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Queue Table */}
            <div className="bg-card border border-border rounded-venus overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-border">
                    <h2 className="text-lg md:text-h4 text-super-black font-bold">
                        Semua Booking
                        <span className="ml-2 text-label-sm text-foreground/40 font-normal">({bookings.length})</span>
                    </h2>
                    <FilterTabs
                        tabs={filters}
                        active={activeFilter}
                        onChange={(tab) => setActiveFilter(tab as FilterTab)}
                    />
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="px-6 py-12 text-center text-foreground/40 text-body-reg">
                        Tidak ada booking yang cocok dengan filter ini.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs md:text-body-reg">
                            <thead className="hidden md:table-header-group">
                                <tr className="border-b border-border">
                                    {["KODE", "PELANGGAN", "KENDARAAN", "LAYANAN", "JADWAL", "STATUS", "AKSI"].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-4 md:px-5 py-3 text-[10px] text-foreground/40 font-bold"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((b) => (
                                    <tr
                                        key={b.id}
                                        className={`border-b border-border/50 hover:bg-background/40 transition-colors ${
                                            b.status === "pending" ? "bg-amber-50/40" : ""
                                        }`}
                                    >
                                        {/* Kode */}
                                        <td className="px-4 md:px-5 py-3 md:py-4">
                                            <p className="text-super-black font-bold">{b.booking_code}</p>
                                            <p className="text-foreground/40 text-[10px]">{b.created_at}</p>
                                        </td>

                                        {/* Pelanggan */}
                                        <td className="px-4 md:px-5 py-3 md:py-4">
                                            <p className="text-super-black font-semibold">{b.customer_name}</p>
                                            <p className="text-foreground/50 text-[10px]">{b.customer_email}</p>
                                        </td>

                                        {/* Kendaraan */}
                                        <td className="px-4 md:px-5 py-3 md:py-4">
                                            <p className="text-super-black font-semibold">{b.license_plate}</p>
                                            <p className="text-foreground/50 text-[10px]">{b.vehicle_class}</p>
                                        </td>

                                        {/* Layanan */}
                                        <td className="px-4 md:px-5 py-3 md:py-4">
                                            <p className="text-foreground">{b.service_name}</p>
                                            <p className="text-foreground/40 text-[10px]">{b.service_duration}</p>
                                        </td>

                                        {/* Jadwal */}
                                        <td className="px-4 md:px-5 py-3 md:py-4">
                                            <p className="text-super-black font-semibold">{b.appointment_date}</p>
                                            <p className="text-foreground/50 text-[10px]">{b.time_slot} WIB</p>
                                            {b.stall && (
                                                <p className="text-primary text-[10px] font-bold mt-0.5">{b.stall}</p>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 md:px-5 py-3 md:py-4">
                                            <Badge
                                                text={STATUS_LABEL[b.status]}
                                                variant={STATUS_BADGE[b.status]}
                                            />
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 md:px-5 py-3 md:py-4">
                                            {b.status === "pending" ? (
                                                <div className="flex items-center gap-2">
                                                    {/* Verify button */}
                                                    <button
                                                        onClick={() => setVerifyTarget(b)}
                                                        title="Verifikasi"
                                                        className="flex items-center gap-1.5 bg-secondary text-white px-3 py-1.5 rounded-venus text-xs font-semibold hover:bg-secondary/90 active:scale-95 transition-all"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                        Verifikasi
                                                    </button>
                                                    {/* Reject button */}
                                                    <button
                                                        onClick={() => setRejectTarget(b)}
                                                        title="Tolak"
                                                        className="flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1.5 rounded-venus text-xs font-semibold hover:bg-red-200 active:scale-95 transition-all"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                                        </svg>
                                                        Tolak
                                                    </button>
                                                </div>
                                            ) : (
                                                <ProgressDropdown booking={b} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="px-4 md:px-6 py-3 border-t border-border text-center md:text-left">
                    <p className="text-xs text-foreground/40">
                        Menampilkan {filteredBookings.length} dari {bookings.length} booking
                    </p>
                </div>
            </div>

            {/* Modals */}
            {verifyTarget && (
                <VerifyModal booking={verifyTarget} onClose={() => setVerifyTarget(null)} />
            )}
            {rejectTarget && (
                <RejectModal booking={rejectTarget} onClose={() => setRejectTarget(null)} />
            )}
        </AdminLayout>
    );
}
