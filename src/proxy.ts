import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const protectedPages = ['/cart', '/profile', '/order']
const authPages = ['/login', '/register']
export default async function proxy(req: NextRequest) {
    const token = await getToken({ req })
    if (protectedPages.includes(req.nextUrl.pathname)) {
        if (token) {
            return NextResponse.next()
        } else {
            const base = req.nextUrl?.origin || process.env.NEXT_URL || 'http://localhost:3000'
            const redirectUrl = new URL('/login', base)
            return NextResponse.redirect(redirectUrl)
        }
    }
    if (authPages.includes(req.nextUrl.pathname)) {
        if (!token) {
            return NextResponse.next()
        } else {
            const base = req.nextUrl?.origin || process.env.NEXT_URL || 'http://localhost:3000'
            const redirectUrl = new URL('/', base)
            return NextResponse.redirect(redirectUrl)
        }
    }
    return NextResponse.next()
}