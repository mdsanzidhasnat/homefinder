"use client";

import { create } from "zustand";
import type { SearchFilters, UserRole, Property } from "@/types";

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar_url?: string;
  } | null;
  setUser: (
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      avatar_url?: string;
    } | null
  ) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

interface FilterState {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));

interface FavoriteState {
  favorites: Set<string>;
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: new Set(),
  setFavorites: (ids) => set({ favorites: new Set(ids) }),
  addFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favorites);
      next.add(id);
      return { favorites: next };
    }),
  removeFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favorites);
      next.delete(id);
      return { favorites: next };
    }),
  isFavorite: (id) => get().favorites.has(id),
}));
