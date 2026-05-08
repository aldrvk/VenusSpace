import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import {
    PageHeader,
    Badge,
    FilterTabs,
    PrimaryButton,
    SearchInput,
} from "../../Components/AdminUI";

interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    status: "Tersedia" | "Habis" | "Terbatas";
}

type FilterTab = "Semua" | "Device" | "Liquid" | "Accessories";

const products: Product[] = [
    {
        id: 1,
        name: "Lost Mary BM600",
        brand: "Lost Mary",
        category: "Device",
        price: 85000,
        stock: 24,
        status: "Tersedia",
    },
    {
        id: 2,
        name: "Vaporesso XROS 3",
        brand: "Vaporesso",
        category: "Device",
        price: 350000,
        stock: 8,
        status: "Tersedia",
    },
    {
        id: 3,
        name: "SMOK Nord 5",
        brand: "SMOK",
        category: "Device",
        price: 420000,
        stock: 3,
        status: "Terbatas",
    },
    {
        id: 4,
        name: "Elfbar BC5000",
        brand: "Elfbar",
        category: "Device",
        price: 95000,
        stock: 0,
        status: "Habis",
    },
    {
        id: 5,
        name: "Saltnic Mnke Punch 30ml",
        brand: "Mnke",
        category: "Liquid",
        price: 55000,
        stock: 40,
        status: "Tersedia",
    },
    {
        id: 6,
        name: "Freebase Mango Ice 60ml",
        brand: "Pachamama",
        category: "Liquid",
        price: 75000,
        stock: 15,
        status: "Tersedia",
    },
    {
        id: 7,
        name: "Coil GTX 0.6ohm",
        brand: "Vaporesso",
        category: "Accessories",
        price: 35000,
        stock: 60,
        status: "Tersedia",
    },
    {
        id: 8,
        name: "Cotton Fiber",
        brand: "VapeAmp",
        category: "Accessories",
        price: 25000,
        stock: 2,
        status: "Terbatas",
    },
];

const statusBadge: Record<Product["status"], string> = {
    Tersedia: "bg-primary/15 text-secondary border border-primary/30",
    Terbatas: "bg-orange-100 text-orange-600 border border-orange-200",
    Habis: "bg-red-100 text-red-600 border border-red-200",
};

export default function KatalogVapeStore() {
    const [activeFilter, setActiveFilter] = useState<FilterTab>("Semua");
    const [search, setSearch] = useState("");
    const filters: FilterTab[] = ["Semua", "Device", "Liquid", "Accessories"];

    const filtered = products.filter((p) => {
        const matchCat =
            activeFilter === "Semua" || p.category === activeFilter;
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <AdminLayout>
            <Head title="Katalog Vape Store – Venus Hub Admin" />

            <PageHeader
                title="Katalog Vape Store"
                subtitle="Kelola produk, stok, dan harga item di Vape Store."
                action={<PrimaryButton>Tambah Produk</PrimaryButton>}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                    {
                        label: "Total Produk",
                        value: products.length,
                        emoji: "🛒",
                        color: "bg-secondary/10 text-secondary",
                    },
                    {
                        label: "Total Stok",
                        value: `${products.reduce((s, p) => s + p.stock, 0)} pcs`,
                        emoji: "📦",
                        color: "bg-primary/10 text-primary",
                    },
                    {
                        label: "Produk Habis",
                        value: products.filter((p) => p.status === "Habis")
                            .length,
                        emoji: "⚠️",
                        color: "bg-red-50 text-red-500",
                    },
                    {
                        label: "Est. Nilai Stok",
                        value: `Rp ${(products.reduce((s, p) => s + p.price * p.stock, 0) / 1000000).toFixed(1)}jt`,
                        emoji: "💎",
                        color: "bg-emerald-50 text-emerald-600",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded-venus p-4 md:p-5"
                    >
                        <div
                            className={`w-10 h-10 rounded-venus flex items-center justify-center text-lg mb-3 ${s.color}`}
                        >
                            {s.emoji}
                        </div>
                        <p className="text-xs md:text-body-reg text-foreground/50">
                            {s.label}
                        </p>
                        <p className="text-lg md:text-h3 text-super-black mt-1 font-bold">
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-border">
                <FilterTabs
                    tabs={filters}
                    active={activeFilter}
                    onChange={(tab) => setActiveFilter(tab as FilterTab)}
                />
                <div className="flex-1 md:max-w-xs">
                    <SearchInput
                        placeholder="Cari produk atau brand..."
                        value={search}
                        onChange={setSearch}
                    />
                </div>
            </div>

            <div className="bg-card border border-border rounded-venus overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-body-m">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b border-border">
                                {[
                                    "NO",
                                    "NAMA PRODUK",
                                    "BRAND",
                                    "KATEGORI",
                                    "HARGA",
                                    "STOK",
                                    "STATUS",
                                    "AKSI",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 md:px-6 py-3 text-xs md:text-label-sm text-foreground/40 font-semibold"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr
                                    key={p.id}
                                    className="flex md:table-row flex-col md:flex-row gap-2 md:gap-0 p-4 md:p-0 md:border-b md:border-border/50 md:hover:bg-background/60 md:transition-colors border-b md:border-b border-border/50 last:border-b-0"
                                >
                                    <td
                                        className="md:px-4 md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="NO"
                                    >
                                        <span className="text-xs md:text-body-m text-foreground/50">
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="NAMA"
                                    >
                                        <span className="text-xs md:text-body-m text-super-black font-semibold">
                                            {p.name}
                                        </span>
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="BRAND"
                                    >
                                        <span className="text-xs md:text-body-m text-foreground/70">
                                            {p.brand}
                                        </span>
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="KATEGORI"
                                    >
                                        <Badge text={p.category} />
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-foreground/80">
                                        Rp {p.price.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-foreground/70">
                                        {p.stock} pcs
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest ${statusBadge[p.status]}`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
                                                <svg
                                                    width="13"
                                                    height="13"
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
                                            </button>
                                            <button className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-all">
                                                <svg
                                                    width="13"
                                                    height="13"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 border-t border-border">
                    <p className="text-body-reg text-foreground/40">
                        Menampilkan {filtered.length} dari {products.length}{" "}
                        produk
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
