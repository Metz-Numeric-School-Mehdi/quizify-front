import { defineStore } from "pinia";
import { ref } from "vue";
import type SignIn from "~/types/auth/Auth";
import type { SignUp } from "~/types/auth/Auth";
import type User from "~/types/user/User";
import { localStorageIsAvailable } from "~/utils/client";
import fetchAPI from "~/utils/request/fetch";

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
      const requestPayload = {
        email: userData.email,
        password: userData.password,
        username: userData.username,
      };
      const response = await fetchAPI<{ token: string; user: User }>({
        method: "POST",
        endpoint: "auth/signup",
        params: requestPayload,
        token: undefined,
      });

      if (response && "user" in response && response && "token" in response) {
        setUser(response.user, response.token);
        navigateTo("/");
        state.value.isAuthenticated = true;
      } else {
        state.value.responseErrors = Object.values(response.errors).join(" ");
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
        baseURL: "http://localhost:8000/api",
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

    // const isAdmin = () => {
    //   return (
    //     state.value.user?.roles.some(
    //       (role) => role.name === "admin" || role.name === "super-admin"
    //     ) ?? false
    //   );
    // };

    return { state, signUp, signIn, signOut, getData };
  },
  {
    persist: true,
  }
);
