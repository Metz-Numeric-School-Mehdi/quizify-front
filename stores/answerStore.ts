import { defineStore } from "pinia";
import { ref } from "vue";
import type { Answer, CreateAnswer, updateAnswer } from "~/types/answer/Answer";
import { authStore } from "./authStore";

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

  const useQuiz = useQuizStore();

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Answer[]>(`/api/answers`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
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
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.answer = data.value;
    state.value.loading = false;
  };

  const create = async (payload: CreateAnswer) => {
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/answers", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    if (useQuiz.state.quiz) {
      useQuiz.getOne(useQuiz.state.quiz.id);
    }
    return data.value;
  };

  const update = async (payload: updateAnswer, id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/answers/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "PUT",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    if (useQuiz.state.quiz) {
      useQuiz.getOne(useQuiz.state.quiz.id);
    }
    return data.value;
  };

  const updateMany = async (payload: CreateAnswer) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/questions/${payload.question_id}/answers`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "PUT",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    if (useQuiz.state.quiz) {
      useQuiz.getOne(useQuiz.state.quiz.id);
    }
    state.value.loading = false;
    return data.value;
  };

  const remove = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error } = await useFetch(`/api/answers/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (error.value) return false;
    if (useQuiz.state.quiz) {
      useQuiz.getOne(useQuiz.state.quiz.id);
    }
    state.value.loading = false;
    return true;
  };

  return { state, getAll, getOne, create, update, updateMany, remove };
});
