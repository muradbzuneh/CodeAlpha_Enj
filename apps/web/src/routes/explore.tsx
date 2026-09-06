import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { SideRail } from "@/components/layout/side-rail";
import { PostList } from "@/components/post/post-list";
import { usePostFeed } from "@/hooks/use-posts";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore trending posts — Enj" },
      {
        name: "description",
        content: "The most liked and discussed posts on Enj right now, from across the network.",
      },
      { property: "og:title", content: "Explore trending posts — Enj" },
      {
        property: "og:description",
        content: "The most liked and discussed posts on Enj right now, from across the network.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const feed = usePostFeed("trending");

  return (
    <AppShell rail={<SideRail />}>
      <PageHeader title="Explore" subtitle="Trending across Enj" />
      <PostList
        posts={feed.posts}
        isLoading={feed.isLoading}
        error={feed.error}
        emptyTitle="Nothing trending yet"
        emptyHint="Once people start posting, the liveliest posts land here."
        hasNextPage={feed.hasNextPage}
        isFetchingNextPage={feed.isFetchingNextPage}
        onLoadMore={() => void feed.fetchNextPage()}
        onRetry={() => void feed.refetch()}
      />
    </AppShell>
  );
}
