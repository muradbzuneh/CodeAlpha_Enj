import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { toUserMessage } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query-keys";

/** Comments are only fetched when a post's thread is actually opened. */
export function useComments(postId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: () => api.comments.list(postId),
    enabled,
    retry: false,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => api.comments.create(postId, { content }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.comments.remove(commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success("Comment deleted");
    },
    onError: (error) => toast.error(toUserMessage(error)),
  });
}
