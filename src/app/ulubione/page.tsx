import { requireProgramUser } from "@/lib/program-auth";
import { getPostBySlug, getPostSlides } from "@/lib/posts";
import { PostCard } from "@/components/feed/post-card";
import { LikeProvider } from "@/components/feed/like-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { t, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";
import { getLocaleFromCookies } from "@/lib/locale-cookie";
import Link from "next/link";

export default async function FavoritesPage() {
  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookies(cookieStore);
  const d = t(locale);
  const { user, supabase } = await requireProgramUser();

  const { data } = await supabase
    .from("user_interactions")
    .select("target_id, created_at")
    .eq("user_id", user.id)
    .eq("interaction_type", "like")
    .eq("target_type", "post")
    .order("created_at", { ascending: false });

  const slugs = (data ?? []).map((row) => row.target_id);

  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      const slides = getPostSlides(post);
      return {
        slug: post.slug,
        topicTag: post.topicTag,
        headline: post.headline,
        caption: post.caption,
        publishedAt: post.publishedAt,
        slides: slides.map((s) => ({
          filename: s.filename,
          slideNumber: s.slideNumber,
        })),
      };
    })
    .filter(Boolean) as { slug: string; topicTag: string; headline: string; caption: string | null; publishedAt: string | null; slides: { filename: string; slideNumber: number }[] }[];

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <SiteHeader locale={locale} />

      <LikeProvider initialLikedSlugs={slugs} isLoggedIn={true}>
        <main className="max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-[#1E2A36]">{d.favorites}</h1>
            <Link
              href="/profil"
              className="text-sm text-[#8A99A8] hover:text-[#7B9E8C] transition-colors"
            >
              {d.navMyAccount}
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8A99A8] text-lg">{d.favoritesEmpty}</p>
              <p className="text-[#b5bfc9] text-sm mt-1">{d.favoritesEmptySubtitle}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </main>
      </LikeProvider>

      <SiteFooter locale={locale} />
    </div>
  );
}
