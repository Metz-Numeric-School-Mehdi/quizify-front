import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { CreateQuestion, Question, OrderingQuestion, OrderingQuestionResponse } from "~/types/question/Question";

export const useQuestionStore = defineStore("question", () => {
  const config = useRuntimeConfig();
  const auth = authStore();
  const state = ref<{
    questions: Question[] | null;
    question: Question | null;
    error: string | null;
    loading: boolean;
  }>({
    questions: null,
    question: null,
    error: null,
    loading: false,
  });

  const useQuiz = useQuizStore();

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Question[]>(`/api/questions`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.questions = data.value;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Question>(
      `/api/questions/${id}`,
      {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.question = data.value;
    state.value.loading = false;
  };

  const create = async (payload: CreateQuestion) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/questions", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    await useQuiz.getOne(payload.quiz_id);
    return data.value;
  };

  const createOrdering = async (payload: OrderingQuestion) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<OrderingQuestionResponse>("/api/ordering-questions", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    await useQuiz.getOne(payload.quiz_id);
    return data.value;
  };

  const update = async (payload: CreateQuestion, id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/questions/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "PUT",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const remove = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error } = await useFetch(`/api/questions/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (error.value) return false;
    useQuiz.getOne(useQuiz.state.quiz?.id || 0);
    state.value.loading = false;
    return true;
  };

  return { state, getAll, getOne, create, createOrdering, update, remove };
});
