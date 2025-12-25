
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getUserToken() {
    const cookieToken = (await cookies()).get("next-auth.session-token")?.value;
    const secret = process.env.NEXTAUTH_SECRET;
    if (!cookieToken || !secret) return null;
    try {
        const accessToken = await decode({ token: cookieToken, secret });
        return (accessToken as any)?.token ?? null;
    } catch (err) {
        return null;
    }
}