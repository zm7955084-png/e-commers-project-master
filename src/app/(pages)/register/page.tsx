"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z.email("invalid email").nonempty("email is required "),
    name: z
      .string()
      .nonempty("name is required ")
      .min(3, "min length is 3")
      .max(10, "max is 10"),
    password: z
      .string()
      .nonempty("password is required")
      .min(6, "min pass is 6 chars"),
    rePassword: z.string().nonempty("confirm is required"),
    phone: z
      .string()
      .nonempty("phone is required")
      .regex(/^01[0251][0-9]{8}$/),
  })
  .refine((e) => e.password === e.rePassword, {
    path: ["rePassword"],
    error: "password & rePassword not matched",
  });

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  async function handelRegister(values: any) {
    setIsLoading(true);
    console.log(values);
    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        values
      );
      console.log("success", response);
      if (response.data.message == "success") {
        toast.success("Successfully Registration");
        // Reset all fields
        form.reset();
        // Redirect to login after 1 second
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (err: any) {
      console.log("err", err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      form.setValue("name", "");
      form.setValue("password", "");
      form.setValue("email", "");
      form.setValue("rePassword", "");
      form.setValue("phone", "");
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <h1 className="my-3 text-2xl">Register</h1>
        <Card className="p-5 w-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handelRegister)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input placeholder="ali" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ali@example.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>rePassword</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading || !isMounted}
              >
                {isMounted && isLoading && (
                  <Loader className="animate-spin mr-2" />
                )}
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}
