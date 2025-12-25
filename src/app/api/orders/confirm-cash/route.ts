import { NextResponse } from "next/server";
import { getUserToken } from "@/app/Helpers/getUserToken";

export async function POST(req: Request) {
    const token = await getUserToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const orderId = body?.orderId;
        if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

        return NextResponse.json({ ok: true, orderId });
    } catch (err: any) {
        return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
    }
}
