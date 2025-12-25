import { CategoryI } from "@/interfaces";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function Categories() {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/categories"
  );
  const { data: categories }: { data: CategoryI[] } = await response.json();
  console.log(categories);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 px-3 mx-auto container">
        {categories.map((category) => (
          <div key={category._id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Link href={"/categories/" + category._id}>
                <CardHeader className="flex items-center justify-center">
                  <Image
                    src={category.image}
                    alt={category.name}
                    height={150}
                    width={150}
                    className=" object-contain"
                  />
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardContent>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
