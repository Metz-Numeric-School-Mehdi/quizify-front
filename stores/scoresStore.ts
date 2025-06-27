import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { Score } from "~/types/score/Score";
export const useScoresStore = defineStore("scores", () => {
  const auth = authStore();
  const state = ref<{
    scores: Score[] | null;
    score: Score | null;
    error: string | null;
    loading: boolean;
  }>({
    scores: null,
    score: null,
    error: null,
    loading: false,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Score[]>("/api/scores", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.scores = data.value;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Score>(`/api/scores/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.score = data.value;
    state.value.loading = false;
  };

  const create = async (payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/scores", {
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
    const { data, error: err } = await useFetch(`/api/scores/${id}`, {
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
    const { error: err } = await useFetch(`/api/scores/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "DELETE",
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  return { state, getAll, getOne, create, update, remove };
});
