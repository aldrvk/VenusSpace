import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface UserProfileDropdownProps {
    user: {
        name: string;
        email?: string;
        [key: string]: any;
    };
}

const ExitIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export default function UserProfileDropdown({ user }: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close the dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Create initials from the user's name
    const initials = user?.name 
        ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() 
        : 'U';

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {/* User Profile Avatar only (no username text) */}
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
                    {initials}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-surface border border-border rounded-venus shadow-lg py-2 z-50 transform origin-top-right transition-all">
                    {/* Header: User Full Name */}
                    <div className="px-4 py-3 border-b border-border mb-2">
                        <p className="text-body-m font-bold text-super-black truncate">{user?.name}</p>
                        {user?.email && (
                            <p className="text-label-sm text-foreground opacity-70 truncate mt-1">{user.email}</p>
                        )}
                    </div>
                    
                    <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-body-reg text-foreground hover:bg-background hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Edit Profile
                    </Link>
                    
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button"
                        className="w-full text-left flex items-center px-4 py-2 text-body-reg text-red-500 hover:bg-background hover:text-red-700 transition-colors mt-1"
                        onClick={() => setIsOpen(false)}
                    >
                        <ExitIcon />
                        Exit
                    </Link>
                </div>
            )}
        </div>
    );
}
