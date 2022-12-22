export default {
    state: {
        token: "",
    },
    getters: {
        get_token: (state) => state.token,
    },
    actions: {
        refresh_token(context, refresh_token) {
            console.log(refresh_token)
        }
    }
};
