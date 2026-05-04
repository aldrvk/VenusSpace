import React from 'react';

export default function SearchBar() {
    return (
        <div className="w-full md:w-80 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-foreground opacity-50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            <input 
                type="text" 
                placeholder="Search product" 
                className="w-full bg-surface border border-border rounded-venus py-3 pl-12 pr-4 text-body-reg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
    );
}
