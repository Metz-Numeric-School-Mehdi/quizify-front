import type { Quiz, QuizMeta } from "~/types/quiz/Quiz";

/**
 * Composable for searching quizzes via the Laravel API.
 * Provides results, pagination, loading state, and error handling.
 *
 * @returns {{
 *   items: Ref<Array<any>>,
 *   meta: Ref<any>,
 *   loading: Ref<boolean>,
 *   error: Ref<string|null>,
 *   search: (params: object) => Promise<void>
 * }}
 */
export function useQuizSearch() {
  const items = ref<Quiz[]>([]);
  const meta = ref<QuizMeta | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  /**
   * Performs a quiz search.
   * @param {object} params
   */
  async function search(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<{ items: Quiz[], meta: QuizMeta }>("/api/quizzes/search", {
        method: "GET",
        params,
        baseURL: useRuntimeConfig().public.apiBase,
      });
      
      items.value = data?.items || [];
      meta.value = data?.meta || null;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || "Erreur lors de la recherche";
      items.value = [];
      meta.value = null;
    } finally {
      loading.value = false;
    }
  }

  return { items, meta, loading, error, search };
}
