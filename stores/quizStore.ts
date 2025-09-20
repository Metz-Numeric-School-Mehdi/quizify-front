import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  QuizCreatePayloadType,
  QuizBasicCreatePayload,
} from "~/types/config/QuizConfigType";
import type { ApiError } from "~/types/error/ApiError";
import type { Category } from "~/types/quiz/Category";
import type { Level } from "~/types/quiz/Level";
import type { Quiz, QuizForm } from "~/types/quiz/Quiz";
import { authStore } from "./authStore";
export const useQuizStore = defineStore(
  "quiz",
  () => {
    const auth = authStore();
    const state = ref<{
      [key: string]: any;
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
      quizCreatePayload: QuizCreatePayloadType;
      ready: boolean;
      allQuiz: Quiz[] | null;
      isOwner: boolean;
    }>({
      quizzes: null,
      quiz: null,
      levels: null,
      categories: null,
      quizForm: {
        title: "",
        description: "",
        duration: null,
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
      quizCreatePayload: {
        title: "",
        description: "",
        level_id: "",
        category_id: "",
        is_public: false,
        status: "published",
        duration: 0,
        pass_score: 0,
        thumbnail: null,
        questions: [],
      },
      ready: false,
      allQuiz: null,
      filteredPublicQuizzes: null,
      isOwner: false,
    });

    const getAll = async () => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const { data } = await useFetch<Quiz[]>("/api/quizzes", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.state.token}`,
          },
          query: {
            mine: state.value.isOwner ? "1" : "0",
          },
        });
        state.value.quizzes = data.value
          ? data.value.filter((quiz) => {
              if (state.value.isOwner) {
                return true;
              }
              return Array.isArray(quiz.questions) && quiz.questions.length > 0;
            })
          : [];
        state.value.allQuiz = data.value || [];
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
          duration: state.value.quiz.duration || null,
          level_id: state.value.quiz.level?.id || null,
          category_id: state.value.quiz.category?.id || null,
          is_public: state.value.quiz.is_public ? "1" : "0",
          status: state.value.quiz.status || "published",
        };
      }
    };

    const getOne = async (id: number) => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const { data, error } = await useFetch<Quiz>(`/api/quizzes/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase,
        });
        
        if (error.value) {
          throw { response: { data: error.value.data } };
        }
        
        state.value.quiz = data.value;
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
          baseURL: useRuntimeConfig().public.apiBase,
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
        const { data } = await useFetch<Category[]>("/api/categories", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
        });
        state.value.categories = data.value;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
      } finally {
        state.value.loading = false;
      }
    };

    const useAuth = authStore();

    const create = async (payload: QuizCreatePayloadType) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("level_id", String(payload.level_id));
      formData.append("category_id", String(payload.category_id));
      formData.append("is_public", payload.is_public ? "1" : "0");
      formData.append("status", "published");
      formData.append("duration", String(payload.duration));
      formData.append("pass_score", String(payload.pass_score));
      if (payload.thumbnail) {
        formData.append("thumbnail", payload.thumbnail);
      }
      if (useAuth.state.user?.id) {
        formData.append("user_id", String(useAuth.state.user.id));
      }
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const { data } = await useFetch<{ data: Quiz; message: string }>(
          "/api/quizzes",
          {
            baseURL: useRuntimeConfig().public.apiBase,
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${auth.state.token}`,
            },
          }
        );
        if (data.value?.data?.id) await getOne(data.value.data.id);
        return data.value?.data;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
        return false;
      } finally {
        state.value.loading = false;
      }
    };

    const update = async (id: number, payload: QuizForm) => {
      state.value.apiError = null;
      payload.is_public = payload.is_public === "true" ? true : false;
      payload.duration = payload.duration ? payload.duration : null;
      payload.status = "published";
      try {
        const { data, error } = await useFetch(`/api/quizzes/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase,
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

    const deleteQuiz = async (id: number) => {
      state.value.apiError = null;
      try {
        const { data, error } = await useFetch(`/api/quizzes/${id}`, {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth.state.token}` },
        });
        if (error.value) {
          state.value.apiError = error.value.data as ApiError;
          return false;
        }
        await getAll();
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
        duration: null,
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
          baseURL: useRuntimeConfig().public.apiBase,
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
      responses.time_spent = responses.time_spent ? responses.time_spent : null;
      try {
        const { data } = await useFetch(`/api/quizzes/${id}/submit`, {
          baseURL: useRuntimeConfig().public.apiBase,
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

    const resetPayload = () => {
      state.value.quizCreatePayload = {
        title: "",
        description: "",
        level_id: "",
        category_id: "",
        is_public: false,
        status: "published",
        duration: 0,
        pass_score: 0,
        thumbnail: null,
        questions: [],
      };
    };

    const getPublishedAndPublicQuizzes = async () => {
      state.value.loading = true;
      state.value.apiError = null;
      try {
        const { data } = await useFetch<Quiz[]>("/api/quizzes", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.state.token}`,
          },
        });

        if (data.value) {
          const publishedAndPublicQuizzes = data.value.filter((quiz) => {
            return (
              quiz.status === "published" &&
              (quiz.is_public === 1 || quiz.is_public === true)
            );
          });

          state.value.filteredPublicQuizzes = publishedAndPublicQuizzes;
        } else {
          state.value.filteredPublicQuizzes = [];
        }
        state.value.ready = true;
      } catch (e: any) {
        state.value.apiError = e.response?.data as ApiError;
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
      deleteQuiz,
      resetPayload,
      create,
      update,
      resetQuizForm,
      remove,
      submit,
      setQuizFormFromQuiz,
      getPublishedAndPublicQuizzes,
    };
  },
  {
    persist: true,
  }
);
