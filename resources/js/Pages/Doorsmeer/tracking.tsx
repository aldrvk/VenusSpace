import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

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
    status: string;
    progress_label: string;
    progress_step: number;
    stall: string | null;
    admin_notes: string | null;
    verified_at: string | null;
    done_at: string | null;
    created_at: string;
}

interface Props {
    booking: Booking;
}

// ─── Progress Steps Definition ────────────────────────────────────────────────

const STEPS = [
    {
        key: 'pending',
        label: 'Menunggu Verifikasi',
        desc: 'Booking Anda sedang ditinjau oleh admin.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        key: 'verified',
        label: 'Booking Dikonfirmasi',
        desc: 'Admin telah menyetujui booking Anda.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    {
        key: 'in_queue',
        label: 'Dalam Antrian',
        desc: 'Kendaraan Anda masuk ke antrean stall.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        ),
    },
    {
        key: 'washing',
        label: 'Sedang Dicuci',
        desc: 'Tim kami sedang membersihkan kendaraan Anda.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
    },
    {
        key: 'rinsing',
        label: 'Finishing / Bilas',
        desc: 'Proses bilas akhir dan pengeringan.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        key: 'done',
        label: 'Selesai!',
        desc: 'Kendaraan Anda sudah bersih dan siap diambil.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
];

// ─── Status color helpers ──────────────────────────────────────────────────────

function statusColor(status: string): string {
    switch (status) {
        case 'pending':   return 'text-amber-500 bg-amber-50 border-amber-200';
        case 'verified':  return 'text-blue-500 bg-blue-50 border-blue-200';
        case 'rejected':  return 'text-red-500 bg-red-50 border-red-200';
        case 'in_queue':  return 'text-purple-500 bg-purple-50 border-purple-200';
        case 'washing':   return 'text-primary bg-primary/10 border-primary/30';
        case 'rinsing':   return 'text-cyan-500 bg-cyan-50 border-cyan-200';
        case 'done':      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        default:          return 'text-foreground/50 bg-surface border-border';
    }
}

function statusDotColor(status: string): string {
    switch (status) {
        case 'pending':   return 'bg-amber-400';
        case 'verified':  return 'bg-blue-500';
        case 'rejected':  return 'bg-red-500';
        case 'in_queue':  return 'bg-purple-500';
        case 'washing':   return 'bg-primary animate-pulse';
        case 'rinsing':   return 'bg-cyan-500 animate-pulse';
        case 'done':      return 'bg-emerald-500';
        default:          return 'bg-foreground/30';
    }
}

// ─── Component: Vertical Step ─────────────────────────────────────────────────

function ProgressStep({
    step, currentStep, isRejected,
}: { step: typeof STEPS[number]; currentStep: number; stepIndex: number; isRejected: boolean }) {
    const allKeys = STEPS.map(s => s.key);
    const thisIndex = allKeys.indexOf(step.key);
    const isDone = thisIndex < currentStep;
    const isActive = thisIndex === currentStep;

    if (isRejected && step.key !== 'pending') return null;

    return (
        <div className="flex gap-4">
            {/* Circle + line */}
            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                    isDone   ? 'bg-secondary border-secondary text-white' :
                    isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' :
                               'bg-surface border-border text-foreground/30'
                }`}>
                    {isDone ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : step.icon}
                </div>
                {thisIndex < STEPS.length - 1 && (
                    <div className={`w-0.5 h-10 mt-1 transition-all ${isDone ? 'bg-secondary' : 'bg-border'}`} />
                )}
            </div>

            {/* Content */}
            <div className="pb-8">
                <p className={`font-bold text-label-sm md:text-body-m ${isActive ? 'text-primary' : isDone ? 'text-super-black' : 'text-foreground/40'}`}>
                    {step.label}
                </p>
                <p className={`text-body-reg mt-0.5 ${isActive ? 'text-foreground/80' : 'text-foreground/40'}`}>
                    {step.desc}
                </p>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrackingPage({ booking: initialBooking }: Props) {
    const [booking, setBooking] = useState(initialBooking);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isTerminal = ['done', 'rejected'].includes(booking.status);

    // Toast messages per status
    const STATUS_TOAST: Partial<Record<string, { msg: string; type: 'success' | 'error' | 'loading' | 'default' }>> = {
        verified:  { msg: '✅ Booking Anda telah dikonfirmasi oleh admin!', type: 'success' },
        rejected:  { msg: '❌ Booking Anda ditolak. Silakan buat booking baru.', type: 'error' },
        in_queue:  { msg: '📋 Kendaraan Anda masuk ke antrean stall.', type: 'default' },
        washing:   { msg: '🚿 Proses pencucian kendaraan Anda dimulai!', type: 'default' },
        rinsing:   { msg: '💧 Tahap finishing dan pembilasan.', type: 'default' },
        done:      { msg: '🎉 Kendaraan Anda sudah selesai! Silakan ambil.', type: 'success' },
    };

    // Poll every 10 seconds for status updates
    useEffect(() => {
        if (isTerminal) return;

        const poll = async () => {
            try {
                const res = await fetch(`/api/doorsmeer/status/${booking.booking_code}`, {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!res.ok) return;
                const data = await res.json();
                if (data.status !== booking.status) {
                    setBooking(prev => ({
                        ...prev,
                        status: data.status,
                        progress_label: data.progressLabel,
                        progress_step: data.progressStep,
                        stall: data.stall,
                        admin_notes: data.admin_notes,
                    }));

                    // Tampilkan toast notifikasi saat status berubah
                    const toastCfg = STATUS_TOAST[data.status];
                    if (toastCfg) {
                        const opts = {
                            duration: 5000,
                            style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff', padding: '14px 18px' },
                            iconTheme: { primary: 'hsl(var(--primary))', secondary: '#fff' },
                        };
                        if (toastCfg.type === 'success') toast.success(toastCfg.msg, opts);
                        else if (toastCfg.type === 'error') toast.error(toastCfg.msg, opts);
                        else toast(toastCfg.msg, { ...opts, icon: '🔔' });
                    }
                }
            } catch (_) { /* silent */ }
        };

        intervalRef.current = setInterval(poll, 10000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [booking.booking_code, booking.status, isTerminal]);

    const isRejected = booking.status === 'rejected';
    const SERVICE_FEE = 5000;
    const total = booking.service_price + SERVICE_FEE;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Head title={`Tracking ${booking.booking_code} – Doorsmeer`} />
            <Toaster position="top-right" />
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-6 text-label-sm text-foreground/50 uppercase">
                    <Link href="/doorsmeer" className="hover:text-primary transition-colors">
                        ← Doorsmeer
                    </Link>
                    <span>›</span>
                    <span className="text-foreground font-semibold">Tracking Booking</span>
                </div>

                {/* Header banner */}
                <div className={`rounded-venus p-6 mb-8 border ${
                    isRejected
                        ? 'bg-red-50 border-red-200'
                        : booking.status === 'done'
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-card border-border'
                }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-label-sm text-foreground/50 uppercase mb-1">ID Booking</p>
                            <h1 className="text-h2 text-super-black">{booking.booking_code}</h1>
                            <p className="text-body-reg text-foreground/60 mt-1">{booking.service_name} · {booking.license_plate}</p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-label-sm font-bold ${statusColor(booking.status)}`}>
                                <span className={`w-2 h-2 rounded-full ${statusDotColor(booking.status)}`} />
                                {booking.progress_label}
                            </span>
                            {!isTerminal && (
                                <p className="text-body-reg text-foreground/40 text-sm">
                                    Status otomatis diperbarui setiap 10 detik
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rejected notice */}
                {isRejected && (
                    <div className="bg-red-50 border border-red-200 rounded-venus p-5 mb-8 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-h4 text-red-700 font-bold">Booking Ditolak</p>
                            <p className="text-body-reg text-red-600 mt-1">
                                {booking.admin_notes || 'Maaf, booking Anda tidak dapat diproses saat ini.'}
                            </p>
                            <Link href="/doorsmeer" className="mt-3 inline-block text-label-sm font-semibold text-primary hover:underline">
                                Buat Booking Baru →
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Progress tracker ────────────────────────────────── */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-venus p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                                <h2 className="text-h4 text-super-black">Progress Pengerjaan</h2>
                            </div>

                            {isRejected ? (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center text-red-500 shrink-0">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-body-m text-red-600">Booking Ditolak</p>
                                        <p className="text-body-reg text-foreground/50 mt-0.5">Proses tidak dilanjutkan.</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {STEPS.map((step, idx) => (
                                        <ProgressStep
                                            key={step.key}
                                            step={step}
                                            currentStep={booking.progress_step}
                                            stepIndex={idx}
                                            isRejected={isRejected}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stall info */}
                        {booking.stall && !isRejected && (
                            <div className="mt-4 bg-primary/5 border border-primary/20 rounded-venus p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-label-sm text-foreground/50 uppercase">Stall Ditugaskan</p>
                                    <p className="text-h4 text-super-black">{booking.stall}</p>
                                </div>
                            </div>
                        )}

                        {/* Done banner */}
                        {booking.status === 'done' && (
                            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-venus p-5 flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-h4 text-emerald-700 font-bold">Kendaraan Siap Diambil! 🎉</p>
                                    <p className="text-body-reg text-emerald-600 mt-1">
                                        Proses pencucian telah selesai. Silakan ambil kendaraan Anda di {booking.stall ?? 'area doorsmeer'}.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Detail Booking ──────────────────────────────────── */}
                    <div className="space-y-4">

                        {/* Service summary */}
                        <div className="bg-card border border-border rounded-venus p-5">
                            <p className="text-label-sm text-foreground/50 uppercase mb-3">Detail Layanan</p>
                            <p className="text-h4 text-super-black">{booking.service_name}</p>
                            <p className="text-body-reg text-foreground/60">{booking.service_subtitle}</p>
                            <div className="mt-3 pt-3 border-t border-border space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-body-reg text-foreground/60">Harga</span>
                                    <span className="text-body-m font-semibold">Rp{booking.service_price.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-body-reg text-foreground/60">Biaya Layanan</span>
                                    <span className="text-body-m font-semibold">Rp{SERVICE_FEE.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-border">
                                    <span className="text-h4 text-super-black">Total</span>
                                    <span className="text-h4 text-primary">Rp{total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle info */}
                        <div className="bg-card border border-border rounded-venus p-5">
                            <p className="text-label-sm text-foreground/50 uppercase mb-3">Kendaraan</p>
                            <p className="text-h3 text-super-black">{booking.license_plate}</p>
                            <p className="text-body-reg text-foreground/60">{booking.vehicle_class}</p>
                        </div>

                        {/* Schedule */}
                        <div className="bg-card border border-border rounded-venus p-5">
                            <p className="text-label-sm text-foreground/50 uppercase mb-3">Jadwal</p>
                            <p className="text-h4 text-super-black">{booking.appointment_date}</p>
                            <p className="text-body-reg text-foreground/60">Pukul {booking.time_slot} WIB</p>
                            <p className="text-body-reg text-foreground/40 mt-1">Dibuat: {booking.created_at}</p>
                        </div>

                        <Link
                            href="/doorsmeer/my-bookings"
                            className="block text-center text-label-sm text-primary hover:text-primary/80 font-semibold transition-colors py-2"
                        >
                            ← Lihat Semua Booking Saya
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
