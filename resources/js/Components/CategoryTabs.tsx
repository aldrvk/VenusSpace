import React from 'react';
import { Link } from '@inertiajs/react';

interface CategoryTabsProps {
    activeCategory: 'all' | 'devices' | 'liquids' | 'accessories';
}

export default function CategoryTabs({ activeCategory }: CategoryTabsProps) {
    const categories = [
        { id: 'all', name: 'Terlaris', href: '/vape-store' },
        { id: 'devices', name: 'Devices', href: '/vape-store/devices' },
        { id: 'liquids', name: 'Liquids', href: '/vape-store/liquids' },
        { id: 'accessories', name: 'Perlengkapan', href: '/vape-store/accessories' }
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
