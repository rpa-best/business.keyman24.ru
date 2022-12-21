import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import { createI18n } from "vue-i18n";
import "@/assets/styles.scss"
import locale from "@/locale";

const i18n = createI18n({
  legacy: false,
  locale: "ru",
  fallbackLocale: "en",
  messages: locale,
});

const app = createApp(App).use(store).use(router).use(PrimeVue).use(i18n);
app.mount("#app");
