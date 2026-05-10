import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CategoryTabs from '../../Components/CategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductDetailButton from '../../Components/ProductDetailButton';
import ProductNotFound from '../../Components/ProductNotFound';
import Card from '../../Components/Card/Card';
import Pagination from '../../Components/Pagination';
import StoreClosedBanner from '../../Components/StoreClosedBanner';
import { useOperationalStatus } from '../../hooks/useOperationalStatus';

const FlameIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
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

interface PaginatedData {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    products: PaginatedData;
    filters?: { search?: string };
}

export default function Accessories({ products, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const { isOpen, message } = useOperationalStatus('Vape Store');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/vape-store/accessories', { search: searchTerm }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Vape Store - Perlengkapan" />
            <Navbar />
            
            {!isOpen && <StoreClosedBanner message={message} />}

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

                        <form onSubmit={handleSearch}>
                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                </div>

                {/* Categories */}
                <CategoryTabs activeCategory="accessories" />

                {/* Product Grid */}
                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.data.map((product) => (
                                <Card 
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={`Rp${product.price.toLocaleString('id-ID')}`}
                                    description={product.description}
                                    image={product.image}
                                    href={`/vape-store/product/${product.id}`}
                                />
                            ))}
                        </div>
                        <Pagination links={products.links} />
                    </>
                ) : (
                    <ProductNotFound searchTerm={searchTerm} onClear={() => {
                        setSearchTerm('');
                        router.get('/vape-store/accessories');
                    }} />
                )}

            </main>
            <Footer />
        </div>
    );
}
