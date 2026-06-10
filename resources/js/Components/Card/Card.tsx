import React from 'react';
import { Link } from '@inertiajs/react';
import ProductDetailButton from '../ProductDetailButton';

interface CardProps {
    id: number | string;
    name: string;
    price: string | number;
    description: string;
    image: string;
    href?: string;
    stock?: number;
    showStock?: boolean;
}

export default function Card({ id, name, price, description, image, href, stock, showStock }: CardProps) {
    const formattedPrice = typeof price === 'number' 
        ? 'Rp' + price.toLocaleString('id-ID')
        : price;
        
    const linkHref = href || `/vape-store/product/${id}`;

    const truncateText = (text: string, maxLength: number = 120) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + "...";
    };

    return (
        <Link 
            href={stock === 0 ? '#' : linkHref} 
            className={`bg-card rounded-venus p-6 flex flex-col transition-shadow border border-border group relative h-full ${stock === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'}`}
            onClick={(e) => {
                if (stock === 0) e.preventDefault();
            }}
        >
            <div className="bg-surface rounded-venus aspect-square mb-6 flex items-center justify-center overflow-hidden border border-border relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent opacity-0 group-hover:opacity-30 transition-opacity z-10"></div>
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${stock !== 0 ? 'group-hover:scale-105' : 'grayscale'}`}
                />
                {stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                        <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-label-sm tracking-wider shadow-lg">STOK HABIS</span>
                    </div>
                )}
            </div>
            <div className="flex items-start justify-between mb-3 shrink-0">
                <h3 className="text-card-title text-super-black">{name}</h3>
                <span className="text-body-m font-bold text-secondary whitespace-nowrap ml-4">{formattedPrice}</span>
            </div>
            {showStock && stock !== undefined && stock > 0 && (
                <div className="mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold border border-primary/20">Sisa Stok: {stock}</span>
                </div>
            )}
            <div className="flex-grow mb-6 overflow-hidden">
                <p className="text-body-reg text-foreground/80 line-clamp-3" title={description}>
                    {truncateText(description, 150)}
                </p>
            </div>
            <div className="mt-auto">
                {stock !== 0 ? (
                    <ProductDetailButton href={linkHref} />
                ) : (
                    <span className="inline-flex items-center gap-1 text-body-m font-bold text-red-500 opacity-80">STOK HABIS</span>
                )}
            </div>
        </Link>
    );
}
