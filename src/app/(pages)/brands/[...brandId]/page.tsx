import { productI, BrandI } from "@/interfaces";
import { Params } from "next/dist/server/request/params";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import MyStarIcon from "@/components/myStarIcon/myStarIcon";
import AddToCart from "@/components/addToCart/AddToCart";

interface ErrorCardProps {
  message: string;
}

function ErrorCard({ message }: ErrorCardProps) {
  return (
    <Card className="w-3/4 mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-red-600">Error</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default async function BrandDetails({ params }: { params: Params }) {
  const { brandId } = await params;

  // Extract ID from catch-all routing
  let id: string;
  if (Array.isArray(brandId)) {
    id = brandId[0];
  } else if (typeof brandId === "string") {
    id = brandId;
  } else {
    id = "";
  }

  console.log("Full params:", params);
  console.log("brandId value:", brandId);
  console.log("Extracted ID:", id);

  if (!id) {
    return <ErrorCard message="No brand ID provided" />;
  }

  try {
    // Fetch brand details
    const brandResponse = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${id}`
    );
    if (!brandResponse.ok) {
      return (
        <ErrorCard message={`Failed to fetch brand: ${brandResponse.status}`} />
      );
    }
    const { data: brand }: { data: BrandI } = await brandResponse.json();

    // Fetch all products and filter by brand
    // Use limit to get more products (default is 40, max available)
    const productsResponse = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products?limit=200"
    );
    if (!productsResponse.ok) {
      return <ErrorCard message="Failed to fetch products" />;
    }
    const { data: allProducts } = await productsResponse.json();
    const brandProducts = allProducts.filter(
      (p: productI) => p.brand._id === brand._id
    );

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Brand Header */}
        <div className="mb-8">
          <Card className="grid md:grid-cols-2 items-center gap-4">
            <div className="p-4 flex justify-center">
              <Image
                src={brand.image}
                alt={brand.name}
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <CardHeader>
                <CardTitle className="text-3xl">{brand.name}</CardTitle>
                <CardDescription className="text-lg">
                  {brandProducts.length} Products
                </CardDescription>
              </CardHeader>
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {brandProducts.map((product: productI) => (
            <Link href={"/products/" + product._id} key={product._id}>
              <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <CardContent className="grow p-3">
                  <CardDescription className="line-clamp-1 mb-2">
                    {product.category.name}
                  </CardDescription>
                  <CardTitle className="text-sm line-clamp-2 mb-2">
                    {product.title}
                  </CardTitle>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MyStarIcon key={i} />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">
                      ({product.ratingsQuantity})
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {brandProducts.length === 0 && (
          <Card className="w-full p-8 text-center">
            <CardDescription className="text-lg">
              No products found for this brand
            </CardDescription>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching brand details:", error);
    return (
      <ErrorCard
        message={
          error instanceof Error
            ? error.message
            : "An error occurred while fetching brand details"
        }
      />
    );
  }
}
