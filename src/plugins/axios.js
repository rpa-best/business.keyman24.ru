import { computed } from "vue";
import axios from "axios";

import store from "@/store";

const $api = axios.create({
  baseURL: "http://localhost:8000",
});

export default {
  async raise_error(response) {
    console.log(response);
  },
  async get_headers() {
    return {
      Authorization: computed(store.getters.get_token)
        ? `Bearer ${computed(store.getters.get_token)}`
        : "",
    };
  },
  async get(url, options = {}) {
    options.headers = this.get_headers();
    try {
      return await $api.get(url, options);
    } catch (e) {
      await this.raise_error(e.response);
    }
  },
  async post(url, data, options = {}) {
    options.headers = this.get_headers();
    try {
      return await $api.post(url, data, options);
    } catch (e) {
      await this.raise_error(e.response);
    }
  },
  async patch(url, data, options = {}) {
    options.headers = this.get_headers();
    try {
      return await $api.patch(url, data, options);
    } catch (e) {
      await this.raise_error(e.response);
    }
  },
  async delete(url, options = {}) {
    options.headers = this.get_headers();
    try {
      return await $api.delete(url, options);
    } catch (e) {
      await this.raise_error(e.response);
    }
  },
  async head(url, options = {}) {
    options.headers = this.get_headers();
    try {
      return await $api.head(url, options);
    } catch (e) {
      await this.raise_error(e.response);
    }
  },
};
