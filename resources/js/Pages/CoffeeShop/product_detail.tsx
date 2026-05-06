import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import ProductDetailButton from '../../Components/ProductDetailButton';

import img1 from '../../../images/Vape Store/apex titanium.jpg';
import img2 from '../../../images/Vape Store/nano pod s ii.jpg';
import img2b from '../../../images/Vape Store/gold nano pod s ii.png';
import img2c from '../../../images/Vape Store/earthy nano pod s ii.png';
import img3 from '../../../images/Vape Store/drag q pod kit.png';
import img4 from '../../../images/Vape Store/voopoo argus.jpg';
import img5 from '../../../images/Vape Store/thelema aura s.jpg';
import img6 from '../../../images/Vape Store/oxva xlim go 2.jpg';
import img101 from '../../../images/Vape Store/arctic menthol.jpg';
import img102 from '../../../images/Vape Store/blueberry ice.jpg';
import img103 from '../../../images/Vape Store/blackcurrant tea.jpg';
import img104 from '../../../images/Vape Store/blue bolu.jpeg';
import img105 from '../../../images/Vape Store/english breakfast.png';
import img106 from '../../../images/Vape Store/good sundae.png';
import img201 from '../../../images/Vape Store/nitecore battery.png';
import img202 from '../../../images/Vape Store/casan type c.png';
import img203 from '../../../images/Vape Store/cartridge.png';
import img204 from '../../../images/Vape Store/cotton bacon.png';
import img205 from '../../../images/Vape Store/coil.png';
import img206 from '../../../images/Vape Store/vapeband.png';

const productsData = [
    { id: 1, name: 'Espresso Classico', price: 28000, category: 'COFFEE', tag: 'BEST SELLER', description: 'Espresso murni yang diseduh dari biji kopi Arabica pilihan, menghasilkan rasa yang kuat dan aroma yang khas dengan crema yang sempurna.', images: [img1], options: { Size: ['REGULAR', 'LARGE'], Sugar: ['NORMAL', 'LESS SUGAR', 'NO SUGAR'] } },
    { id: 2, name: 'Cappuccino', price: 32000, category: 'COFFEE', tag: 'PREMIUM BLEND', description: 'Kombinasi sempurna espresso, steamed milk, dan foam susu yang lembut, disajikan dengan taburan bubuk cokelat di atasnya.', images: [img2, img2b, img2c], options: { Size: ['REGULAR', 'LARGE'], Temperature: ['HOT', 'ICED'], Sugar: ['NORMAL', 'LESS SUGAR', 'NO SUGAR'] } },
    { id: 3, name: 'Café Latte', price: 30000, category: 'COFFEE', tag: 'SMOOTH TASTE', description: 'Espresso yang dipadukan dengan steamed milk berlimpah, menciptakan minuman yang halus dan creamy.', images: [img3], options: { Size: ['REGULAR', 'LARGE'], Temperature: ['HOT', 'ICED'] } },
    { id: 4, name: 'Americano', price: 25000, category: 'COFFEE', tag: 'CLASSIC BREW', description: 'Espresso yang dilarutkan dengan air panas, menghasilkan kopi hitam yang bersih dan kaya rasa.', images: [img4], options: { Size: ['REGULAR', 'LARGE'], Temperature: ['HOT', 'ICED'] } },
    { id: 5, name: 'Mocha Latte', price: 35000, category: 'COFFEE', tag: 'RICH FLAVOR', description: 'Perpaduan harmonis espresso, cokelat premium, dan susu segar yang menciptakan minuman kopi dengan sentuhan manis.', images: [img5], options: { Size: ['REGULAR', 'LARGE'], Temperature: ['HOT', 'ICED'] } },
    { id: 6, name: 'Caramel Macchiato', price: 38000, category: 'COFFEE', tag: 'SWEET & BOLD', description: 'Espresso yang dihiasi dengan susu berbusa dan siraman saus karamel premium.', images: [img6], options: { Size: ['REGULAR', 'LARGE'], Temperature: ['HOT', 'ICED'] } },
    { id: 101, name: 'Matcha Latte', price: 35000, category: 'NON-COFFEE', tag: 'REFRESHING', description: 'Perpaduan teh hijau matcha premium dengan susu segar yang dikocok halus.', images: [img101], options: { Size: ['REGULAR', 'LARGE'], Temperature: ['HOT', 'ICED'] } },
    { id: 102, name: 'Iced Chocolate', price: 32000, category: 'NON-COFFEE', tag: 'SWEET FLAVOR', description: 'Cokelat premium yang dicampur dengan susu dingin dan es.', images: [img102], options: { Size: ['REGULAR', 'LARGE'], Sugar: ['NORMAL', 'LESS SUGAR'] } },
    { id: 103, name: 'Thai Tea', price: 30000, category: 'NON-COFFEE', tag: 'EXOTIC BLEND', description: 'Teh Thailand otentik dengan campuran susu kental manis dan rempah-rempah khas.', images: [img103], options: { Size: ['REGULAR', 'LARGE'], Sugar: ['NORMAL', 'LESS SUGAR'] } },
    { id: 104, name: 'Taro Milk', price: 33000, category: 'NON-COFFEE', tag: 'CREAMY SMOOTH', description: 'Minuman susu taro yang lembut dan creamy dengan warna ungu yang menarik.', images: [img104], options: { Size: ['REGULAR', 'LARGE'], Sugar: ['NORMAL', 'LESS SUGAR'] } },
    { id: 105, name: 'Lemon Tea', price: 25000, category: 'NON-COFFEE', tag: 'CLASSIC TASTE', description: 'Teh segar yang dipadu dengan perasan lemon alami.', images: [img105], options: { Size: ['REGULAR', 'LARGE'], Temperature: ['HOT', 'ICED'] } },
    { id: 106, name: 'Strawberry Smoothie', price: 38000, category: 'NON-COFFEE', tag: 'FRUITY FRESH', description: 'Smoothie strawberry segar yang diblender dengan yogurt dan madu alami.', images: [img106], options: { Size: ['REGULAR', 'LARGE'] } },
    { id: 201, name: 'Croissant Butter', price: 25000, category: 'SNACKS', tag: 'FRESHLY BAKED', description: 'Croissant renyah berlapis-lapis yang dipanggang sempurna dengan butter premium.', images: [img201], options: { Quantity: ['1 PCS', '2 PCS'] } },
    { id: 202, name: 'Banana Bread', price: 22000, category: 'SNACKS', tag: 'HOMEMADE', description: 'Roti pisang homemade yang lembut dan moist.', images: [img202], options: { Quantity: ['1 SLICE', '2 SLICES'] } },
    { id: 203, name: 'Cheese Cake', price: 35000, category: 'SNACKS', tag: 'PREMIUM QUALITY', description: 'Cheese cake lembut dengan base biskuit renyah.', images: [img203], options: { Quantity: ['1 SLICE', '2 SLICES'] } },
    { id: 204, name: 'French Fries', price: 20000, category: 'SNACKS', tag: 'CRISPY FRESH', description: 'Kentang goreng renyah yang dipotong tipis dan digoreng sempurna.', images: [img204], options: { Size: ['REGULAR', 'LARGE'], Sauce: ['KETCHUP', 'MAYO', 'BBQ'] } },
    { id: 205, name: 'Chicken Wings', price: 30000, category: 'SNACKS', tag: 'SPICY HOT', description: 'Sayap ayam yang dimarinasi dengan bumbu rahasia dan digoreng hingga renyah.', images: [img205], options: { Flavor: ['BBQ', 'SPICY', 'HONEY GARLIC'] } },
    { id: 206, name: 'Brownies', price: 28000, category: 'SNACKS', tag: 'SWEET TREAT', description: 'Brownies cokelat yang fudgy dan kaya rasa.', images: [img206], options: { Quantity: ['1 PCS', '2 PCS'] } },
];

const recommendations = [
    productsData.find(p => p.id === 101)!,
    productsData.find(p => p.id === 1)!,
    productsData.find(p => p.id === 201)!,
];

export default function ProductDetail({ id }: { id?: string | number }) {
    const productId = id ? parseInt(id.toString()) : 2;
    const product = productsData.find(p => p.id === productId) || productsData.find(p => p.id === 2)!;
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    useEffect(() => {
        if (product.options && Object.keys(product.options).length > 0) {
            const init: Record<string, string> = {};
            Object.keys(product.options).forEach(k => { init[k] = (product.options as any)[k][0]; });
            setSelectedOptions(init);
        } else { setSelectedOptions({}); }
        setSelectedImageIndex(0);
        setQuantity(1);
    }, [product]);

    const formatPrice = (p: number) => 'Rp' + p.toLocaleString('id-ID');
    const handleOptionSelect = (name: string, val: string) => setSelectedOptions(prev => ({ ...prev, [name]: val }));

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('venus_cart') || '[]');
        const optionsStr = Object.values(selectedOptions).join(' / ');
        const cartItemId = `coffee-${product.id}-${optionsStr}`;
        const idx = cart.findIndex((item: any) => item.cartItemId === cartItemId);
        if (idx >= 0) { cart[idx].quantity += quantity; }
        else { cart.push({ cartItemId, productId: product.id, name: product.name, price: product.price, image: product.images[selectedImageIndex] || product.images[0], quantity, optionsStr }); }
        localStorage.setItem('venus_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart_updated'));
        router.visit('/coffee-shop/cart');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Head title={`Coffee Shop - ${product.name}`} />
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-8 flex-grow">
                <div className="flex items-center gap-2 mb-8 text-label-sm text-foreground/60 uppercase">
                    <Link href="/coffee-shop" className="hover:text-primary transition-colors">{product.category}</Link>
                    <span>&rsaquo;</span>
                    <span className="text-foreground font-bold">{product.name}</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    <div className="space-y-6">
                        <div className="bg-surface rounded-venus aspect-[4/5] relative flex items-center justify-center overflow-hidden border border-border shadow-2xl">
                            {product.id === 2 && (<div className="absolute top-6 left-6 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-label-sm z-10">BEST SELLER</div>)}
                            <img src={product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex justify-center gap-4">
                                {product.images.map((img, idx) => (
                                    <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`w-20 h-20 rounded-venus overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-primary' : 'border-transparent hover:border-border'}`}>
                                        <div className="w-full h-full bg-surface flex items-center justify-center"><img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" /></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="mb-6">
                            <span className="inline-block bg-surface px-3 py-1 rounded-full text-label-sm text-foreground mb-4">{product.tag}</span>
                            <h1 className="text-h1 mb-6 text-super-black uppercase tracking-tight">{product.name}</h1>
                            <p className="text-body-l text-foreground/80 mb-8 max-w-lg">{product.description}</p>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-h2 text-super-black">{formatPrice(product.price)}</span>
                                <span className="text-label-sm text-foreground/60">/ FRESHLY MADE</span>
                            </div>
                        </div>
                        {product.options && Object.entries(product.options).map(([optionName, values]) => (
                            <div key={optionName} className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-label-sm text-super-black uppercase tracking-widest">{optionName}</h4>
                                    <span className="text-label-sm text-foreground/40 italic">SELECT ONE</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {(values as string[]).map(val => (
                                        <button key={val} onClick={() => handleOptionSelect(optionName, val)} className={`px-6 py-3 rounded-full text-label-sm transition-all border ${selectedOptions[optionName] === val ? 'bg-secondary text-secondary-foreground border-secondary shadow-md' : 'bg-background text-foreground border-border hover:bg-surface'}`}>{val}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="mb-8">
                            <h4 className="text-label-sm text-super-black uppercase tracking-widest mb-4">QUANTITY</h4>
                            <div className="inline-flex items-center bg-surface rounded-full border border-border h-14 w-fit">
                                <button className="w-14 h-full flex items-center justify-center text-super-black hover:text-primary transition-colors text-h4" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span className="w-12 text-center text-card-title">{quantity}</span>
                                <button className="w-14 h-full flex items-center justify-center text-super-black hover:text-primary transition-colors text-h4" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <button onClick={handleAddToCart} className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground h-14 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg text-label-sm tracking-widest font-bold group">
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
            <section className="bg-surface py-20 border-t border-border mt-auto">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h2 className="text-h2 text-super-black tracking-tight">Produk Lainnya</h2>
                        <Link href="/coffee-shop" className="text-label-sm text-super-black hover:text-primary border-b-2 border-super-black pb-1 uppercase tracking-widest transition-colors">LIHAT SEMUA PRODUK</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="bg-card rounded-venus p-6 flex flex-col hover:shadow-xl transition-shadow border border-border group">
                                <div className="bg-surface rounded-venus aspect-[4/3] mb-6 flex items-center justify-center overflow-hidden border border-border relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                    <img src={rec.images[0]} alt={rec.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-card-title text-super-black">{rec.name}</h3>
                                    <span className="text-body-m font-bold text-secondary whitespace-nowrap ml-4">{formatPrice(rec.price)}</span>
                                </div>
                                <p className="text-body-reg text-foreground/80 line-clamp-3 mb-6">{rec.description}</p>
                                <ProductDetailButton href={`/coffee-shop/product/${rec.id}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
