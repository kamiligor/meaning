import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E2A36]">New Post</h1>
        <p className="text-sm text-[#8A99A8] mt-1">
          Create a new carousel post
        </p>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
