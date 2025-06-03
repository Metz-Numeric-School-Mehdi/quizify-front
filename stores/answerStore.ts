import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { Answer } from "~/types/answer/Answer";

export const useAnswerStore = defineStore("answer", () => {
  const auth = authStore();
  const state = ref<{
    answers: Answer[] | null;
    answer: Answer | null;
    error: string | null;
    loading: boolean;
  }>({
    answers: null,
    answer: null,
    error: null,
    loading: false,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Answer[]>(
      `/api/answers`,
      {
        baseURL: "http://localhost:8000",
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.answers = data.value;
    state.value.loading = false;
  };

  const getOne = async (questionId: number, id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Answer>(
      `/api/questions/${questionId}/answers/${id}`,
      {
        baseURL: "http://localhost:8000",
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.answer = data.value;
    state.value.loading = false;
  };

  const create = async (questionId: number, payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(
      `/api/questions/${questionId}/answers`,
      {
        baseURL: "http://localhost:8000",
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${auth.state.token}` },
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const update = async (questionId: number, id: number, payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(
      `/api/questions/${questionId}/answers/${id}`,
      {
        baseURL: "http://localhost:8000",
        method: "PUT",
        body: payload,
        headers: { Authorization: `Bearer ${auth.state.token}` },
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const remove = async (questionId: number, id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { error: err } = await useFetch(
      `/api/questions/${questionId}/answers/${id}`,
      {
        baseURL: "http://localhost:8000",
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.state.token}` },
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  return { state, getAll };
});
