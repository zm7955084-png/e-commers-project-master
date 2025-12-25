import { BrandI } from "@/interfaces";
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

export default async function Brands() {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
  const { data: brands }: { data: BrandI[] } = await response.json();
  console.log(brands);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 px-3 mx-auto container">
        {brands.map((brand) => (
          <div key={brand._id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Link href={"/brands/" + brand._id}>
                <CardHeader className="flex items-center justify-center">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    height={150}
                    width={150}
                    className="w-full object-contain"
                  />
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-lg">{brand.name}</CardTitle>
                </CardContent>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
