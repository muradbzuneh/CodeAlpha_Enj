export type { User, Profile, Post, Comment, FollowUserItem, PostAuthor, ApiError, SessionResponse, Story, CreateStoryInput, Notification } from "./index";
import type { Pagination } from "./index";
export type { Pagination };

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface UpdateProfileInput {
  username?: string;
  name?: string;
  bio?: string | null;
  image?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  name: string;
  username: string;
}
