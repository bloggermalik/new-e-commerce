// lib/cookie-flash.ts

'use server'; // The delete function needs to be a Server Action

import { cookies } from 'next/headers';

const FLASH_COOKIE_NAME = 'flash_message';

/**
 * SET: Sets the flash message cookie (Can be used in any Server Action/Route Handler).
 */
export async function setFlashMessage(message: string): Promise<void> {
  const thirtySeconds = 30;
  const cookieStore = await cookies();
  cookieStore.set(FLASH_COOKIE_NAME, message, {
    maxAge: thirtySeconds,
    path: '/',
  });
}

/**
 * READ: Reads the flash message (Can be used in a Server Component).
 * NOTE: This function NO LONGER deletes the cookie.
 */
export async function readFlashMessage(): Promise<string | null> {
  const cookieStore = await cookies();
  const flashMessage = cookieStore.get(FLASH_COOKIE_NAME);

  if (flashMessage) {
    return flashMessage.value;
  }
  return null;
}

/**
 * DELETE: Deletes the flash message cookie (MUST be a Server Action).
 */
