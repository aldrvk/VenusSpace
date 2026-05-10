import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CoffeeCategoryTabs from '../../Components/CoffeeCategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductNotFound from '../../Components/ProductNotFound';
import Card from '../../Components/Card/Card';

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const CupIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
);

const BeanIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.66 0 3.14-.68 4.22-1.78l-8.44-8.44C8.86 6.68 10.34 6 12 6z"></path></svg>
);


export default function Drinks() {
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        {
            id: 301,
            name: 'Caramel Macchiato',
            price: 'Rp45.000',
            description: 'Perpaduan sempurna antara espresso kuat, susu murni yang di-steam, dan sirup karamel manis yang lembut.',
            image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop',
            tag: 'TERLARIS',
            tagIcon: <StarIcon />
        },
        {
            id: 302,
            name: 'V60 Pour Over',
            price: 'Rp35.000',
            description: 'Kopi hitam manual brew menggunakan biji kopi pilihan dengan metode V60 untuk mengeluarkan aroma dan rasa yang bersih dan tajam.',
            image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop',
            tag: 'BIJI KOPI PREMIUM',
            tagIcon: <BeanIcon />
        },
        {
            id: 303,
            name: 'Matcha Latte',
            price: 'Rp40.000',
            description: 'Bubuk matcha premium dari Jepang dipadukan dengan susu segar, menghasilkan tekstur creamy dan rasa manis yang seimbang.',
            image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?q=80&w=600&auto=format&fit=crop',
            tag: 'FAVORITE',
            tagIcon: <CupIcon />
        }
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Head title="Coffee Shop - Minuman" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <p className="text-label-sm text-primary mb-4 uppercase">Coffee Shop</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-h1 text-super-black mb-4">
                                Minuman <span className="text-primary">Menyegarkan</span>
                            </h1>
                            <p className="text-body-l text-foreground">
                                Pilih minuman kesukaanmu, mulai dari kopi racikan artisan hingga non-coffee yang menyegarkan.
                            </p>
                        </div>

                        <SearchBar 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Categories */}
                <CoffeeCategoryTabs activeCategory="drinks" />

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        {filteredProducts.map((product) => (
                            <Card 
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                description={product.description}
                                image={product.image}
                                href={`/coffee-shop/product/${product.id}`}
                            />
                        ))}
                    </div>
                ) : (
                    <ProductNotFound searchTerm={searchTerm} onClear={() => setSearchTerm('')} />
                )}

            </main>
            <Footer />
        </div>
    );
}
