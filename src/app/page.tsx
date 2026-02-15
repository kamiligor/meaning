import { db } from "@/db";
import { posts, slides } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { InfiniteFeed } from "@/components/feed/infinite-feed";

const LIMIT = 10;

export default async function Home() {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.id))
    .limit(LIMIT + 1);

  const hasMore = result.length > LIMIT;
  const items = hasMore ? result.slice(0, LIMIT) : result;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  const postsWithSlides = await Promise.all(
    items.map(async (post) => {
      const postSlides = await db
        .select()
        .from(slides)
        .where(eq(slides.postId, post.id))
        .orderBy(slides.slideNumber);
      return {
        id: post.id,
        slug: post.slug,
        topicTag: post.topicTag,
        headline: post.headline,
        caption: post.caption,
        publishedAt: post.publishedAt,
        slides: postSlides.map((s) => ({
          id: s.id,
          filename: s.filename,
          slideNumber: s.slideNumber,
        })),
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F1F4F6]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-center">
          <a href="/" className="flex flex-col items-center">
            <span
              className="text-[10px] italic text-[#8A99A8] leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              just
            </span>
            <span
              className="text-xl font-extrabold text-[#1E2A36] leading-none -mt-0.5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              have
            </span>
            <span
              className="text-[9px] italic text-[#7B9E8C] leading-none -mt-0.5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              a little
            </span>
            <span
              className="text-xl font-extrabold text-[#7B9E8C] leading-none -mt-0.5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              meaning
            </span>
          </a>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {postsWithSlides.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8A99A8] text-lg">No posts yet</p>
            <p className="text-[#b5bfc9] text-sm mt-1">
              Check back soon for new content
            </p>
          </div>
        ) : (
          <InfiniteFeed
            initialPosts={postsWithSlides}
            initialCursor={nextCursor}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F1F4F6] py-8 text-center">
        <p className="text-xs text-[#8A99A8] tracking-widest uppercase">
          just have a little meaning
        </p>
      </footer>
    </div>
  );
}
