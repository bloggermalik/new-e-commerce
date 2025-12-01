// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { db } from "@/db/drizzle"; // your drizzle instance
// import { nextCookies } from "better-auth/next-js";
// import { schema } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { admin as adminPlugin } from "better-auth/plugins";
// import { ac, admin, user, moderator } from "@/lib/auth/permission";

// export type UserType = {
//   id: string;
//   name: string;
//   email: string;
//   email_verified: boolean; // snake_case to match database
//   image: string | null;
//   created_at: Date | null; // Date to match database timestamp
//   updated_at: Date | null; // Date to match database timestamp
// };

// export const auth = betterAuth({
//   emailVerification: {
//     sendVerificationEmail: async ({}) => {
//       // Send verification email to user
//     },
//     sendOnSignUp: true,
//     autoSignInAfterVerification: true,
//     expiresIn: 3600,
//     sendOnSignIn: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//   },
//   database: drizzleAdapter(db, {
//     provider: "pg",
//     schema,
//   }),
//   events: {
//     onUserCreated: async ({ user }: { user: UserType }) => {
//       // update role in DB after signup
//       await db
//         .update(schema.user)
//         .set({ role: "user" })
//         .where(eq(schema.user.id, user.id));
//     },
//   },
//   session: {
//     // Persistent login for 30 days
//     maxAge: 30 * 24 * 60 * 60,
//     updateAge: 24 * 60 * 60,
//   },

//   advanced: {
//     useSecureCookies: true, // fine because you use HTTPS
//     cookies: {
//       session_token: {
//         attributes: {
//           path: "/",
//           sameSite: "None",
//           secure: true,
//         },
//       },
//     },
//   },

//   plugins: [
//     adminPlugin({
//       defaultRole: "regular",
//       adminRoles: ["admin", "superadmin"],
//       ac,
//       roles: {
//         admin,
//         user,
//         moderator,
//       },
//     }),
//     nextCookies(),
//   ],
// });


import { betterAuth, jwt } from "better-auth";
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
    sendVerificationEmail: async ({}) => {
      // Send verification email to user
    },
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
  events: {
    onUserCreated: async ({ user }: { user: UserType }) => {
      await db
        .update(schema.user)
        .set({ role: "user" })
        .where(eq(schema.user.id, user.id));
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
   cookie: {
      name: "__Secure-better-auth.session_token",
      sameSite: "none",
      secure: true
    }
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production", // Changed this
    crossSubDomainCookies: {
      enabled: true, // Add this for better cross-origin support
    },
    cookies: {
      session_token: {
        attributes: {
          path: "/",
          sameSite: "none", // lowercase 'none'
          secure: true,
          httpOnly: true, // Add this
          domain: undefined // Let it auto-detect
        },
      },
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