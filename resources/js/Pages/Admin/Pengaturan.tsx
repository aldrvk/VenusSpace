import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { PageHeader } from "../../Components/AdminUI";

type SettingTab = "Profil" | "Operasional" | "Notifikasi" | "Keamanan";

export default function Pengaturan() {
    const [activeTab, setActiveTab] = useState<SettingTab>("Profil");
    const [saved, setSaved] = useState(false);
    const tabs: SettingTab[] = [
        "Profil",
        "Operasional",
        "Notifikasi",
        "Keamanan",
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan – Venus Hub Admin" />

            <PageHeader
                title="Pengaturan"
                subtitle="Konfigurasi sistem, profil bisnis, dan preferensi operasional."
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {/* Sidebar Tabs */}
                <div className="md:col-span-1">
                    <div className="flex md:flex-col gap-2 md:gap-1 bg-card border border-border rounded-venus p-3 md:p-4 md:space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 md:flex-none text-center md:text-left px-3 md:px-4 py-2 md:py-3 rounded-venus text-xs md:text-body-m transition-all ${
                                    activeTab === tab
                                        ? "bg-secondary text-white font-semibold shadow"
                                        : "text-foreground/70 hover:bg-surface hover:text-foreground"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="col-span-3 space-y-5">
                    {activeTab === "Profil" && (
                        <>
                            <div className="bg-card border border-border rounded-venus p-6">
                                <h2 className="text-h4 text-super-black mb-5">
                                    Informasi Bisnis
                                </h2>
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-white font-heading font-bold text-2xl">
                                        V
                                    </div>
                                    <div>
                                        <p className="text-h4 text-super-black">
                                            Venus Hub
                                        </p>
                                        <p className="text-body-reg text-foreground/50 mt-0.5">
                                            Multi-unit business admin
                                        </p>
                                        <button className="mt-2 text-label-sm text-primary hover:underline">
                                            Ganti Logo
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            label: "Nama Bisnis",
                                            value: "Venus Hub",
                                            type: "text",
                                        },
                                        {
                                            label: "Email Admin",
                                            value: "admin@venushub.id",
                                            type: "email",
                                        },
                                        {
                                            label: "Nomor WhatsApp",
                                            value: "+62 812-3456-7890",
                                            type: "tel",
                                        },
                                        {
                                            label: "Alamat",
                                            value: "Jl. Venus No. 12, Medan",
                                            type: "text",
                                        },
                                    ].map((f) => (
                                        <div
                                            key={f.label}
                                            className="space-y-1.5"
                                        >
                                            <label className="text-label-sm text-foreground/50">
                                                {f.label.toUpperCase()}
                                            </label>
                                            <input
                                                type={f.type}
                                                defaultValue={f.value}
                                                className="w-full bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-card border border-border rounded-venus p-6">
                                <h2 className="text-h4 text-super-black mb-5">
                                    Unit Usaha Aktif
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        {
                                            name: "Doorsmeer",
                                            desc: "Layanan cuci kendaraan",
                                            active: true,
                                        },
                                        {
                                            name: "Bengkel",
                                            desc: "Layanan service kendaraan",
                                            active: true,
                                        },
                                        {
                                            name: "Rental PS",
                                            desc: "Rental PlayStation & Gaming",
                                            active: true,
                                        },
                                        {
                                            name: "Coffee Shop",
                                            desc: "Minuman & makanan ringan",
                                            active: true,
                                        },
                                        {
                                            name: "Vape Store",
                                            desc: "Penjualan produk vape",
                                            active: false,
                                        },
                                    ].map((u) => (
                                        <div
                                            key={u.name}
                                            className="flex items-center justify-between p-4 border border-border rounded-venus"
                                        >
                                            <div>
                                                <p className="text-body-m text-super-black font-semibold">
                                                    {u.name}
                                                </p>
                                                <p className="text-body-reg text-foreground/50">
                                                    {u.desc}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${u.active ? "bg-secondary" : "bg-surface border border-border"}`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${u.active ? "right-0.5" : "left-0.5"}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "Operasional" && (
                        <div className="bg-card border border-border rounded-venus p-6">
                            <h2 className="text-h4 text-super-black mb-5">
                                Jam Operasional
                            </h2>
                            <div className="space-y-3">
                                {[
                                    "Senin",
                                    "Selasa",
                                    "Rabu",
                                    "Kamis",
                                    "Jumat",
                                    "Sabtu",
                                    "Minggu",
                                ].map((day, i) => (
                                    <div
                                        key={day}
                                        className="flex items-center justify-between p-4 border border-border rounded-venus"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-10 h-6 rounded-full relative cursor-pointer transition-all ${i < 6 ? "bg-secondary" : "bg-surface border border-border"}`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${i < 6 ? "right-0.5" : "left-0.5"}`}
                                                />
                                            </div>
                                            <p className="text-body-m text-foreground font-semibold w-20">
                                                {day}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="time"
                                                defaultValue="08:00"
                                                className="bg-background border border-border rounded-venus px-3 py-2 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                            />
                                            <span className="text-body-reg text-foreground/40">
                                                –
                                            </span>
                                            <input
                                                type="time"
                                                defaultValue={
                                                    i === 5 ? "22:00" : "20:00"
                                                }
                                                className="bg-background border border-border rounded-venus px-3 py-2 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "Notifikasi" && (
                        <div className="bg-card border border-border rounded-venus p-6">
                            <h2 className="text-h4 text-super-black mb-5">
                                Preferensi Notifikasi
                            </h2>
                            <div className="space-y-3">
                                {[
                                    {
                                        label: "Booking baru masuk",
                                        desc: "Notifikasi saat ada booking baru dari pelanggan",
                                        on: true,
                                    },
                                    {
                                        label: "Pembayaran diterima",
                                        desc: "Notifikasi konfirmasi pembayaran",
                                        on: true,
                                    },
                                    {
                                        label: "Antrean menumpuk",
                                        desc: "Peringatan saat antrean > 5 orang",
                                        on: true,
                                    },
                                    {
                                        label: "Stok produk hampir habis",
                                        desc: "Peringatan stok di bawah 5 unit",
                                        on: false,
                                    },
                                    {
                                        label: "Laporan harian otomatis",
                                        desc: "Kirim ringkasan pendapatan setiap pukul 21:00",
                                        on: true,
                                    },
                                    {
                                        label: "WhatsApp Notifikasi",
                                        desc: "Kirim notifikasi via WhatsApp ke admin",
                                        on: false,
                                    },
                                ].map((n) => (
                                    <div
                                        key={n.label}
                                        className="flex items-center justify-between p-4 border border-border rounded-venus"
                                    >
                                        <div>
                                            <p className="text-body-m text-super-black font-semibold">
                                                {n.label}
                                            </p>
                                            <p className="text-body-reg text-foreground/50">
                                                {n.desc}
                                            </p>
                                        </div>
                                        <div
                                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${n.on ? "bg-secondary" : "bg-surface border border-border"}`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${n.on ? "right-0.5" : "left-0.5"}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "Keamanan" && (
                        <div className="space-y-5">
                            <div className="bg-card border border-border rounded-venus p-6">
                                <h2 className="text-h4 text-super-black mb-5">
                                    Ganti Password
                                </h2>
                                <div className="space-y-4 max-w-md">
                                    {[
                                        "Password Saat Ini",
                                        "Password Baru",
                                        "Konfirmasi Password Baru",
                                    ].map((f) => (
                                        <div key={f} className="space-y-1.5">
                                            <label className="text-label-sm text-foreground/50">
                                                {f.toUpperCase()}
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-background border border-border rounded-venus px-4 py-3 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    ))}
                                    <button className="bg-secondary text-white px-6 py-3 rounded-venus text-label-sm font-semibold hover:bg-secondary/90 transition-all">
                                        Perbarui Password
                                    </button>
                                </div>
                            </div>
                            <div className="bg-card border border-border rounded-venus p-6">
                                <h2 className="text-h4 text-super-black mb-2">
                                    Sesi Login Aktif
                                </h2>
                                <p className="text-body-reg text-foreground/50 mb-5">
                                    Berikut adalah perangkat yang sedang login
                                    ke akun admin.
                                </p>
                                <div className="space-y-3">
                                    {[
                                        {
                                            device: "Chrome – Windows 11",
                                            ip: "192.168.1.5",
                                            time: "Aktif sekarang",
                                            current: true,
                                        },
                                        {
                                            device: "Safari – iPhone 14",
                                            ip: "192.168.1.12",
                                            time: "2 jam yang lalu",
                                            current: false,
                                        },
                                    ].map((s, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 border border-border rounded-venus"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${s.current ? "bg-primary animate-pulse" : "bg-surface border border-border"}`}
                                                />
                                                <div>
                                                    <p className="text-body-m text-foreground font-semibold">
                                                        {s.device}
                                                    </p>
                                                    <p className="text-body-reg text-foreground/40">
                                                        {s.ip} · {s.time}
                                                    </p>
                                                </div>
                                            </div>
                                            {!s.current && (
                                                <button className="text-label-sm text-red-500 hover:underline">
                                                    Logout
                                                </button>
                                            )}
                                            {s.current && (
                                                <span className="text-label-sm text-primary">
                                                    Perangkat ini
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    {activeTab !== "Keamanan" && (
                        <div className="flex items-center gap-3 justify-end">
                            {saved && (
                                <span className="text-body-m text-primary font-semibold">
                                    ✓ Tersimpan!
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                className="bg-secondary text-white px-8 py-3 rounded-venus text-label-sm font-semibold hover:bg-secondary/90 transition-all shadow-lg"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
