import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';

// Mendefinisikan tipe data untuk props
interface AuthenticatedLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AuthenticatedLayout({ children, title = 'Venus Hub' }: AuthenticatedLayoutProps) {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Tempat Komponen NavBar buatanmu nanti */}
            <nav className="bg-card border-b border-border h-16 flex items-center px-6 sticky top-0 z-50">
                <h1 className="font-heading font-bold text-primary">Venus Hub</h1>
            </nav>

            {/* Wrapper utama untuk konten halaman */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}