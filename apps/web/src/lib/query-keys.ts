export const queryKeys = {
  session: ["session"] as const,
  feed: (scope: "home" | "trending" | "liked") => ["feed", scope] as const,
  posts: ["posts"] as const,
  post: (id: string) => ["post", id] as const,
  comments: (postId: string) => ["comments", postId] as const,
  profile: (identifier: string) => ["profile", identifier] as const,
  profilePosts: (identifier: string) => ["profile", identifier, "posts"] as const,
  followers: (identifier: string) => ["profile", identifier, "followers"] as const,
  following: (identifier: string) => ["profile", identifier, "following"] as const,
};
