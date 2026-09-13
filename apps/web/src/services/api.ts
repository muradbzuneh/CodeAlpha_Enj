import { authService } from "./auth.service";
import { postsService } from "./posts.service";
import { commentsService } from "./comments.service";
import { feedService } from "./feed.service";
import { usersService } from "./users.service";
import { likesService } from "./likes.service";
import { searchService } from "./search.service";
import { storiesService } from "./stories.service";
import { notificationsService } from "./notifications.service";
import { messagesService } from "./messages.service";
import { bookmarkService } from "./bookmark.service";

export const api = {
  auth: authService,
  posts: postsService,
  comments: commentsService,
  feed: feedService,
  users: usersService,
  likes: likesService,
  search: searchService,
  stories: storiesService,
  notifications: notificationsService,
  messages: messagesService,
  bookmarks: bookmarkService,

  getMode(): "live" {
    return "live";
  },

  onModeChange(_cb: (mode: "live" | "mock") => void): () => void {
    return () => {};
  },

  resetDemoData(): void {
    // no-op in live mode
  },
};
