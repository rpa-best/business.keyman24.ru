import {createStore} from "vuex";
import locale from "@/store/locale";
import auth from "@/store/auth";
import message from "@/store/message";
import organization from "@/store/organization";
import sidebar from "@/store/sidebar";
import inventory from "@/store/inventory"

export default createStore({
    state: {},
    getters: {},
    mutations: {
        basic(state, {key, value}) {
            state[key] = value;
        },
    },
    actions: {},
    modules: {
        locale,
        auth,
        message,
        organization,
        sidebar,
        inventory,
    },
});
