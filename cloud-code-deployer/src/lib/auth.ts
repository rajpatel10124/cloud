import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from "./supabase"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check if user exists in Supabase
        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user) {
          return null
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password)
        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        // Check if user exists in Supabase, if not create them
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', user.email!)
          .single()

        if (!existingUser) {
          const { error } = await supabaseAdmin
            .from('users')
            .insert({
              id: user.id,
              email: user.email!,
              name: user.name || profile?.name || '',
            })

          if (error) {
            console.error('Error creating user:', error)
            return false
          }
        }
      }
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (user) {
          session.user.id = user.id
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}