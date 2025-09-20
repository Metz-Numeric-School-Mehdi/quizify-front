import { defineStore } from "pinia";
import { ref } from "vue";
import type { LeaderboardResponse } from "~/types/leaderboard/LeaderboardResponse";
import { authStore } from "./authStore";

export const useLeaderboardStore = defineStore("leaderboard", () => {
  const auth = authStore();
  const state = ref<{
    leaderboard: LeaderboardResponse | null;
    error: string | null;
    loading: boolean;
  }>({
    leaderboard: null,
    error: null,
    loading: false,
  });

  const getGlobalLeaderboard = async (page: number = 1, order: "asc" | "desc" = "desc") => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const { data, error } = await useFetch<LeaderboardResponse>("/api/leaderboard", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
        query: { page, order }
      });
      
      if (error.value) {
        state.value.error = error.value?.data?.message || error.value?.message || "Erreur inconnue";
      } else if (data.value) {
        state.value.leaderboard = data.value;
      }
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur inconnue";
    }
    state.value.loading = false;
  };

  const getLeaderboardByCategory = async (categoryId: number, page: number = 1, order: "asc" | "desc" = "desc") => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const { data, error } = await useFetch<LeaderboardResponse>(`/api/leaderboard/category/${categoryId}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
        query: { page, order }
      });
      
      if (error.value) {
        state.value.error = error.value?.data?.message || error.value?.message || "Erreur inconnue";
      } else if (data.value) {
        state.value.leaderboard = data.value;
      }
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur inconnue";
    }
    state.value.loading = false;
  };

  const getLeaderboardByOrganization = async (organizationId: number, page: number = 1, order: "asc" | "desc" = "desc") => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const { data, error } = await useFetch<LeaderboardResponse>(`/api/leaderboard/organization/${organizationId}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
        query: { page, order }
      });
      
      if (error.value) {
        state.value.error = error.value?.data?.message || error.value?.message || "Erreur inconnue";
      } else if (data.value) {
        state.value.leaderboard = data.value;
      }
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur inconnue";
    }
    state.value.loading = false;
  };

  const updateRankings = async () => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const { error } = await useFetch("/api/leaderboard/update-rankings", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "POST",
        headers: { Authorization: `Bearer ${auth.state.token}` },
      });
      
      if (error.value) {
        state.value.error = error.value?.data?.message || error.value?.message || "Erreur inconnue";
      }
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur inconnue";
    }
    state.value.loading = false;
  };

  return {
    state,
    getGlobalLeaderboard,
    getLeaderboardByCategory,
    getLeaderboardByOrganization,
    updateRankings
  };
});