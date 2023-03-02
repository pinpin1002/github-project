import router from "@/router/index.js";
import axios from "axios";
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
      } = await axios.get(`http://localhost:4000/getAccessToken?code=${codeParam}`);

      if (access_token) {
        localStorage.setItem("accessToken", access_token);
        commit("setLogin", access_token);
        router.push("/");
      }
    },
    async getUserInfo({ commit, state }) {
      const {
        data: { login, name, avatar_url, public_repos },
      } = await state.octokit.request("GET /user");
      commit("setUserInfo", { login, name, avatar_url, public_repos });
    },
  },
};

export default auth;
