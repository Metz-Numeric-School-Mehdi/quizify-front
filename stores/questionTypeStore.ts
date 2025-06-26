import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { QuestionType } from "~/types/questionType/QuestionType";
const config = useRuntimeConfig();

export const useQuestionTypeStore = defineStore("questionType", () => {
  const auth = authStore();
  const state = ref<{
    questionTypes: QuestionType[] | null;
    questionType: QuestionType | null;
    error: string | null;
    loading: boolean;
  }>({
    questionTypes: null,
    questionType: null,
    error: null,
    loading: false,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<QuestionType[]>(
      "/api/question-types",
      {
        baseURL: config.public.apiBase,
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.questionTypes = data.value;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<QuestionType>(
      `/api/question-types/${id}`,
      {
        baseURL: config.public.apiBase,
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.questionType = data.value;
    state.value.loading = false;
  };

  const create = async (payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/question-types", {
      baseURL: config.public.apiBase,
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
    const { data, error: err } = await useFetch(`/api/question-types/${id}`, {
      baseURL: config.public.apiBase,
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
    const { error: err } = await useFetch(`/api/question-types/${id}`, {
      baseURL: config.public.apiBase,
      method: "DELETE",
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  return { state };
});
