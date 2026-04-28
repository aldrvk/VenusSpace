import { useState } from 'react';
import Navbar from '../Components/Navbar';
import { Head } from '@inertiajs/react';

import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';

type AuthModalType = 'login' | 'register' | 'forgot-password' | null;

export default function LandingPage() {
    const [authModal, setAuthModal] = useState<AuthModalType>(null);

    return (
        <div className="min-h-screen bg-background relative">
            <Head title="Venus Hub - Smart Management System" />
            
            <Navbar onOpenAuthModal={(type) => setAuthModal(type)} />

            {/* HERO SECTION */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-6">
                    <span className="text-label-sm text-secondary bg-secondary/10 px-4 py-2 rounded-full">
                        Sistem Manajemen Terintegrasi
                    </span>
                    <h1 className="text-h1 max-w-4xl mx-auto">
                        Kelola Unit Bisnis Jadi Lebih <span className="text-primary">Efisien</span>
                    </h1>
                    <p className="text-body-l max-w-2xl mx-auto text-foreground/70">
                        Pantau operasional Doorsmeer, Laundry, dan unit lainnya dalam satu dashboard yang presisi.
                    </p>
                    
                    <div className="pt-10">
                        <img 
                            src="/images/dashboard-preview.png" 
                            alt="Venus Hub Preview" 
                            className="rounded-venus border border-border shadow-2xl"
                        />
                    </div>
                </div>
            </main>

            {/* Auth Modals */}
            <Login 
                isOpen={authModal === 'login'} 
                onClose={() => setAuthModal(null)} 
                onSwitch={(type) => setAuthModal(type)} 
            />
            <Register 
                isOpen={authModal === 'register'} 
                onClose={() => setAuthModal(null)} 
                onSwitch={(type) => setAuthModal(type)} 
            />
            <ForgotPassword 
                isOpen={authModal === 'forgot-password'} 
                onClose={() => setAuthModal(null)} 
                onSwitch={(type) => setAuthModal(type)} 
            />
        </div>
    );
}