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

const FoodIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 6v6l4 2"></path></svg>
);


export default function Foods() {
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        {
            id: 401,
            name: 'Croissant Butter',
            price: 'Rp25.000',
            description: 'Croissant klasik dengan tekstur renyah di luar dan lembut di dalam, dibuat dengan mentega premium.',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
            tag: 'BARU DIPANGGANG',
            tagIcon: <FoodIcon />
        },
        {
            id: 402,
            name: 'Beef Sandwich',
            price: 'Rp55.000',
            description: 'Sandwich daging sapi pilihan dengan sayuran segar dan saus spesial, disajikan dengan roti yang dipanggang sempurna.',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop',
            tag: 'HEARTY MEAL',
            tagIcon: <StarIcon />
        }
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Head title="Coffee Shop - Makanan" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <p className="text-label-sm text-primary mb-4 uppercase">Coffee Shop</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-h1 text-super-black mb-4">
                                Hidangan <span className="text-primary">Lezat</span>
                            </h1>
                            <p className="text-body-l text-foreground">
                                Santap hidangan lezat dan bernutrisi tinggi yang disiapkan fresh setiap hari dari dapur kami.
                            </p>
                        </div>

                        <SearchBar 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Categories */}
                <CoffeeCategoryTabs activeCategory="foods" />

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
