/**
 * Every backend route the frontend talks to lives here.
 * If the Express API changes a path, this is the ONLY file to edit.
 */
export const endpoints = {
  auth: {
    me: "/api/me",
    signUp: "/api/auth/sign-up/email",
    signIn: "/api/auth/sign-in/email",
    signOut: "/api/auth/sign-out",
    session: "/api/auth/get-session",
  },
  posts: {
    list: "/api/posts",
    create: "/api/posts",
    byId: (id: string) => `/api/posts/${id}`,
    update: (id: string) => `/api/posts/${id}`,
    remove: (id: string) => `/api/posts/${id}`,
    trending: "/api/posts/trending",
    liked: "/api/posts/liked",
  },
  comments: {
    list: (postId: string) => `/api/posts/${postId}/comments`,
    create: (postId: string) => `/api/posts/${postId}/comments`,
    remove: (commentId: string) => `/api/comments/${commentId}`,
  },
  likes: {
    list: (postId: string) => `/api/posts/${postId}/likes`,
    like: (postId: string) => `/api/posts/${postId}/like`,
    unlike: (postId: string) => `/api/posts/${postId}/like`,
  },
  users: {
    byId: (userId: string) => `/api/users/${userId}`,
    followers: (userId: string) => `/api/users/${userId}/followers`,
    following: (userId: string) => `/api/users/${userId}/following`,
    follow: (userId: string) => `/api/users/${userId}/follow`,
    unfollow: (userId: string) => `/api/users/${userId}/follow`,
    posts: (userId: string) => `/api/users/${userId}/posts`,
  },
  profile: {
    update: "/api/profile",
  },
  feed: {
    personalized: "/api/feed",
  },
} as const;
