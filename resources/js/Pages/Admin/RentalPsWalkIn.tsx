import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { PageHeader } from '../../Components/AdminUI';

// ── Data ─────────────────────────────────────────────────────────────────────

const services = [
    {
        id: 'ps3',
        name: 'Sewa PS3',
        subtitle: '1 Jam Main PS3',
        price: 15000,
        duration: '60 menit',
    },
    {
        id: 'ps4',
        name: 'Sewa PS4',
        subtitle: '1 Jam Main PS4',
        price: 30000,
        duration: '60 menit',
    },
    {
        id: 'ps5',
        name: 'Sewa PS5',
        subtitle: '1 Jam Main PS5',
        price: 50000,
        duration: '60 menit',
    },
];

export default function RentalPsWalkIn() {
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('ps4');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const service = services.find(s => s.id === selectedServiceId)!;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim()) return;

        setIsSubmitting(true);
        router.post('/admin/rental-ps/walk-in', {
            customer_name:    customerName,
            customer_email:   customerEmail,
            service_id:       service.id,
            service_name:     service.name,
            service_subtitle: service.subtitle,
            service_price:    service.price,
            service_duration: service.duration,
        }, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Registrasi Walk-in – RentalPs Admin" />

            <PageHeader
                title="Registrasi Walk-in"
                subtitle="Masukkan data pelanggan yang datang langsung ke lokasi."
            />

            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Customer Info */}
                    <div className="bg-card border border-border rounded-venus p-6 space-y-6">
                        <h3 className="text-h4 text-super-black border-b border-border pb-3">Data Pelanggan</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-label-sm text-foreground/60 uppercase">Nama Lengkap *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Nama Pelanggan"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-label-sm text-foreground/60 uppercase">Email (Opsional)</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={customerEmail}
                                    onChange={e => setCustomerEmail(e.target.value)}
                                    className="w-full bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Service Info */}
                    <div className="bg-card border border-border rounded-venus p-6 space-y-6">
                        <h3 className="text-h4 text-super-black border-b border-border pb-3">Layanan Rental</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-label-sm text-foreground/60 uppercase">Pilih Layanan</label>
                                <select
                                    value={selectedServiceId}
                                    onChange={e => setSelectedServiceId(e.target.value)}
                                    className="w-full bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                >
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} (Rp{s.price.toLocaleString('id-ID')})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="flex items-center justify-between gap-4 pt-4">
                        <Link
                            href="/admin/booking-rental-ps"
                            className="text-label-sm font-bold text-foreground/40 hover:text-foreground/60 transition-colors"
                        >
                            ← Kembali ke Dashboard
                        </Link>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full text-label-sm font-bold hover:bg-secondary/90 shadow-lg transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Memproses...' : '✓ Daftarkan & Masuk Antrian'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
