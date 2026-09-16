"use client";

import { useMemo, useState } from "react";
import type { PostRow } from "@/lib/analytics-types";
import { PillTabs } from "@/components/admin/pill-tabs";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";

interface PostsSectionProps {
  posts: PostRow[];
}

const LOCALE_OPTIONS: { key: "all" | "pl" | "en"; label: string }[] = [
  { key: "all", label: "Wszystkie" },
  { key: "pl", label: "PL" },
  { key: "en", label: "EN" },
];

function formatReadRate(rate: number | null) {
  return rate === null ? "—" : `${Math.round(rate * 100)}%`;
}

/**
 * Locale pills filter locally on the already-fetched top-10 list (no
 * re-fetch), the table underneath sorts locally too.
 */
export function PostsSection({ posts }: PostsSectionProps) {
  const [locale, setLocale] = useState<"all" | "pl" | "en">("all");

  const filtered = useMemo(
    () => (locale === "all" ? posts : posts.filter((p) => p.locale === locale)),
    [posts, locale]
  );

  const columns: DataTableColumn<PostRow>[] = [
    {
      key: "title",
      header: "Tytuł",
      sortValue: (r) => r.title,
      render: (r) => r.title,
    },
    {
      key: "locale",
      header: "Język",
      sortValue: (r) => r.locale,
      render: (r) => <span className="uppercase">{r.locale}</span>,
    },
    {
      key: "views",
      header: "Wyświetlenia",
      align: "right",
      sortValue: (r) => r.views,
      render: (r) => r.views,
    },
    {
      key: "uniqueViews",
      header: "Unikalni",
      align: "right",
      sortValue: (r) => r.uniqueViews,
      render: (r) => r.uniqueViews,
    },
    {
      key: "readRate",
      header: "% dotarcia do końca",
      align: "right",
      sortValue: (r) => r.readRate ?? -1,
      render: (r) => formatReadRate(r.readRate),
    },
    {
      key: "likes",
      header: "Lajki",
      align: "right",
      sortValue: (r) => r.likes,
      render: (r) => r.likes,
    },
  ];

  return (
    <div>
      <PillTabs
        options={LOCALE_OPTIONS}
        active={locale}
        onChange={setLocale}
        ariaLabel="Filtruj posty po języku"
      />
      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={filtered}
          getRowKey={(r) => `${r.slug}-${r.locale}`}
          defaultSortKey="views"
          defaultSortDir="desc"
          emptyMessage="Brak postów w tym filtrze."
          renderCard={(r) => (
            <div className="bg-white rounded-xl border border-[#e2e7eb] p-4">
              <p className="font-medium text-[#1E2A36]">{r.title}</p>
              <p className="text-xs text-[#8A99A8] uppercase mt-0.5">
                {r.locale}
              </p>
              <p className="text-sm text-[#4A5B6A] mt-2">
                {r.views} wyśw. · {r.uniqueViews} unikalnych ·{" "}
                {formatReadRate(r.readRate)} do końca · {r.likes} lajków
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
