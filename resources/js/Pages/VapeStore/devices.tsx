import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CategoryTabs from '../../Components/CategoryTabs';
import SearchBar from '../../Components/SearchBar';

// Importing images
import apexImg from '../../../images/Vape Store/apex titanium.jpg';
import nanoImg from '../../../images/Vape Store/nano pod s ii.jpg';
import dragImg from '../../../images/Vape Store/drag q pod kit.png';
import argusImg from '../../../images/Vape Store/voopoo argus.jpg';
import thelemaImg from '../../../images/Vape Store/thelema aura s.jpg';
import oxvaImg from '../../../images/Vape Store/oxva xlim go 2.jpg';

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const BatteryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line><polygon points="11 6 7 12 11 12 10 18 14 12 10 12 11 6"></polygon></svg>
);

const ChipIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
);

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

export default function Devices() {

    const products = [
        {
            id: 1,
            name: 'Apex Titanium',
            price: 'Rp400.000',
            description: 'Aerospace-grade titanium chassis with the revolutionary Omni-Chip 4.0 for unmatched precision.',
            image: apexImg,
            tag: 'PREMIUM BUILD',
            tagIcon: <ShieldIcon />
        },
        {
            id: 2,
            name: 'Nano Pod S II',
            price: 'Rp350.000',
            description: 'The pinnacle of compact vaporization technology, offering a 12-hour battery life in a pocket-sized form factor with a leak-proof top-fill system.',
            image: nanoImg,
            tag: 'PORTABLE POWER',
            tagIcon: <BatteryIcon />
        },
        {
            id: 3,
            name: 'Drag Q Pod Kit',
            price: 'Rp350.000',
            description: 'A versatile starter kit that balances aesthetic design with professional performance. Includes an adjustable airflow ring and a tactile leather grip.',
            image: dragImg,
            tag: 'TECH SPECS',
            tagIcon: <ChipIcon />
        },
        {
            id: 4,
            name: 'VOOPOO Argus',
            price: 'Rp400.000',
            description: 'Equipped with innovative honeycomb mesh coils that ensure a wider heating surface for rich and dense vapor production.',
            image: argusImg,
            tag: 'PREMIUM GRADE',
            tagIcon: <ShieldIcon />
        },
        {
            id: 5,
            name: 'Thelema Aura S',
            price: 'Rp200.000',
            description: 'This high-performance pod system features an advanced chipset that ensures rapid firing and a consistent, rich flavor profile in every single puff.',
            image: thelemaImg,
            tag: 'HIGH QUALITY',
            tagIcon: <StarIcon />
        },
        {
            id: 6,
            name: 'Oxva Xlim Go 2',
            price: 'Rp180.000',
            description: 'This versatile device supports a wide range of resistance levels, making it the perfect choice for both flavor seekers and cloud enthusiast.',
            image: oxvaImg,
            tag: 'ADVANCED CHIP',
            tagIcon: <ChipIcon />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Vape Store - Devices" />
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
                <CategoryTabs activeCategory="devices" />

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

            </main>
            <Footer />
        </div>
    );
}
