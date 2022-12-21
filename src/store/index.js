import { createStore } from "vuex";
import locale from "@/store/locale";
import auth from "@/store/auth";

export default createStore({
  state: {},
  getters: {},
  mutations: {
    basic(state, payload) {
      state[payload.key] = payload.value;
    },
  },
  actions: {},
  modules: {
    locale,
    auth,
  },
});
