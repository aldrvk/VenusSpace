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

interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: "Tersedia" | "Habis" | "Terbatas";
    sold: number;
}

type FilterTab = "Semua" | "Kopi" | "Non-Kopi" | "Makanan";

const menuItems: MenuItem[] = [
    {
        id: 1,
        name: "Americano",
        category: "Kopi",
        price: 18000,
        stock: "Tersedia",
        sold: 42,
    },
    {
        id: 2,
        name: "Cappuccino",
        category: "Kopi",
        price: 22000,
        stock: "Tersedia",
        sold: 38,
    },
    {
        id: 3,
        name: "Latte",
        category: "Kopi",
        price: 24000,
        stock: "Tersedia",
        sold: 55,
    },
    {
        id: 4,
        name: "Espresso",
        category: "Kopi",
        price: 15000,
        stock: "Tersedia",
        sold: 29,
    },
    {
        id: 5,
        name: "Matcha Latte",
        category: "Non-Kopi",
        price: 25000,
        stock: "Terbatas",
        sold: 20,
    },
    {
        id: 6,
        name: "Chocolate Frappe",
        category: "Non-Kopi",
        price: 27000,
        stock: "Tersedia",
        sold: 18,
    },
    {
        id: 7,
        name: "Teh Tarik",
        category: "Non-Kopi",
        price: 12000,
        stock: "Tersedia",
        sold: 31,
    },
    {
        id: 8,
        name: "Croissant",
        category: "Makanan",
        price: 20000,
        stock: "Habis",
        sold: 14,
    },
    {
        id: 9,
        name: "Roti Bakar",
        category: "Makanan",
        price: 15000,
        stock: "Tersedia",
        sold: 22,
    },
];

export default function KatalogCoffeeShop() {
    const [activeFilter, setActiveFilter] = useState<FilterTab>("Semua");
    const [search, setSearch] = useState("");
    const filters: FilterTab[] = ["Semua", "Kopi", "Non-Kopi", "Makanan"];

    const filtered = menuItems.filter((item) => {
        const matchCat =
            activeFilter === "Semua" || item.category === activeFilter;
        const matchSearch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const totalItems = menuItems.length;
    const totalSold = menuItems.reduce((s, i) => s + i.sold, 0);
    const habisCount = menuItems.filter((i) => i.stock === "Habis").length;
    const revenue = menuItems.reduce((s, i) => s + i.price * i.sold, 0);

    return (
        <AdminLayout>
            <Head title="Katalog Coffee Shop – Venus Hub Admin" />

            {/* Header */}
            <PageHeader
                title="Katalog Coffee Shop"
                subtitle="Kelola menu, harga, dan ketersediaan item di Coffee Shop."
                action={<PrimaryButton>Tambah Menu</PrimaryButton>}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                    {
                        label: "Total Menu",
                        value: totalItems,
                        icon: "☕",
                        color: "bg-amber-50 text-amber-600",
                    },
                    {
                        label: "Total Terjual Hari Ini",
                        value: totalSold,
                        icon: "📦",
                        color: "bg-primary/10 text-primary",
                    },
                    {
                        label: "Item Habis",
                        value: habisCount,
                        icon: "⚠️",
                        color: "bg-red-50 text-red-500",
                    },
                    {
                        label: "Est. Pendapatan",
                        value: `Rp ${(revenue / 1000).toFixed(0)}k`,
                        icon: "💰",
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
                            {s.icon}
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
                        placeholder="Cari menu..."
                        value={search}
                        onChange={setSearch}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-venus overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-body-m">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b border-border">
                                {[
                                    "NO",
                                    "NAMA MENU",
                                    "KATEGORI",
                                    "HARGA",
                                    "TERJUAL",
                                    "STOK",
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
                            {filtered.map((item, i) => (
                                <tr
                                    key={item.id}
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
                                        data-label="MENU"
                                    >
                                        <span className="text-xs md:text-body-m text-super-black font-semibold">
                                            {item.name}
                                        </span>
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="KATEGORI"
                                    >
                                        <Badge text={item.category} />
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="HARGA"
                                    >
                                        <span className="text-xs md:text-body-m text-foreground/80">
                                            Rp{" "}
                                            {item.price.toLocaleString("id-ID")}
                                        </span>
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="TERJUAL"
                                    >
                                        <span className="text-xs md:text-body-m text-foreground/70">
                                            {item.sold} porsi
                                        </span>
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="STOK"
                                    >
                                        <Badge
                                            text={item.stock}
                                            variant={
                                                item.stock === "Tersedia"
                                                    ? "default"
                                                    : item.stock === "Terbatas"
                                                      ? "warning"
                                                      : "danger"
                                            }
                                        />
                                    </td>
                                    <td
                                        className="md:px-6 md:py-4 before:content-attr(data-label) before:font-bold before:text-foreground/40 before:mr-2 md:before:content-none"
                                        data-label="AKSI"
                                    >
                                        <div className="flex items-center gap-1.5 md:gap-2">
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
                <div className="px-4 md:px-6 py-3 border-t border-border text-xs md:text-body-m">
                    <p className="text-foreground/40">
                        Menampilkan {filtered.length} dari {totalItems} menu
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
