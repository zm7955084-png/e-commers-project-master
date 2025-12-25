"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/useWishlist";
import { pickImage } from "@/lib/image";
import WishlistButton from "@/components/ui/wishlist-button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import AddToCart from "@/components/addToCart/AddToCart";
import MyStarIcon from "@/components/myStarIcon/myStarIcon";

export default function WishlistPage() {
  const { wishlist, loading, error, removeFromWishlist, refresh } =
    useWishlist();
  const [removing, setRemoving] = useState<Record<string, boolean>>({});

  async function handleRemove(productId?: string) {
    if (!productId) return;
    setRemoving((s) => ({ ...s, [productId]: true }));
    try {
      // call hook helper if available, otherwise call API directly
      if (removeFromWishlist) {
        await removeFromWishlist(productId);
      } else {
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ productId }),
        });
      }
      await refresh();
    } catch (err) {
      console.error("remove wishlist", err);
    } finally {
      setRemoving((s) => ({ ...s, [productId]: false }));
    }
  }

  const getImage = (p: any) =>
    pickImage(p) || "https://via.placeholder.com/150";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Wishlist</h1>

      {loading && <div>Loading wishlist...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && (!wishlist || wishlist.length === 0) && (
        <div>No items in wishlist.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlist?.map((p: any) => {
          const pid = p._id ?? p.id ?? p.productId ?? p.product?._id;
          return (
            <Card key={pid} className="bg-white">
              <Link href={`/products/${pid}`} prefetch>
                <CardHeader>
                  <Image
                    src={getImage(p)}
                    alt={p.title ?? p.product?.title ?? p.name ?? ""}
                    width={200}
                    height={200}
                    className=" h-40 object-cover rounded"
                  />
                  <CardDescription>
                    {p.brand?.name ?? p.product?.brand?.name}
                  </CardDescription>
                  <CardTitle>
                    {(p.title ?? p.product?.title ?? p.name ?? "")
                      .toString()
                      .split(" ", 3)
                      .join(" ")}
                  </CardTitle>
                  <CardDescription>
                    {p.category?.name ?? p.product?.category?.name}
                  </CardDescription>
                </CardHeader>
              </Link>

              <CardContent>
                <div className="flex items-center gap-2 mb-1">
                  <MyStarIcon />
                  <MyStarIcon />
                  <MyStarIcon />
                  <MyStarIcon />
                  {p.ratingsAverage ?? p.product?.ratingsAverage ?? ""}
                </div>
                <p className="pt-1">
                  Price :{" "}
                  <span className="font-bold">
                    {p.price ?? p.product?.price}
                  </span>{" "}
                  EGP
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between ">
                <AddToCart productId={pid} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
