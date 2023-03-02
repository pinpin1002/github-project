import { createStore } from "vuex";
import auth from "./auth";

// 创建一个新的 store 实例
const store = createStore({
  modules: {
    auth,
  },
});

export default store;
