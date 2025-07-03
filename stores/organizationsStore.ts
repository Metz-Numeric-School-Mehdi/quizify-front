import { defineStore } from "pinia";
import { ref } from "vue";
import type { Organization } from "~/types/organization/Organization";
export const useOrganizationsStore = defineStore("organizations", () => {
  const auth = authStore();
  const state = ref<{
    organizations: Organization[] | null;
    organization: Organization | null;
    error: string | null;
    loading: boolean;
  }>({
    organizations: null,
    organization: null,
    error: null,
    loading: false,
  });

  const getAll = async () => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Organization[]>(
      "/api/organizations",
      {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.organizations = data.value;
    state.value.loading = false;
  };

  const getOne = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch<Organization>(
      `/api/organizations/${id}`,
      {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
      }
    );
    if (err.value) state.value.error = err.value.data?.message;
    else state.value.organization = data.value;
    state.value.loading = false;
  };

  const create = async (payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch("/api/organizations", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "POST",
      body: payload,
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const update = async (id: number, payload: any) => {
    state.value.loading = true;
    state.value.error = null;
    const { data, error: err } = await useFetch(`/api/organizations/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "PUT",
      body: payload,
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
    return data.value;
  };

  const remove = async (id: number) => {
    state.value.loading = true;
    state.value.error = null;
    const { error: err } = await useFetch(`/api/organizations/${id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "DELETE",
    });
    if (err.value) state.value.error = err.value.data?.message;
    state.value.loading = false;
  };

  return { state, getAll, getOne, create, update, remove };
});
