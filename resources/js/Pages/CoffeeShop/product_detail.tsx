import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Card from '../../Components/Card/Card';

const productsData = [
    {
        id: 301,
        name: 'Caramel Macchiato',
        price: 45000,
        category: 'MINUMAN',
        tag: 'TERLARIS',
        description: 'Perpaduan sempurna antara espresso kuat, susu murni yang di-steam, dan sirup karamel manis yang lembut.',
        images: ['https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop'],
        options: {
            Ukuran: ['REGULER', 'BESAR'],
            'Level Gula': ['NORMAL', 'KURANG GULA', 'TANPA GULA'],
            Es: ['ES NORMAL', 'KURANG ES', 'PANAS']
        }
    },
    {
        id: 302,
        name: 'V60 Pour Over',
        price: 35000,
        category: 'MINUMAN',
        tag: 'BIJI KOPI PREMIUM',
        description: 'Kopi hitam manual brew menggunakan biji kopi pilihan dengan metode V60 untuk mengeluarkan aroma dan rasa yang bersih dan tajam.',
        images: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop'],
        options: {
            Biji: ['ETHIOPIA YIRGACHEFFE', 'GAYO WINE', 'TORAJA SAPAN'],
            Suhu: ['PANAS', 'ES']
        }
    },
    {
        id: 303,
        name: 'Matcha Latte',
        price: 40000,
        category: 'MINUMAN',
        tag: 'FAVORIT',
        description: 'Bubuk matcha premium dari Jepang dipadukan dengan susu segar, menghasilkan tekstur creamy dan rasa manis yang seimbang.',
        images: ['https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?q=80&w=600&auto=format&fit=crop'],
        options: {
            Ukuran: ['REGULER', 'BESAR'],
            Susu: ['SUSU BIASA', 'SUSU GANDUM (OAT)', 'SUSU ALMOND']
        }
    },
    {
        id: 401,
        name: 'Croissant Butter',
        price: 25000,
        category: 'MAKANAN',
        tag: 'BARU DIPANGGANG',
        description: 'Croissant klasik dengan tekstur renyah di luar dan lembut di dalam, dibuat dengan mentega premium.',
        images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop'],
        options: {}
    },
    {
        id: 402,
        name: 'Beef Sandwich',
        price: 55000,
        category: 'MAKANAN',
        tag: 'HIDANGAN LEZAT',
        description: 'Sandwich daging sapi pilihan dengan sayuran segar dan saus spesial, disajikan dengan roti yang dipanggang sempurna.',
        images: ['https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop'],
        options: {
            Roti: ['ROTI PUTIH', 'GANDUM UTUH', 'SOURDOUGH'],
            Kepedasan: ['TIDAK PEDAS', 'SEDANG', 'PEDAS']
        }
    },
    {
        id: 501,
        name: 'French Fries',
        price: 30000,
        category: 'CAMILAN',
        tag: 'CAMILAN',
        description: 'Kentang goreng renyah yang dibumbui dengan garam dan herbs pilihan, cocok untuk teman nongkrong.',
        images: ['https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop'],
        options: {
            Rasa: ['ORIGINAL', 'KEJU', 'BBQ']
        }
    }
];

const recommendations = [
    productsData.find(p => p.id === 301)!, // Caramel Macchiato
    productsData.find(p => p.id === 401)!, // Croissant
    productsData.find(p => p.id === 501)!  // Fries
];

export default function ProductDetail({ id }: { id?: string | number }) {
    const productId = id ? parseInt(id.toString()) : 301;
    const product = productsData.find(p => p.id === productId) || productsData.find(p => p.id === 301)!;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

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
        const cart = JSON.parse(localStorage.getItem('venus_cart_coffee') || '[]');
        const optionsStr = Object.keys(selectedOptions).length > 0 
            ? Object.values(selectedOptions).join(' / ') 
            : 'Default';
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
        
        localStorage.setItem('venus_cart_coffee', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart_updated'));
        
        router.visit('/coffee-shop/cart');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Head title={`Coffee Shop - ${product.name}`} />
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8 flex-grow">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-8 text-label-sm text-foreground/60 uppercase">
                    <Link href="/coffee-shop" className="hover:text-primary transition-colors">{product.category}</Link>
                    <span>&rsaquo;</span>
                    <span className="text-foreground font-bold">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left Column: Images */}
                    <div className="space-y-6">
                        <div className="bg-surface rounded-venus aspect-[4/5] relative flex items-center justify-center overflow-hidden border border-border shadow-2xl">
                            {product.id === 301 && (
                                <div className="absolute top-6 left-6 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-label-sm z-10">
                                    TERLARIS
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
                                <span className="text-label-sm text-foreground/60">/ DIBUAT SEGAR</span>
                            </div>
                        </div>

                        {/* Options */}
                        {product.options && Object.keys(product.options).length > 0 && Object.entries(product.options).map(([optionName, values]) => (
                            <div key={optionName} className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-label-sm text-super-black uppercase tracking-widest">{optionName}</h4>
                                    <span className="text-label-sm text-foreground/40 italic">PILIH SATU</span>
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
                            <h4 className="text-label-sm text-super-black uppercase tracking-widest mb-4">JUMLAH</h4>
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
                                TAMBAHKAN KE PESANAN — {formatPrice(product.price * quantity)}
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
                            <h2 className="text-h2 text-super-black tracking-tight">Produk Lainnya</h2>
                        </div>
                        <Link href="/coffee-shop" className="text-label-sm text-super-black hover:text-primary border-b-2 border-super-black pb-1 uppercase tracking-widest transition-colors">
                            LIHAT SEMUA MENU
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((rec) => (
                            <Card 
                                key={rec.id}
                                id={rec.id}
                                name={rec.name}
                                price={rec.price}
                                description={rec.description}
                                image={rec.images[0]}
                                href={`/coffee-shop/product/${rec.id}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
