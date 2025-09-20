import { defineStore } from "pinia";
import { ref } from "vue";
import { localStorageIsAvailable } from "~/utils/client";

import type SignIn from "~/types/auth/Auth";
import type { SignUp } from "~/types/auth/Auth";
import type User from "~/types/user/User";

export const authStore = defineStore(
  "auth",
  () => {
    const state = ref<{
      user: User | null;
      token: string;
      responseErrors: string;
      isAuthenticated: boolean;
      ready: boolean;
      signInPayload: SignIn;
      signUpPayload: SignUp;
    }>({
      user: null,
      token: "",
      responseErrors: "",
      isAuthenticated: false,
      ready: false,
      signInPayload: {
        email: "",
        password: "",
      },
      signUpPayload: {
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        photo: null,
        avatar: "",
      },
    });

    const getData = () => {
      if (localStorageIsAvailable()) {
        state.value.token = localStorage.getItem("token") || "";
      }
      state.value.ready = true;
    };

    const setUser = (user: User, token: string) => {
      if (localStorageIsAvailable()) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      state.value.user = user;
      state.value.token = token;
    };

    const signUp = async (userData: SignUp) => {
      console.log(userData);
      const formData = new FormData();
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("username", userData.username);
      formData.append("avatar", userData.avatar);
      if (userData.photo) formData.append("photo", userData.photo);
      state.value.responseErrors = "";
      try {
        const data = await $fetch<{ user: User; token: string }>(
          "/api/auth/signup",
          {
            baseURL: useRuntimeConfig().public.apiBase,
            method: "POST",
            body: formData,
          }
        );
        
        if (data && data.user && data.token) {
          setUser(data.user, data.token);
          state.value.isAuthenticated = true;
          navigateTo("/");
        } else {
          state.value.responseErrors = "Erreur lors de l'inscription";
          state.value.isAuthenticated = false;
        }
      } catch (e) {
        state.value.responseErrors = "Erreur lors de l'inscription";
        state.value.isAuthenticated = false;
      }
    };

    const signIn = async (email: string, password: string) => {
      const requestBody = {
        email,
        password,
      }
      state.value.responseErrors = "";
      try {
        const data = await $fetch<{ token: string; user: User }>("/api/auth/signin", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "POST",
          body: requestBody,
        });

        if (data && data.user && data.token) {
          setUser(data.user, data.token);
          navigateTo("/");
          state.value.isAuthenticated = true;
        } else {
          state.value.responseErrors = "Erreur lors de la connexion";
          state.value.isAuthenticated = false;
        }
      } catch (error: any) {
        state.value.responseErrors =
          error?.data?.message || error?.message || "Erreur lors de la connexion";
        state.value.isAuthenticated = false;
      }
    };

    const signOut = async () => {
      await $fetch("/api/auth/signout", {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.value.token}`,
          Accept: "application/json",
        },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.value.token = "";
      state.value.isAuthenticated = false;
      state.value.user = null;
      navigateTo("/");
    };

    const verify = async () => {
      try {
        await $fetch("/api/auth/verify", {
          baseURL: useRuntimeConfig().public.apiBase,
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.value.token}`,
            Accept: "application/json",
          },
        });
        return true;
      } catch (error: any) {
        if (error?.status === 401) {
          state.value.isAuthenticated = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          state.value.token = "";
          navigateTo("/");
        }
        return false;
      }
    };

    return { state, signUp, verify, signIn, signOut, getData };
  },
  {
    persist: true,
  }
);
