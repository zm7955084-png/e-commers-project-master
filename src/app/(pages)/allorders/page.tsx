"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type AnyObj = Record<string, any>;

export default function Page() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<AnyObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      // API might return { orders } or array directly
      const list = Array.isArray(data)
        ? data
        : (data?.orders ?? data?.data ?? data?.results ?? []);
      setOrders(list);
    } catch (err: any) {
      setError(String(err?.message ?? err ?? "Failed to fetch orders"));
    } finally {
      setLoading(false);
    }
  }

  function normalizeUrl(s?: string) {
    if (!s) return s || "";
    // protocol-less
    if (s.startsWith("//")) return `https:${s}`;
    if (s.startsWith("/")) {
      const base =
        process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce.routemisr.com";
      return `${base.replace(/\/$/, "")}${s}`;
    }
    return s;
  }

  function formatPaymentMethod(method?: string) {
    if (!method) return "-";
    const m = String(method).toLowerCase();
    if (m.includes("cash")) return "Cash on Delivery";
    if (
      m.includes("visa") ||
      m.includes("card") ||
      m.includes("mastercard") ||
      m.includes("stripe")
    )
      return "Card / Visa";
    return method;
  }

  async function handleConfirmCash(orderId: string) {
    try {
      const res = await fetch("/api/orders/confirm-cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to confirm cash");

      // optimistically update local state
      setOrders((prev) =>
        prev.map((o) => {
          const oid = o._id ?? o.id ?? o.orderId ?? String(o);
          if (String(oid) === String(orderId)) return { ...o, isPaid: true };
          return o;
        })
      );
    } catch (err: any) {
      console.error("confirm cash error", err);
      setError(String(err?.message ?? err ?? "Failed to confirm cash"));
    }
  }

  function extractImages(item: AnyObj) {
    const imgs: string[] = [];
    const push = (v: any) => {
      if (!v) return;
      if (Array.isArray(v)) v.forEach(push);
      else if (typeof v === "string") imgs.push(normalizeUrl(v));
      else if (typeof v === "object") {
        if (v.url) imgs.push(normalizeUrl(v.url));
        else if (v.src) imgs.push(normalizeUrl(v.src));
        else if (v.path) imgs.push(normalizeUrl(v.path));
      }
    };

    // common locations
    push(
      item.image ||
        item.images ||
        item.imagesUrl ||
        item.product?.images ||
        item.product?.imageCover
    );
    // ensure imageCover first if present
    if (item.product?.imageCover)
      imgs.unshift(normalizeUrl(item.product.imageCover));
    // dedupe
    return Array.from(new Set(imgs)).filter(Boolean);
  }

  function getCategory(item: AnyObj) {
    if (!item) return "-";
    return (
      item.category?.name ??
      item.subcategory?.[0]?.name ??
      item.product?.category?.name ??
      "-"
    );
  }

  if (status === "unauthenticated") {
    return <div className="p-6">Please login to see your orders.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Orders</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid gap-4">
        {orders.length === 0 && !loading && <div>No orders found.</div>}

        {orders.map((order: AnyObj, orderIndex: number) => {
          const id =
            order._id ??
            order.id ??
            order.orderId ??
            `order-${orderIndex}`;
          const user = order.user ?? order.customer ?? {};
          const createdAt = order.createdAt
            ? new Date(order.createdAt).toUTCString()
            : (order.createdAt ?? "-");
          const items =
            order.cartItems ??
            order.items ??
            order.products ??
            order.orderItems ??
            [];

          const itemOrders = items.map((it: AnyObj, idx: number) => ({
            id: `${id}-item-${idx}`,
            createdAt,
            user,
            total: Number(
              (it.qty ?? it.quantity ?? 1) * (it.price ?? it.unitPrice ?? 0)
            ),
            item: it,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
          }));

          return (
            <details
              key={id}
              className="p-4 border rounded-md bg-white shadow-sm"
            >
              <summary className="flex justify-between items-center cursor-pointer">
                <div>
                  <div className="font-medium">Order: {String(id)}</div>
                  <div className="text-sm text-gray-500">{createdAt}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ${Number(order.total ?? order.totalPrice ?? 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {user?.email ?? user?.name ?? "Customer"}
                  </div>
                </div>
              </summary>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Shipping</h3>
                  <div className="text-sm text-gray-700">
                    {order.shippingAddress ? (
                      <div>
                        <div>{order.shippingAddress.address}</div>
                        <div>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.country}
                        </div>
                        <div>{order.shippingAddress.postalCode}</div>
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Method of pay</h3>
                  <div className="text-sm text-gray-700">
                    <div>{formatPaymentMethod(order.paymentMethod)}</div>
                    <div>Paid: {order.isPaid ? "Yes" : "No"}</div>
                    <div>Delivered: {order.isDelivered ? "Yes" : "No"}</div>
                    {String(order.paymentMethod ?? "")
                      .toLowerCase()
                      .includes("cash") && !order.isPaid ? (
                      <div className="mt-2">
                        <button
                          className="px-3 py-1 bg-emerald-600 text-white rounded"
                          onClick={() => handleConfirmCash(order._id ?? id)}
                        >
                          Confirm cash payment
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Items</h3>
                  <div className="space-y-3">
                    {items.map((it: AnyObj, idx: number) => {
                      const images = extractImages(it);
                      const category = getCategory(it);
                      return (
                        <div
                          key={idx}
                          className="flex gap-3 items-center p-2 border rounded"
                        >
                          <div className="w-20 shrink-0">
                            <img
                              src={it.product?.imageCover ?? images[0] ?? ""}
                              alt={it.product?.title ?? it.name}
                              className="w-20 h-20 object-cover rounded"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "https://via.placeholder.com/150";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {it.name ?? it.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              Qty: {it.qty ?? it.quantity ?? 1} • $
                              {Number(it.price ?? it.unitPrice ?? 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Category: {category}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
