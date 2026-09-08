import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { SideRail } from "@/components/layout/side-rail";
import { Button } from "@/components/ui/button";
import { SEARCH_ENABLED } from "@/services/search.service";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search people and posts — Enj" },
      { name: "description", content: "Find people and posts across the Enj network." },
      { property: "og:title", content: "Search people and posts — Enj" },
      { property: "og:description", content: "Find people and posts across the Enj network." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <AppShell rail={<SideRail />}>
      <PageHeader title="Search" subtitle="People and posts" />
      <div className="px-4 py-4 sm:px-6">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Enj"
            aria-label="Search Enj"
            disabled={!SEARCH_ENABLED}
            className="h-11 w-full rounded-full border border-input bg-muted pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
          />
        </div>

        {!SEARCH_ENABLED ? (
          <div className="mt-10 text-center">
            <p className="font-display text-lg font-semibold">Search is coming soon</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              The search endpoint isn't part of the API yet. As soon as it ships, this page starts
              returning real people and posts — no other change needed.
            </p>
            <Button variant="outline" className="mt-4" disabled>
              Waiting on the API
            </Button>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
