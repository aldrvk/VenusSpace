import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { PageHeader, Badge } from '../../Components/AdminUI';
import toast from 'react-hot-toast';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string | null;
    description?: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface Props {
    products: Product[];
    categories: string[];
    unit: 'VAPE STORE' | 'COFFEE SHOP';
    unitLabel: string;
}

export default function StoreWalkIn({ products, categories, unit, unitLabel }: Props) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
    const [submitting, setSubmitting] = useState(false);
    const [showQrisModal, setShowQrisModal] = useState(false);

    // Keyboard shortcuts listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // '/' to focus search input (if not currently focusing input/textarea)
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder="Cari produk..."]') as HTMLInputElement;
                searchInput?.focus();
            }

            // 'F2' to checkout
            if (e.key === 'F2') {
                e.preventDefault();
                const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }

            // 'Escape' to close QRIS modal
            if (e.key === 'Escape') {
                setShowQrisModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [customerName, cart, paymentMethod]);

    const executeCheckout = () => {
        setSubmitting(true);
        setShowQrisModal(false);
        router.post(
            '/admin/store/walk-in',
            {
                customer_name: customerName.trim(),
                payment_method: paymentMethod,
                items: cart.map((item) => ({
                    id: item.product.id,
                    quantity: item.quantity,
                })),
            },
            {
                onSuccess: () => {
                    setCart([]);
                    setCustomerName('');
                    toast.success('Transaksi walk-in berhasil diproses!');
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            }
        );
    };

    // Filter products
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            toast.error('Stok produk habis!');
            return;
        }

        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
            if (existing.quantity >= product.stock) {
                toast.error(`Kuantitas melebihi stok tersedia (${product.stock})`);
                return;
            }
            setCart(
                cart.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
        toast.success(`${product.name} ditambahkan`);
    };

    const updateQuantity = (productId: number, delta: number) => {
        const existing = cart.find((item) => item.product.id === productId);
        if (!existing) return;

        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
            setCart(cart.filter((item) => item.product.id !== productId));
            toast.success(`${existing.product.name} dihapus dari keranjang`);
        } else {
            if (newQty > existing.product.stock) {
                toast.error(`Kuantitas melebihi stok tersedia (${existing.product.stock})`);
                return;
            }
            setCart(
                cart.map((item) =>
                    item.product.id === productId ? { ...item, quantity: newQty } : item
                )
            );
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error('Keranjang belanja kosong!');
            return;
        }
        if (!customerName.trim()) {
            toast.error('Nama pelanggan wajib diisi!');
            return;
        }

        if (paymentMethod === 'qris') {
            setShowQrisModal(true);
        } else {
            executeCheckout();
        }
    };

    return (
        <AdminLayout>
            <Head title={`POS Kasir ${unitLabel} – Venus Space`} />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Kiri: Katalog & Pencarian */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-super-black tracking-tight">
                                POS Kasir {unitLabel}
                            </h1>
                            <p className="text-foreground/50 text-xs mt-1">Catat transaksi penjualan offline langsung.</p>
                        </div>
                        <Link
                            href="/admin/pesanan-store"
                            className="text-xs font-bold text-foreground/60 border border-border px-4 py-2 rounded-full hover:bg-surface hover:text-super-black transition-all"
                        >
                            ← Daftar Pesanan
                        </Link>
                    </div>

                    {/* Filter & Search */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-card border border-border rounded-venus px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary shadow-sm"
                            />
                        </div>
                        <div className="flex flex-wrap gap-1 bg-surface/50 p-1 rounded-full border border-border">
                            {['Semua', ...categories].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-secondary text-white shadow-sm'
                                            : 'text-foreground/60 hover:text-super-black'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Produk */}
                    {filteredProducts.length === 0 ? (
                        <div className="bg-card border border-border rounded-venus p-12 text-center text-foreground/40 italic">
                            Tidak ada produk ditemukan.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map((p) => {
                                const isLowStock = p.stock <= 5;
                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => addToCart(p)}
                                        className="bg-card border border-border rounded-venus p-3 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden relative"
                                    >
                                        <div>
                                            <div className="aspect-square bg-surface rounded-lg mb-3 overflow-hidden relative border border-border">
                                                {p.image ? (
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                                {isLowStock && (
                                                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                                                        Stok Kritis: {p.stock}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-xs font-bold text-super-black leading-snug truncate">
                                                {p.name}
                                            </h3>
                                            <p className="text-[10px] text-foreground/50 mt-0.5 capitalize">{p.category}</p>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs font-bold text-primary">
                                                Rp{p.price.toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-[9px] font-semibold text-foreground/45 bg-surface px-2 py-0.5 rounded">
                                                Stok: {p.stock}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Kanan: Keranjang Belanja Sticky */}
                <div className="w-full lg:w-96 shrink-0">
                    <div className="bg-card border border-border rounded-venus p-5 sticky top-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                            <h2 className="text-sm font-bold text-super-black">
                                Keranjang Transaksi
                            </h2>
                            {cart.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCart([]);
                                        toast.success('Keranjang dibersihkan');
                                    }}
                                    className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    </svg>
                                    Bersihkan
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Input Nama Pelanggan */}
                            <div>
                                <label className="block text-[10px] font-bold text-foreground/60 uppercase mb-1.5">
                                    Nama Pelanggan Walk-in
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Masukkan nama pelanggan..."
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* Item List */}
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {cart.length === 0 ? (
                                    <p className="text-xs text-foreground/40 italic text-center py-6">
                                        Keranjang belanja kosong.
                                    </p>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center justify-between gap-3 text-xs bg-surface/40 p-2.5 rounded-lg border border-border/50"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-super-black truncate">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-[10px] text-primary mt-0.5">
                                                    Rp{item.product.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-surface border border-border text-foreground hover:bg-background active:scale-90"
                                                >
                                                    -
                                                </button>
                                                <span className="font-semibold text-xs w-6 text-center text-super-black">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-surface border border-border text-foreground hover:bg-background active:scale-90"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pilihan Metode Pembayaran */}
                            <div className="border-t border-border pt-4">
                                <label className="block text-[10px] font-bold text-foreground/60 uppercase mb-2">
                                    Metode Pembayaran
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['cash', 'qris'] as const).map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method)}
                                            className={`py-2 px-3 border rounded-venus text-xs font-bold transition-all capitalize ${
                                                paymentMethod === method
                                                    ? 'bg-secondary border-secondary text-white shadow-sm'
                                                    : 'bg-surface border-border text-foreground hover:bg-background'
                                            }`}
                                        >
                                            {method === 'cash' ? '💵 Cash / Tunai' : '📱 QRIS'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ringkasan Biaya */}
                            <div className="border-t border-border pt-4 space-y-1.5 text-xs">
                                <div className="flex justify-between text-foreground/60">
                                    <span>Subtotal</span>
                                    <span>Rp{cartTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-super-black font-extrabold text-sm pt-1.5 border-t border-dashed border-border/80">
                                    <span>Total Bayar</span>
                                    <span className="text-secondary">
                                        Rp{cartTotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            {/* Tombol Kirim */}
                            <button
                                type="submit"
                                disabled={cart.length === 0 || submitting || !customerName.trim()}
                                className="w-full bg-primary text-white py-3 rounded-full text-xs font-bold hover:bg-primary/95 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {submitting ? 'Memproses Transaksi...' : '✓ Selesaikan Transaksi'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal: QRIS Mockup */}
            {showQrisModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQrisModal(false)} />
                    <div className="relative w-full max-w-sm bg-card border border-border rounded-venus p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                            <h3 className="text-lg font-extrabold text-super-black">📱 Pembayaran QRIS Dinamis</h3>
                            <p className="text-xs text-foreground/50 mt-1">Tunjukkan QR Code ini kepada pelanggan walk-in.</p>
                        </div>

                        {/* Mock QR Code Visual */}
                        <div className="w-48 h-48 mx-auto bg-white p-3 rounded-lg border border-border flex items-center justify-center relative overflow-hidden group">
                            <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                                <rect x="0" y="0" width="25" height="25" />
                                <rect x="5" y="5" width="15" height="15" fill="white" />
                                <rect x="9" y="9" width="7" height="7" />

                                <rect x="75" y="0" width="25" height="25" />
                                <rect x="80" y="5" width="15" height="15" fill="white" />
                                <rect x="84" y="9" width="7" height="7" />

                                <rect x="0" y="75" width="25" height="25" />
                                <rect x="5" y="80" width="15" height="15" fill="white" />
                                <rect x="9" y="84" width="7" height="7" />

                                <circle cx="50" cy="50" r="10" fill="white" />
                                <circle cx="50" cy="50" r="8" className="text-primary" />

                                <rect x="35" y="10" width="10" height="5" />
                                <rect x="50" y="20" width="15" height="10" />
                                <rect x="30" y="40" width="8" height="8" />
                                <rect x="60" y="35" width="10" height="12" />
                                <rect x="40" y="60" width="20" height="8" />
                                <rect x="15" y="30" width="5" height="15" />
                                <rect x="75" y="50" width="8" height="20" />
                                <rect x="30" y="75" width="15" height="5" />
                                <rect x="55" y="75" width="12" height="12" />
                            </svg>
                            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow">VENUS HUB</span>
                            </div>
                        </div>

                        {/* Transaction details */}
                        <div className="bg-surface border border-border rounded-venus p-3 space-y-1 text-xs text-left">
                            <div className="flex justify-between">
                                <span className="text-foreground/50">Pelanggan:</span>
                                <span className="font-semibold text-super-black">{customerName}</span>
                            </div>
                            <div className="flex justify-between border-t border-dashed border-border/80 pt-1.5 mt-1.5">
                                <span className="text-foreground/50">Total Nominal:</span>
                                <span className="font-extrabold text-secondary text-sm">Rp{cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="button"
                                onClick={executeCheckout}
                                disabled={submitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full text-xs font-bold transition-all shadow"
                            >
                                {submitting ? 'Memproses...' : '✓ Simulasikan Pembayaran Sukses'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowQrisModal(false)}
                                className="w-full border border-border hover:bg-surface text-foreground/75 py-2 rounded-full text-xs font-semibold transition-all"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
