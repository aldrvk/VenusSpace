import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';

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
    const categories = [
        { name: 'All Items', href: '/vape-store', active: false },
        { name: 'Devices', href: '/vape-store/devices', active: false },
        { name: 'Liquids', href: '/vape-store/liquids', active: false },
        { name: 'Accessories', href: '/vape-store/accessories', active: true }
    ];

    const products = [
        {
            id: 1,
            name: 'Nitecore Battery',
            price: 'Rp136.000',
            description: 'A reliable high-performance battery designed to deliver stable power and long-lasting usage. Built with safety and efficiency in mind.',
            image: nitecoreImg,
            tag: 'HIGH CAPACITY',
            tagIcon: <BatteryIcon />
        },
        {
            id: 2,
            name: 'Casan Type C',
            price: 'Rp40.000',
            description: 'A versatile dual-slot charger equipped with Type-C input for faster and more convenient charging. Features smart power management.',
            image: casanImg,
            tag: 'FAST CHARGING',
            tagIcon: <ZapIcon />
        },
        {
            id: 3,
            name: 'Cartridge',
            price: 'Rp40.000',
            description: 'A compact and easy-to-use pod designed for smooth and consistent vapor production. Ideal for delivering clean flavor and user-friendly design.',
            image: cartridgeImg,
            tag: 'LEAK PROOF',
            tagIcon: <ShieldIcon />
        },
        {
            id: 4,
            name: 'Cotton Bacon',
            price: 'Rp50.000',
            description: 'Premium quality cotton specially made for vaping, offering excellent absorption and clean flavor delivery.',
            image: cottonImg,
            tag: 'PURE TASTE',
            tagIcon: <StarIcon />
        },
        {
            id: 5,
            name: 'Coil',
            price: 'Rp25.000',
            description: 'Engineered for optimal heating and flavor production, this coil provides a balanced vaping experience.',
            image: coilImg,
            tag: 'OPTIMAL HEATING',
            tagIcon: <FlameIcon />
        },
        {
            id: 6,
            name: 'Vapeband',
            price: 'Rp2.500',
            description: 'A practical accessory that protects your tank from minor impact and adds a touch of personal style.',
            image: vapebandImg,
            tag: 'PROTECTIVE GEAR',
            tagIcon: <ShieldIcon />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Vape Store - Accessories" />
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
                        
                        <div className="w-full md:w-80 relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-foreground opacity-50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search product" 
                                className="w-full bg-surface border border-border rounded-venus py-3 pl-12 pr-4 text-body-reg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    {categories.map((category) => (
                        <Link 
                            key={category.name}
                            href={category.href}
                            className={`px-6 py-2 rounded-full text-btn transition-colors border border-border ${
                                category.active 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-surface text-foreground hover:bg-card'
                            }`}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

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
                                <span className="text-body-m text-primary">{product.price}</span>
                            </div>
                            
                            <p className="text-body-reg text-foreground mb-6 flex-grow">
                                {product.description}
                            </p>
                            
                            <div className="flex items-center gap-2 text-primary mt-auto">
                                {product.tagIcon}
                                <span className="text-label-sm uppercase">{product.tag}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Section Placeholder */}
                <footer className="border-t border-border pt-16 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1">
                            <h3 className="text-h4 text-super-black mb-4">Venus</h3>
                            <p className="text-body-reg text-foreground mb-4">
                                The ultimate curation of lifestyle services for the modern professional.
                            </p>
                            <p className="text-label-sm text-foreground opacity-50 uppercase">© 2024 Venus Curator. All rights reserved.</p>
                        </div>
                        
                        <div>
                            <h4 className="text-label-sm text-primary mb-6 uppercase">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-body-reg text-foreground hover:text-primary">Privacy Policy</Link></li>
                                <li><Link href="#" className="text-body-reg text-foreground hover:text-primary">Terms of Service</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-label-sm text-primary mb-6 uppercase">Support</h4>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-body-reg text-foreground hover:text-primary">Contact Us</Link></li>
                                <li><Link href="#" className="text-body-reg text-foreground hover:text-primary">Location</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-label-sm text-primary mb-6 uppercase">Join the Newsletter</h4>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    className="bg-surface border border-border rounded-venus py-3 px-4 text-body-reg text-foreground flex-grow focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button className="bg-primary text-primary-foreground p-3 rounded-venus flex-shrink-0 hover:opacity-90 transition-opacity">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
