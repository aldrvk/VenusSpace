import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CategoryTabs from '../../Components/CategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductDetailButton from '../../Components/ProductDetailButton';
import ProductNotFound from '../../Components/ProductNotFound';
import Card from '../../Components/Card/Card';

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: string;
    description: string;
    image: string;
    tag: string;
    tag_icon: string;
}

interface Props {
    products: Product[];
}

export default function Devices({ products }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                Mendefinisikan Ulang Seni <span className="text-primary">Vapor</span>
                            </h1>
                            <p className="text-body-l text-foreground">
                                Temukan pilihan perangkat premium dan cairan buatan tangan yang dirancang khusus untuk para penggemar yang cerdas.
                            </p>
                        </div>

                        <SearchBar 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Categories */}
                <CategoryTabs activeCategory="devices" />

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        {filteredProducts.map((product) => (
                            <Card 
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={`Rp${product.price.toLocaleString('id-ID')}`}
                                description={product.description}
                                image={product.image}
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
