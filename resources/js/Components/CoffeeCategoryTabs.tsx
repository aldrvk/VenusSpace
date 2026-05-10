import React from 'react';
import { Link } from '@inertiajs/react';

interface CoffeeCategoryTabsProps {
    activeCategory: 'all' | 'drinks' | 'foods' | 'snacks';
}

export default function CoffeeCategoryTabs({ activeCategory }: CoffeeCategoryTabsProps) {
    const categories = [
        { id: 'all', name: 'Semua Menu', href: '/coffee-shop' },
        { id: 'drinks', name: 'Minuman', href: '/coffee-shop/drinks' },
        { id: 'foods', name: 'Makanan', href: '/coffee-shop/foods' },
        { id: 'snacks', name: 'Cemilan', href: '/coffee-shop/snacks' }
    ];

    return (
        <div className="flex flex-wrap items-center gap-3 mb-10">
            {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                    <Link
                        key={category.id}
                        href={category.href}
                        className={`px-6 py-2 rounded-full text-btn transition-all duration-300 ${isActive
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-surface text-foreground hover:bg-card'
                            }`}
                    >
                        {category.name}
                    </Link>
                );
            })}
        </div>
    );
}
