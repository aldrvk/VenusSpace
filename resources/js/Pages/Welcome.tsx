import Footer from '../Components/Footer';
import Hero from '../Components/HomeHero';
import HomeMain from '../Components/HomeMain';
import Navbar from '../Components/Navbar';
import { Head } from '@inertiajs/react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            <Head title="Venus Hub - Smart Management System" />
            
            {/* NAVBAR */}
            <div className='shadow-md' style={{ position: "sticky", top: "0", zIndex: "50", }}>
                <Navbar />
            </div>

            {/* HERO */}
            <Hero />

            {/* HOMEMAIN */}
            <div className='shadow-md'>
                <HomeMain />
            </div>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}