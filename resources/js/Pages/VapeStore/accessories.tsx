import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CategoryTabs from '../../Components/CategoryTabs';
import SearchBar from '../../Components/SearchBar';

// Importing images
import nitecoreImg from '../../../images/Vape Store/nitecore battery.png';
import casanImg from '../../../images/Vape Store/casan type c.png';
import cartridgeImg from '../../../images/Vape Store/cartridge.png';
import cottonImg from '../../../images/Vape Store/cotton bacon.png';
import coilImg from '../../../images/Vape Store/coil.png';
import vapebandImg from '../../../images/Vape Store/vapeband.png';

const BatteryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line><polygon points="11 6 7 12 11 12 10 18 14 12 10 12 11 6"></polygon></svg>
);

const ZapIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const FlameIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
);

export default function Accessories() {

    const products = [
        {
            id: 201,
            name: 'Nitecore Battery',
            price: 'Rp136.000',
            description: 'Baterai andal berperforma tinggi yang dirancang untuk memberikan daya stabil dan penggunaan tahan lama. Dibuat dengan mengutamakan keamanan dan efisiensi.',
            image: nitecoreImg,
            tag: 'HIGH CAPACITY',
            tagIcon: <BatteryIcon />
        },
        {
            id: 202,
            name: 'Casan Type C',
            price: 'Rp40.000',
            description: 'Pengisi daya dua slot serbaguna yang dilengkapi dengan input Type-C untuk pengisian daya yang lebih cepat dan nyaman. Dilengkapi dengan manajemen daya cerdas.',
            image: casanImg,
            tag: 'FAST CHARGING',
            tagIcon: <ZapIcon />
        },
        {
            id: 203,
            name: 'Cartridge',
            price: 'Rp40.000',
            description: 'Pod yang ringkas dan mudah digunakan, dirancang untuk menghasilkan uap yang halus dan konsisten. Ideal untuk memberikan rasa yang bersih dan desain yang ramah pengguna.',
            image: cartridgeImg,
            tag: 'LEAK PROOF',
            tagIcon: <ShieldIcon />
        },
        {
            id: 204,
            name: 'Cotton Bacon',
            price: 'Rp50.000',
            description: 'Kapas berkualitas premium yang dibuat khusus untuk vaping, menawarkan daya serap yang sangat baik dan penyampaian rasa yang bersih.',
            image: cottonImg,
            tag: 'PURE TASTE',
            tagIcon: <StarIcon />
        },
        {
            id: 205,
            name: 'Coil',
            price: 'Rp25.000',
            description: 'Dirancang untuk pemanasan dan produksi rasa yang optimal, koil ini memberikan pengalaman vaping yang seimbang.',
            image: coilImg,
            tag: 'OPTIMAL HEATING',
            tagIcon: <FlameIcon />
        },
        {
            id: 206,
            name: 'Vapeband',
            price: 'Rp2.500',
            description: 'Aksesori praktis yang melindungi tangki Anda dari benturan ringan dan menambahkan sentuhan gaya pribadi.',
            image: vapebandImg,
            tag: 'PROTECTIVE GEAR',
            tagIcon: <ShieldIcon />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Vape Store - Perlengkapan" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <p className="text-label-sm text-primary mb-4 uppercase">Vape Store</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-h1 text-super-black mb-4">
                                Redefining the Art of <span className="text-primary">Vapor</span>
                            </h1>
                            <p className="text-body-l text-foreground">
                                Discover a handpicked selection of premium devices and artisanal e-liquids designed for the discerning enthusiast.
                            </p>
                        </div>

                        <SearchBar />
                    </div>
                </div>

                {/* Categories */}
                <CategoryTabs activeCategory="accessories" />

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {products.map((product) => (
                        <div key={product.id} className="bg-card rounded-venus p-6 flex flex-col hover:shadow-lg transition-shadow border border-border">
                            <div className="bg-surface rounded-venus aspect-square mb-6 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>

                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-card-title text-super-black">{product.name}</h3>
                                <span className="text-body-m font-bold text-secondary">{product.price}</span>
                            </div>

                            <p className="text-body-reg text-foreground mb-6 flex-grow">
                                {product.description}
                            </p>

                            <Link href={`/vape-store/product/${product.id}`} className="mt-auto inline-flex items-center gap-1 text-secondary text-body-m font-bold self-start hover:text-secondary/80 hover:underline transition-all">
                                Detail
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>

            </main>
            <Footer />
        </div>
    );
}
