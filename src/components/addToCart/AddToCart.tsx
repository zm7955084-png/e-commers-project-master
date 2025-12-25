"use client";
import React, { useContext, useState } from "react";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { HeartIcon, Loader, ShoppingCartIcon } from "lucide-react";
import { useWishlist } from "@/lib/useWishlist";
import toast from "react-hot-toast";
import { CartContext } from "../context/CartContext";
import { addToCartAction } from "@/app/(pages)/products/_action/addToCart.action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddToCart({ productId }: { productId: string }) {
  const { getCart, setCartData } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();
  async function addToCart() {
    if (session.status == "authenticated") {
      setIsLoading(true);
      const data = await addToCartAction(productId);
      data.status == "success" && toast.success("product added successfully ");
      setCartData(data);
      console.log(data);
      // await getCart()
      setIsLoading(false);
    } else {
      router.push("/login");
    }
  }
  const {
    addToWishlist,
    removeFromWishlist,
    has,
    loading: wishLoading,
  } = useWishlist();
  const liked = has?.(productId);

  async function toggleWishlist() {
    try {
      if (liked) await removeFromWishlist(productId);
      else await addToWishlist(productId);
    } catch (err) {
      console.error("wishlist toggle", err);
    }
  }

  return (
    <CardFooter className="gap-2 mt-2">
      <Button className="grow hover:cursor-pointer" onClick={addToCart}>
        {isLoading ? <Loader className="animate-spin" /> : <ShoppingCartIcon />}
        Add To Cart
      </Button>

      <button
        onClick={toggleWishlist}
        aria-pressed={Boolean(liked)}
        disabled={wishLoading}
        className="p-2 rounded hover:bg-gray-100 cursor-pointer"
        title={liked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <HeartIcon className={liked ? "text-red-600" : "text-gray-600"} />
      </button>
    </CardFooter>
  );
}
