import type { TagSummary } from "@/lib/analytics-types";
import { maskSmall } from "@/lib/analytics-stats";
import { Badge } from "@/components/ui/badge";
import { TagMembersDialog } from "@/components/admin/tag-members-dialog";

interface TagListProps {
  tags: TagSummary[];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Tag overview table. Only aggregated counts (masked below
 * STATS_MIN_GROUP) are rendered here — the e-mail list only exists behind
 * TagMembersDialog, fetched separately on explicit confirmation.
 */
export function TagList({ tags }: TagListProps) {
  return (
    <>
      <div className="hidden sm:block bg-white rounded-xl border border-[#e2e7eb] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F1F4F6]">
              <th
                scope="col"
                className="text-left px-4 py-3 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase"
              >
                Tag
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase"
              >
                Opis
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase"
              >
                Rodzaj
              </th>
              <th
                scope="col"
                className="text-right px-4 py-3 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase"
              >
                Osoby
              </th>
              <th
                scope="col"
                className="text-right px-4 py-3 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase"
              >
                Zsynchronizowani
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase"
              >
                Ostatnia synchronizacja
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Akcje</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr
                key={tag.tag}
                className="border-b border-[#F1F4F6] last:border-0 hover:bg-[#FAFBFC]"
              >
                <td className="px-4 py-3 text-sm font-medium text-[#1E2A36]">
                  {tag.tag}
                </td>
                <td className="px-4 py-3 text-sm text-[#4A5B6A]">
                  {tag.description}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={tag.kind === "manual" ? "secondary" : "outline"}>
                    {tag.kind === "manual" ? "ręczny" : "automatyczny"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-[#1E2A36] text-right">
                  {maskSmall(tag.members)}
                </td>
                <td className="px-4 py-3 text-sm text-[#1E2A36] text-right">
                  {maskSmall(tag.synced)}
                </td>
                <td className="px-4 py-3 text-sm text-[#4A5B6A]">
                  {formatDate(tag.lastSyncedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <TagMembersDialog tag={tag.tag} memberCount={tag.members} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col gap-3">
        {tags.map((tag) => (
          <div
            key={tag.tag}
            className="bg-white rounded-xl border border-[#e2e7eb] p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="font-medium text-[#1E2A36]">{tag.tag}</p>
              <Badge variant={tag.kind === "manual" ? "secondary" : "outline"}>
                {tag.kind === "manual" ? "ręczny" : "automatyczny"}
              </Badge>
            </div>
            {tag.description && (
              <p className="text-sm text-[#4A5B6A] mb-2">{tag.description}</p>
            )}
            <p className="text-xs text-[#8A99A8] mb-3">
              {maskSmall(tag.members)} osób · zsynchronizowano{" "}
              {maskSmall(tag.synced)} · {formatDate(tag.lastSyncedAt)}
            </p>
            <TagMembersDialog tag={tag.tag} memberCount={tag.members} />
          </div>
        ))}
      </div>
    </>
  );
}
