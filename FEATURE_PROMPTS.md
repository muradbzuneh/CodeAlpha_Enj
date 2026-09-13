# ENJ Feature Implementation Prompts

Copy-paste these prompts to implement each feature. Each prompt includes exact files to modify, Prisma schema changes, API routes, frontend components, and testing steps.

---

## 1. User Search by Username (Backend)

**Prompt:**
```
Implement backend user search by username in the ENJ social media platform.

Backend (apps/api):
1. Create apps/api/src/controllers/search.controller.ts:
   - GET /api/search/users?q=query&limit=20&page=1
   - Use Prisma: prisma.user.findMany where username contains query (case-insensitive via mode: "insensitive")
   - Return users with id, name, username, image, bio, _count.followers
   - Include isFollowing: check if current user follows each result

2. Add route to apps/api/src/routes/profile.routes.ts:
   - import { searchUsers } from "../controllers/search.controller.js"
   - profileRouter.get("/search/users", optionalAuth, searchUsers)

3. Update apps/web/src/services/search.service.ts:
   - Replace stub with real API call: apiClient.get("/api/search/users", { q: query, limit, page })
   - Normalize response to User[] with isFollowing field

4. Update apps/web/src/pages/search/SearchPage.tsx:
   - On search submit, call searchService.query()
   - Display results in user list with FollowButton
   - Show "No users found" when empty

Testing: Create 3 users, search by partial username, verify results include isFollowing status.
```

---

## 2. Notifications Backend

**Prompt:**
```
Implement a full notifications system for the ENJ social media platform.

Backend (apps/api):
1. Add to apps/api/prisma/schema.prisma:
   model Notification {
     id        String   @id @default(cuid())
     type      String   // "like", "comment", "follow"
     message   String
     read      Boolean  @default(false)
     actorId   String
     actor     User     @relation(fields: [actorId], references: [id])
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     postId    String?
     post      Post?    @relation(fields: [postId], references: [id])
     createdAt DateTime @default(now())
     @@index([userId, read])
     @@index([userId, createdAt])
   }

   Add to existing User model:
     notifications Notification[]

   Add to existing Post model:
     notifications Notification[]

   Run: npx prisma migrate dev --name add_notifications

2. Create apps/api/src/controllers/notification.controller.ts:
   - GET /api/notifications?page=1&limit=20 → list current user's notifications (include actor with name,username,image)
   - PATCH /api/notifications/:id/read → mark as read
   - POST /api/notifications/read-all → mark all as read
   - GET /api/notifications/unread-count → return count of unread

3. Create apps/api/src/routes/notification.routes.ts:
   - All routes use requireAuth middleware

4. Wire into apps/api/src/app.ts:
   - app.use("/api", notificationRouter)

5. Trigger notifications in existing controllers:
   - like.controller.ts: after creating a like, create Notification { type: "like", message: "X liked your post", actorId: user.id, userId: post.authorId, postId }
   - comment.controller.ts: after creating a comment, create Notification { type: "comment", message: "X commented on your post" }
   - follow.controller.ts: after following, create Notification { type: "follow", message: "X started following you" }
   - Skip notification if actor is the same as the target user (don't notify yourself)

6. Frontend - apps/web/src/services/notifications.service.ts:
   - list(page, limit), markRead(id), markAllRead(), unreadCount()

7. Frontend - apps/web/src/components/notifications/NotificationBell.tsx:
   - Bell icon with unread count badge
   - Dropdown showing recent notifications
   - Mark as read on click
   - "Mark all read" button

8. Add NotificationBell to apps/web/src/components/layout/Header.tsx

Testing: Create 2 users. User A likes User B's post. User B sees notification. User A follows User B. User B sees follow notification.
```

---

## 3. Story Reactions as Messages

**Prompt:**
```
Convert story reactions from fire-and-forget toasts into stored messages/replies.

Backend (apps/api):
1. Add to apps/api/prisma/schema.prisma:
   model StoryReaction {
     id        String   @id @default(cuid())
     content   String
     storyId   String
     story     Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)
     authorId  String
     author    User     @relation(fields: [authorId], references: [id])
     createdAt DateTime @default(now())
     @@index([storyId, createdAt])
   }

   Add to existing Story model:
     reactions StoryReaction[]

   Run: npx prisma migrate dev --name add_story_reactions

2. Create apps/api/src/controllers/story-reaction.controller.ts:
   - POST /api/stories/:storyId/reactions { content } → create reaction
   - GET /api/stories/:storyId/reactions?page=1&limit=20 → list reactions (include author name,username,image)
   - DELETE /api/stories/:storyId/reactions/:reactionId → delete own reaction

3. Create apps/api/src/routes/story-reaction.routes.ts and wire into app.ts

4. Frontend - apps/web/src/services/stories.service.ts:
   - addReaction(storyId, content), getReactions(storyId), deleteReaction(storyId, reactionId)

5. Frontend - apps/web/src/components/story/StoryViewerModal.tsx:
   - Replace fire emoji toast with text input at bottom of story
   - Show reaction count on each story
   - Show reactions list when tapping count
   - Allow story author to see all reactions

Testing: User A posts story. User B opens it, types "🔥🔥🔥" and sends. User A sees the reaction in their story viewer.
```

---

## 4. Story View Count Display

**Prompt:**
```
Show story view count to the story author in the story viewer.

Backend (apps/api):
1. Update apps/api/src/controllers/story.controller.ts → getStories:
   - Add to include: views: { select: { id: true } } (already partially there)
   - Add _count: { select: { views: true } } to story query
   - Return viewCount in response

2. Update apps/api/src/controllers/story.controller.ts → getStoryById (if exists) or add:
   - GET /api/stories/:storyId → single story with viewCount and viewer list (author only)

Frontend (apps/web):
3. Update apps/web/src/types/index.ts → Story type:
   - Add viewCount?: number

4. Update apps/web/src/services/stories.service.ts → normalizeStory:
   - Map viewCount from backend response

5. Update apps/web/src/components/story/StoryViewerModal.tsx:
   - Show "X views" at bottom of story (for story author only)
   - Show eye icon + count
   - For non-authors: show "You viewed" or nothing

6. Update apps/web/src/components/story/StoryBar.tsx:
   - Show view count on story ring for own stories

Testing: User A posts story. User B and C view it. User A opens their story and sees "2 views".
```

---

## 5. Post Media Upload (Real File Upload)

**Prompt:**
```
Replace base64 media with real file upload using local storage or S3-compatible storage.

Backend (apps/api):
1. Install: npm install multer uuid
2. Create apps/api/src/middleware/upload.ts:
   - Configure multer for local storage at apps/api/uploads/
   - Generate unique filenames with uuid
   - Limit: 10MB, accept image/* and video/*

3. Create apps/api/src/controllers/upload.controller.ts:
   - POST /api/upload → accepts multipart/form-data with "file" field
   - Returns { url: "/uploads/filename.jpg", type: "image" }
   - Validates file type and size

4. Create apps/api/src/routes/upload.routes.ts with requireAuth

5. Wire into app.ts:
   - app.use("/uploads", express.static("uploads"))
   - app.use("/api", uploadRouter)

6. Update apps/api/prisma/schema.prisma → Post model:
   - Add mediaUrl String?

7. Update post.controller.ts createPost/updatePost to accept mediaUrl

Frontend (apps/web):
8. Create apps/web/src/lib/upload.ts:
   - uploadFile(file: File): Promise<{ url: string }> using FormData + POST /api/upload

9. Update apps/web/src/components/post/PostComposer.tsx:
   - Add image upload button (camera icon)
   - On file select, upload to server, get URL
   - Show preview of uploaded image
   - Include mediaUrl in post creation payload

10. Update apps/web/src/components/post/PostCard.tsx:
    - If post.mediaUrl exists, render image below text content
    - Use aspect-ratio container for consistent sizing

11. Update apps/web/src/types/index.ts → Post type:
    - Add mediaUrl?: string | null

Testing: Upload a 5MB image, create post, verify image displays in feed. Check that files are stored in apps/api/uploads/.
```

---

## 6. Direct Messages / DMs

**Prompt:**
```
Implement real-time direct messaging between users.

Backend (apps/api):
1. Add to apps/api/prisma/schema.prisma:
   model Conversation {
     id        String   @id @default(cuid())
     createdAt DateTime @default(now())
     participants ConversationParticipant[]
     messages      Message[]
   }

   model ConversationParticipant {
     id             String       @id @default(cuid())
     conversationId String
     conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
     userId         String
     user           User         @relation(fields: [userId], references: [id])
     joinedAt       DateTime     @default(now())
     @@unique([conversationId, userId])
   }

   model Message {
     id             String       @id @default(cuid())
     content        String
     conversationId String
     conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
     authorId       String
     author         User         @relation(fields: [authorId], references: [id])
     read           Boolean      @default(false)
     createdAt      DateTime     @default(now())
     @@index([conversationId, createdAt])
   }

   Add to User model:
     conversations ConversationParticipant[]
     messages Message[]

   Run: npx prisma migrate dev --name add_messages

2. Create apps/api/src/controllers/message.controller.ts:
   - GET /api/conversations → list user's conversations (with last message, unread count, other participant)
   - POST /api/conversations { participantId } → create or get existing conversation
   - GET /api/conversations/:id/messages?page=1&limit=50 → paginated messages
   - POST /api/conversations/:id/messages { content } → send message

3. Create apps/api/src/routes/message.routes.ts with requireAuth

4. Frontend - apps/web/src/services/messages.service.ts:
   - getConversations(), createConversation(userId), getMessages(convId, page), sendMessage(convId, content)

5. Frontend - apps/web/src/pages/messages/MessagesPage.tsx:
   - Two-panel layout: conversation list (left) + active chat (right)
   - Mobile: show list, tap to open chat, back button
   - Each conversation shows: avatar, name, last message preview, unread badge, timestamp

6. Frontend - apps/web/src/components/messages/ChatPanel.tsx:
   - Message bubbles (own = right, other = left)
   - Text input with send button
   - Auto-scroll to bottom on new message
   - Load older messages on scroll up

7. Frontend - apps/web/src/components/messages/ConversationItem.tsx:
   - Avatar, name, last message preview, time, unread count badge

8. Add Messages icon to Header/SidebarNav with unread count badge

Testing: User A starts conversation with User B. Sends "Hello". User B sees it. User B replies. Both see messages in real-time (polling or WebSocket).
```

---

## 7. Explore / Discover Page

**Prompt:**
```
Build a proper Explore page showing trending posts, suggested users, and hashtag categories.

Backend (apps/api):
1. GET /api/explore/trending → already exists as /api/posts/trending

2. Create GET /api/explore/suggested-users:
   - Return 10 users with most followers that current user doesn't follow
   - Include follower count, post count

3. Create GET /api/explore/hashtags:
   - Extract hashtags from posts (parse content for #words)
   - Return top 20 hashtags with post count
   - Cache results for 5 minutes

Frontend (apps/web):
4. Update apps/web/src/pages/explore/ExplorePage.tsx:
   - Section 1: "Trending Posts" grid (2 columns on mobile, 3 on desktop)
   - Section 2: "Suggested Users" horizontal scrollable row with FollowButton
   - Section 3: "Popular Hashtags" tag cloud
   - Section 4: "Recent Posts" infinite scroll

5. Create apps/web/src/components/explore/TrendingGrid.tsx:
   - Masonry-style grid of post cards (image + like count overlay)
   - Click opens PostDetailModal

6. Create apps/web/src/components/explore/SuggestedUsersRow.tsx:
   - Horizontal scrollable row of user cards
   - Each card: avatar, name, username, follow button

7. Create apps/web/src/components/explore/HashtagCloud.tsx:
   - Tag chips with post count
   - Click navigates to search with hashtag query

Testing: Verify trending posts load, suggested users don't include already-followed users, hashtags are extracted from post content.
```

---

## 8. Hashtag Search

**Prompt:**
```
Implement hashtag extraction, storage, and search.

Backend (apps/api):
1. Add to apps/api/prisma/schema.prisma:
   model Hashtag {
     id    String @id @default(cuid())
     name  String @unique
     posts Post[]
   }

   Add to Post model:
     hashtags Hashtag[]

   Run: npx prisma migrate dev --name add_hashtags

2. Create apps/api/src/controllers/hashtag.controller.ts:
   - POST /api/hashtags/extract { content } → parse content for #words, return or create Hashtag records
   - GET /api/hashtags/:tag/posts?page=1&limit=20 → posts with this hashtag
   - GET /api/hashtags/popular?limit=20 → top hashtags by post count

3. Create apps/api/src/routes/hashtag.routes.ts

4. Update post.controller.ts createPost:
   - After creating post, extract hashtags from content
   - Connect/create Hashtag records and link to post

5. Frontend - apps/web/src/services/hashtag.service.ts:
   - getHashtagPosts(tag, page), getPopularHashtags()

6. Update apps/web/src/pages/search/SearchPage.tsx:
   - Add "Hashtags" tab alongside "Posts" and "Users"
   - Search results include matching hashtags
   - Click hashtag shows posts with that tag

7. Update apps/web/src/components/post/PostCard.tsx:
   - Render #hashtags as clickable links that navigate to hashtag search

Testing: Create post with "#Hello #World". Search "#Hello". Verify posts appear. Verify hashtag count increases.
```

---

## 9. Push Notifications (FCM/Web Push)

**Prompt:**
```
Implement browser push notifications using Firebase Cloud Messaging.

Setup:
1. Create Firebase project at console.firebase.google.com
2. Generate VAPID key pair
3. Add firebase config to apps/web/.env

Backend (apps/api):
1. Install: npm install web-push firebase-admin

2. Create apps/api/src/lib/push.ts:
   - Initialize firebase-admin with service account
   - subscribeToTopic(token, topic), sendToTopic(topic, data)

3. Add to apps/api/prisma/schema.prisma:
   model PushSubscription {
     id        String   @id @default(cuid())
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     endpoint  String
     p256dh    String
     auth      String
     createdAt DateTime @default(now())
     @@unique([userId, endpoint])
   }

   Add to User model:
     pushSubscriptions PushSubscription[]

4. Create apps/api/src/controllers/push.controller.ts:
   - POST /api/push/subscribe { endpoint, p256dh, auth } → save subscription
   - DELETE /api/push/unsubscribe → remove subscription

5. Update notification.controller.ts:
   - After creating notification, also send push notification to user's subscriptions
   - Include notification title, body, icon, click URL

Frontend (apps/web):
6. Create apps/web/src/lib/push.ts:
   - requestPermission() → get FCM token
   - subscribeToPush() → register service worker, get subscription, send to backend
   - onMessage listener for foreground notifications

7. Create apps/web/public/firebase-messaging-sw.js:
   - Service worker for handling push events
   - Show notification with title, body, icon
   - Click opens relevant page

8. Update apps/web/src/context/AuthContext.tsx:
   - On login, request push permission and subscribe
   - On logout, unsubscribe

9. Create apps/web/src/components/notifications/PushPrompt.tsx:
   - Banner asking user to enable notifications
   - "Enable" and "Not now" buttons
   - Show once per session

Testing: Enable notifications for User A. User B likes User A's post. User A receives browser notification even when tab is in background.
```

---

## 10. Story Highlights

**Prompt:**
```
Allow users to save stories permanently as "Highlights" on their profile.

Backend (apps/api):
1. Add to apps/api/prisma/schema.prisma:
   model StoryHighlight {
     id        String   @id @default(cuid())
     title     String
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     stories   HighlightStory[]
     createdAt DateTime @default(now())
     @@index([userId])
   }

   model HighlightStory {
     id          String         @id @default(cuid())
     highlightId String
     highlight   StoryHighlight @relation(fields: [highlightId], references: [id], onDelete: Cascade)
     storyId     String
     story       Story          @relation(fields: [storyId], references: [id], onDelete: Cascade)
     @@unique([highlightId, storyId])
   }

   Add to User model:
     highlights StoryHighlight[]

   Run: npx prisma migrate dev --name add_story_highlights

2. Create apps/api/src/controllers/highlight.controller.ts:
   - GET /api/highlights/:userId → list user's highlights with stories
   - POST /api/highlights { title, storyId } → create highlight from story
   - POST /api/highlights/:id/stories { storyId } → add story to highlight
   - DELETE /api/highlights/:id → delete highlight
   - DELETE /api/highlights/:id/stories/:storyId → remove story from highlight

3. Create apps/api/src/routes/highlight.routes.ts

4. Frontend - apps/web/src/services/highlights.service.ts:
   - getHighlights(userId), createHighlight(title, storyId), addToHighlight(id, storyId), deleteHighlight(id)

5. Frontend - apps/web/src/components/story/StoryViewerModal.tsx:
   - Add "Save to Highlight" button (for story author)
   - Modal to select existing highlight or create new one

6. Frontend - apps/web/src/components/profile/ProfileHeader.tsx:
   - Show highlight circles below story ring (Instagram-style)
   - Each circle shows first story thumbnail
   - Tap opens highlight reel

7. Frontend - apps/web/src/components/story/HighlightViewer.tsx:
   - Similar to StoryViewerModal but shows only highlight stories
   - No expiry, no view tracking

Testing: User A posts 3 stories. Saves 2 to "My Trip" highlight. Views highlight on profile. Verifies stories play in order.
```

---

## 11. Story Music/Audio

**Prompt:**
```
Add background music to stories (like TikTok/Instagram).

Backend (apps/api):
1. Add to apps/api/prisma/schema.prisma → Story model:
   - audioUrl String?
   - audioTitle String?
   - audioArtist String?
   Run: npx prisma migrate dev --name add_story_audio

2. Create apps/api/src/controllers/music.controller.ts:
   - GET /api/music/search?q=query → search free music library (use Free Music Archive API or local JSON catalog)
   - GET /api/music/categories → list music categories (Mood, Genre, Activity)

3. Create apps/api/src/routes/music.routes.ts

Frontend (apps/web):
4. Create apps/web/src/services/music.service.ts:
   - searchMusic(query), getCategories()

5. Create apps/web/src/components/story/AudioPicker.tsx:
   - Search bar for music
   - List of tracks with play/preview button
   - Select track to add to story
   - Show selected track name on story creation

6. Create apps/web/src/components/story/AudioPlayer.tsx:
   - Background audio player for story
   - Small music note icon showing track info
   - Tap to expand track details
   - Audio loop

7. Update apps/web/src/components/story/CreateStoryModal.tsx:
   - Add music icon button
   - Opens AudioPicker
   - Pass audioUrl, audioTitle, audioArtist to API

8. Update apps/web/src/components/story/StoryViewerModal.tsx:
   - Play audio when story has audioUrl
   - Stop audio when story changes or modal closes
   - Show track info overlay

Testing: Search "chill", select track, create story with music. Play story. Verify audio plays and loops.
```

---

## 12. Story Filters/Effects

**Prompt:**
```
Add visual filters and effects to story creation (like Instagram filters).

Frontend only (apps/web):
1. Create apps/web/src/components/story/filterPresets.ts:
   export const FILTERS = [
     { name: 'Normal', class: '' },
     { name: 'Vintage', class: 'sepia-[0.6] contrast-[1.1] brightness-[0.9]' },
     { name: 'B&W', class: 'grayscale contrast-[1.2]' },
     { name: 'Cool', class: 'hue-rotate-[180deg] saturate-[1.3]' },
     { name: 'Warm', class: 'sepia-[0.3] saturate-[1.4] hue-rotate-[-10deg]' },
     { name: 'Dramatic', class: 'contrast-[1.5] brightness-[0.8] saturate-[1.2]' },
     { name: 'Fade', class: 'contrast-[0.8] brightness-[1.1] saturate-[0.8]' },
     { name: 'Vivid', class: 'saturate-[1.8] contrast-[1.1]' },
   ] as const;

2. Create apps/web/src/components/story/FilterPicker.tsx:
   - Horizontal scrollable row of filter thumbnails
   - Each thumbnail shows preview of image with filter applied
   - Selected filter has highlight border
   - Tap to select

3. Update apps/web/src/components/story/CreateStoryModal.tsx:
   - After selecting/uploading image, show FilterPicker at bottom
   - Apply selected filter class to preview image using Tailwind CSS filters
   - Store selected filter name with story

4. Update Story type and API:
   - Add filterName?: string to Story type
   - Add to story creation payload
   - Store in story record (add filterName String? to Prisma schema if desired)

5. Update apps/web/src/components/story/StoryViewerModal.tsx:
   - Apply stored filter class to story image when rendering

6. Create apps/web/src/components/story/EffectPicker.tsx:
   - Overlay effects: Bokeh lights, Film grain, Light leak, Sparkles
   - Use CSS mix-blend-mode and pseudo-elements
   - Each effect is a transparent PNG overlay

Testing: Upload photo, cycle through filters, select "Vintage", post story. Verify filter applied when viewing story.
```

---

## Usage

1. Copy the prompt for the feature you want to implement
2. Paste into a new chat/session with the codebase context
3. The AI will generate the exact implementation
4. Test each feature after implementation
5. Move to next feature based on priority

## Recommended Implementation Order

1. **User Search** (quick win, high impact)
2. **Notifications** (foundation for engagement)
3. **Story View Count** (small feature, big UX)
4. **Post Media Upload** (core functionality)
5. **Hashtag Search** (extends search)
6. **Explore Page** (content discovery)
7. **Story Reactions** (engagement)
8. **Story Highlights** (profile richness)
9. **DMs** (communication)
10. **Push Notifications** (retention)
11. **Story Music** (polish)
12. **Story Filters** (polish)
