<p align="center">
  <img src="https://img.shields.io/badge/ENJ-Social%20Platform-FF3366?style=for-the-badge&logo=react&logoColor=white" alt="ENJ Badge" />
</p>

<h1 align="center">ENJ</h1>

<p align="center">
  A modern, full-stack social media platform built for creators and communities.<br/>
  Post. Share. Connect.
</p>

<p align="center">
  <a href="#-features">Features</a> &bull;
  <a href="#-tech-stack">Tech Stack</a> &bull;
  <a href="#-getting-started">Getting Started</a> &bull;
  <a href="#-deployment">Deployment</a> &bull;
  <a href="#-project-structure">Structure</a> &bull;
  <a href="#-roadmap">Roadmap</a>
</p>

---

## Highlights

- **Feed** — Personalized "For You" and "Following" tabs with infinite scroll
- **Reels** — TikTok-style vertical snap-scroll with swipe, keyboard, and double-tap to like
- **Stories** — 24-hour ephemeral stories with reactions, view counts, and auto-advance
- **Messaging** — Real-time direct messaging between users
- **Explore** — Trending posts, suggested users, and hashtag discovery
- **Bookmarks** — Save posts and access them later
- **Notifications** — Like, comment, and follow alerts
- **Profiles** — Customizable profiles with avatar, banner, bio, and follower stats
- **Dark Mode** — Full dark theme with one-click toggle
- **Responsive** — Works seamlessly on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Express 5, TypeScript, Node.js 22 |
| Database | PostgreSQL 17 via Prisma ORM |
| Auth | BetterAuth (email/password, cookie sessions) |
| File Upload | Multer (local storage) |
| Deployment | Railway (API) + Vercel (Frontend) |
| Containerization | Docker + Docker Compose |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Docker](https://www.docker.com/) (for PostgreSQL)
- [pnpm](https://pnpm.io/) or npm

### 1. Clone the repository

```bash
git clone https://github.com/muradbzuneh/CodeAlpha_Enj.git
cd CodeAlpha_Enj
```

### 2. Start the database

```bash
docker compose up -d db
```

This starts PostgreSQL on `localhost:5432` with:
- **User:** `enj_user`
- **Password:** `enj_password`
- **Database:** `enj_db`

### 3. Set up the backend

```bash
cd apps/api
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

API runs at `http://localhost:4001`.

### 4. Set up the frontend

```bash
cd ../web
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## Environment Variables

### Backend (`apps/api/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://enj_user:enj_password@localhost:5432/enj_db` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `BETTER_AUTH_URL` | Backend base URL | `http://localhost:4001` |
| `BETTER_AUTH_SECRET` | Auth session secret | `fallback-secret-change-me` |
| `PORT` | Server port | `4001` |

### Frontend (`apps/web/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4001` |

---

## Deployment

### Railway (Backend)

1. Create a new Railway project and link your GitHub repo
2. Set the service root to `apps/api`
3. Add a **PostgreSQL** plugin (or use Neon/Supabase)
4. Set environment variables:
   ```
   DATABASE_URL=           # from Railway PostgreSQL plugin
   FRONTEND_URL=           # https://your-app.vercel.app
   BETTER_AUTH_URL=        # https://your-api.up.railway.app
   BETTER_AUTH_SECRET=     # generate a random string
   ```
5. Railway auto-detects the Dockerfile and deploys

### Vercel (Frontend)

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Set the root directory to `apps/web`
3. Add environment variable:
   ```
   VITE_API_URL = https://your-api.up.railway.app
   ```
4. Deploy. Copy the Vercel URL and set it as `FRONTEND_URL` in Railway.

---

## Project Structure

```
CodeAlpha_Enj/
├── apps/
│   ├── api/                        # Express backend
│   │   ├── src/
│   │   │   ├── controllers/        # Route handlers
│   │   │   ├── middleware/          # Auth, validation, error handling
│   │   │   ├── routes/             # Express route definitions
│   │   │   ├── schemas/            # Zod validation schemas
│   │   │   ├── lib/                # Prisma client, auth config, session
│   │   │   ├── services/           # Business logic
│   │   │   ├── app.ts              # Express app setup
│   │   │   └── server.ts           # HTTP server entry
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── migrations/         # Migration history
│   │   ├── uploads/                # Uploaded media files
│   │   ├── Dockerfile              # Production build
│   │   └── railway.json            # Railway config
│   │
│   └── web/                        # React frontend
│       ├── src/
│       │   ├── components/         # Reusable UI components
│       │   │   ├── post/           # PostCard, PostComposer, PostDetailModal
│       │   │   ├── story/          # StoryBar, StoryViewerModal, CreateStoryModal
│       │   │   ├── profile/        # ProfileHeader, FollowButton
│       │   │   ├── comment/        # CommentSection, CommentItem
│       │   │   ├── layout/         # Header, SidebarNav, MainLayout
│       │   │   ├── explore/        # TrendingGrid, SuggestedUsersRow, HashtagCloud
│       │   │   └── ui/             # Avatar, Button, Input, Preloader, Skeleton
│       │   ├── pages/              # Route-level components
│       │   ├── services/           # API client functions
│       │   ├── context/            # Auth, Theme, Toast providers
│       │   ├── lib/                # Utilities (upload, resolveMediaUrl, api client)
│       │   ├── hooks/              # Custom React hooks
│       │   └── types/              # TypeScript type definitions
│       ├── vercel.json             # Vercel config
│       └── vite.config.ts          # Vite config
│
├── docker-compose.yml              # Local development (API + PostgreSQL)
└── README.md
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register new account |
| POST | `/api/auth/sign-in/email` | Sign in |
| POST | `/api/auth/sign-out` | Sign out |
| GET | `/api/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feed` | Personalized feed |
| POST | `/api/posts` | Create post |
| PATCH | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like post |
| DELETE | `/api/posts/:id/like` | Unlike post |
| POST | `/api/posts/:id/bookmark` | Toggle bookmark |

### Users & Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/:id` | Get profile |
| PATCH | `/api/profile` | Update own profile |
| POST | `/api/user/:id/follow` | Follow user |
| DELETE | `/api/user/:id/follow` | Unfollow user |
| GET | `/api/user/:id/followers` | Get followers |
| GET | `/api/user/:id/following` | Get following |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | Get stories feed |
| POST | `/api/stories` | Create story |
| DELETE | `/api/stories/:id` | Delete story |
| POST | `/api/stories/:id/view` | Mark story viewed |
| POST | `/api/stories/:id/react` | React to story |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations` | Start conversation |
| GET | `/api/conversations/:id/messages` | Get messages |
| POST | `/api/conversations/:id/messages` | Send message |

### Explore & Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search/users?q=` | Search users |
| GET | `/api/search/hashtag?q=` | Search by hashtag |
| GET | `/api/explore` | Explore/trending content |
| GET | `/api/suggestions` | Suggested users |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications/:id/read` | Mark as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload file (multipart) |

---

## Database Schema (Key Models)

```
User ──┬── Post ──── Like
       │        ├─── Comment
       │        ├─── Bookmark
       │        └─── PostHashtag
       ├── Story ──── StoryView
       │          └─── StoryReaction
       ├── Follow
       ├── Notification
       ├── Conversation ──── Message
       │                 └─── ConversationParticipant
       └── Session / Account / Verification
```

---

## Roadmap

### Phase 1 — Core (Current)
- [x] Auth (sign-up, sign-in, sessions)
- [x] User profiles & settings
- [x] Posts with media upload
- [x] Like, comment, bookmark
- [x] Follow / unfollow
- [x] Stories with reactions
- [x] Reels (vertical scroll)
- [x] Direct messaging
- [x] Notifications
- [x] Explore / search
- [x] Dark mode
- [x] Responsive design

### Phase 2 — Polish
- [ ] Real-time updates (WebSockets)
- [ ] Push notifications
- [ ] Image optimization & CDN
- [ ] Video transcoding
- [ ] Rate limiting
- [ ] Content moderation
- [ ] Report / block users
- [ ] Two-factor authentication
- [ ] OAuth login (Google, GitHub)

### Phase 3 — Scale
- [ ] AI-powered feed recommendations
- [ ] Live streaming
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] Multi-image carousels
- [ ] GIF support
- [ ] Post translations
- [ ] PWA / offline support
- [ ] CI/CD pipeline
- [ ] Load testing

---

## License

This project is private and proprietary.

---

<p align="center">
  Built with care by the ENJ team.
</p>
