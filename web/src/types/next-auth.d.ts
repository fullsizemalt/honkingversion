import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      accessToken?: string
      name?: string | null
      email?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: number
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number
    accessToken?: string
    username?: string
  }
}
