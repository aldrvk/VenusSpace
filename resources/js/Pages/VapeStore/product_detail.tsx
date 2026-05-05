import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

// Images - Devices
import nanoImg from '../../../images/Vape Store/nano pod s ii.jpg';
import earthyNano from '../../../images/Vape Store/earthy nano pod s ii.png';
import goldNano from '../../../images/Vape Store/gold nano pod s ii.png';
import apexImg from '../../../images/Vape Store/apex titanium.jpg';
import dragImg from '../../../images/Vape Store/drag q pod kit.png';
import argusImg from '../../../images/Vape Store/voopoo argus.jpg';
import thelemaImg from '../../../images/Vape Store/thelema aura s.jpg';
import oxvaImg from '../../../images/Vape Store/oxva xlim go 2.jpg';
import xmaxImg from '../../../images/Vape Store/xmax v3 pro.jpg';

// Liquids
import arcticImg from '../../../images/Vape Store/arctic menthol.jpg';
import blueberryImg from '../../../images/Vape Store/blueberry ice.jpg';
import blackcurrantImg from '../../../images/Vape Store/blackcurrant tea.jpg';
import buleboluImg from '../../../images/Vape Store/blue bolu.jpeg';
import kingsImg from '../../../images/Vape Store/king\'s reserve.jpeg';
import bananaImg from '../../../images/Vape Store/banana licious.jpeg';
import sundaeImg from '../../../images/Vape Store/good sundae.png';
import englishImg from '../../../images/Vape Store/english breakfast.png';

// Accessories
import nitecoreImg from '../../../images/Vape Store/nitecore battery.png';
import casanImg from '../../../images/Vape Store/casan type c.png';
import cartridgeImg from '../../../images/Vape Store/cartridge.png';
import cottonImg from '../../../images/Vape Store/cotton bacon.png';
import coilImg from '../../../images/Vape Store/coil.png';
import vapebandImg from '../../../images/Vape Store/vapeband.png';

const productsData = [
    {
        id: 1,
        name: 'Apex Titanium',
        price: 400000,
        category: 'DEVICES',
        tag: 'PREMIUM BUILD',
        description: 'Sasis titanium kelas kedirgantaraan dengan Omni-Chip 4.0 revolusioner untuk presisi yang tak tertandingi.',
        images: [apexImg],
        options: {
            Color: ['METALLIC', 'MATTE BLACK'],
            'Vapor Intensity': ['SMOOTH', 'INTENSE']
        }
    },
    {
        id: 2,
        name: 'Nano Pod S II',
        price: 350000,
        category: 'DEVICES',
        tag: 'PORTABLE POWER',
        description: 'Puncak dari teknologi penguapan kompak, menawarkan daya tahan baterai 12 jam dalam bentuk yang seukuran saku dengan sistem pengisian atas yang anti bocor.',
        images: [nanoImg, goldNano, earthyNano],
        options: {
            Color: ['MIDNIGHT BLACK', 'EMPIRE GOLD', 'EARTHY GREEN'],
            'Vapor Intensity': ['SMOOTH', 'DIRECT', 'INTENSE']
        }
    },
    {
        id: 3,
        name: 'Drag Q Pod Kit',
        price: 350000,
        category: 'DEVICES',
        tag: 'TECH SPECS',
        description: 'Kit pemula serbaguna yang menyeimbangkan desain estetika dengan performa profesional. Termasuk cincin pengatur aliran udara dan pegangan kulit yang nyaman.',
        images: [dragImg],
        options: {
            Color: ['CLASSIC RED', 'CARBON FIBER'],
            'Vapor Intensity': ['REGULAR', 'HIGH']
        }
    },
    {
        id: 4,
        name: 'VOOPOO Argus',
        price: 400000,
        category: 'DEVICES',
        tag: 'PREMIUM GRADE',
        description: 'Dilengkapi dengan kumparan jala sarang lebah inovatif yang memastikan permukaan pemanas lebih luas untuk produksi uap yang kaya dan padat.',
        images: [argusImg],
        options: {
            Color: ['BLACK', 'SILVER', 'GUNMETAL']
        }
    },
    {
        id: 5,
        name: 'Thelema Aura S',
        price: 200000,
        category: 'DEVICES',
        tag: 'HIGH QUALITY',
        description: 'Sistem pod berperforma tinggi ini dilengkapi dengan chipset canggih yang memastikan pengaktifan cepat dan profil rasa yang konsisten dan kaya di setiap hisapan.',
        images: [thelemaImg],
        options: {
            Color: ['BLUE', 'RED', 'BLACK']
        }
    },
    {
        id: 6,
        name: 'Oxva Xlim Go 2',
        price: 180000,
        category: 'DEVICES',
        tag: 'ADVANCED CHIP',
        description: 'Perangkat serbaguna ini mendukung berbagai tingkat resistansi, menjadikannya pilihan sempurna bagi pencari rasa maupun penggemar uap tebal.',
        images: [oxvaImg],
        options: {
            Color: ['DARK GREY', 'GREEN', 'RED']
        }
    },
    {
        id: 7,
        name: 'XMax V3 Pro',
        price: 260000,
        category: 'DEVICES',
        tag: 'HIGH QUALITY',
        description: 'Vaporizer konveksi ini memiliki waktu pemanasan yang cepat dan layar OLED yang jernih yang menampilkan suhu dan pemantauan baterai.',
        images: [xmaxImg],
        options: {
            Color: ['BLACK', 'SILVER']
        }
    },
    {
        id: 101,
        name: 'Blackcurrant Tea',
        price: 110000,
        category: 'LIQUIDS',
        tag: 'REFRESHING TASTE',
        description: 'A smooth fusion of rich blackcurrant and subtle tea notes, delivering a refreshing yet slightly tangy inhale.',
        images: [blackcurrantImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 102,
        name: 'Bule Bolu',
        price: 120000,
        category: 'LIQUIDS',
        tag: 'CREAMY CLOUDS',
        description: 'A delightful dessert-inspired flavor that captures the soft sweetness of classic sponge cake. Light, creamy, and satisfying.',
        images: [buleboluImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 103,
        name: 'King\'s Reserve',
        price: 145000,
        category: 'LIQUIDS',
        tag: 'PREMIUM BLEND',
        description: 'Crafted for a premium experience, this blend offers a bold yet refined flavor profile with deep, layered notes.',
        images: [kingsImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 104,
        name: 'Banana Licious',
        price: 162000,
        category: 'LIQUIDS',
        tag: 'RICH FLAVOR',
        description: 'A creamy banana blend with a naturally sweet aroma and smooth texture on every puff. Delivers a mellow and flavorful experience.',
        images: [bananaImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 105,
        name: 'Good Sundae',
        price: 145000,
        category: 'LIQUIDS',
        tag: 'SWEET DESSERT',
        description: 'This flavor combines every sweetness with a hint of fruity topping. A fun and indulgent vape that brings dessert vibes in every inhale.',
        images: [sundaeImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 106,
        name: 'English Breakfast',
        price: 165000,
        category: 'LIQUIDS',
        tag: 'CLASSIC TASTE',
        description: 'A unique take on traditional tea flavor, offering a warm, slightly bold taste with a smooth finish. Great for those who prefer more refined vaping.',
        images: [englishImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 107,
        name: 'Arctic Menthol',
        price: 100000,
        category: 'LIQUIDS',
        tag: 'REFRESHING TASTE',
        description: 'Cairan vape yang menyegarkan, dirancang untuk menghasilkan uap yang halus dan konsisten, menghadirkan sensasi menthol yang segar dengan intensitas rasa yang seimbang.',
        images: [arcticImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 108,
        name: 'Blueberry Ice',
        price: 100000,
        category: 'LIQUIDS',
        tag: 'SWEET FLAVOR',
        description: 'Perpaduan rasa yang lezat, menggabungkan aroma blueberry manis dengan sensasi dingin di akhir, dirancang untuk memberikan sensasi lembut di tenggorokan dengan uap yang memuaskan.',
        images: [blueberryImg],
        options: {
            Nicotine: ['3MG', '6MG'],
            Size: ['30ML', '60ML']
        }
    },
    {
        id: 201,
        name: 'Nitecore Battery',
        price: 136000,
        category: 'ACCESSORIES',
        tag: 'HIGH CAPACITY',
        description: 'Baterai andal berperforma tinggi yang dirancang untuk memberikan daya stabil dan penggunaan tahan lama. Dibuat dengan mengutamakan keamanan dan efisiensi.',
        images: [nitecoreImg],
        options: {
            Quantity: ['1 PCS', '2 PCS']
        }
    },
    {
        id: 202,
        name: 'Casan Type C',
        price: 40000,
        category: 'ACCESSORIES',
        tag: 'FAST CHARGING',
        description: 'Pengisi daya dua slot serbaguna yang dilengkapi dengan input Type-C untuk pengisian daya yang lebih cepat dan nyaman. Dilengkapi dengan manajemen daya cerdas.',
        images: [casanImg],
        options: {
            Color: ['BLACK', 'WHITE']
        }
    },
    {
        id: 203,
        name: 'Cartridge',
        price: 40000,
        category: 'ACCESSORIES',
        tag: 'LEAK PROOF',
        description: 'Pod yang ringkas dan mudah digunakan, dirancang untuk menghasilkan uap yang halus dan konsisten. Ideal untuk memberikan rasa yang bersih dan desain yang ramah pengguna.',
        images: [cartridgeImg],
        options: {
            Resistance: ['0.6 OHM', '0.8 OHM', '1.2 OHM']
        }
    },
    {
        id: 204,
        name: 'Cotton Bacon',
        price: 50000,
        category: 'ACCESSORIES',
        tag: 'PURE TASTE',
        description: 'Kapas berkualitas premium yang dibuat khusus untuk vaping, menawarkan daya serap yang sangat baik dan penyampaian rasa yang bersih.',
        images: [cottonImg],
        options: {
            Quantity: ['1 PACK', '2 PACK']
        }
    },
    {
        id: 205,
        name: 'Coil',
        price: 25000,
        category: 'ACCESSORIES',
        tag: 'OPTIMAL HEATING',
        description: 'Dirancang untuk pemanasan dan produksi rasa yang optimal, koil ini memberikan pengalaman vaping yang seimbang.',
        images: [coilImg],
        options: {
            Resistance: ['0.15 OHM', '0.2 OHM', '0.3 OHM']
        }
    },
    {
        id: 206,
        name: 'Vapeband',
        price: 2500,
        category: 'ACCESSORIES',
        tag: 'PROTECTIVE GEAR',
        description: 'Aksesori praktis yang melindungi tangki Anda dari benturan ringan dan menambahkan sentuhan gaya pribadi.',
        images: [vapebandImg],
        options: {
            Color: ['BLACK', 'RED', 'BLUE']
        }
    }
];

const recommendations = [
    productsData.find(p => p.id === 107)!, // Arctic Menthol
    productsData.find(p => p.id === 1)!,   // Apex Titanium
    productsData.find(p => p.id === 108)!  // Blueberry Ice
];

export default function ProductDetail({ id }: { id?: string | number }) {
    const productId = id ? parseInt(id.toString()) : 2;
    const product = productsData.find(p => p.id === productId) || productsData.find(p => p.id === 2)!;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    // Initialize default options
    useEffect(() => {
        if (product.options && Object.keys(product.options).length > 0) {
            const initialOptions: Record<string, string> = {};
            Object.keys(product.options).forEach(key => {
                initialOptions[key] = (product.options as any)[key][0];
            });
            setSelectedOptions(initialOptions);
        } else {
            setSelectedOptions({});
        }
        setSelectedImageIndex(0);
        setQuantity(1);
    }, [product]);

    const formatPrice = (price: number) => {
        return 'Rp' + price.toLocaleString('id-ID');
    };

    const handleOptionSelect = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('venus_cart') || '[]');
        const optionsStr = Object.values(selectedOptions).join(' / ');
        const cartItemId = `${product.id}-${optionsStr}`;
        
        const existingItemIndex = cart.findIndex((item: any) => item.cartItemId === cartItemId);
        
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                cartItemId,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[selectedImageIndex] || product.images[0],
                quantity,
                optionsStr
            });
        }
        
        localStorage.setItem('venus_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart_updated'));
        
        // Navigate to cart
        router.visit('/vape-store/cart');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Head title={`Vape Store - ${product.name}`} />
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8 flex-grow">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-8 text-label-sm text-foreground/60 uppercase">
                    <Link href="/vape-store" className="hover:text-primary transition-colors">{product.category}</Link>
                    <span>&rsaquo;</span>
                    <span className="text-foreground font-bold">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left Column: Images */}
                    <div className="space-y-6">
                        <div className="bg-surface rounded-venus aspect-[4/5] relative flex items-center justify-center overflow-hidden border border-border shadow-2xl">
                            {product.id === 2 && (
                                <div className="absolute top-6 left-6 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-label-sm z-10">
                                    BEST SELLER
                                </div>
                            )}
                            <img 
                                src={product.images[selectedImageIndex]} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {product.images.length > 1 && (
                            <div className="flex justify-center gap-4">
                                {product.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-20 h-20 rounded-venus overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-primary' : 'border-transparent hover:border-border'}`}
                                    >
                                        <div className="w-full h-full bg-surface flex items-center justify-center">
                                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-6">
                            <span className="inline-block bg-surface px-3 py-1 rounded-full text-label-sm text-foreground mb-4">
                                {product.tag}
                            </span>
                            <h1 className="text-h1 mb-6 text-super-black uppercase tracking-tight">{product.name}</h1>
                            <p className="text-body-l text-foreground/80 mb-8 max-w-lg">
                                {product.description}
                            </p>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-h2 text-super-black">{formatPrice(product.price)}</span>
                                <span className="text-label-sm text-foreground/60">/ SUSTAINABLY SOURCED</span>
                            </div>
                        </div>

                        {/* Options */}
                        {product.options && Object.keys(product.options).length > 0 && Object.entries(product.options).map(([optionName, values]) => (
                            <div key={optionName} className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-label-sm text-super-black uppercase tracking-widest">{optionName}</h4>
                                    <span className="text-label-sm text-foreground/40 italic">SELECT ONE</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {(values as string[]).map(val => {
                                        const isSelected = selectedOptions[optionName] === val;
                                        return (
                                            <button
                                                key={val}
                                                onClick={() => handleOptionSelect(optionName, val)}
                                                className={`px-6 py-3 rounded-full text-label-sm transition-all border ${
                                                    isSelected 
                                                    ? 'bg-secondary text-secondary-foreground border-secondary shadow-md' 
                                                    : 'bg-background text-foreground border-border hover:bg-surface'
                                                }`}
                                            >
                                                {val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Quantity and Actions */}
                        <div className="mb-8">
                            <h4 className="text-label-sm text-super-black uppercase tracking-widest mb-4">QUANTITY</h4>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-surface rounded-full border border-border h-14">
                                    <button 
                                        className="w-14 h-full flex items-center justify-center text-super-black hover:text-primary transition-colors text-h4"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-card-title">{quantity}</span>
                                    <button 
                                        className="w-14 h-full flex items-center justify-center text-super-black hover:text-primary transition-colors text-h4"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground h-14 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg text-label-sm tracking-widest font-bold group"
                            >
                                ADD TO ORDER — {formatPrice(product.price * quantity)}
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                            <button className="w-14 h-14 flex items-center justify-center border border-border rounded-full text-foreground hover:bg-surface hover:text-error transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Recommendations Section */}
            <section className="bg-surface py-20 border-t border-border mt-auto">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-label-sm text-secondary mb-3">ELEVATE THE EXPERIENCE</p>
                            <h2 className="text-h2 text-super-black tracking-tight">Recommended for You</h2>
                        </div>
                        <Link href="/vape-store" className="text-label-sm text-super-black hover:text-primary border-b-2 border-super-black pb-1 uppercase tracking-widest transition-colors">
                            VIEW ALL PAIRINGS
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="bg-card rounded-venus p-6 flex flex-col hover:shadow-xl transition-shadow border border-border group">
                                <div className="bg-surface rounded-venus aspect-[4/3] mb-6 flex items-center justify-center overflow-hidden border border-border relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                    <img
                                        src={rec.images[0]}
                                        alt={rec.name}
                                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-card-title text-super-black">{rec.name}</h3>
                                    <span className="text-body-m font-bold text-secondary whitespace-nowrap ml-4">{formatPrice(rec.price)}</span>
                                </div>
                                <p className="text-body-reg text-foreground/80 line-clamp-3 mb-6">
                                    {rec.description}
                                </p>
                                <Link href={`/vape-store/product/${rec.id}`} className="mt-auto block w-full py-3 text-center border border-border rounded-venus text-label-sm text-super-black hover:bg-surface hover:text-primary transition-colors">
                                    VIEW DETAILS
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
