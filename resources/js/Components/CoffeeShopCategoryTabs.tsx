import React from 'react';
import { Link } from '@inertiajs/react';

interface CoffeeShopCategoryTabsProps {
    activeCategory: 'all' | 'coffee' | 'non-coffee' | 'snacks';
}

export default function CoffeeShopCategoryTabs({ activeCategory }: CoffeeShopCategoryTabsProps) {
    const categories = [
        { id: 'all', name: 'Terlaris', href: '/coffee-shop' },
        { id: 'coffee', name: 'Coffee', href: '/coffee-shop/coffee' },
        { id: 'non-coffee', name: 'Non-Coffee', href: '/coffee-shop/non-coffee' },
        { id: 'snacks', name: 'Snacks', href: '/coffee-shop/snacks' }
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
