"use client";

import { SessionProvider } from "next-auth/react";
import CartContextProvider from "./context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartContextProvider>
        {children}
      </CartContextProvider>
    </SessionProvider>
  );
}
