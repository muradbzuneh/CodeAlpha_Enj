import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { SideRail } from "@/components/layout/side-rail";
import { PostList } from "@/components/post/post-list";
import { Button } from "@/components/ui/button";
import { usePostFeed } from "@/hooks/use-posts";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/liked")({
  head: () => ({
    meta: [
      { title: "Posts you liked — Enj" },
      { name: "description", content: "Every Enj post you've liked, kept in one place." },
      { property: "og:title", content: "Posts you liked — Enj" },
      {
        property: "og:description",
        content: "Every Enj post you've liked, kept in one place.",
      },
    ],
  }),
  component: LikedPage,
});

function LikedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const feed = usePostFeed("liked", isAuthenticated);

  return (
    <AppShell rail={<SideRail />}>
      <PageHeader title="Likes" subtitle="Posts you've liked" />
      {!isAuthenticated && !isLoading ? (
        <div className="px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Sign in to see your likes</p>
          <Button asChild className="mt-4 rounded-full px-6">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      ) : (
        <PostList
          posts={feed.posts}
          isLoading={feed.isLoading}
          error={feed.error}
          emptyTitle="No likes yet"
          emptyHint="Tap the heart on a post and it'll show up here."
          hasNextPage={feed.hasNextPage}
          isFetchingNextPage={feed.isFetchingNextPage}
          onLoadMore={() => void feed.fetchNextPage()}
          onRetry={() => void feed.refetch()}
        />
      )}
    </AppShell>
  );
}
