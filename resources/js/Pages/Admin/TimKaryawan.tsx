import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";

interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    business_unit: string | null;
    phone: string | null;
    employee_status: string;
    last_login_at: string | null;
    created_at: string;
}

interface EmployeeForm {
    name: string;
    email: string;
    password: string;
    role: string;
    business_unit: string;
    phone: string;
}

const UNITS = [
    { value: "doorsmeer", label: "Doorsmeer" },
    { value: "bengkel", label: "Bengkel" },
    { value: "rental_ps", label: "Rental PS" },
    { value: "vape_store", label: "Vape Store" },
    { value: "coffee_shop", label: "Coffee Shop" },
];

const unitLabel = (key: string | null) => {
    if (!key) return "-";
    const found = UNITS.find(u => u.value === key);
    return found ? found.label : key;
};

const roleBadge = (role: string) => {
    if (role === 'admin') return { label: 'Admin', class: 'bg-primary/10 text-primary border border-primary/20' };
    if (role === 'kasir') return { label: 'Kasir', class: 'bg-secondary/10 text-secondary border border-secondary/20' };
    return { label: role, class: 'bg-gray-100 text-gray-600 border border-gray-200' };
};

const statusBadge = (status: string) => {
    if (status === 'active') return { label: 'Aktif', class: 'bg-emerald-50 text-emerald-600 border border-emerald-200', dot: 'bg-emerald-500' };
    if (status === 'inactive') return { label: 'Nonaktif', class: 'bg-red-50 text-red-500 border border-red-200', dot: 'bg-red-500' };
    if (status === 'leave') return { label: 'Cuti', class: 'bg-amber-50 text-amber-600 border border-amber-200', dot: 'bg-amber-500' };
    return { label: status, class: 'bg-gray-50 text-gray-500 border border-gray-200', dot: 'bg-gray-400' };
};

const emptyForm: EmployeeForm = { name: '', email: '', password: '', role: 'admin', business_unit: 'doorsmeer', phone: '' };

export default function TimKaryawan({ employees = [], stats = { total: 0, active: 0, inactive: 0, leave: 0 }, filters = {} as any }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [form, setForm] = useState<EmployeeForm>({ ...emptyForm });
    const [editForm, setEditForm] = useState<EmployeeForm>({ ...emptyForm });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            router.get('/admin/tim', { search }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const params: Record<string, string> = { ...filters, [key]: value };
        if (search) params.search = search;
        router.get('/admin/tim', params, { preserveState: true, preserveScroll: true });
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        router.post('/admin/tim', form as any, {
            preserveScroll: true,
            onSuccess: () => { setShowAddModal(false); setForm({ ...emptyForm }); },
            onError: (errs) => setErrors(errs),
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEmployee) return;
        setErrors({});
        router.put(`/admin/tim/${editingEmployee.id}`, editForm as any, {
            preserveScroll: true,
            onSuccess: () => { setShowEditModal(false); setEditingEmployee(null); },
            onError: (errs) => setErrors(errs),
        });
    };

    const handleStatusChange = (emp: Employee, newStatus: string) => {
        router.patch(`/admin/tim/${emp.id}/status`, { employee_status: newStatus }, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/tim/${id}`, { preserveScroll: true, onSuccess: () => setShowDeleteConfirm(null) });
    };

    const openEditModal = (emp: Employee) => {
        setEditingEmployee(emp);
        setEditForm({
            name: emp.name,
            email: emp.email,
            password: '',
            role: emp.role,
            business_unit: emp.business_unit || 'doorsmeer',
            phone: emp.phone || '',
        });
        setErrors({});
        setShowEditModal(true);
    };

    return (
        <AdminLayout>
            <Head title="Tim & Karyawan – Venus Space" />

            {/* Header */}
            <div className="relative mb-8">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary/15 rounded-full blur-3xl -z-10 pointer-events-none" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-super-black to-foreground/70 tracking-tight">
                    Tim & Karyawan
                </h1>
                <p className="text-foreground/60 mt-2 font-medium">Kelola semua personel dan pantau status operasional tim Anda.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        label: 'Total', value: stats.total,
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
                        gradient: 'from-primary to-primary/70', glow: 'group-hover:shadow-primary/20'
                    },
                    {
                        label: 'Aktif', value: stats.active,
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
                        gradient: 'from-emerald-400 to-emerald-600', glow: 'group-hover:shadow-emerald-500/20'
                    },
                    {
                        label: 'Nonaktif', value: stats.inactive,
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
                        gradient: 'from-red-400 to-red-600', glow: 'group-hover:shadow-red-500/20'
                    },
                    {
                        label: 'Cuti', value: stats.leave,
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                        gradient: 'from-amber-400 to-amber-500', glow: 'group-hover:shadow-amber-500/20'
                    },
                ].map((s, i) => (
                    <div key={i} className={`group relative bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${s.glow} overflow-hidden`}>
                        <div className={`absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br ${s.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity`} />
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-md`}>
                                {s.icon}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-2xl font-extrabold text-super-black">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 w-full sm:max-w-xs">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch}
                        placeholder="Cari nama / email..." className="w-full bg-background border border-border rounded-venus pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <select value={filters.filter_role || 'Semua'} onChange={(e) => handleFilterChange('filter_role', e.target.value)}
                        className="bg-background border border-border rounded-venus px-2.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary">
                        <option value="Semua">Semua Role</option>
                        <option value="admin">Admin</option>
                        <option value="kasir">Kasir</option>
                    </select>
                    <select value={filters.filter_unit || 'Semua'} onChange={(e) => handleFilterChange('filter_unit', e.target.value)}
                        className="bg-background border border-border rounded-venus px-2.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary">
                        <option value="Semua">Semua Unit</option>
                        {UNITS.map(u => <option key={u.value} value={u.label}>{u.label}</option>)}
                    </select>
                    <select value={filters.filter_status || 'Semua'} onChange={(e) => handleFilterChange('filter_status', e.target.value)}
                        className="bg-background border border-border rounded-venus px-2.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary">
                        <option value="Semua">Semua Status</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                        <option value="Cuti">Cuti</option>
                    </select>
                </div>

                {/* Add Button */}
                <button onClick={() => { setForm({ ...emptyForm }); setErrors({}); setShowAddModal(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Tambah Karyawan
                </button>
            </div>

            {/* Employee Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-surface/50 border-b border-border">
                            <tr>
                                {['Nama', 'Email', 'No. HP', 'Role', 'Unit Usaha', 'Status', 'Bergabung', 'Login Terakhir', 'Aksi'].map(h => (
                                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-foreground/50 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ? employees.map((emp: Employee) => {
                                const rb = roleBadge(emp.role);
                                const sb = statusBadge(emp.employee_status);
                                return (
                                    <tr key={emp.id} className="border-b border-border/50 hover:bg-background/40 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                                    {emp.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-super-black">{emp.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-foreground/60 text-xs">{emp.email}</td>
                                        <td className="px-5 py-4 text-foreground/60 text-xs">{emp.phone || '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rb.class}`}>{rb.label}</span>
                                        </td>
                                        <td className="px-5 py-4 text-xs font-semibold text-foreground/70">{unitLabel(emp.business_unit)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${sb.dot}`} />
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sb.class}`}>{sb.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-foreground/50 text-xs">{emp.created_at}</td>
                                        <td className="px-5 py-4 text-foreground/50 text-xs">{emp.last_login_at || '—'}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Status Quick Toggle */}
                                                <select value={emp.employee_status} onChange={(e) => handleStatusChange(emp, e.target.value)}
                                                    className="bg-background border border-border rounded px-1.5 py-1 text-[10px] font-semibold text-foreground focus:outline-none focus:border-primary">
                                                    <option value="active">Aktif</option>
                                                    <option value="inactive">Nonaktif</option>
                                                    <option value="leave">Cuti</option>
                                                </select>
                                                {/* Edit */}
                                                <button onClick={() => openEditModal(emp)} className="w-7 h-7 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors" title="Edit">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                {/* Delete */}
                                                <button onClick={() => setShowDeleteConfirm(emp.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors" title="Hapus">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-16 text-center text-foreground/40 italic">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-foreground/5 text-foreground/30 flex items-center justify-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                                            </div>
                                            <p className="font-medium">Tidak ada karyawan ditemukan.</p>
                                            <p className="text-xs">Coba ubah filter atau tambahkan karyawan baru.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-border">
                    <p className="text-xs text-foreground/40">Menampilkan {employees.length} karyawan</p>
                </div>
            </div>

            {/* ── Add Modal ───────────────────────────────────────────────────── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-border bg-surface/30">
                            <h3 className="text-lg font-bold text-super-black">Tambah Karyawan Baru</h3>
                            <p className="text-xs text-foreground/50 mt-1">Isi data karyawan untuk mendaftarkan akun baru.</p>
                        </div>
                        <form onSubmit={handleAdd} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Nama Lengkap</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Masukkan nama lengkap" />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Email</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="email@venusspace.com" />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Password</label>
                                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Minimal 6 karakter" />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Role</label>
                                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-semibold">
                                        <option value="admin">Admin</option>
                                        <option value="kasir">Kasir</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Unit Usaha</label>
                                    <select value={form.business_unit} onChange={(e) => setForm({ ...form, business_unit: e.target.value })}
                                        className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-semibold">
                                        {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">No. HP (opsional)</label>
                                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="08xxxxxxxxxx" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-venus border border-border text-sm font-semibold text-foreground/60 hover:bg-surface transition-colors">Batal</button>
                                <button type="submit" className="px-5 py-2 rounded-venus bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Edit Modal ──────────────────────────────────────────────────── */}
            {showEditModal && editingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-border bg-surface/30">
                            <h3 className="text-lg font-bold text-super-black">Edit Karyawan</h3>
                            <p className="text-xs text-foreground/50 mt-1">Perbarui data {editingEmployee.name}.</p>
                        </div>
                        <form onSubmit={handleEdit} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Nama Lengkap</label>
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Email</label>
                                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Role</label>
                                    <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-semibold">
                                        <option value="admin">Admin</option>
                                        <option value="kasir">Kasir</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">Unit Usaha</label>
                                    <select value={editForm.business_unit} onChange={(e) => setEditForm({ ...editForm, business_unit: e.target.value })}
                                        className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary font-semibold">
                                        {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1 block">No. HP</label>
                                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full bg-background border border-border rounded-venus px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-venus border border-border text-sm font-semibold text-foreground/60 hover:bg-surface transition-colors">Batal</button>
                                <button type="submit" className="px-5 py-2 rounded-venus bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ────────────────────────────────────────── */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
                    <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-6 text-center">
                            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-super-black mb-2">Hapus Karyawan?</h3>
                            <p className="text-sm text-foreground/60 mb-6">
                                Tindakan ini tidak dapat dibatalkan. Akun karyawan akan dihapus secara permanen.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button onClick={() => setShowDeleteConfirm(null)} className="px-5 py-2.5 rounded-venus border border-border text-sm font-semibold text-foreground/60 hover:bg-surface transition-colors">Batal</button>
                                <button onClick={() => handleDelete(showDeleteConfirm)} className="px-5 py-2.5 rounded-venus bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Ya, Hapus</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
