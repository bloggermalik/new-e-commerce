// app/api/flash/clear/route.ts
import { cookies } from "next/headers";

const FLASH_COOKIE_NAME = "flash_message";

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(FLASH_COOKIE_NAME);
  return Response.json({ success: true });
}
