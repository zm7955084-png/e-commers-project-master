"use client";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";

export default function CheckOut({ cartId }: { cartId: string }) {
  let detailsInput = useRef<HTMLInputElement | null>(null);
  let cityInput = useRef<HTMLInputElement | null>(null);
  let phoneInput = useRef<HTMLInputElement | null>(null);

  async function checkOutSession(paymentMethod: "card" | "cash") {
    const shippingAddress = {
      details: detailsInput.current?.value,
      city: cityInput.current?.value,
      phone: phoneInput.current?.value,
    };

    if (paymentMethod === "card") {
      // Handle Visa/Card payment
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`,
        {
          method: "POST",
          body: JSON.stringify({ shippingAddress }),
          headers: {
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjlmMzcwODRkOTUwYzkwMjM2YjMzNCIsIm5hbWUiOiJtdGVya2EiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NDM1NzAwMSwiZXhwIjoxNzcyMTMzMDAxfQ.jmvORsHfTndFNe8d0uwwT3gpq3Qsd55qYEqSjK0Lbv8",
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.status == "success") {
        window.location.href = data.session.url;
      }
    } else if (paymentMethod === "cash") {
      // Handle Cash on Delivery
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        {
          method: "POST",
          body: JSON.stringify({ shippingAddress }),
          headers: {
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjlmMzcwODRkOTUwYzkwMjM2YjMzNCIsIm5hbWUiOiJtdGVya2EiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NDM1NzAwMSwiZXhwIjoxNzcyMTMzMDAxfQ.jmvORsHfTndFNe8d0uwwT3gpq3Qsd55qYEqSjK0Lbv8",
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.status == "success") {
        window.location.href = "/allorders";
      }
    }
  }
  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button className="w-full text-lg mt-4" variant="outline">
              Proceed to Checkout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Shipping Address</DialogTitle>
              <DialogDescription>
                Make sure that is your correct address.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>city</Label>
                <Input ref={cityInput} id="city" type="text" />
              </div>
              <div className="grid gap-3">
                <Label>details</Label>
                <Input ref={detailsInput} type="text" id="details" />
              </div>
              <div className="grid gap-3">
                <Label>phone</Label>
                <Input ref={phoneInput} type="tel" id="phone" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                className="cursor-pointer"
                type="button"
                onClick={() => checkOutSession("card")}
              >
                Visa
              </Button>
              <Button
                className="cursor-pointer"
                type="button"
                onClick={() => checkOutSession("cash")}
              >
                Cash
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
