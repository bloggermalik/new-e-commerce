import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user, moderator } from "@/lib/auth/permission";

export type UserType = {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  image: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({}) => {},
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
    sendOnSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  // 🔥🔥 THIS FIXES CAPACITOR SESSION RESET
  session: {
    // 30 days persistent session
    maxAge: 30 * 24 * 60 * 60, // 30 days (in seconds)
    
    // refresh cookie every 24 hours
    updateAge: 24 * 60 * 60,  
    
    // allow long-lived sessions
    rememberMe: true,
  },

  // 🔥 IMPORTANT FOR CAPACITOR COOKIE BEHAVIOR
  advanced: {
    // Only use secure cookies in production (real HTTPS domain)
    useSecureCookies: process.env.NODE_ENV === "production",

    // Optional: ensure cookies have an explicit path
    cookies: {
      session_token: {
        attributes: {
          path: "/",        
        },
      },
    },
  },

  events: {
    onUserCreated: async ({ user }: { user: UserType }) => {
      await db
        .update(schema.user)
        .set({ role: "user" })
        .where(eq(schema.user.id, user.id));
    },
  },

  plugins: [
    adminPlugin({
      defaultRole: "regular",
      adminRoles: ["admin", "superadmin"],
      ac,
      roles: {
        admin,
        user,
        moderator,
      },
    }),

    nextCookies(),
  ],
});
