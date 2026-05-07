import React from 'react';
import { Link } from '@inertiajs/react';
import ProductDetailButton from '../ProductDetailButton';

interface CardProps {
    id: number | string;
    name: string;
    price: string | number;
    description: string;
    image: string;
}

export default function Card({ id, name, price, description, image }: CardProps) {
    const formattedPrice = typeof price === 'number' 
        ? 'Rp' + price.toLocaleString('id-ID')
        : price;

    return (
        <Link href={`/vape-store/product/${id}`} className="bg-card rounded-venus p-6 flex flex-col hover:shadow-xl transition-shadow border border-border group cursor-pointer">
            <div className="bg-surface rounded-venus aspect-square mb-6 flex items-center justify-center overflow-hidden border border-border relative">
                <div className="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent opacity-0 group-hover:opacity-30 transition-opacity z-10"></div>
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-card-title text-super-black">{name}</h3>
                <span className="text-body-m font-bold text-secondary whitespace-nowrap ml-4">{formattedPrice}</span>
            </div>
            <p className="text-body-reg text-foreground/80 line-clamp-3 mb-6 flex-grow">
                {description}
            </p>
            <ProductDetailButton href={`/vape-store/product/${id}`} />
        </Link>
    );
}
