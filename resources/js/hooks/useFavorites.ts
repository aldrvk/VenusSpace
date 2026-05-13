import { useState, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const LOCAL_STORAGE_KEY = 'venus_favorites';
const LOCAL_STORAGE_META_KEY = 'venus_favorites_meta';

export interface FavoriteMeta {
    id: number;
    name: string;
    price: number;
    image?: string;
}

/**
 * Reusable hook for managing product favorites.
 * - Guest users: persisted in localStorage
 * - Logged-in users: persisted in database via API
 * - Auto-merges localStorage favorites to DB upon login
 */
export function useFavorites() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [favoriteMeta, setFavoriteMeta] = useState<Record<number, FavoriteMeta>>({});
    const [isLoading, setIsLoading] = useState(true);

    // ── Load favorites on mount / auth change ──────────────────────────────────
    useEffect(() => {
        if (user) {
            // Logged in: check for localStorage favorites to merge, then fetch from DB
            const localFavs = getLocalFavorites();
            if (localFavs.length > 0) {
                // Merge local favorites to DB
                axios.post('/api/favorites/merge', { product_ids: localFavs })
                    .then(res => {
                        setFavoriteIds(res.data.favorites);
                        // Merge local meta into state
                        const localMeta = getLocalFavoriteMeta();
                        setFavoriteMeta(prev => ({ ...prev, ...localMeta }));
                        clearLocalFavorites();
                    })
                    .catch(() => {
                        // Fallback: just fetch from DB
                        fetchFromApi();
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchFromApi();
            }
        } else {
            // Guest: load from localStorage
            setFavoriteIds(getLocalFavorites());
            setFavoriteMeta(getLocalFavoriteMeta());
            setIsLoading(false);
        }
    }, [user?.id]);

    const fetchFromApi = useCallback(() => {
        axios.get('/api/favorites')
            .then(res => setFavoriteIds(res.data.favorites))
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    // ── Toggle favorite ────────────────────────────────────────────────────────
    const toggleFavorite = useCallback((productId: number, meta?: Omit<FavoriteMeta, 'id'>): { action: 'added' | 'removed' } => {
        const currentlyFavorited = favoriteIds.includes(productId);
        const action: 'added' | 'removed' = currentlyFavorited ? 'removed' : 'added';

        if (currentlyFavorited) {
            // Optimistic remove
            const newIds = favoriteIds.filter(id => id !== productId);
            setFavoriteIds(newIds);

            // Remove meta
            setFavoriteMeta(prev => {
                const next = { ...prev };
                delete next[productId];
                return next;
            });

            if (user) {
                axios.post('/api/favorites/toggle', { product_id: productId }).catch(() => {
                    // Revert on error
                    setFavoriteIds(prev => [...prev, productId]);
                });
            } else {
                saveLocalFavorites(newIds);
                removeLocalFavoriteMeta(productId);
            }
        } else {
            // Optimistic add
            const newIds = [...favoriteIds, productId];
            setFavoriteIds(newIds);

            // Save meta if provided
            if (meta) {
                const fullMeta: FavoriteMeta = { id: productId, ...meta };
                setFavoriteMeta(prev => ({ ...prev, [productId]: fullMeta }));
                if (!user) {
                    saveLocalFavoriteMeta(productId, fullMeta);
                }
            }

            if (user) {
                axios.post('/api/favorites/toggle', { product_id: productId }).catch(() => {
                    // Revert on error
                    setFavoriteIds(prev => prev.filter(id => id !== productId));
                });
            } else {
                saveLocalFavorites(newIds);
            }
        }

        return { action };
    }, [favoriteIds, user]);

    // ── Check if a product is favorited ────────────────────────────────────────
    const isFavorited = useCallback((productId: number): boolean => {
        return favoriteIds.includes(productId);
    }, [favoriteIds]);

    // ── Get meta for a product ─────────────────────────────────────────────────
    const getMeta = useCallback((productId: number): FavoriteMeta | undefined => {
        return favoriteMeta[productId];
    }, [favoriteMeta]);

    return { favoriteIds, favoriteMeta, isFavorited, toggleFavorite, getMeta, isLoading };
}

// ── localStorage helpers ───────────────────────────────────────────────────────

function getLocalFavorites(): number[] {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveLocalFavorites(ids: number[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
}

function clearLocalFavorites(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_META_KEY);
}

function getLocalFavoriteMeta(): Record<number, FavoriteMeta> {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_META_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveLocalFavoriteMeta(productId: number, meta: FavoriteMeta): void {
    const existing = getLocalFavoriteMeta();
    existing[productId] = meta;
    localStorage.setItem(LOCAL_STORAGE_META_KEY, JSON.stringify(existing));
}

function removeLocalFavoriteMeta(productId: number): void {
    const existing = getLocalFavoriteMeta();
    delete existing[productId];
    localStorage.setItem(LOCAL_STORAGE_META_KEY, JSON.stringify(existing));
}
