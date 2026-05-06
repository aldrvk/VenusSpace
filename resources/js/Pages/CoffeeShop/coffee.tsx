import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CoffeeShopCategoryTabs from '../../Components/CoffeeShopCategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductDetailButton from '../../Components/ProductDetailButton';

// Importing images (using Vape Store images as placeholders)
import img1 from '../../../images/Vape Store/apex titanium.jpg';
import img2 from '../../../images/Vape Store/nano pod s ii.jpg';
import img3 from '../../../images/Vape Store/drag q pod kit.png';
import img4 from '../../../images/Vape Store/voopoo argus.jpg';
import img5 from '../../../images/Vape Store/thelema aura s.jpg';
import img6 from '../../../images/Vape Store/oxva xlim go 2.jpg';

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const DropIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
);

const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);

const FlameIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
);

export default function Coffee() {

    const products = [
        {
            id: 1,
            name: 'Espresso Classico',
            price: 'Rp28.000',
            description: 'Espresso murni yang diseduh dari biji kopi Arabica pilihan, menghasilkan rasa yang kuat dan aroma yang khas dengan crema yang sempurna.',
            image: img1,
            tag: 'BEST SELLER',
            tagIcon: <StarIcon />
        },
        {
            id: 2,
            name: 'Cappuccino',
            price: 'Rp32.000',
            description: 'Kombinasi sempurna espresso, steamed milk, dan foam susu yang lembut, disajikan dengan taburan bubuk cokelat di atasnya.',
            image: img2,
            tag: 'PREMIUM BLEND',
            tagIcon: <ShieldIcon />
        },
        {
            id: 3,
            name: 'Café Latte',
            price: 'Rp30.000',
            description: 'Espresso yang dipadukan dengan steamed milk berlimpah, menciptakan minuman yang halus dan creamy dengan sentuhan kopi yang pas.',
            image: img3,
            tag: 'SMOOTH TASTE',
            tagIcon: <DropIcon />
        },
        {
            id: 4,
            name: 'Americano',
            price: 'Rp25.000',
            description: 'Espresso yang dilarutkan dengan air panas, menghasilkan kopi hitam yang bersih dan kaya rasa tanpa kehilangan karakter kopi aslinya.',
            image: img4,
            tag: 'CLASSIC BREW',
            tagIcon: <FlameIcon />
        },
        {
            id: 5,
            name: 'Mocha Latte',
            price: 'Rp35.000',
            description: 'Perpaduan harmonis espresso, cokelat premium, dan susu segar yang menciptakan minuman kopi dengan sentuhan manis yang memikat.',
            image: img5,
            tag: 'RICH FLAVOR',
            tagIcon: <StarIcon />
        },
        {
            id: 6,
            name: 'Caramel Macchiato',
            price: 'Rp38.000',
            description: 'Espresso yang dihiasi dengan susu berbusa dan siraman saus karamel premium, menghadirkan kombinasi manis dan pahit yang sempurna.',
            image: img6,
            tag: 'SWEET & BOLD',
            tagIcon: <FlameIcon />
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Head title="Coffee Shop - Coffee" />
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
                <CoffeeShopCategoryTabs activeCategory="coffee" />

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
