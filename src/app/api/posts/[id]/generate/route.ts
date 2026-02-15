import { NextRequest, NextResponse } from "next/server";
import { generatePostSlides } from "@/lib/generate-slides";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const generatedSlides = await generatePostSlides(Number(id));
    return NextResponse.json({ slides: generatedSlides });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
