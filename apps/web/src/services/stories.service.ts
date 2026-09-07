import type { Story, CreateStoryInput } from "@/types";

export const storiesService = {
  async getStories(): Promise<Story[]> {
    return [];
  },

  async create(_input: CreateStoryInput): Promise<Story> {
    throw new Error("Stories are not available yet — no backend endpoint.");
  },

  async markViewed(_storyId: string): Promise<void> {
    // no-op
  },

  async delete(_storyId: string): Promise<void> {
    // no-op
  },
};
