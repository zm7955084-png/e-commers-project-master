"use client";
import React, { useContext } from "react";
import { useSession, signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, ShoppingCartIcon, UserIcon, Heart } from "lucide-react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { cartData, isLoading } = useContext(CartContext);
  const session = useSession();
  return (
    <>
      <nav className="bg-gray-100 text-2xl font-semibold px-6 py-3  mx-auto sticky top-0">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1>
              <Link href={"/"}>ShopMart</Link>
            </h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/brands" prefetch>
                      brands
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/categories" prefetch>
                      categories
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/products" prefetch>
                      products
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/wishlist" prefetch>
                      wishlist
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
              {session.status == "authenticated" && (
                <h2>Hi {session.data.user.name}</h2>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <UserIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {session.status == "authenticated" ? (
                    <>
                      <DropdownMenuSeparator />
                      <Link href={"/profile"}>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/login" })}
                      >
                        LogOut
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={"/login"}>
                        <DropdownMenuItem>login</DropdownMenuItem>
                      </Link>
                      <Link href={"/register"}>
                        <DropdownMenuItem>register</DropdownMenuItem>
                      </Link>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {session.status == "authenticated" && (
                <div className="relative">
                  <Link href={"/cart"}>
                    <ShoppingCartIcon />
                    <Badge className="h-5 absolute -top-3 -end-3 min-w-5 rounded-full px-1 font-mono tabular-nums">
                      {isLoading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        cartData?.numOfCartItems
                      )}
                    </Badge>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
