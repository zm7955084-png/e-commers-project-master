"use client";
import { Button } from "@/components/ui/button";
import { Session } from "inspector";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const session = useSession();
  return (
    <>
      <div className="flex flex-col items-center justify-center h-100 bg-white text-center">
        <h1 className="text-4xl font-bold mb-4 uppercase">
          Hi {session.data?.user.name}
        </h1>
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopMart</h1>
        <p className="mb-8 text-lg text-gray-600 w-2/4">
          Discover the latest technology, fashion, and lifestyle products.
          Quality guaranteed with fast shipping and excellent customer service.
        </p>
        <div className="flex space-x-4">
          <Link href={"/products"}>
            <Button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-200">
              Shop Now
            </Button>
          </Link>
          <Link href={"/categories"}>
            <Button className="border border-gray-400 px-6 py-2 rounded-md bg-gray-500 hover:bg-gray-400 transition duration-200">
              Browse Categories
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
