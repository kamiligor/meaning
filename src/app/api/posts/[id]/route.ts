import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, slides } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteFile } from "@/lib/storage";
import { sql } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, Number(id)),
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const postSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.postId, post.id))
    .orderBy(slides.slideNumber);

  return NextResponse.json({ post, slides: postSlides });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(posts)
    .set({
      ...body,
      hashtags: typeof body.hashtags === "string"
        ? body.hashtags
        : body.hashtags
          ? JSON.stringify(body.hashtags)
          : undefined,
      updatedAt: sql`(datetime('now'))`,
      publishedAt: body.status === "published" ? sql`(datetime('now'))` : undefined,
    })
    .where(eq(posts.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ post: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);

  // Delete slide files
  const existingSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.postId, postId));

  for (const s of existingSlides) {
    await deleteFile(s.filename);
  }

  await db.delete(posts).where(eq(posts.id, postId));

  return NextResponse.json({ success: true });
}
