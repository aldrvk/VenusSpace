import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CoffeeShopCategoryTabs from '../../Components/CoffeeShopCategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductDetailButton from '../../Components/ProductDetailButton';

// Importing images (using Vape Store images as placeholders)
import img1 from '../../../images/Vape Store/nitecore battery.png';
import img2 from '../../../images/Vape Store/casan type c.png';
import img3 from '../../../images/Vape Store/cartridge.png';
import img4 from '../../../images/Vape Store/cotton bacon.png';
import img5 from '../../../images/Vape Store/coil.png';
import img6 from '../../../images/Vape Store/vapeband.png';

const FlameIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
);

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

const DropIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
);

export default function Snacks() {

    const products = [
        {
            id: 201,
            name: 'Croissant Butter',
            price: 'Rp25.000',
            description: 'Croissant renyah berlapis-lapis yang dipanggang sempurna dengan butter premium Prancis, menghasilkan tekstur yang flaky dan rasa yang gurih.',
            image: img1,
            tag: 'FRESHLY BAKED',
            tagIcon: <FlameIcon />
        },
        {
            id: 202,
            name: 'Banana Bread',
            price: 'Rp22.000',
            description: 'Roti pisang homemade yang lembut dan moist, dibuat dengan pisang matang pilihan dan sentuhan kayu manis yang hangat.',
            image: img2,
            tag: 'HOMEMADE',
            tagIcon: <StarIcon />
        },
        {
            id: 203,
            name: 'Cheese Cake',
            price: 'Rp35.000',
            description: 'Cheese cake lembut dengan base biskuit renyah dan topping cream cheese yang kaya rasa, dipanggang dengan suhu rendah untuk tekstur yang sempurna.',
            image: img3,
            tag: 'PREMIUM QUALITY',
            tagIcon: <ShieldIcon />
        },
        {
            id: 204,
            name: 'French Fries',
            price: 'Rp20.000',
            description: 'Kentang goreng renyah yang dipotong tipis dan digoreng sempurna, disajikan dengan saus pilihan Anda. Teman sempurna untuk setiap minuman.',
            image: img4,
            tag: 'CRISPY FRESH',
            tagIcon: <FlameIcon />
        },
        {
            id: 205,
            name: 'Chicken Wings',
            price: 'Rp30.000',
            description: 'Sayap ayam yang dimarinasi dengan bumbu rahasia dan digoreng hingga renyah, disajikan dengan saus BBQ atau saus pedas pilihan.',
            image: img5,
            tag: 'SPICY HOT',
            tagIcon: <FlameIcon />
        },
        {
            id: 206,
            name: 'Brownies',
            price: 'Rp28.000',
            description: 'Brownies cokelat yang fudgy dan kaya rasa, dibuat dari cokelat premium dengan topping kacang almond panggang.',
            image: img6,
            tag: 'SWEET TREAT',
            tagIcon: <StarIcon />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Coffee Shop - Snacks" />
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
                <CoffeeShopCategoryTabs activeCategory="snacks" />

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
