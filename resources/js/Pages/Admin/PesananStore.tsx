import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    PageHeader, 
    Badge, 
    TableResponsive, 
    IconButton,
    PrimaryButton
} from '../../Components/AdminUI';
import toast from 'react-hot-toast';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    order_code: string;
    customer_name: string;
    unit: 'VAPE STORE' | 'COFFEE SHOP';
    items: OrderItem[];
    total: number;
    payment_method: 'cash' | 'qris';
    status: 'MENUNGGU PEMBAYARAN' | 'BERHASIL';
    created_at: string;
}

interface Props {
    orders: Order[];
}

export default function PesananStore({ orders = [] }: Props) {
    const [filter, setFilter] = useState<'ALL' | 'VAPE STORE' | 'COFFEE SHOP'>('ALL');

    const handleConfirmPayment = (orderId: number | string) => {
        router.post(`/admin/pesanan-store/${orderId}/confirm`, {}, {
            preserveScroll: true
        });
    };

    const filteredOrders = filter === 'ALL' 
        ? orders 
        : orders.filter(o => o.unit === filter);

    const formatPrice = (price: number) => {
        return 'Rp' + price.toLocaleString('id-ID');
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pesanan Store – Admin Venus Hub" />

            <PageHeader 
                title="Daftar Pesanan Store" 
                subtitle="Kelola pesanan dari Vape Store dan Coffee Shop Anda."
            />

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 bg-card p-1 border border-border rounded-venus w-fit">
                {['ALL', 'VAPE STORE', 'COFFEE SHOP'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 rounded-venus text-label-sm transition-all ${
                            filter === f 
                                ? 'bg-primary text-primary-foreground shadow-md' 
                                : 'text-foreground/60 hover:bg-surface'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="bg-card border border-border rounded-venus overflow-hidden">
                <TableResponsive>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-surface/30">
                                <th className="text-left px-6 py-4 text-label-sm text-foreground/40 font-bold uppercase tracking-wider">ID Pesanan</th>
                                <th className="text-left px-6 py-4 text-label-sm text-foreground/40 font-bold uppercase tracking-wider">Pelanggan</th>
                                <th className="text-left px-6 py-4 text-label-sm text-foreground/40 font-bold uppercase tracking-wider">Unit</th>
                                <th className="text-left px-6 py-4 text-label-sm text-foreground/40 font-bold uppercase tracking-wider">Metode</th>
                                <th className="text-left px-6 py-4 text-label-sm text-foreground/40 font-bold uppercase tracking-wider">Total</th>
                                <th className="text-left px-6 py-4 text-label-sm text-foreground/40 font-bold uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-label-sm text-foreground/40 font-bold uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-background/40 transition-colors">
                                    <td className="px-6 py-4 text-body-reg font-bold text-super-black">{order.order_code || order.id}</td>
                                    <td className="px-6 py-4 text-body-reg text-foreground">{order.customer_name}</td>
                                    <td className="px-6 py-4">
                                        <Badge 
                                            text={order.unit} 
                                            variant={order.unit === 'VAPE STORE' ? 'warning' : 'default'} 
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-label-sm font-bold uppercase tracking-widest text-foreground/50">
                                            {order.payment_method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-body-reg font-bold text-primary">
                                        {formatPrice(order.total)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge 
                                            text={order.status} 
                                            variant={order.status === 'BERHASIL' ? 'success' : 'warning'} 
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.status === 'MENUNGGU PEMBAYARAN' && (
                                            <button 
                                                onClick={() => handleConfirmPayment(order.id)}
                                                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-label-sm font-bold hover:bg-secondary/90 transition-all shadow-sm active:scale-95"
                                            >
                                                Konfirmasi Bayar
                                            </button>
                                        )}
                                        {order.status === 'BERHASIL' && (
                                            <span className="text-foreground/30 text-label-sm">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableResponsive>
            </div>
        </AdminLayout>
    );
}
