import { defineStore } from "pinia";
import { ref } from "vue";
import type { ApiError } from "~/types/error/ApiError";
import type { Category } from "~/types/quiz/Category";
import type { CreateQuizModal } from "~/types/quiz/CreateQuizModal";
import type { Level } from "~/types/quiz/Level";
import type { Quiz, QuizForm } from "~/types/quiz/Quiz";
import { authStore } from "./authStore";
const config = useRuntimeConfig();

export const useQuizStore = defineStore(
  "quiz",
  () => {
    const auth = authStore();
    const state = ref<{
      quizzes: Quiz[] | null;
      quiz: Quiz | null;
      levels: Level[] | null;
      categories: Category[] | null;
      quizForm: QuizForm;
      apiError: ApiError | null;
      loading: boolean;
      openModal: boolean;
      openPlayModal: boolean;
      openEditModal: boolean;
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
      levels: null,
      categories: null,
      quizForm: {
        title: "",
        description: "",
        level_id: null,
        category_id: null,
        is_public: "0",
        status: "published",
      },
      apiError: null,
      loading: false,
      openModal: false,
      openPlayModal: false,
      openEditModal: false,
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
      state.value.apiError = null;
      try {
        const { data } = await useFetch<Quiz[]>("/api/quizzes", {
          baseURL: config.public.apiBase,
          method: "GET",
        });
        state.value.quizzes = data.value;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
      } finally {
        state.value.loading = false;
      }
    };

    const setQuizFormFromQuiz = () => {
      if (state.value.quiz) {
        state.value.quizForm = {
          title: state.value.quiz.title || "",
          description: state.value.quiz.description || "",
          level_id: state.value.quiz.level_id || null,
          category_id: state.value.quiz.category_id || null,
          is_public: state.value.quiz.is_public ? "1" : "0",
          status: state.value.quiz.status || "draft",
        };
      }
    };

    const getOne = async (id: number) => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const response = await fetch(`${config.public.apiBase}/api/quizzes/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw { response: { data: errorData } };
        }
        const quiz = await response.json();
        state.value.quiz = quiz;
        setQuizFormFromQuiz();
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
        state.value.quiz = null;
      } finally {
        state.value.loading = false;
      }
    };

    const getLevels = async () => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const { data } = await useFetch<Level[]>("/api/quiz-levels", {
          baseURL: config.public.apiBase,
          method: "GET",
        });
        state.value.levels = data.value;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
      } finally {
        state.value.loading = false;
      }
    };

    const getCategories = async () => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const { data } = await useFetch<Category[]>(
          "/api/categories",
          {
            baseURL: config.public.apiBase,
            method: "GET",
          }
        );
        state.value.categories = data.value;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
      } finally {
        state.value.loading = false;
      }
    };

    const create = async (payload: CreateQuizModal) => {
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
      state.value.apiError = null;
      try {
        const { data } = await useFetch<Quiz>("/api/quizzes", {
          baseURL: config.public.apiBase,
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.state.token}`,
          },
        });
        if (data.value?.id) await getOne(data.value.id);
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
      } finally {
        state.value.loading = false;
      }
    };

    const update = async (id: number, payload: QuizForm) => {
      state.value.apiError = null;
      try {
        const { data, error } = await useFetch(`/api/quizzes/${id}`, {
          baseURL: config.public.apiBase,
          method: "PUT",
          body: payload,
          headers: { Authorization: `Bearer ${auth.state.token}` },
        });
        if (error.value) {
          state.value.apiError = error.value.data as ApiError;
          return false;
        }
        getOne(id);
        return true;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
        return false;
      }
    };


    const resetQuizForm = () => {
      state.value.quizForm = {
        title: "",
        description: "",
        level_id: null,
        category_id: null,
        is_public: "0",
        status: "published",
      };
    };

    const remove = async (id: number) => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        await useFetch(`/api/quizzes/${id}`, {
          baseURL: config.public.apiBase,
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth.state.token}` },
        });
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
      } finally {
        state.value.loading = false;
      }
    };

    const submit = async (id: number, responses: any) => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const { data } = await useFetch(`/api/quizzes/${id}/submit`, {
          baseURL: config.public.apiBase,
          method: "POST",
          body: { responses },
          headers: { Authorization: `Bearer ${auth.state.token}` },
        });
        return data.value;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
        return null;
      } finally {
        state.value.loading = false;
      }
    };

    return {
      state,
      getAll,
      getOne,
      getLevels,
      getCategories,
      create,
      update,
      resetQuizForm,
      remove,
      submit,
      setQuizFormFromQuiz,
    };
  },
  {
    persist: true,
  }
);
