import { authService } from "@/services/auth.service";
import { commentsService } from "@/services/comments.service";
import { feedService } from "@/services/feed.service";
import { postsService } from "@/services/posts.service";
import { searchService } from "@/services/search.service";
import { usersService } from "@/services/users.service";

/** Single entry point for every backend call: api.posts.create(), api.feed.getPersonalized(), ... */
export const api = {
  auth: authService,
  posts: postsService,
  comments: commentsService,
  users: usersService,
  feed: feedService,
  search: searchService,
};

export { API_BASE_URL } from "./client";
export { endpoints } from "./endpoints";
export { ApiRequestError, toUserMessage, isUnauthorized } from "./errors";
