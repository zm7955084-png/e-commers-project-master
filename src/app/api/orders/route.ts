import { getUserToken } from "@/app/Helpers/getUserToken";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await getUserToken();
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v1/orders", {
        headers: {
            token: token,
        },
    });

    const data = await response.json();
    return NextResponse.json(data);
}
