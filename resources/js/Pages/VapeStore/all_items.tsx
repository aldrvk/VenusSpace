import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CategoryTabs from '../../Components/CategoryTabs';
import SearchBar from '../../Components/SearchBar';
import ProductDetailButton from '../../Components/ProductDetailButton';
import ProductNotFound from '../../Components/ProductNotFound';

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

export default function AllItems() {
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        {
            id: 7,
            name: 'XMax V3 Pro',
            price: 'Rp260.000',
            description: 'Vaporizer konveksi ini memiliki waktu pemanasan yang cepat dan layar OLED yang jernih yang menampilkan suhu dan pemantauan baterai.',
            image: xmaxImg,
            tag: 'HIGH QUALITY',
            tagIcon: <StarIcon />
        },
        {
            id: 107,
            name: 'Arctic Menthol',
            price: 'Rp100.000',
            description: 'Cairan vape yang menyegarkan, dirancang untuk menghasilkan uap yang halus dan konsisten, menghadirkan sensasi menthol yang segar dengan intensitas rasa yang seimbang.',
            image: arcticImg,
            tag: 'REFRESHING TASTE',
            tagIcon: <DropIcon />
        },
        {
            id: 108,
            name: 'Blueberry Ice',
            price: 'Rp100.000',
            description: 'Perpaduan rasa yang lezat, menggabungkan aroma blueberry manis dengan sensasi dingin di akhir, dirancang untuk memberikan sensasi lembut di tenggorokan dengan uap yang memuaskan.',
            image: blueberryImg,
            tag: 'SWEET FLAVOR',
            tagIcon: <StarIcon />
        },
        {
            id: 201,
            name: 'Nitecore Battery',
            price: 'Rp136.000',
            description: 'Baterai andal berperforma tinggi yang dirancang untuk memberikan daya stabil dan penggunaan tahan lama. Dibuat dengan mengutamakan keamanan dan efisiensi.',
            image: nitecoreImg,
            tag: 'HIGH CAPACITY',
            tagIcon: <BatteryIcon />
        },
        {
            id: 1,
            name: 'Apex Titanium',
            price: 'Rp400.000',
            description: 'Sasis titanium kelas kedirgantaraan dengan Omni-Chip 4.0 revolusioner untuk presisi yang tak tertandingi.',
            image: apexImg,
            tag: 'PREMIUM BUILD',
            tagIcon: <ShieldIcon />
        },
        {
            id: 2,
            name: 'Nano Pod S II',
            price: 'Rp350.000',
            description: 'Puncak dari teknologi penguapan kompak, menawarkan daya tahan baterai 12 jam dalam bentuk yang seukuran saku dengan sistem pengisian atas yang anti bocor.',
            image: nanoImg,
            tag: 'PORTABLE POWER',
            tagIcon: <BatteryIcon />
        }
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Head title="Vape Store - Terlaris" />
            <Navbar />

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
                                Temukan pilihan perangkat premium dan e-liquid buatan tangan yang dirancang khusus untuk para penggemar yang cerdas.
                            </p>
                        </div>

                        <SearchBar 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Categories */}
                <CategoryTabs activeCategory="all" />

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        {filteredProducts.map((product) => (
                            <Link href={`/vape-store/product/${product.id}`} key={product.id} className="bg-card rounded-venus p-6 flex flex-col hover:shadow-lg transition-shadow border border-border cursor-pointer">
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

                                <ProductDetailButton href={`/vape-store/product/${product.id}`} />
                            </Link>
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
