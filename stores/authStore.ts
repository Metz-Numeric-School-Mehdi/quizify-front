import { defineStore } from "pinia";
import { ref } from "vue";
import type SignIn from "~/types/auth/Auth";
import type { SignUp } from "~/types/auth/Auth";
import type User from "~/types/user/User";
import { localStorageIsAvailable } from "~/utils/client";
import fetchAPI from "~/utils/request/fetch";
const config = useRuntimeConfig();

export const authStore = defineStore("auth", () => {
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
      photo: "",
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
    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("username", userData.username);
    if (userData.photo) formData.append("photo", userData.photo);
    state.value.responseErrors = "";
    try {
      const { data, error } = await useFetch<{ user: User; token: string }>(
        "/api/auth/signup",
        {
          baseURL: config.public.apiBase,
          method: "POST",
          body: formData,
        }
      );
      if (error.value) {
        state.value.responseErrors = error.value.data?.errors || "Erreur lors de l'inscription";
        state.value.isAuthenticated = false;
        return;
      }
      if (data.value && data.value.user && data.value.token) {
        setUser(data.value.user, data.value.token);
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
    const requestPayload = {
      email,
      password,
    };
    const response = await fetchAPI<{ token: string; user: User }>({
      method: "POST",
      endpoint: "auth/signin",
      params: requestPayload,
      token: undefined,
    });

    if (response && "user" in response && response && "token" in response) {
      setUser(response.user, response.token);
      navigateTo("/");
      state.value.isAuthenticated = true;
    } else {
      state.value.responseErrors = response.errors;
      state.value.isAuthenticated = false;
    }
  };

  const signOut = async () => {
    const { data } = await useFetch("/auth/signout", {
      baseURL: `${config.public.apiBase}/api`,
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
    navigateTo("/");
  };

  return { state, signUp, signIn, signOut, getData };
}, {
  persist: true,
});
