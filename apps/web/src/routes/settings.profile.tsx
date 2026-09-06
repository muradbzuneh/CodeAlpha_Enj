import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { SideRail } from "@/components/layout/side-rail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user/user-avatar";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/settings/profile")({
  head: () => ({
    meta: [
      { title: "Edit your profile — Enj" },
      { name: "description", content: "Update your Enj display name, username, bio and avatar." },
      { property: "og:title", content: "Edit your profile — Enj" },
      {
        property: "og:description",
        content: "Update your Enj display name, username, bio and avatar.",
      },
    ],
  }),
  component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({ name: "", username: "", bio: "", image: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        username: user.username ?? "",
        bio: user.bio ?? "",
        image: user.image ?? "",
      });
    }
  }, [user]);

  return (
    <AppShell rail={<SideRail />}>
      <PageHeader title="Profile settings" subtitle="How you appear across Enj" />

      {!isAuthenticated && !isLoading ? (
        <div className="px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Sign in to edit your profile</p>
          <Button asChild className="mt-4 rounded-full px-6">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      ) : user ? (
        <form
          className="space-y-5 px-4 py-6 sm:px-6"
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile.mutate({
              name: form.name,
              username: form.username,
              bio: form.bio || null,
              image: form.image || null,
            });
          }}
        >
          <div className="flex items-center gap-4">
            <UserAvatar
              user={{ ...user, image: form.image || user.image }}
              size="lg"
              linked={false}
            />
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="image">Avatar image URL</Label>
              <Input
                id="image"
                placeholder="https://…"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              maxLength={160}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">{160 - form.bio.length} characters left</p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="text-destructive"
              onClick={() => void signOut()}
            >
              Sign out
            </Button>
            <Button type="submit" className="rounded-full px-6" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      ) : null}
    </AppShell>
  );
}
