import { defineStore } from "pinia";
import { ref } from "vue";
import type { Quiz } from "~/types/quiz/Quiz";

export const quizStore = defineStore(
  "quiz",
  () => {
    const state = ref<{
      ready: boolean;
      allQuiz: Quiz[] | null;
      quiz: Quiz | null;
    }>({
      ready: false,
      allQuiz: null,
      quiz: null,
    });

    const setAllQuiz = async () => {
      state.value.ready = false;

      try {
        const { data, error } = await useFetch<Quiz[]>("/quizzes", {
          baseURL: "http://localhost:8000/api",
          method: "GET",
        });

        if (data.value) {
          state.value.allQuiz = data.value;
          console.log(state.value.allQuiz);
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        state.value.ready = true;
      }
    };

    const fetch = () => {
      Promise.all([setAllQuiz()]);
    };

    return { state, setAllQuiz, fetch};
  },
  {
    persist: true,
  }
);
