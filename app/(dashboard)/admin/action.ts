import { cookies } from 'next/headers';

const FLASH_COOKIE_NAME = 'flash_message';


export async function deleteFlashMessage(): Promise<void> {
  const cookieStore = await cookies(); // 👈 wait for the Promise
  cookieStore.delete(FLASH_COOKIE_NAME);
}