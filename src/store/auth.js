import router from "@/router/index.js";
import $axios from "@/axios";
import { Octokit } from "https://cdn.skypack.dev/octokit";

const auth = {
  namespaced: true,
  state() {
    return {
      octokit: null,
      accessToken: null,
      userInfo: {},
    };
  },
  mutations: {
    setLogin(state, payload) {
      state.accessToken = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = { ...payload };
    },
    setOctokit(state) {
      state.octokit = new Octokit({
        auth: localStorage.getItem("accessToken"),
      });
    },
    setLogOut(state) {
      state.accessToken = null;
      state.userInfo = {};
      window.localStorage.removeItem("accessToken");
      router.push("/login");
    },
  },
  actions: {
    async getLogin({ commit }) {
      const codeParam = new URLSearchParams(window.location.search).get("code");
      const {
        data: { access_token },
      } = await $axios.get(`http://localhost:4000/getAccessToken?code=${codeParam}`);

      if (access_token) {
        localStorage.setItem("accessToken", access_token);
        commit("setLogin", access_token);
        router.push("/");
      }
    },
    async getUserInfo({ commit }) {
      try {
        const {
          data: { login, name, avatar_url, public_repos },
          status,
        } = await $axios.get(`https://api.github.com/user`, {
          headers: {
            Authorization: "token " + localStorage.getItem("accessToken"),
          },
        });
        if (status === 200) {
          commit("setUserInfo", { login, name, avatar_url, public_repos });
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};

export default auth;
