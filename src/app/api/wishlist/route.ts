import { NextResponse } from "next/server";
import { getUserToken } from "@/app/Helpers/getUserToken";

// GET -> returns wishlist items (proxied to external API if available)
export async function GET(req: Request) {
    const token = await getUserToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // If external wishlist endpoint exists, proxy it. Otherwise return empty.
    try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: { token },
        });
        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: text }, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
    }
}

// POST -> add product to wishlist { productId }
export async function POST(req: Request) {
    const token = await getUserToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const body = await req.json();
        const productId = body?.productId;
        if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

        // Proxy to external API if available
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json", token },
            body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
        return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
    }
}

// DELETE -> remove product from wishlist, expects JSON { productId }
export async function DELETE(req: Request) {
    const token = await getUserToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        // Accept productId from JSON body or query string
        let productId: string | undefined;
        try {
            const body = await req.json();
            productId = body?.productId;
        } catch (_) {
            // ignore JSON parse error
        }

        // fallback to query param
        if (!productId) {
            const url = new URL(req.url);
            productId = url.searchParams.get("productId") ?? undefined;
        }

        if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

        // Some external APIs expect DELETE /wishlist/:productId
        const tryPaths = [
            `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
            `https://ecommerce.routemisr.com/api/v1/wishlist`,
        ];

        let lastErr: any = null;
        for (const path of tryPaths) {
            try {
                const opts: any = { method: "DELETE", headers: { token } };
                if (path.endsWith("/wishlist")) {
                    opts.headers["Content-Type"] = "application/json";
                    opts.body = JSON.stringify({ productId });
                }
                const res = await fetch(path, opts);
                const text = await res.text();
                // try parse json
                try {
                    const data = JSON.parse(text);
                    if (!res.ok) return NextResponse.json({ error: data?.message ?? data ?? text }, { status: res.status });
                    return NextResponse.json(data, { status: res.status });
                } catch {
                    if (!res.ok) return NextResponse.json({ error: text }, { status: res.status });
                    return NextResponse.json({ ok: true, result: text }, { status: res.status });
                }
            } catch (err: any) {
                lastErr = err;
                // try next path
            }
        }

        return NextResponse.json({ error: String(lastErr ?? "Failed to delete") }, { status: 500 });
    } catch (err: any) {
        return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
    }
}
