interface EmptyStateProps {
  title: string;
  description?: string;
}

/**
 * Calm empty state, no exclamation marks — mirrors the tone of the
 * existing "No posts yet" message in admin/page.tsx.
 */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e7eb] p-10 text-center">
      <p className="text-[#8A99A8] text-base mb-1">{title}</p>
      {description && (
        <p className="text-[#8A99A8] text-sm">{description}</p>
      )}
    </div>
  );
}
