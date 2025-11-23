import { upload } from "@imagekit/next";

export async function uploadToImageKit(file: File) {
  const resp = await fetch("/api/upload-auth");
  if (!resp.ok) throw new Error("Failed to get upload auth");

  const { token, expire, signature, publicKey } = await resp.json();

  const result = await upload({
    file,
    fileName: file.name,
    token,
    signature,
    expire,
    publicKey,
  });

  return result;
}
