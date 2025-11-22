import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getApiEndpoint } from "./api"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null

                try {
                    const res = await fetch(getApiEndpoint("/auth/token"), {
                        method: "POST",
                        body: new URLSearchParams({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    })

                    if (res.ok) {
                        const data = await res.json()
                        // Decode token to get user info or make another call to /users/me
                        // For simplicity, we'll just return the username and token for now
                        // Ideally we should call /users/me here with the token

                        const userRes = await fetch(getApiEndpoint("/auth/users/me"), {
                            headers: { Authorization: `Bearer ${data.access_token}` }
                        })

                        if (userRes.ok) {
                            const user = await userRes.json()
                            return { ...user, accessToken: data.access_token }
                        }
                    }
                    return null
                } catch (e) {
                    console.error(e)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as unknown as { accessToken: string }).accessToken
                token.username = (user as unknown as { name: string }).name
                token.id = (user as unknown as { id: number }).id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    name: token.username as string,
                    id: token.id as number,
                    accessToken: token.accessToken as string
                }
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin', // We'll need to create this page later or use default for now
    }
}
