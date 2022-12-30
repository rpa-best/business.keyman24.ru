import axios from "@/plugins/axios";

export default {
    state: {
        token: "",
    },
    getters: {
        get_token: (state) => {
            if (localStorage.getItem('access')) {
                return localStorage.getItem('access')
            }
            return state.token
        },
    },
    actions: {
        async refresh_token(context, refresh_token) {
            try {
                const r = await axios.$api.post('/api/v1.1/account/refresh-token/', {refresh: refresh_token})
                context.commit('basic', {key: 'token', value: r.data.access})
                localStorage.setItem('access', r.data.access)
                localStorage.setItem('refresh', r.data.refresh)
            } catch (e) {
                // window.location.replace(process.env.VUE_APP_PUBLIC_HOST)
            }

        }
    }
};
