import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CategoryTabs from '../../Components/CategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductDetailButton from '../../Components/ProductDetailButton';
import ProductNotFound from '../../Components/ProductNotFound';
import Card from '../../Components/Card/Card';

// Importing images
import xmaxImg from '../../../images/Vape Store/xmax v3 pro.jpg';
import arcticImg from '../../../images/Vape Store/arctic menthol.jpg';
import blueberryImg from '../../../images/Vape Store/blueberry ice.jpg';
import nitecoreImg from '../../../images/Vape Store/nitecore battery.png';
import apexImg from '../../../images/Vape Store/apex titanium.jpg';
import nanoImg from '../../../images/Vape Store/nano pod s ii.jpg';

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const DropIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
);

const BatteryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line><polygon points="11 6 7 12 11 12 10 18 14 12 10 12 11 6"></polygon></svg>
);

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

const iconMap: Record<string, React.ReactNode> = {
    'StarIcon': <StarIcon />,
    'DropIcon': <DropIcon />,
    'BatteryIcon': <BatteryIcon />,
    'ShieldIcon': <ShieldIcon />,
};

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

export default function AllItems({ products }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Head title="Vape Store - Semua Produk" />
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
                                Temukan pilihan perangkat premium dan e-liquid buatan tangan yang dirancang khusus untuk para penggemar yang cerdas.
                            </p>
                        </div>

                        <SearchBar 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    {new Date().getHours() < 8 || new Date().getHours() >= 23 ? (
                        <div className="mt-6 flex items-center gap-2 bg-surface border border-border rounded-venus px-4 py-3">
                            <svg className="w-5 h-5 text-foreground/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-body-reg text-foreground/60">
                                <strong className="text-super-black">Vape Store saat ini tutup.</strong> Jam operasional: 08:00 - 23:00 WIB. Anda masih bisa melihat produk, tapi tidak dapat melakukan pemesanan.
                            </p>
                        </div>
                    ) : null}
                </div>

                {/* Categories */}
                <CategoryTabs activeCategory="all" />

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
