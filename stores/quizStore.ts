import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type { Quiz, QuizForm } from "~/types/quiz/Quiz";
import type { CreateQuizModal } from "~/types/quiz/CreateQuizModal";
import type { Level } from "~/types/quiz/Level";
import type { Category } from "~/types/quiz/Category";

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
      error: string | null;
      loading: boolean;
      openModal: boolean;
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
      error: null,
      loading: false,
      openModal: false,
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
      state.value.error = null;
      const { data, error: err } = await useFetch<Quiz[]>("/api/quizzes", {
        baseURL: "http://localhost:8000",
        method: "GET",
      });
      if (err.value) state.value.error = err.value.data?.message;
      else if (data.value) state.value.quizzes = data.value;
      state.value.loading = false;
    };

    const getOne = async (id: number) => {
      state.value.loading = true;
      state.value.error = null;
      try {
        const response = await fetch(`http://localhost:8000/api/quizzes/${id}`);
        if (!response.ok) throw new Error("Erreur serveur");
        const quiz = await response.json();
        state.value.quiz = quiz;
      } catch (e: any) {
        state.value.error = e?.message || "An error occurred";
        state.value.quiz = null;
      } finally {
        state.value.loading = false;
      }
    };

    const getLevels = async () => {
      state.value.loading = true;
      state.value.error = null;
      const { data, error: err } = await useFetch<Level[]>("/api/quiz-levels", {
        baseURL: "http://localhost:8000",
        method: "GET",
      });
      if (err.value) state.value.error = err.value.data?.message;
      else state.value.levels = data.value;
      state.value.loading = false;
    };

    const getCategories = async () => {
      state.value.loading = true;
      state.value.error = null;
      const { data, error: err } = await useFetch<Category[]>(
        "/api/categories",
        {
          baseURL: "http://localhost:8000",
          method: "GET",
        }
      );
      if (err.value) state.value.error = err.value.data?.message;
      else state.value.categories = data.value;
      state.value.loading = false;
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
      state.value.error = null;
      const { data, error: err } = await useFetch<Quiz>("/api/quizzes", {
        baseURL: "http://localhost:8000",
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${auth.state.token}`,
        },
      });
      if (err.value) state.value.error = err.value.data?.message;
      state.value.loading = false;
      if (data.value?.id) await getOne(data.value.id);
    };

    const update = async (id: number, payload: QuizForm) => {
      const { data, error } = await useFetch(`/api/quizzes/${id}`, {
        baseURL: "http://localhost:8000",
        method: "PUT",
        body: payload.is_public,
        headers: { Authorization: `Bearer ${auth.state.token}` },
      });
      if (error.value) return false;

      getOne(id);
      return true;
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
      getLevels,
      getCategories,
      create,
      update,
      resetQuizForm,
      remove,
      submit,
    };
  },
  {
    persist: true,
  }
);
