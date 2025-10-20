// utils/permissions.ts
import { auth } from "@/lib/auth"

type Permission = {
  [resource: string]: string[]
}

export async function can(session: any, permission: Permission): Promise<boolean> {
  if (!session?.session?.userId) return false

  try {
    const result = await auth.api.userHasPermission({
      body: {
        userId: session.session.userId,
        role: session.user?.role, // server-only role
        permission,
      },
    })

    return result.success === true
  } catch (error) {
    console.error("❌ Permission check failed:", error)
    return false
  }
}
