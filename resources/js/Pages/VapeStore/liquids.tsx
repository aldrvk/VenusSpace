import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CategoryTabs from '../../Components/CategoryTabs';
import SearchBar from '../../Components/SearchBar';

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

    const products = [
        {
            id: 101,
            name: 'Blackcurrant Tea',
            price: 'Rp110.000',
            description: 'A smooth fusion of rich blackcurrant and subtle tea notes, delivering a refreshing yet slightly tangy inhale.',
            image: blackcurrantImg,
            tag: 'REFRESHING TASTE',
            tagIcon: <DropIcon />
        },
        {
            id: 102,
            name: 'Bule Bolu',
            price: 'Rp120.000',
            description: 'A delightful dessert-inspired flavor that captures the soft sweetness of classic sponge cake. Light, creamy, and satisfying.',
            image: buleboluImg,
            tag: 'CREAMY CLOUDS',
            tagIcon: <CloudIcon />
        },
        {
            id: 103,
            name: 'King\'s Reserve',
            price: 'Rp145.000',
            description: 'Crafted for a premium experience, this blend offers a bold yet refined flavor profile with deep, layered notes.',
            image: kingsImg,
            tag: 'PREMIUM BLEND',
            tagIcon: <ShieldIcon />
        },
        {
            id: 104,
            name: 'Banana Licious',
            price: 'Rp162.000',
            description: 'A creamy banana blend with a naturally sweet aroma and smooth texture on every puff. Delivers a mellow and flavorful experience.',
            image: bananaImg,
            tag: 'RICH FLAVOR',
            tagIcon: <StarIcon />
        },
        {
            id: 105,
            name: 'Good Sundae',
            price: 'Rp145.000',
            description: 'This flavor combines every sweetness with a hint of fruity topping. A fun and indulgent vape that brings dessert vibes in every inhale.',
            image: sundaeImg,
            tag: 'SWEET DESSERT',
            tagIcon: <StarIcon />
        },
        {
            id: 106,
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

                        <SearchBar />
                    </div>
                </div>

                {/* Categories */}
                <CategoryTabs activeCategory="liquids" />

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
