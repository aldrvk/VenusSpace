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
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        {
            id: 101,
            name: 'Blackcurrant Tea',
            price: 'Rp110.000',
            description: 'Perpaduan halus antara blackcurrant kaya dan sentuhan teh, memberikan sensasi menyegarkan namun sedikit asam.',
            image: blackcurrantImg,
            tag: 'RASA MENYEGARKAN',
            tagIcon: <DropIcon />
        },
        {
            id: 102,
            name: 'Bule Bolu',
            price: 'Rp120.000',
            description: 'Rasa yang terinspirasi makanan penutup yang lezat, menangkap kemanisan lembut kue spons klasik. Ringan, creamy, dan memuaskan.',
            image: buleboluImg,
            tag: 'AWAN CREAMY',
            tagIcon: <CloudIcon />
        },
        {
            id: 103,
            name: 'King\'s Reserve',
            price: 'Rp145.000',
            description: 'Dibuat untuk pengalaman premium, campuran ini menawarkan profil rasa yang berani namun halus dengan lapisan rasa yang mendalam.',
            image: kingsImg,
            tag: 'CAMPURAN PREMIUM',
            tagIcon: <ShieldIcon />
        },
        {
            id: 104,
            name: 'Banana Licious',
            price: 'Rp162.000',
            description: 'Campuran pisang creamy dengan aroma manis alami dan tekstur halus di setiap hisapan. Memberikan pengalaman yang lembut dan penuh rasa.',
            image: bananaImg,
            tag: 'RASA KAYA',
            tagIcon: <StarIcon />
        },
        {
            id: 105,
            name: 'Good Sundae',
            price: 'Rp145.000',
            description: 'Rasa ini menggabungkan setiap kemanisan dengan sentuhan topping buah. Vape yang menyenangkan dan memanjakan yang membawa nuansa hidangan penutup di setiap hisapan.',
            image: sundaeImg,
            tag: 'DESSERT MANIS',
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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <CategoryTabs activeCategory="liquids" />

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
