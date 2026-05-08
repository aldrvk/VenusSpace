import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

const services = [
    {
        id: 'basic',
        name: 'Basic Wash',
        subtitle: 'Exterior & Foam Wash',
        price: 35000,
        priceLabel: '35k',
        duration: '20 menit',
        features: ['Tire shine'],
    },
    {
        id: 'premium',
        name: 'Premium Wash',
        subtitle: 'Interior & Vacuum Included',
        price: 65000,
        priceLabel: '65k',
        duration: '45 menit',
        features: ['Interior vacuum', 'Fragrance blast'],
    },
    {
        id: 'detailing',
        name: 'Full Detailing',
        subtitle: 'Engine & Coating',
        price: 150000,
        priceLabel: '150k',
        duration: '120 menit',
        features: ['Clay bar treatment', 'Wax finish'],
    },
];

const vehicleClasses = [
    'City Car / Sedan',
    'SUV / MPV',
    'Pickup / Double Cabin',
    'Motor',
    'Minibus',
];

const bayStatus = [
    { name: 'Bay 1 (Standard)', status: 'in-use', detail: 'In Use – Finishes in 12m' },
    { name: 'Bay 2 (Available)', status: 'available', detail: 'Ready for immediate entry' },
    { name: 'Detailing Zone', status: 'maintenance', detail: 'Maintenance in progress' },
];

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);


const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

function getNextDays(count: number) {
    const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
    const result = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        result.push({
            label: days[d.getDay()],
            date: d.getDate(),
            fullDate: d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            iso: d.toISOString().split('T')[0],
        });
    }
    return result;
}

const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

export default function DoorsmeerIndex() {
    const { auth } = usePage<{ auth: { user?: { id: number } } }>().props;
    const [selectedService, setSelectedService] = useState('premium');
    const [vehicleClass, setVehicleClass] = useState('City Car / Sedan');
    const [licensePlate, setLicensePlate] = useState('');
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedTime, setSelectedTime] = useState('10:30');
    const [plateError, setPlateError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const days = getNextDays(4);
    const service = services.find(s => s.id === selectedService)!;

    const handleConfirm = () => {
        if (!licensePlate.trim()) {
            setPlateError('Nomor polisi wajib diisi.');
            return;
        }

        // Redirect ke login jika belum login
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setPlateError('');
        setIsSubmitting(true);

        router.post(
            '/doorsmeer/booking',
            {
                service_id:       service.id,
                service_name:     service.name,
                service_subtitle: service.subtitle,
                service_price:    service.price,
                service_duration: service.duration,
                vehicle_class:    vehicleClass,
                license_plate:    licensePlate.trim().toUpperCase(),
                appointment_date: days[selectedDay].iso,
                time_slot:        selectedTime,
            },
            {
                onError: () => setIsSubmitting(false),
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Doorsmeer – Venus Hub" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-label-sm text-foreground/50 uppercase">
                    <span>HOME</span>
                    <span>›</span>
                    <span className="text-foreground font-semibold">DOORSMEER</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── LEFT CONTENT (2/3) ─────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Hero */}
                        <div>
                            <h1 className="text-h2 text-super-black">
                                Elite <span className="text-primary">Car Wash</span> Experience
                            </h1>
                            <p className="text-body-l text-foreground/70 mt-4 max-w-lg">
                                Manjakan kendaraan Anda dengan ritual perawatan premium. Kami tidak hanya mencuci—kami memulihkan kilau arsitektural mobil Anda menggunakan elemen pH-balanced.
                            </p>
                        </div>

                        {/* Service Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {services.map(svc => {
                                const isSelected = selectedService === svc.id;
                                return (
                                    <button
                                        key={svc.id}
                                        onClick={() => setSelectedService(svc.id)}
                                        className={`relative text-left p-5 rounded-venus border-2 transition-all duration-200 flex flex-col gap-3 ${
                                            isSelected
                                                ? 'border-primary bg-card shadow-lg shadow-primary/10'
                                                : 'border-border bg-card hover:border-primary/40 hover:shadow-md'
                                        }`}
                                    >
                                        <div>
                                            <p className="text-h4 text-super-black">{svc.name}</p>
                                            <p className="text-body-reg text-foreground/60">{svc.subtitle}</p>
                                        </div>

                                        <p className="text-h3 text-super-black leading-none">
                                            {svc.priceLabel}
                                        </p>

                                        <ul className="space-y-1.5">
                                            <li className="flex items-center gap-2 text-label-sm text-foreground/80">
                                                <span className="text-primary"><CheckIcon /></span>
                                                {svc.duration} durasi
                                            </li>
                                            {svc.features.map(f => (
                                                <li key={f} className="flex items-center gap-2 text-label-sm text-foreground/80">
                                                    <span className="text-primary"><CheckIcon /></span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedService(svc.id); }}
                                            className={`w-full mt-2 py-2.5 rounded-full text-label-sm font-semibold transition-all ${
                                                isSelected
                                                    ? 'bg-secondary text-secondary-foreground shadow-md'
                                                    : 'bg-surface text-foreground border border-border hover:bg-border'
                                            }`}
                                        >
                                            {isSelected ? 'Selected' : 'Select'}
                                        </button>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Booking Form */}
                        <div className="bg-card border border-border rounded-venus p-6 space-y-6">

                            {/* Row 1: Vehicle class + License plate */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-label-sm text-foreground/60 uppercase">Klasifikasi Kendaraan</label>
                                    <div className="relative">
                                        <select
                                            value={vehicleClass}
                                            onChange={e => setVehicleClass(e.target.value)}
                                            className="w-full appearance-none bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                        >
                                            {vehicleClasses.map(vc => (
                                                <option key={vc} value={vc}>{vc}</option>
                                            ))}
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-label-sm text-foreground/60 uppercase">Nomor Polisi</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: B 1234 ABC"
                                        value={licensePlate}
                                        onChange={e => { setLicensePlate(e.target.value); setPlateError(''); }}
                                        className={`w-full bg-background border rounded-venus px-4 py-3 text-body-m text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors ${
                                            plateError ? 'border-error focus:border-error' : 'border-border focus:border-primary'
                                        }`}
                                    />
                                    {plateError && (
                                        <p className="text-label-sm text-error">{plateError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Date selector */}
                            <div className="space-y-3">
                                <label className="text-label-sm text-foreground/60 uppercase">Tanggal Perjanjian</label>
                                <div className="flex flex-wrap gap-3">
                                    {days.map((d, idx) => (
                                        <button
                                            key={d.iso}
                                            onClick={() => setSelectedDay(idx)}
                                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-venus border-2 transition-all ${
                                                selectedDay === idx
                                                    ? 'bg-secondary border-secondary text-secondary-foreground shadow-md'
                                                    : 'bg-background border-border text-foreground hover:border-primary/50'
                                            }`}
                                        >
                                            <span className="text-label-sm font-bold">{d.label}</span>
                                            <span className="text-h4 leading-tight">{d.date}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Row 3: Time slot */}
                            <div className="space-y-3">
                                <label className="text-label-sm text-foreground/60 uppercase">Jendela Waktu</label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {timeSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`py-2.5 px-3 rounded-venus text-label-sm font-semibold border-2 transition-all ${
                                                selectedTime === slot
                                                    ? 'bg-secondary border-secondary text-secondary-foreground'
                                                    : 'bg-background border-border text-foreground hover:border-primary/50'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-70 text-secondary-foreground h-14 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg text-label-sm tracking-widest font-bold group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                                        Memproses…
                                    </>
                                ) : (
                                    <>
                                        {!auth?.user ? 'Login untuk Booking' : 'Konfirmasi Booking Saya'}
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR (1/3) ────────────────────────────── */}
                    <div className="space-y-5">

                        {/* Live Availability */}
                        <div className="bg-card border border-border rounded-venus p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                                <p className="text-h4 text-super-black">Live Availability</p>
                            </div>
                            <div className="space-y-4">
                                {bayStatus.map(bay => (
                                    <div key={bay.name} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full shrink-0 ml-3 mr-1 mt-0.5 flex-none" style={{
                                            background: bay.status === 'available' ? 'hsl(var(--primary))' :
                                                        bay.status === 'in-use'    ? 'hsl(var(--secondary))' :
                                                        'hsl(var(--surface))',
                                            boxShadow: bay.status === 'available' ? '0 0 6px hsl(var(--primary))' : 'none'
                                        }} />
                                        <div>
                                            <p className="text-label-sm font-semibold text-super-black">{bay.name}</p>
                                            <p className="text-body-reg text-foreground/60">{bay.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Current Queue */}
                        <div className="bg-card border border-border rounded-venus p-5">
                            <p className="text-label-sm text-foreground/60 uppercase mb-4">Antrian Saat Ini</p>
                            <div className="flex items-center gap-2 mb-3">
                                {/* Avatar placeholders */}
                                {['A', 'B', 'C'].map((l, i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-bold text-secondary-foreground bg-secondary -ml-${i > 0 ? '2' : '0'}`}>
                                        {l}
                                    </div>
                                ))}
                                <span className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-label-sm font-bold text-foreground -ml-2">
                                    +3
                                </span>
                            </div>
                            <p className="text-body-reg text-foreground/60">Estimasi waktu tunggu: <span className="font-semibold text-foreground">15 menit</span></p>
                        </div>

                        {/* Member Perk Banner */}
                        <div className="bg-secondary rounded-venus p-5 overflow-hidden relative">
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/20" />
                            <p className="text-label-sm text-secondary-foreground/70 mb-1 uppercase">Member Perk</p>
                            <p className="text-h4 text-secondary-foreground leading-snug">
                                Dapatkan setiap cuci ke-5 <span className="text-primary">GRATIS</span> dengan Venus Membership.
                            </p>
                            <button className="mt-4 bg-primary text-primary-foreground text-label-sm font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
                                Pelajari Lebih Lanjut
                            </button>
                        </div>

                        {/* Selected Service Summary */}
                        <div className="bg-card border border-border rounded-venus p-5">
                            <p className="text-label-sm text-foreground/60 uppercase mb-3">Layanan Dipilih</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-h4 text-super-black">{service.name}</p>
                                    <p className="text-body-reg text-foreground/60">{service.subtitle}</p>
                                </div>
                                <span className="text-card-title text-primary">
                                    Rp{service.price.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-body-reg text-foreground/60">Durasi: <span className="text-foreground font-semibold">{service.duration}</span></p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
