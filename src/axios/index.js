import axios from "axios";
import store from "@/store";

const $axios = axios.create({
  baseURL: "https://api.github.com/",
  timeout: 30 * 1000, // Pending 30 秒後，request 則失效
});

$axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return store.commit("auth/setLogOut");
  }
);

export default $axios;
