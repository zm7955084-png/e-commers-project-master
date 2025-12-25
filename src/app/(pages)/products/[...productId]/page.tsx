import { productI } from "@/interfaces";
import { Params } from "next/dist/server/request/params";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MyStarIcon from "@/components/myStarIcon/myStarIcon";
import ProductSlider from "@/components/productSlider/ProductSlider";
import AddToCart from "@/components/addToCart/AddToCart";
import WishlistButton from "@/components/ui/wishlist-button";

export default async function ProductDetails({ params }: { params: Params }) {
  let { productId } = await params;

  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/products/" + productId
  );
  const { data: product }: { data: productI } = await response.json();
  return (
    <>
      <Card className="grid md:grid-cols-2 items-center w-3/4 mx-auto mt-2">
        <div className="p-3">
          <ProductSlider images={product.images} altContent={product.title} />
        </div>
        <div className="">
          <CardHeader>
            <CardDescription>{product.brand.name}</CardDescription>
            <CardTitle>{product.title}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardDescription>{product.category.name}</CardDescription>
            <div className="flex gap-1">
              <MyStarIcon />
              <MyStarIcon />
              <MyStarIcon />
              <MyStarIcon />
              <MyStarIcon />
              <p>({product.ratingsQuantity})</p>
            </div>
            <div className="mt-3 flex justify-between">
              <p className="font-bold">{product.price}EGP</p>
              <p className="font-bold">Quantity : {product.quantity}EGP</p>
            </div>
          </CardContent>
          <div className="flex gap-2 items-center mt-3">
            <AddToCart productId={product._id} />
          </div>
        </div>
      </Card>
    </>
  );
}
