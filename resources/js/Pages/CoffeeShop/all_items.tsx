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

const FoodIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 6v6l4 2"></path></svg>
);


export default function AllItems() {
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        {
            id: 301,
            name: 'Caramel Macchiato',
            price: 'Rp45.000',
            description: 'Perpaduan sempurna antara espresso kuat, susu murni yang di-steam, dan sirup karamel manis yang lembut.',
            image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop',
            tag: 'BEST SELLER',
            tagIcon: <StarIcon />
        },
        {
            id: 302,
            name: 'V60 Pour Over',
            price: 'Rp35.000',
            description: 'Kopi hitam manual brew menggunakan biji kopi pilihan dengan metode V60 untuk mengeluarkan aroma dan rasa yang bersih dan tajam.',
            image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop',
            tag: 'PREMIUM BEANS',
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
        },
        {
            id: 401,
            name: 'Croissant Butter',
            price: 'Rp25.000',
            description: 'Croissant klasik dengan tekstur renyah di luar dan lembut di dalam, dibuat dengan mentega premium.',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
            tag: 'FRESH BAKED',
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
        },
        {
            id: 501,
            name: 'French Fries',
            price: 'Rp30.000',
            description: 'Kentang goreng renyah yang dibumbui dengan garam dan herbs pilihan, cocok untuk teman nongkrong.',
            image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop',
            tag: 'SNACK',
            tagIcon: <FoodIcon />
        }
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Head title="Coffee Shop - Semua Menu" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <p className="text-label-sm text-primary mb-4 uppercase">Coffee Shop</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-h1 text-super-black mb-4">
                                Crafted for <span className="text-primary">Perfection</span>
                            </h1>
                            <p className="text-body-l text-foreground">
                                Temukan racikan kopi terbaik, minuman segar, dan hidangan pendamping yang dibuat sepenuh hati.
                            </p>
                        </div>

                        <SearchBar 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    {new Date().getHours() < 8 || new Date().getHours() >= 22 ? (
                        <div className="mt-6 flex items-center gap-2 bg-surface border border-border rounded-venus px-4 py-3">
                            <svg className="w-5 h-5 text-foreground/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-body-reg text-foreground/60">
                                <strong className="text-super-black">Coffee Shop saat ini tutup.</strong> Jam operasional: 08:00 - 22:00 WIB. Anda masih bisa melihat menu, tapi tidak dapat melakukan pemesanan.
                            </p>
                        </div>
                    ) : null}
                </div>

                {/* Categories */}
                <CoffeeCategoryTabs activeCategory="all" />

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
