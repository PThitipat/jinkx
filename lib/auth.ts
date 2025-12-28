import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { createClient } from "@supabase/supabase-js"

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    // Ensure user exists / update basic profile on every sign-in
    async signIn({ user, account }) {
      if (!account?.providerAccountId) return false

      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("Xjinkx_users")
          .select("id")
          .eq("discord_id", account.providerAccountId)
          .single()

        // If user doesn't exist, create with reset_token = 2
        if (!existingUser) {
          const { error } = await supabase
            .from("Xjinkx_users")
            .insert({
              discord_id: account.providerAccountId,
              name: user.name ?? null,
              email: user.email ?? null,
              image: (user as any).image ?? null,
              reset_token: 2,
              last_updated: new Date().toISOString(),
            })

          if (error) {
            return false
          }
        } else {
          // Update existing user (without changing reset_token)
          const { error } = await supabase
            .from("Xjinkx_users")
            .update({
              name: user.name ?? null,
              email: user.email ?? null,
              image: (user as any).image ?? null,
              last_updated: new Date().toISOString(),
            })
            .eq("discord_id", account.providerAccountId)

          if (error) {
            return false
          }
        }
      } catch {
        // Silently handle errors
      }

      return true
    },
    async jwt({ token }) {
      if (!token.sub) return token
      try {
        const { data, error } = await supabase
          .from("Xjinkx_users")
          .select("id, points, role, reset_token")
          .eq("discord_id", token.sub)
          .limit(1)
          .single()

        if (!error && data) {
          ;(token as any).userId = data.id
          ;(token as any).points = data.points ?? 0
          ;(token as any).role = data.role ?? "Member"
          ;(token as any).reset_token = data.reset_token ?? 0
        }
      } catch {
        // Silently handle errors
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = (token as any).userId
        ;(session.user as any).points = (token as any).points ?? 0
        ;(session.user as any).role = (token as any).role ?? "Member"
        ;(session.user as any).reset_token = (token as any).reset_token ?? 0
        ;(session.user as any).discord_id = token.sub // Discord ID from provider
      }
      return session
    },
  },
}

