import { defineStore } from "pinia";
import { ref } from "vue";
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
    }>({
      user: null,
      token: "",
      responseErrors: "",
      isAuthenticated: false,
      ready: false,
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
      }
      state.value.user = user;
      state.value.token = token;
    };

    // const signUp = async (userData: userStoreType) => {
    //   const requestPayload = {
    //     firstname: userData.firstname,
    //     lastname: userData.lastname,
    //     username: userData.username,
    //     roles: [userData.roles],
    //     email: userData.email,
    //     password: userData.password,
    //   };
    //   const response = await fetchAPI<{ token: string; user: User }>({
    //     method: "POST",
    //     endpoint: "auth/signup",
    //     params: requestPayload,
    //     token: undefined,
    //   });

    //   if (response && "user" in response && response && "token" in response) {
    //     setUser(response.user, response.token);
    //     navigateTo("/");
    //   } else {
    //   }
    // };

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
        navigateTo("/home");
        state.value.isAuthenticated = true;
      } else {
        state.value.responseErrors = response.errors;
        state.value.isAuthenticated = false;
      }
    };

    const logOut = async () => {
      const response = await fetchAPI<{ token: string; user: User }>({
        method: "GET",
        endpoint: "auth/signout",
        token: state.value.token,
      });
      localStorage.removeItem("token");
      state.value.token = "";
      navigateTo("/");
    };

    // const isAdmin = () => {
    //   return (
    //     state.value.user?.roles.some(
    //       (role) => role.name === "admin" || role.name === "super-admin"
    //     ) ?? false
    //   );
    // };

    return { state, signIn, logOut, getData };
  },
  {
    persist: true,
  }
);
