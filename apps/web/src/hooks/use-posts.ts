import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { toUserMessage } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query-keys";
import type { Paginated, Post } from "@/types/api";

type FeedScope = "home" | "trending" | "liked";

const fetchers: Record<FeedScope, (page: number) => Promise<Paginated<Post>>> = {
  home: (page) => api.feed.getPersonalized({ page }),
  trending: (page) => api.feed.getTrending({ page }),
  liked: (page) => api.feed.getLiked({ page }),
};

export function usePostFeed(scope: FeedScope, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.feed(scope),
    queryFn: ({ pageParam }) => fetchers[scope](pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    enabled,
    retry: false,
  });

  const posts = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  return { ...query, posts };
}

export function useProfilePosts(identifier: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.profilePosts(identifier),
    queryFn: ({ pageParam }) => api.users.getPosts(identifier, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    enabled,
    retry: false,
  });
  const posts = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  return { ...query, posts };
}

type PostPages = InfiniteData<Paginated<Post>, number>;

function mapPostEverywhere(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
  updater: (post: Post) => Post,
) {
  queryClient.setQueriesData<PostPages>({ queryKey: ["feed"] }, (data) =>
    data ? mapPages(data, postId, updater) : data,
  );
  queryClient.setQueriesData<PostPages>({ queryKey: ["profile"] }, (data) =>
    data && "pages" in data ? mapPages(data, postId, updater) : data,
  );
}

function mapPages(data: PostPages, postId: string, updater: (post: Post) => Post): PostPages {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((post) => (post.id === postId ? updater(post) : post)),
    })),
  };
}

function removePostEverywhere(queryClient: ReturnType<typeof useQueryClient>, postId: string) {
  const strip = (data: PostPages | undefined) =>
    data
      ? {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.filter((post) => post.id !== postId),
          })),
        }
      : data;
  queryClient.setQueriesData<PostPages>({ queryKey: ["feed"] }, strip);
  queryClient.setQueriesData<PostPages>({ queryKey: ["profile"] }, (data) =>
    data && "pages" in data ? strip(data) : data,
  );
}

/** Optimistic like/unlike with rollback — the API stays the source of truth. */
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ post }: { post: Post }) => {
      if (post.likedByMe) await api.posts.unlike(post.id);
      else await api.posts.like(post.id);
    },
    onMutate: async ({ post }) => {
      const liked = Boolean(post.likedByMe);
      mapPostEverywhere(queryClient, post.id, (current) => ({
        ...current,
        likedByMe: !liked,
        likeCount: Math.max(0, (current.likeCount ?? 0) + (liked ? -1 : 1)),
      }));
      return { liked };
    },
    onError: (error, { post }, context) => {
      // Roll back to the pre-click state.
      mapPostEverywhere(queryClient, post.id, (current) => ({
        ...current,
        likedByMe: context?.liked ?? false,
        likeCount: Math.max(0, (current.likeCount ?? 0) + (context?.liked ? 1 : -1)),
      }));
      toast.error(toUserMessage(error));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed("liked") });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => api.posts.create({ content }),
    onSuccess: () => {
      toast.success("Post published");
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      api.posts.update(id, { content }),
    onSuccess: (updated) => {
      mapPostEverywhere(queryClient, updated.id, (current) => ({
        ...current,
        content: updated.content,
        updatedAt: updated.updatedAt ?? current.updatedAt,
      }));
      toast.success("Post updated");
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.posts.remove(id),
    onSuccess: (_data, id) => {
      removePostEverywhere(queryClient, id);
      toast.success("Post deleted");
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
}
