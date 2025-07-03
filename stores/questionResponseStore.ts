import { defineStore } from "pinia"
import { ref } from "vue"
import type { QuestionResponse } from "~/types/questionResponse/QuestionResponse"
export const useQuestionResponseStore = defineStore("questionResponse", () => {
  const state = ref<{
    questionResponses: QuestionResponse[] | null
    questionResponse: QuestionResponse | null
    error: string | null
    loading: boolean
  }>({
    questionResponses: null,
    questionResponse: null,
    error: null,
    loading: false
  })

  const getAll = async () => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch<QuestionResponse[]>("/api/question-responses", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET"
    })
    if (err.value) state.value.error = err.value.data?.message
    else state.value.questionResponses = data.value
    state.value.loading = false
  }

  const getOne = async (id: number) => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch<QuestionResponse>(`/api/question-responses/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "GET"
    })
    if (err.value) state.value.error = err.value.data?.message
    else state.value.questionResponse = data.value
    state.value.loading = false
  }

  const create = async (payload: any) => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch("/api/question-responses", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "POST",
      body: payload
    })
    if (err.value) state.value.error = err.value.data?.message
    state.value.loading = false
    return data.value
  }

  const update = async (id: number, payload: any) => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch(`/api/question-responses/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "PUT",
      body: payload
    })
    if (err.value) state.value.error = err.value.data?.message
    state.value.loading = false
    return data.value
  }

  const remove = async (id: number) => {
    state.value.loading = true
    state.value.error = null
    const { error: err } = await useFetch(`/api/question-responses/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "DELETE"
    })
    if (err.value) state.value.error = err.value.data?.message
    state.value.loading = false
  }

  return { state }
})
