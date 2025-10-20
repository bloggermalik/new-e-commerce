import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime (not Edge)

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json({ error: "fileId required" }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: "Missing IMAGEKIT_PRIVATE_KEY" }, { status: 500 });
    }

    const auth = Buffer.from(`${privateKey}:`).toString("base64");

    const res = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    // ✅ log what came back
    const text = await res.text();
    console.log("ImageKit delete response:", res.status, text);

    
    if (!res.ok) {
      return NextResponse.json(
        { error: "ImageKit delete failed", status: res.status, body: text },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
