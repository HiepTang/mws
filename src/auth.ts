import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { db, schema } from "@/db";

const allowedAdminEmails = (process.env.ALLOWED_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),

  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],

  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?check-email=1",
    error: "/signin?error=1",
  },

  callbacks: {
    // Email-allowlist gate. Only addresses in ALLOWED_ADMIN_EMAILS can sign in.
    // The magic-link email gets sent regardless (Auth.js sends before this
    // check), but verifying the link for a non-allowed email returns false.
    signIn({ user }) {
      if (!user.email) return false;
      return allowedAdminEmails.includes(user.email.toLowerCase());
    },
  },

  session: { strategy: "database" },
});
