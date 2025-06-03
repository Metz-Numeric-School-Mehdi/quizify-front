import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { Quiz } from "~/types/quiz/Quiz";
import type { QuizLevel } from "~/types/level/QuizLevel";
import type { QuizCategory } from "~/types/category/QuizCategory";
import type { CreateQuizModal } from "~/types/quiz/CreateQuizModal";

export const useQuizStore = defineStore("quiz", () => {
  const auth = authStore();
  const state = ref<{
    quizzes: Quiz[] | null;
    quiz: Quiz | null;
    quizLevels: QuizLevel[] | null;
    quizCategories: QuizCategory[] | null;
    error: string | null;
    loading: boolean;
    openModal: boolean;
    createQuizForm: {
      title: string;
      description: string;
      level_id: string | number;
      category_id: string | number;
      is_public: boolean;
      status: string;
      duration: number;
      max_attempts: number;
      pass_score: number;
      thumbnail: File | null;
      questions: any[];
    };
    ready: boolean;
    allQuiz: Quiz[] | null;
  }>({
    quizzes: null,
    quiz: null,
    quizLevels: null,
    quizCategories: null,
    error: null,
    loading: false,
    openModal: false,
    createQuizForm: {
      title: "",
      description: "",
      level_id: "",
      category_id: "",
      is_public: false,
      status: "draft",
      duration: 0,
      max_attempts: 0,
      pass_score: 0,
      thumbnail: null,
      questions: [],
    },
    ready: false,
    allQuiz: null,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<{ data: Quiz[] }>(
      "/api/quizzes",
      {
        baseURL: "http://localhost:8000",
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else if (data.value) state.value.quizzes = data.value.data;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Quiz>(`/api/quizzes/${id}`, {
      baseURL: "http://localhost:8000",
      method: "GET",
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.quiz = data.value;
    state.value.loading = false;
  };

  const getQuizLevels = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<QuizLevel[]>(
      "/api/quiz-levels",
      {
        baseURL: "http://localhost:8000",
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.quizLevels = data.value;
    state.value.loading = false;
  };

  const getQuizCategories = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<QuizCategory[]>(
      "/api/categories",
      {
        baseURL: "http://localhost:8000",
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.quizCategories = data.value;
    state.value.loading = false;
  };

  const create = async (payload: CreateQuizModal) => {
    console.log(payload.duration);
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("level_id", String(payload.level_id));
    formData.append("category_id", String(payload.category_id));
    formData.append("is_public", payload.is_public ? "1" : "0");
    formData.append("status", payload.status);
    formData.append("duration", String(payload.duration));
    formData.append("max_attempts", String(payload.max_attempts));
    formData.append("pass_score", String(payload.pass_score));
    if (payload.thumbnail) {
      formData.append("thumbnail", payload.thumbnail);
    }
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/quizzes", {
      baseURL: "http://localhost:8000",
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${auth.state.token}`,
      },
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const update = async (id: number, payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/quizzes/${id}`, {
      baseURL: "http://localhost:8000",
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
    const { error: err } = await useFetch(`/api/quizzes/${id}`, {
      baseURL: "http://localhost:8000",
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  const submit = async (id: number, responses: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/quizzes/${id}/submit`, {
      baseURL: "http://localhost:8000",
      method: "POST",
      body: { responses },
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  return {
    state,
    getAll,
    getOne,
    getQuizLevels,
    getQuizCategories,
    create,
    update,
    remove,
    submit,
  };
});
