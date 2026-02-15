import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, slides } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, Number(id)),
  });

  if (!post) notFound();

  const postSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.postId, post.id))
    .orderBy(slides.slideNumber);

  const initialData = {
    topicTag: post.topicTag,
    headline: post.headline,
    subtitle: post.subtitle || "Swipe to learn why",
    iconType: post.iconType || "clock",
    contentTag: post.contentTag || "Why it works",
    contentBody: post.contentBody,
    sectionNumber: post.sectionNumber || "01",
    quote: post.quote,
    quoteAttribution: post.quoteAttribution || "",
    quoteIconType: post.quoteIconType || "sun",
    ctaText: post.ctaText || "Follow for {more} psychology life hacks",
    hashtags: post.hashtags,
    handleBio: post.handleBio || "psychology \u00B7 life hacks \u00B7 mental health",
    caption: post.caption || "",
    colorPalette: post.colorPalette || "sage",
    logoVariant: post.logoVariant || "light",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E2A36]">Edit Post</h1>
        <p className="text-sm text-[#8A99A8] mt-1">
          {post.headline.replace(/\{|\}/g, "")}
        </p>
      </div>
      <PostForm
        mode="edit"
        postId={post.id}
        initialData={initialData}
        initialSlides={postSlides.map((s) => ({
          id: s.id,
          filename: s.filename,
          slideNumber: s.slideNumber,
        }))}
        initialStatus={post.status}
      />
    </div>
  );
}
