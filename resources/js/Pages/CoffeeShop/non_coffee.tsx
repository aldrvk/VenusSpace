import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CoffeeShopCategoryTabs from '../../Components/CoffeeShopCategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductDetailButton from '../../Components/ProductDetailButton';

// Importing images (using Vape Store images as placeholders)
import img1 from '../../../images/Vape Store/arctic menthol.jpg';
import img2 from '../../../images/Vape Store/blueberry ice.jpg';
import img3 from '../../../images/Vape Store/blackcurrant tea.jpg';
import img4 from '../../../images/Vape Store/blue bolu.jpeg';
import img5 from '../../../images/Vape Store/english breakfast.png';
import img6 from '../../../images/Vape Store/good sundae.png';

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const DropIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
);

const CloudIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"></path></svg>
);

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

export default function NonCoffee() {

    const products = [
        {
            id: 101,
            name: 'Matcha Latte',
            price: 'Rp35.000',
            description: 'Perpaduan teh hijau matcha premium dengan susu segar yang dikocok halus, menghasilkan minuman yang creamy dan menyegarkan dengan sentuhan manis alami.',
            image: img1,
            tag: 'REFRESHING',
            tagIcon: <DropIcon />
        },
        {
            id: 102,
            name: 'Iced Chocolate',
            price: 'Rp32.000',
            description: 'Cokelat premium yang dicampur dengan susu dingin dan es, menciptakan minuman yang kaya rasa dan menyegarkan, sempurna untuk menemani hari yang panas.',
            image: img2,
            tag: 'SWEET FLAVOR',
            tagIcon: <StarIcon />
        },
        {
            id: 103,
            name: 'Thai Tea',
            price: 'Rp30.000',
            description: 'Teh Thailand otentik dengan campuran susu kental manis dan rempah-rempah khas, menawarkan rasa yang creamy, manis, dan aromatik.',
            image: img3,
            tag: 'EXOTIC BLEND',
            tagIcon: <ShieldIcon />
        },
        {
            id: 104,
            name: 'Taro Milk',
            price: 'Rp33.000',
            description: 'Minuman susu taro yang lembut dan creamy dengan warna ungu yang menarik, menawarkan rasa manis alami dari umbi taro pilihan.',
            image: img4,
            tag: 'CREAMY SMOOTH',
            tagIcon: <CloudIcon />
        },
        {
            id: 105,
            name: 'Lemon Tea',
            price: 'Rp25.000',
            description: 'Teh segar yang dipadu dengan perasan lemon alami, menghasilkan minuman yang menyegarkan dan kaya vitamin C untuk menemani aktivitas Anda.',
            image: img5,
            tag: 'CLASSIC TASTE',
            tagIcon: <DropIcon />
        },
        {
            id: 106,
            name: 'Strawberry Smoothie',
            price: 'Rp38.000',
            description: 'Smoothie strawberry segar yang diblender dengan yogurt dan madu alami, menghasilkan minuman yang sehat, creamy, dan menyegarkan.',
            image: img6,
            tag: 'FRUITY FRESH',
            tagIcon: <StarIcon />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Coffee Shop - Non-Coffee" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <p className="text-label-sm text-primary mb-4 uppercase">Coffee Shop</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-h1 text-super-black mb-4">
                                Crafted with Passion, Served with <span className="text-primary">Love</span>
                            </h1>
                            <p className="text-body-l text-foreground">
                                Temukan pilihan kopi premium dan minuman artisan yang dirancang khusus untuk para pecinta kopi sejati.
                            </p>
                        </div>

                        <SearchBar />
                    </div>
                </div>

                {/* Categories */}
                <CoffeeShopCategoryTabs activeCategory="non-coffee" />

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

                            <ProductDetailButton href={`/coffee-shop/product/${product.id}`} />
                        </div>
                    ))}
                </div>

            </main>
            <Footer />
        </div>
    );
}
