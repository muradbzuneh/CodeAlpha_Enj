import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { SignInInput, SignUpInput, User } from "@/types/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: unknown;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: user = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.session,
    queryFn: () => api.auth.me(),
    retry: false,
    staleTime: 60_000,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.session });
  }, [queryClient]);

  const signIn = useCallback(
    async (input: SignInInput) => {
      await api.auth.signIn(input);
      await queryClient.invalidateQueries({ queryKey: queryKeys.session });
    },
    [queryClient],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      await api.auth.signUp(input);
      await queryClient.invalidateQueries({ queryKey: queryKeys.session });
    },
    [queryClient],
  );

  const signOut = useCallback(async () => {
    await queryClient.cancelQueries();
    try {
      await api.auth.signOut();
    } finally {
      queryClient.clear();
      navigate({ to: "/login", replace: true });
    }
  }, [navigate, queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      error,
      signIn,
      signUp,
      signOut,
      refresh,
    }),
    [user, isLoading, error, signIn, signUp, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
