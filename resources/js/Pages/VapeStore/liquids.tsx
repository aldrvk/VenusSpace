import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';

// Importing images
import blackcurrantImg from '../../../images/Vape Store/blackcurrant tea.jpg';
import buleboluImg from '../../../images/Vape Store/blue bolu.jpeg';
import kingsImg from '../../../images/Vape Store/king\'s reserve.jpeg';
import bananaImg from '../../../images/Vape Store/banana licious.jpeg';
import sundaeImg from '../../../images/Vape Store/good sundae.png';
import englishImg from '../../../images/Vape Store/english breakfast.png';

const DropIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
);

const CloudIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"></path></svg>
);

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

export default function Liquids() {
    const categories = [
        { name: 'All Items', href: '/vape-store', active: false },
        { name: 'Devices', href: '/vape-store/devices', active: false },
        { name: 'Liquids', href: '/vape-store/liquids', active: true },
        { name: 'Accessories', href: '/vape-store/accessories', active: false }
    ];

    const products = [
        {
            id: 1,
            name: 'Blackcurrant Tea',
            price: 'Rp110.000',
            description: 'A smooth fusion of rich blackcurrant and subtle tea notes, delivering a refreshing yet slightly tangy inhale.',
            image: blackcurrantImg,
            tag: 'REFRESHING TASTE',
            tagIcon: <DropIcon />
        },
        {
            id: 2,
            name: 'Bule Bolu',
            price: 'Rp120.000',
            description: 'A delightful dessert-inspired flavor that captures the soft sweetness of classic sponge cake. Light, creamy, and satisfying.',
            image: buleboluImg,
            tag: 'CREAMY CLOUDS',
            tagIcon: <CloudIcon />
        },
        {
            id: 3,
            name: 'King\'s Reserve',
            price: 'Rp145.000',
            description: 'Crafted for a premium experience, this blend offers a bold yet refined flavor profile with deep, layered notes.',
            image: kingsImg,
            tag: 'PREMIUM BLEND',
            tagIcon: <ShieldIcon />
        },
        {
            id: 4,
            name: 'Banana Licious',
            price: 'Rp162.000',
            description: 'A creamy banana blend with a naturally sweet aroma and smooth texture on every puff. Delivers a mellow and flavorful experience.',
            image: bananaImg,
            tag: 'RICH FLAVOR',
            tagIcon: <StarIcon />
        },
        {
            id: 5,
            name: 'Good Sundae',
            price: 'Rp145.000',
            description: 'This flavor combines every sweetness with a hint of fruity topping. A fun and indulgent vape that brings dessert vibes in every inhale.',
            image: sundaeImg,
            tag: 'SWEET DESSERT',
            tagIcon: <StarIcon />
        },
        {
            id: 6,
            name: 'English Breakfast',
            price: 'Rp165.000',
            description: 'A unique take on traditional tea flavor, offering a warm, slightly bold taste with a smooth finish. Great for those who prefer more refined vaping.',
            image: englishImg,
            tag: 'CLASSIC TASTE',
            tagIcon: <DropIcon />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Vape Store - Liquids" />
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
