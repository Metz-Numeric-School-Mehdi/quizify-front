import { defineStore } from "pinia"
import { ref } from "vue"
import { authStore } from "./authStore"
import type { Question } from "~/types/question/Question"

export const useQuestionStore = defineStore("question", () => {
  const auth = authStore()
  const state = ref<{
    questions: Question[] | null
    question: Question | null
    error: string | null
    loading: boolean
  }>({
    questions: null,
    question: null,
    error: null,
    loading: false
  })

  const getAll = async (quizId: number) => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch<Question[]>(`/api/quizzes/${quizId}/questions`, {
      baseURL: "http://localhost:8000",
      method: "GET"
    })
    if (err.value) state.value.error = err.value.data?.message
    else state.value.questions = data.value
    state.value.loading = false
  }

  const getOne = async (quizId: number, id: number) => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch<Question>(`/api/quizzes/${quizId}/questions/${id}`, {
      baseURL: "http://localhost:8000",
      method: "GET"
    })
    if (err.value) state.value.error = err.value.data?.message
    else state.value.question = data.value
    state.value.loading = false
  }

  const create = async (quizId: number, payload: any) => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch(`/api/quizzes/${quizId}/questions`, {
      baseURL: "http://localhost:8000",
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` }
    })
    if (err.value) state.value.error = err.value.data?.message
    state.value.loading = false
    return data.value
  }

  const update = async (quizId: number, id: number, payload: any) => {
    state.value.loading = true
    state.value.error = null
    const { data, error: err } = await useFetch(`/api/quizzes/${quizId}/questions/${id}`, {
      baseURL: "http://localhost:8000",
      method: "PUT",
      body: payload,
      headers: { Authorization: `Bearer ${auth.state.token}` }
    })
    if (err.value) state.value.error = err.value.data?.message
    state.value.loading = false
    return data.value
  }

  const remove = async (quizId: number, id: number) => {
    state.value.loading = true
    state.value.error = null
    const { error: err } = await useFetch(`/api/quizzes/${quizId}/questions/${id}`, {
      baseURL: "http://localhost:8000",
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.state.token}` }
    })
    if (err.value) state.value.error = err.value.data?.message
    state.value.loading = false
  }

  return { state }
})
