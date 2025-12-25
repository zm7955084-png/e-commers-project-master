import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = body?.email;
        if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

        // Proxy request to external API
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                referer: (await headers()).get("referer") ?? "",
            },
            body: JSON.stringify({ email }),
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: res.status });
        } catch {
            return NextResponse.json({ ok: res.ok, result: text }, { status: res.status });
        }
    } catch (err: any) {
        return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
    }
}
