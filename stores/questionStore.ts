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
    try {
      const data = await $fetch<Question[]>(`/api/questions`, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
      });
      state.value.questions = data;
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur lors du chargement";
    }
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const data = await $fetch<Question>(
        `/api/questions/${id}`,
        {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
        }
      );
      state.value.question = data;
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur lors du chargement";
    }
    state.value.loading = false;
  };

  const create = async (payload: CreateQuestion) => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const data = await $fetch("/api/questions", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${auth.state.token}` },
      });
      await useQuiz.getOne(payload.quiz_id);
      return data;
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur lors de la création";
    }
    state.value.loading = false;
  };

  const createOrdering = async (payload: OrderingQuestion) => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const data = await $fetch<OrderingQuestionResponse>("/api/ordering-questions", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${auth.state.token}` },
      });
      await useQuiz.getOne(payload.quiz_id);
      return data;
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur lors de la création";
    }
    state.value.loading = false;
  };

  const update = async (payload: CreateQuestion, id: number) => {
    state.value.loading = true;
    state.value.error = null;
    try {
      const data = await $fetch(`/api/questions/${id}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "PUT",
        body: payload,
        headers: { Authorization: `Bearer ${auth.state.token}` },
      });
      return data;
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur lors de la mise à jour";
    }
    state.value.loading = false;
  };

  const remove = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    try {
      await $fetch(`/api/questions/${id}`, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.state.token}` },
      });
      useQuiz.getOne(useQuiz.state.quiz?.id || 0);
      state.value.loading = false;
      return true;
    } catch (err: any) {
      state.value.error = err?.data?.message || err?.message || "Erreur lors de la suppression";
      state.value.loading = false;
      return false;
    }
  };

  return { state, getAll, getOne, create, createOrdering, update, remove };
});
