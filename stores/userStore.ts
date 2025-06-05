import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type User from "~/types/user/User";

export const useUserStore = defineStore("user", () => {
  const auth = authStore();
  const state = ref<{
    users: User[] | null;
    user: User | null;
    error: string | null;
    loading: boolean;
  }>({
    users: null,
    user: null,
    error: null,
    loading: false,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<User[]>("/api/users", {
      baseURL: "http://localhost:8000",
      method: "GET",
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.users = data.value;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<User>(`/api/users/${id}`, {
      baseURL: "http://localhost:8000",
      method: "GET",
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.user = data.value;
    state.value.loading = false;
  };

  const update = async (id: number, payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/users/${id}`, {
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
    const { error: err } = await useFetch(`/api/users/${id}`, {
      baseURL: "http://localhost:8000",
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.state.token}` },
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  return { state };
});
