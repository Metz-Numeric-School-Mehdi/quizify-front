import { defineStore } from "pinia";
import { ref } from "vue";
import { authStore } from "./authStore";
import type User from "~/types/user/User";
import { localStorageIsAvailable } from "~/utils/client";
import fetchAPI from "~/utils/request/fetch";

export const userStore = defineStore("user", () => {
  const config = useRuntimeConfig();
  const auth = authStore();

  const state = ref<{
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

  // Initialiser les données du profil avec les données de l'utilisateur connecté
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

  // Mettre à jour le profil
  const updateProfile = async (profileData: typeof state.value.updateProfilePayload) => {
    state.value.isUpdating = true;
    state.value.responseErrors = "";

    try {
      const { data, error } = await useFetch<{ user: User; message: string }>("/user/profile", {
        method: "PUT",
        body: profileData,
        baseURL: `${useRuntimeConfig().public.apiBase}/api`,
        headers: {
          Authorization: `Bearer ${auth.state.token}`,
        },
      });

      if (error.value) {
        state.value.responseErrors = error.value.data?.message || "Erreur lors de la mise à jour du profil";
        return false;
      }

      if (data.value?.user) {
        // Mettre à jour les données utilisateur dans authStore
        auth.state.user = data.value.user;
        
        // Mettre à jour localStorage si disponible
        if (localStorageIsAvailable()) {
          localStorage.setItem("user", JSON.stringify(data.value.user));
        }

        return true;
      }

      return false;
    } catch (err: any) {
      state.value.responseErrors = err.message || "Erreur lors de la mise à jour du profil";
      return false;
    } finally {
      state.value.isUpdating = false;
    }
  };

  return {
    state,
    initializeProfile,
    updateProfile,
  };
});



