import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema"
import { eq } from "drizzle-orm";
import { admin as adminPlugin } from "better-auth/plugins"
import { ac, admin, user, moderator } from "@/lib/auth/permission";



export type UserType = {
  id: string
  name: string
  email: string
  email_verified: boolean   // snake_case to match database
  image: string | null
  created_at: Date | null // Date to match database timestamp
  updated_at: Date | null // Date to match database timestamp
}

export const auth = betterAuth({
    emailVerification: {
		sendVerificationEmail: async ({  }) => {
			// Send verification email to user
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600,
        sendOnSignIn: true
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
    events: {
    onUserCreated: async ({ user }: { user: UserType }) => {
      // update role in DB after signup
      await db
        .update(schema.user)
        .set({ role: "user" })
        .where(eq(schema.user.id, user.id));
    },
  },
  
    plugins: [ adminPlugin({
            defaultRole: "regular",
            adminRoles: ["admin", "superadmin"],
            ac,
            roles: {
                admin,
                user,
                moderator,
            }
        }),nextCookies()]
});