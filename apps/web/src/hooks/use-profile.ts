import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { toUserMessage } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query-keys";
import type { Profile, UpdateProfileInput } from "@/types/api";

export function useProfile(identifier: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile(identifier),
    queryFn: () => api.users.getProfile(identifier),
    enabled: enabled && Boolean(identifier),
    retry: false,
    staleTime: 30_000,
  });
}

export function useFollowers(identifier: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.followers(identifier),
    queryFn: () => api.users.followers(identifier),
    enabled,
    retry: false,
  });
}

export function useFollowing(identifier: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.following(identifier),
    queryFn: () => api.users.following(identifier),
    enabled,
    retry: false,
  });
}

export function useToggleFollow(identifier: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isFollowing }: { userId: string; isFollowing: boolean }) => {
      if (isFollowing) await api.users.unfollow(userId);
      else await api.users.follow(userId);
    },
    onMutate: async ({ isFollowing }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile(identifier) });
      const previous = queryClient.getQueryData<Profile>(queryKeys.profile(identifier));
      if (previous) {
        queryClient.setQueryData<Profile>(queryKeys.profile(identifier), {
          ...previous,
          isFollowing: !isFollowing,
          followerCount: Math.max(0, previous.followerCount + (isFollowing ? -1 : 1)),
        });
      }
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.profile(identifier), context.previous);
      }
      toast.error(toUserMessage(error));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile(identifier) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed("home") });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => api.users.updateProfile(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.session });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
}
