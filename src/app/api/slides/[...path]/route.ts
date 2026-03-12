import { NextRequest, NextResponse } from "next/server";
import { getFile } from "@/lib/storage";
import { regenerateSlide } from "@/lib/regenerate-slide";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filename = path.join("/");

  // Try serving from filesystem first
  try {
    const buffer = await getFile(filename);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch {
    // File not on disk — try to regenerate
  }

  // Regenerate the slide on-demand
  const buffer = await regenerateSlide(filename);
  if (!buffer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": buffer.length.toString(),
    },
  });
}
