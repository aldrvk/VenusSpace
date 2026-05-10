import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
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
    category: string;
    price: number;
    stock: "Tersedia" | "Habis" | "Terbatas";
    sold: number;
}

type FilterTab = "Semua" | "Device" | "Liquid" | "Accessories";

const statusBadge: Record<Product["stock"], string> = {
    Tersedia: "bg-primary/15 text-secondary border border-primary/30",
    Terbatas: "bg-orange-100 text-orange-600 border border-orange-200",
    Habis: "bg-red-100 text-red-600 border border-red-200",
};

interface Props {
    products: Product[];
}

export default function KatalogVapeStore({ products = [] }: Props) {
    const [activeFilter, setActiveFilter] = useState<FilterTab>("Semua");
    const [search, setSearch] = useState("");
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        unit: "VAPE STORE",
        name: "",
        category: "Device",
        price: 0,
        stock: "Tersedia",
    });

    const openAddModal = () => {
        reset();
        setData("unit", "VAPE STORE");
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setData({
            unit: "VAPE STORE",
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
        });
        setIsProductModalOpen(true);
    };

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/admin/store/product/${editingProduct.id}`, {
                onSuccess: () => setIsProductModalOpen(false),
            });
        } else {
            post(`/admin/store/product`, {
                onSuccess: () => setIsProductModalOpen(false),
            });
        }
    };

    const openDeleteModal = (product: Product) => {
        setDeletingProduct(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deletingProduct) {
            router.delete(`/admin/store/product/${deletingProduct.id}`, {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    const filters: FilterTab[] = ["Semua", "Device", "Liquid", "Accessories"];

    const filtered = products.filter((p) => {
        const matchCat =
            activeFilter === "Semua" || p.category === activeFilter;
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <AdminLayout>
            <Head title="Katalog Vape Store – Venus Hub Admin" />

            <PageHeader
                title="Katalog Vape Store"
                subtitle="Kelola produk, stok, dan harga item di Vape Store."
                action={<PrimaryButton onClick={openAddModal}>Tambah Produk</PrimaryButton>}
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
                        label: "Total Terjual",
                        value: `${products.reduce((s, p) => s + p.sold, 0)} pcs`,
                        emoji: "📦",
                        color: "bg-primary/10 text-primary",
                    },
                    {
                        label: "Produk Habis",
                        value: products.filter((p) => p.stock === "Habis").length,
                        emoji: "⚠️",
                        color: "bg-red-50 text-red-500",
                    },
                    {
                        label: "Est. Nilai Terjual",
                        value: `Rp ${(products.reduce((s, p) => s + p.price * p.sold, 0) / 1000000).toFixed(1)}jt`,
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
                                        data-label="KATEGORI"
                                    >
                                        <Badge text={p.category} />
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-foreground/80">
                                        Rp {p.price.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4 text-body-m text-foreground/70">
                                        {p.sold} pcs
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest ${statusBadge[p.stock]}`}
                                        >
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => openEditModal(p)}
                                                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"
                                            >
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
                                            <button 
                                                onClick={() => openDeleteModal(p)}
                                                className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-all"
                                            >
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

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
                    <div className="relative bg-card border border-border rounded-venus p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-h4 text-super-black mb-5">{editingProduct ? "Edit Produk" : "Tambah Produk"}</h3>
                        <form onSubmit={submitProduct} className="space-y-4">
                            <div>
                                <label className="text-label-sm text-foreground/60 uppercase">Nama Produk</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-background border border-border rounded-venus px-4 py-2 mt-1 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-label-sm text-foreground/60 uppercase">Kategori</label>
                                <select
                                    required
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="w-full bg-background border border-border rounded-venus px-4 py-2 mt-1 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="Device">Device</option>
                                    <option value="Liquid">Liquid</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-label-sm text-foreground/60 uppercase">Harga (Rp)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={data.price}
                                    onChange={e => setData('price', parseInt(e.target.value) || 0)}
                                    className="w-full bg-background border border-border rounded-venus px-4 py-2 mt-1 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-label-sm text-foreground/60 uppercase">Stok</label>
                                <select
                                    required
                                    value={data.stock}
                                    onChange={e => setData('stock', e.target.value)}
                                    className="w-full bg-background border border-border rounded-venus px-4 py-2 mt-1 text-body-m text-foreground focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Terbatas">Terbatas</option>
                                    <option value="Habis">Habis</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="flex-1 border border-border rounded-venus py-2.5 text-label-sm font-semibold text-foreground/70 hover:bg-surface transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-primary text-white rounded-venus py-2.5 text-label-sm font-semibold hover:bg-primary/90 disabled:opacity-70 transition-all"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && deletingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="relative bg-card border border-border rounded-venus p-6 w-full max-w-md shadow-2xl text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                            </svg>
                        </div>
                        <h3 className="text-h4 text-super-black mb-2">Hapus Produk?</h3>
                        <p className="text-body-reg text-foreground/60 mb-6">
                            Apakah Anda yakin ingin menghapus <strong>{deletingProduct.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 border border-border rounded-venus py-2.5 text-label-sm font-semibold text-foreground/70 hover:bg-surface transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 text-white rounded-venus py-2.5 text-label-sm font-semibold hover:bg-red-600 transition-all"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
