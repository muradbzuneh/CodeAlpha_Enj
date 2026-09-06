/**
 * ISOLATED MOCK / DEMO DATA STORE FOR ENJ
 * 
 * Authentic, human-centered community content.
 * Real creator updates, photography, daily reflections, and genuine conversations.
 */

import type { User, Post, Comment, Story } from '../types';

export const DEMO_CURRENT_USER: User = {
  id: 'usr_me_001',
  email: 'alex.rivers@example.com',
  name: 'Alex Rivers',
  username: 'alexrivers',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Visual designer, road-tripper & weekend baker. Exploring the intersection of human craft, good typography, and thoughtful stories.',
  createdAt: '2024-01-15T10:00:00.000Z',
};

export const DEMO_USERS: User[] = [
  DEMO_CURRENT_USER,
  {
    id: 'usr_002',
    email: 'maya.brooks@example.com',
    name: 'Maya Brooks',
    username: 'mayabrooks',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Documentary photographer & mountain hiker. Chasing golden hours, quiet trails, and honest portraits across the Pacific Northwest.',
    createdAt: '2023-11-20T08:30:00.000Z',
  },
  {
    id: 'usr_003',
    email: 'leo.tanaka@example.com',
    name: 'Leo Tanaka',
    username: 'leotanaka',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Architect & ceramicist. Designing daylight spaces and slow-crafted stoneware. Tokyo & SF.',
    createdAt: '2024-02-01T14:15:00.000Z',
  },
  {
    id: 'usr_004',
    email: 'chloe.martin@example.com',
    name: 'Chloe Martin',
    username: 'chloemartin',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    bio: 'Coffee roaster, culinary storyteller, and indie bookstore regular. Always hunting for the perfect sourdough.',
    createdAt: '2024-03-10T11:45:00.000Z',
  },
  {
    id: 'usr_005',
    email: 'julian.reed@example.com',
    name: 'Julian Reed',
    username: 'julianreed',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Sound designer, analog synth collector, and film enthusiast. Listening to ambient frequencies.',
    createdAt: '2023-09-05T16:20:00.000Z',
  },
];

export const INITIAL_DEMO_POSTS: Post[] = [
  {
    id: 'post_001',
    authorId: 'usr_002',
    author: {
      id: 'usr_002',
      name: 'Maya Brooks',
      username: 'mayabrooks',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    content: 'Woke up at 4:30 AM to catch the sunrise over the North Cascades ridge. The valley fog was rolling through the cedar trees like a quiet tide. Some mornings remind you why carrying the heavy tripod up 2,000 feet of switchbacks is always worth it.',
    createdAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(), // 38 mins ago
    likesCount: 34,
    commentsCount: 6,
    isLiked: false,
  },
  {
    id: 'post_002',
    authorId: 'usr_003',
    author: {
      id: 'usr_003',
      name: 'Leo Tanaka',
      username: 'leotanaka',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    content: 'Finished carving the prototype for our cedar reading bench today. Traditional Japanese joinery, assembled completely without metal fasteners or glue. There is something grounding about working with natural wood grain where every chisel mark tells a story.',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(), // ~2 hours ago
    likesCount: 52,
    commentsCount: 8,
    isLiked: true,
  },
  {
    id: 'post_003',
    authorId: 'usr_me_001',
    author: {
      id: 'usr_me_001',
      name: 'Alex Rivers',
      username: 'alexrivers',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    content: 'Saturday morning ritual: fresh farmers market figs, a warm slice of rosemary olive-oil focaccia, and leaving the phone on silent for three hours. The best creative ideas always strike when you stop rushing.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    likesCount: 41,
    commentsCount: 5,
    isLiked: true,
  },
  {
    id: 'post_004',
    authorId: 'usr_004',
    author: {
      id: 'usr_004',
      name: 'Chloe Martin',
      username: 'chloemartin',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    content: 'Just pulled an experimental honey-processed batch from Sidama with delicate notes of white peach, jasmine, and wildflower honey. Sharing fresh pour-overs with anyone stopping by the roastery this afternoon! ☕✨',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), // 11 hours ago
    likesCount: 67,
    commentsCount: 11,
    isLiked: false,
  },
  {
    id: 'post_005',
    authorId: 'usr_005',
    author: {
      id: 'usr_005',
      name: 'Julian Reed',
      username: 'julianreed',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    content: 'Spent the evening recording ambient rain hitting an old tin shed roof in the woods. Running the field recording through an analog bucket-brigade delay and warm synth pad. The soundscape feels like an old memory.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
    likesCount: 89,
    commentsCount: 14,
    isLiked: false,
  },
];

export const INITIAL_DEMO_COMMENTS: Record<string, Comment[]> = {
  post_001: [
    {
      id: 'com_001',
      postId: 'post_001',
      authorId: 'usr_003',
      author: {
        id: 'usr_003',
        name: 'Leo Tanaka',
        username: 'leotanaka',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      },
      content: 'The morning light up there is unmatched. Did you hike up via the south trail or the ridge loop?',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: 'com_002',
      postId: 'post_001',
      authorId: 'usr_me_001',
      author: {
        id: 'usr_me_001',
        name: 'Alex Rivers',
        username: 'alexrivers',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      },
      content: 'Such a cinematic atmosphere. Can’t wait to see the prints from this roll, Maya!',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
  ],
  post_002: [
    {
      id: 'com_003',
      postId: 'post_002',
      authorId: 'usr_004',
      author: {
        id: 'usr_004',
        name: 'Chloe Martin',
        username: 'chloemartin',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      },
      content: 'Japanese joinery is pure poetry. That subtle cedar aroma when you walk into the studio must be incredible.',
      createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    },
  ],
  post_003: [
    {
      id: 'com_004',
      postId: 'post_003',
      authorId: 'usr_002',
      author: {
        id: 'usr_002',
        name: 'Maya Brooks',
        username: 'mayabrooks',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      },
      content: 'Rosemary olive-oil focaccia is the ultimate weekend breakfast! Save a slice for Monday!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  ],
};

export const INITIAL_DEMO_STORIES: Story[] = [
  {
    id: 'story_001',
    authorId: 'usr_002',
    author: {
      id: 'usr_002',
      name: 'Maya Brooks',
      username: 'mayabrooks',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    textContent: 'Sunrise over the Pacific coast trail. The early alarm was 100% worth it 🌄🌊',
    gradient: 'from-[#FF3366] via-[#FF5E7E] to-[#FFAA00]',
    moodEmoji: '✨',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
    isViewed: false,
  },
  {
    id: 'story_002',
    authorId: 'usr_003',
    author: {
      id: 'usr_003',
      name: 'Leo Tanaka',
      username: 'leotanaka',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    textContent: 'Shaping a fresh batch of tenmoku glazed tea bowls on the wheel today 🏺🍵',
    gradient: 'from-[#1E1B4B] via-[#4338CA] to-[#06B6D4]',
    moodEmoji: '🎨',
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    isViewed: false,
  },
  {
    id: 'story_003',
    authorId: 'usr_004',
    author: {
      id: 'usr_004',
      name: 'Chloe Martin',
      username: 'chloemartin',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    textContent: 'Dialing in the morning espresso roast. The roastery smells like warm caramelized honey ☕',
    gradient: 'from-[#FB7185] via-[#F43F5E] to-[#FB923C]',
    moodEmoji: '☕',
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    isViewed: false,
  },
  {
    id: 'story_004',
    authorId: 'usr_005',
    author: {
      id: 'usr_005',
      name: 'Julian Reed',
      username: 'julianreed',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    textContent: 'Late night sound design session. Mixing vintage tape loops with ocean waves 🎧🌊',
    gradient: 'from-[#047857] via-[#10B981] to-[#34D399]',
    moodEmoji: '🔥',
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    isViewed: false,
  },
];
