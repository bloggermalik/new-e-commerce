import { createAuthClient } from "better-auth/react"
import { organizationClient, adminClient } from "better-auth/client/plugins"
import { ac, admin, user, } from "@/lib/auth/permission";
import { jwtClient } from "better-auth/client/plugins";



export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins: [
        jwtClient(),
        adminClient({
            ac,
            roles: {
                admin,
                user,

            }
        }),
        organizationClient()
    ]
})