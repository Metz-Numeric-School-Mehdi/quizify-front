import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type User from "~/types/user/User";
import { localStorageIsAvailable } from "~/utils/client";

export const userStore = defineStore("user", () => {
  const auth = authStore();

  const state = ref<{
    user: User | null;
    updateProfilePayload: {
      username: string;
      firstname: string;
      lastname: string;
      email: string;
      avatar: string;
    };
    isUpdating: boolean;
    responseErrors: string;
  }>({
    user: null,
    updateProfilePayload: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      avatar: "",
    },
    isUpdating: false,
    responseErrors: "",
  });

  const getProfile = async () => {
    try {
      const data = await $fetch<{user: User | null}>("/api/user", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.state.token}`,
          Accept: "application/json",
        },
      });

      if (data?.user) state.value.user = data.user;
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    }
  };
  
  const initializeProfile = () => {
    if (auth.state.user) {
      state.value.updateProfilePayload = {
        username: auth.state.user.username || "",
        firstname: auth.state.user.firstname || "",
        lastname: auth.state.user.lastname || "",
        email: auth.state.user.email || "",
        avatar: auth.state.user.avatar || "",
      };
    }
  };

  const updateProfile = async (
    profileData: typeof state.value.updateProfilePayload
  ) => {
    state.value.isUpdating = true;
    state.value.responseErrors = "";

    try {
      const data = await $fetch<{ user: User; message: string }>(
        "/api/user/profile",
        {
          method: "PUT",
          body: profileData,
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: `Bearer ${auth.state.token}`,
          },
        }
      );

      if (data?.user) {
        state.value.user = data.user;
        if (auth.state.user) {
          auth.state.user = data.user;
        }

        if (localStorageIsAvailable()) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        getProfile();
        return true;
      }

      return false;
    } catch (error: any) {
      state.value.responseErrors =
        error?.data?.message ||
        "Erreur lors de la mise à jour du profil";
      return false;
    } finally {
      state.value.isUpdating = false;
    }
  };

  return {
    state,
    initializeProfile,
    updateProfile,
    getProfile,
  };
});
