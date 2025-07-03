import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { Team } from "~/types/team/Team";
export const useTeamsStore = defineStore("teams", () => {
  const auth = authStore();
  const state = ref<{
    teams: Team[] | null;
    team: Team | null;
    error: string | null;
    loading: boolean;
  }>({
    teams: null,
    team: null,
    error: null,
    loading: false,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Team[]>("/api/teams", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.teams = data.value;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Team>(`/api/teams/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.team = data.value;
    state.value.loading = false;
  };

  const create = async (payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/teams", {
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
    const { data, error: err } = await useFetch(`/api/teams/${id}`, {
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
    const { error: err } = await useFetch(`/api/teams/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "DELETE",
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  return { state, getAll, getOne, create, update, remove };
});
