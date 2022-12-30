import axios from "@/plugins/axios";

export default {
    state: {
        my_orgs: [],
        selected_org: null,
    },
    actions: {
        async fetch_orgs(context) {
            const r = await axios.get('/api/v1.1/business/orgs/')
            context.commit('basic', {key: 'my_orgs', value: r.data})
            if (!localStorage.getItem('org')) {
                context.commit('basic', {key: 'selected_org', value: r.data[0].id})
                localStorage.setItem('org', r.data[0].id)
            } else {
                context.commit('basic', {key: 'selected_org', value: localStorage.getItem('org')})
            }
        }
    },
    getters: {
        get_selected_org(state) {
            if (!state.selected_org) {
                return localStorage.getItem('org')
            }
            return state.selected_org
        }
    }
}