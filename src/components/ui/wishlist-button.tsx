"use client";

import React from "react";
import { useWishlist } from "@/lib/useWishlist";

export default function WishlistButton({ productId }: { productId: string }) {
  const { has, addToWishlist, removeFromWishlist, loading } = useWishlist();
  const liked = has(productId);

  const toggle = async () => {
    try {
      if (liked) await removeFromWishlist(productId);
      else await addToWishlist(productId);
    } catch (err) {
      console.error("wishlist toggle", err);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-2 py-1 rounded ${liked ? "bg-red-600 text-white" : "bg-gray-100"}`}
    >
      {liked ? "Remove from wishlist" : "Add to wishlist"}
    </button>
  );
}
