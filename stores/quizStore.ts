import { defineStore } from "pinia";
import { ref } from "vue";
import type { CreateQuizModal } from "~/types/quiz/CreateQuizModal";
import type { Quiz } from "~/types/quiz/Quiz";

export const quizStore = defineStore(
  "quiz",
  () => {
    const useAuth = authStore();
    const state = ref<{
      ready: boolean;
      allQuiz: Quiz[] | null;
      quiz: Quiz | null;
      openModal: boolean;
      createQuizForm: CreateQuizModal;
    }>({
      ready: false,
      allQuiz: null,
      quiz: null,
      openModal: false,
      createQuizForm: {
        title: "",
        description: "",
        level_id: "",
        category_id: "",
        is_public: false,
        status: "",
        duration: 0,
        max_attempts: 0,
        pass_score: 0,
        thumbnail: null,
        questions: [],
      },
    });

    const getAllQuiz = async () => {
      state.value.ready = false;

      try {
        const { data } = await useFetch<{ data: Quiz[] }>("/quizzes", {
          baseURL: "http://localhost:8000/api",
          method: "GET",
        });

        if (data.value?.data) {
          state.value.allQuiz = data.value.data;
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        state.value.ready = true;
      }
    };

    const createQuiz = async (payload: CreateQuizModal) => {
      try {
        const formData = new FormData();

        formData.append("title", payload.title);
        formData.append("description", payload.description);
        formData.append("level_id", payload.level_id);
        formData.append("category_id", payload.category_id);
        formData.append("is_public", payload.is_public ? "1" : "0");
        formData.append("status", payload.status);
        formData.append("duration", payload.duration.toString());
        formData.append("max_attempts", payload.max_attempts.toString());
        formData.append("pass_score", payload.pass_score.toString());
        formData.append(
          "thumbnail",
          payload.thumbnail ? payload.thumbnail : ""
        );
        formData.append("questions", JSON.stringify(payload.questions));

        const { data } = await useFetch<{ data: Quiz[] }>("/quizzes", {
          baseURL: "http://localhost:8000/api",
          method: "POST",
          headers: {
            Authorization: `Bearer ${useAuth.state.token}`,
            Accept: "application/json",
          },

          body: formData,
        });
      } catch (error) {
        console.error("Failed to create quiz:", error);
      }
    };

    const fetch = () => {
      Promise.all([getAllQuiz()]);
    };

    return { state, getAllQuiz, createQuiz, fetch };
  },
  {
    persist: true,
  }
);
