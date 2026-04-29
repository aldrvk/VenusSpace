import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
  const navItems = [
    { name: 'Home', href: '#', active: true },
    { name: 'Doorsmeer', href: '#', active: false },
    { name: 'Coffee Shop', href: '#', active: false },
    { name: 'Vape Store', href: '#', active: false },
    { name: 'Bengkel', href: '#', active: false },
    { name: 'Rental PS', href: '#', active: false },
    { name: 'Contact', href: '#', active: false },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 lg:px-8 bg-background">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="text-h3 text-primary">
          Venus
        </Link>
      </div>

      {/* Navigation */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-body-m relative pb-1 transition-colors ${
              item.active ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            {item.name}
            {item.active && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="flex-shrink-0 hidden md:block">
        <Link
          href="#"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground text-body-m rounded-full hover:opacity-90 transition-opacity"
        >
          Book Now
        </Link>
      </div>

      {/* Mobile Menu Placeholder */}
      <div className="md:hidden flex items-center">
        <button className="text-foreground hover:text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}