"use client";

import { useCallback, useEffect, useState } from "react";

type AnyObj = Record<string, any>;

export function useWishlist() {
    const [wishlist, setWishlist] = useState<AnyObj[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWishlist = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/wishlist", { credentials: "same-origin" });
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            // try common shapes
            const list = Array.isArray(data) ? data : data?.data ?? data?.wishlist ?? data?.items ?? [];
            setWishlist(list);
            return list;
        } catch (err: any) {
            setError(String(err?.message ?? err ?? "Failed to load wishlist"));
            setWishlist([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    useEffect(() => {
        function onUpdated() {
            fetchWishlist();
        }
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('wishlist:updated', onUpdated);
            return () => window.removeEventListener('wishlist:updated', onUpdated);
        }
    }, [fetchWishlist]);

    async function addToWishlist(productId: string) {
        setLoading(true);
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? `Status ${res.status}`);
            await fetchWishlist();
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new Event('wishlist:updated'));
            }
            return data;
        } catch (err: any) {
            setError(String(err?.message ?? err ?? "Failed to add"));
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function removeFromWishlist(productId: string) {
        setLoading(true);
        try {
            const res = await fetch("/api/wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? `Status ${res.status}`);
            await fetchWishlist();
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new Event('wishlist:updated'));
            }
            return data;
        } catch (err: any) {
            setError(String(err?.message ?? err ?? "Failed to remove"));
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const has = useCallback(
        (productId: string) => {
            if (!wishlist) return false;
            return wishlist.some((p: any) => p._id === productId || p.id === productId || p.productId === productId);
        },
        [wishlist]
    );

    return {
        wishlist,
        loading,
        error,
        refresh: fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        has,
    } as const;
}
