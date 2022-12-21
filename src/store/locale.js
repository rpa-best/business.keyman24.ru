import locale from "@/locale";
import {useI18n} from "vue-i18n";

export default {
  state: {
    lang: '',
    languages: [
        {
          lang: 'Русскый', code: 'ru',
        },
        {
          lang: 'Uzbekcha', code: 'uz'
        }
      ],
  },
  mutations: {
    select_lang(state, {lang, i18n}) {
      state.lang = lang
      localStorage.setItem('lang', lang)
      i18n.locale = lang
    }
  },
  getters: {
    get_selected_lang: (state) => state.lang,
    get_languages: (state) => state.languages,
  },
  actions: {
  },
};
