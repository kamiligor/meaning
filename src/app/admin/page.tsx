import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function AdminDashboard() {
  const allPosts = getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2A36]">Posts</h1>
          <p className="text-sm text-[#8A99A8] mt-1">
            {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {allPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center">
          <p className="text-[#8A99A8] text-lg mb-2">No posts yet</p>
          <p className="text-[#8A99A8] text-sm">
            Create a Markdown file in content/posts/ to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F1F4F6]">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase">
                  Locale
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase">
                  Palette
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {allPosts.map((post) => (
                <tr
                  key={post.slug}
                  className="border-b border-[#F1F4F6] last:border-0 hover:bg-[#FAFBFC] transition"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1E2A36]">
                      {post.headline.replace(/\{|\}/g, "")}
                    </p>
                    <p className="text-xs text-[#8A99A8] mt-0.5">
                      {post.topicTag}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                        post.status === "published"
                          ? "bg-[#e8f0eb] text-[#7B9E8C]"
                          : "bg-[#F1F4F6] text-[#8A99A8]"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4A5B6A] uppercase">
                      {post.locale}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4A5B6A] capitalize">
                      {post.colorPalette}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-sm text-[#7B9E8C] font-medium hover:text-[#6a8d7b] transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
