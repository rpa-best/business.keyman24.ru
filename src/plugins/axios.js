import axios from "axios";
import store from "@/store";

const $api = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_HOST,
});

export default {
    $api,
    async raise_error_400(data) {
        for (let message of data) {
            if (message.field === 'message') {
                await store.dispatch('add_message', message.message)
            }
        }
    },
    async raise_error(response) {
        if (response.status === 401) {
            if (localStorage.getItem('refresh')) {
                await store.dispatch('refresh_token', localStorage.getItem('refresh'))
                return
            }
            window.location.replace(process.env.VUE_APP_PUBLIC_HOST)
        } else if (response.status === 400) {
            await this.raise_error_400(response.data)
        }
        throw response.data
    },
    async get_headers() {
        const headers = {}
        if (store.getters.get_token) {
            headers['Authorization'] = `Bearer ${store.getters.get_token}`
        }
        return headers
    },
    async get(url, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.get(url, options);
        } catch (e) {
            await this.raise_error(e.response);
            return await this.get(url, options)
        }
    },
    async post(url, data, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.post(url, data, options);
        } catch (e) {
            await this.raise_error(e.response);
            return await this.post(url, data, options)
        }
    },
    async patch(url, data, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.patch(url, data, options);
        } catch (e) {
            await this.raise_error(e.response);
            return await this.patch(url, data, options)
        }
    },
    async delete(url, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.delete(url, options);
        } catch (e) {
            await this.raise_error(e.response);
            return await this.delete(url, options)
        }
    },
    async head(url, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.head(url, options);
        } catch (e) {
            await this.raise_error(e.response);
        }
    },
};
