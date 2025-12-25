"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.email("invalid email").nonempty("email is required "),
  password: z
    .string()
    .nonempty("password is required")
    .min(6, "min pass is 6 chars"),
});
type FormFields = z.infer<typeof formSchema>;
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  let searchParams = useSearchParams();
  console.log(searchParams.get("error"));

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormFields) {
    setIsLoading(true);
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: "/",
      redirect: true,
    });
    console.log(response);
    setIsLoading(false);
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <h1 className="my-3 text-2xl">Login</h1>
        <Card className="p-5 w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-blue-600">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                {isLoading && <Loader className="animate-spin" />}
                Log In
              </Button>
            </form>
          </Form>
          <p>
            if you don't have an account{" "}
            <Link href={"/register"} className="text-blue-600">
              register
            </Link>{" "}
            now
          </p>
        </Card>
      </div>
    </>
  );
}
