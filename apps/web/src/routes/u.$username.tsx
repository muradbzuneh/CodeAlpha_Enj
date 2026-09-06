import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { SideRail } from "@/components/layout/side-rail";
import { PostList } from "@/components/post/post-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user/user-avatar";
import { useProfilePosts } from "@/hooks/use-posts";
import { useProfile, useToggleFollow } from "@/hooks/use-profile";
import { toUserMessage } from "@/lib/api/errors";
import { compactNumber } from "@/lib/format";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/u/$username")({
  head: ({ params }) => {
    const title = `@${params.username} on Enj`;
    const description = `Posts, followers and replies from @${params.username} on Enj.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
      ],
    };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useProfile(username);
  const posts = useProfilePosts(username);
  const toggleFollow = useToggleFollow(username);

  const isSelf = profile?.isSelf ?? (user ? user.id === profile?.id : false);

  return (
    <AppShell rail={<SideRail />}>
      <PageHeader title={profile?.name ?? `@${username}`} subtitle={`@${username}`} />

      {isLoading ? (
        <div className="space-y-4 p-6">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      ) : error ? (
        <div className="px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Profile unavailable</p>
          <p className="mt-1 text-sm text-muted-foreground">{toUserMessage(error)}</p>
        </div>
      ) : profile ? (
        <section className="border-b border-border/70">
          <div className="h-28 bg-gradient-to-r from-brand-warm to-brand" />
          <div className="px-4 pb-5 sm:px-6">
            <div className="-mt-10 flex items-end justify-between gap-4">
              <UserAvatar
                user={profile}
                size="lg"
                linked={false}
                className="ring-4 ring-background"
              />
              {!isSelf ? (
                <Button
                  className="rounded-full px-6"
                  variant={profile.isFollowing ? "outline" : "default"}
                  disabled={toggleFollow.isPending}
                  onClick={() =>
                    toggleFollow.mutate({
                      userId: profile.id,
                      isFollowing: Boolean(profile.isFollowing),
                    })
                  }
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </Button>
              ) : null}
            </div>

            <h2 className="mt-3 font-display text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            {profile.bio ? <p className="mt-3 text-[15px]">{profile.bio}</p> : null}

            <dl className="mt-4 flex gap-6 text-sm">
              <div className="flex gap-1.5">
                <dt className="font-semibold">{compactNumber(profile.postCount)}</dt>
                <dd className="text-muted-foreground">Posts</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-semibold">{compactNumber(profile.followerCount)}</dt>
                <dd className="text-muted-foreground">Followers</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="font-semibold">{compactNumber(profile.followingCount)}</dt>
                <dd className="text-muted-foreground">Following</dd>
              </div>
            </dl>
          </div>
        </section>
      ) : null}

      <PostList
        posts={posts.posts}
        isLoading={posts.isLoading}
        error={posts.error}
        emptyTitle="No posts yet"
        emptyHint={`@${username} hasn't posted anything so far.`}
        hasNextPage={posts.hasNextPage}
        isFetchingNextPage={posts.isFetchingNextPage}
        onLoadMore={() => void posts.fetchNextPage()}
        onRetry={() => void posts.refetch()}
      />
    </AppShell>
  );
}
