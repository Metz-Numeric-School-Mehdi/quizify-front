import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { Badge } from "~/types/badge/Badge";
export const useBadgesStore = defineStore("badges", () => {
  const auth = authStore();
  const state = ref<{
    badges: Badge[] | null;
    badge: Badge | null;
    error: string | null;
    loading: boolean;
  }>({
    badges: null,
    badge: null,
    error: null,
    loading: false,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Badge[]>("/api/badges", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.badges = data.value;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Badge>(`/api/badges/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.badge = data.value;
    state.value.loading = false;
  };

  const create = async (payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/badges", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "POST",
      body: payload,
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const update = async (id: number, payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/badges/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "PUT",
      body: payload,
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const remove = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { error: err } = await useFetch(`/api/badges/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "DELETE",
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  return { state };
});
