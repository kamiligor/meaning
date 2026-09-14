import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { listTags } from "@/lib/tags";
import { TagList } from "@/components/admin/tag-list";
import { TagForms } from "@/components/admin/tag-forms";
import { MailerliteSyncButton } from "@/components/admin/mailerlite-sync-button";
import { EmptyState } from "@/components/admin/empty-state";

export const dynamic = "force-dynamic";

export default async function TagiPage() {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return (
      <p className="text-[#4A5B6A]">
        Brak konfiguracji SUPABASE_SERVICE_ROLE_KEY — tagi są niedostępne.
      </p>
    );
  }

  let tags;
  try {
    tags = await listTags(admin);
  } catch {
    return (
      <p className="text-[#4A5B6A]">
        Nie udało się pobrać listy tagów. Spróbuj odświeżyć stronę za chwilę.
      </p>
    );
  }

  const manualTags = tags
    .filter((t) => t.kind === "manual")
    .map((t) => ({ tag: t.tag, description: t.description }));

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E2A36] mb-1">Tagi</h1>
          <p className="text-sm text-[#4A5B6A]">
            Kto ma jaki tag, żeby w razie potrzeby wysłać kampanię mailową w
            MailerLite. Tylko liczby na tej liście — listy e-maili trzeba
            odsłonić osobno.
          </p>
        </div>
        <MailerliteSyncButton />
      </div>

      {tags.length === 0 ? (
        <EmptyState
          title="Brak zdefiniowanych tagów"
          description="Tagi automatyczne pojawią się po pierwszym naliczeniu, ręczne — po utworzeniu poniżej."
        />
      ) : (
        <TagList tags={tags} />
      )}

      <TagForms manualTags={manualTags} />
    </div>
  );
}
