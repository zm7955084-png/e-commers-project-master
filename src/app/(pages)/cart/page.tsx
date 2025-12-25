"use client";
import Loading from "@/app/loading";
import CheckOut from "@/components/checkOut/CheckOut";
import { CartContext } from "@/components/context/CartContext";
import { Button } from "@/components/ui/button";
import { CartResponse } from "@/interfaces";
import { Loader, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function Cart() {
  const { cartData, isLoading, getCart, setCartData } = useContext(CartContext);
  const { data: session } = useSession();
  const [removingId, setRemovingId] = useState<null | string>(null);
  const [updatingId, setUpdatingId] = useState<null | string>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  const token = session?.user?.token || "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (
      isMounted &&
      (typeof cartData?.data.products[0]?.product == "string" ||
        cartData == null)
    ) {
      getCart();
    }
  }, [isMounted, cartData, getCart]);
  async function removeItem(productId: string) {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      setRemovingId(productId);
      const response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/cart/" + productId,
        {
          method: "DELETE",
          headers: {
            token: token,
          },
        }
      );
      const data: CartResponse = await response.json();
      console.log(data);
      if (data.status == "success") {
        toast.success("Item deleted successfully");
        setCartData(data);
      } else {
        toast.error(data.message || "Failed to delete item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting item");
    } finally {
      setRemovingId(null);
    }
  }
  async function updateItem(productId: string, count: number) {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      setUpdatingId(productId);
      const response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/cart/" + productId,
        {
          method: "PUT",
          body: JSON.stringify({ count }),
          headers: {
            token: token,
            "content-type": "application/json",
          },
        }
      );
      const data: CartResponse = await response.json();
      console.log(data);
      if (data.status == "success") {
        toast.success("Item quantity updated successfully");
        setCartData(data);
      } else {
        toast.error(data.message || "Failed to update item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating item");
    } finally {
      setUpdatingId(null);
    }
  }
  async function clearCart() {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      setIsClearing(true);
      const response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/cart/",
        {
          method: "DELETE",
          headers: {
            token: token,
            "content-type": "application/json",
          },
        }
      );
      const data: CartResponse = await response.json();
      console.log(data);
      if (data.message == "success") {
        toast.success("Cart cleared successfully");
        setCartData(null);
      } else {
        toast.error(data.message || "Failed to clear cart");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error clearing cart");
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <>
      {!isMounted ||
      isLoading ||
      typeof cartData?.data.products[0]?.product == "string" ? (
        <Loading />
      ) : cartData?.numOfCartItems! > 0 ? (
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">
            {cartData?.numOfCartItems} items in your Cart
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start mt-6">
            <div className="lg:col-span-2 space-y-4">
              {cartData?.data.products.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 rounded-xl border p-4 shadow-sm bg-card"
                >
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-24 h-24 rounded-lg object-cover md:w-28 md:h-28"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="">
                        <h3 className="font-semibold text-base md:text-lg line-clamp-2">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product.brand.name} .{" "}
                          {item.product.category.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.price} EGP</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="decrease"
                          className="size-8 rounded-lg border hover:bg-accent"
                          onClick={() =>
                            updateItem(item.product._id, item.count - 1)
                          }
                          disabled={
                            updatingId === item.product._id || item.count == 1
                          }
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">
                          {updatingId == item.product._id ? (
                            <Loader className="animate-spin" />
                          ) : (
                            item.count
                          )}
                        </span>
                        <button
                          aria-label="increase"
                          className="size-8 rounded-lg border hover:bg-accent"
                          onClick={() =>
                            updateItem(item.product._id, item.count + 1)
                          }
                          disabled={updatingId === item.product._id}
                        >
                          +
                        </button>
                      </div>
                      <button
                        aria-label="remove"
                        className="text-sm cursor-pointer flex text-destructive hover:underline items-center"
                        onClick={() => removeItem(item.product._id)}
                      >
                        {removingId == item.product._id && (
                          <Loader className="animate-spin" />
                        )}
                        remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* order summary */}
            <div className="lg:col-span-1 sticky top-18">
              <div className="rounded-xl border p-5 shadow-sm">
                <h2 className="text-lg font-semibold"> Order Summary</h2>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground ">
                      Subtotal:({cartData?.numOfCartItems} items)
                    </span>
                    <span className="font-semibold">
                      {cartData?.data.totalCartPrice} EGP
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Shipping
                    </span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                </div>
                <div className="my-4 border-t" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-bold">
                    {cartData?.data.totalCartPrice} EGP
                  </span>
                </div>
                <CheckOut cartId={cartData?.cartId!} />
                <Button className="w-full text-lg mt-2">
                  Continue Shopping
                </Button>
              </div>
              <Button
                variant={"outline"}
                className="mt-2 ms-auto text-destructive hover:text-destructive flex"
                onClick={clearCart}
              >
                {isClearing ? <Loader className="animate-spin" /> : <Trash2 />}
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[75vh] items-center justify-center flex-col ">
          <h2 className="text-2xl my-4">Your cart is empty </h2>
          <Link href={"/products"}>
            <Button>Add products to cart</Button>
          </Link>
        </div>
      )}
    </>
  );
}
