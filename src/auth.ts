import { FailedLoginResponse, SuccessLoginResponse } from "@/interfaces"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'terka',
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
                    method: 'post',
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    }),
                    headers: { 'content-type': 'application/json' }
                })
                const payload: SuccessLoginResponse | FailedLoginResponse = await response.json()
                if ('token' in payload) {
                    return {
                        id: payload.user.email,
                        user: payload.user,
                        token: payload.token
                    }
                } else {
                    throw new Error(payload.message)
                }
            }

        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.user = user.user || user
                token.token = user.token
            }
            return token
        },
        session: ({ session, token }) => {
            if (token.user) {
                session.user = token.user
            }
            if (token.token) {
                session.user.token = token.token as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET
}