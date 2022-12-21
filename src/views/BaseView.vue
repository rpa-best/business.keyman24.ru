<template>
  <div class="layout-wrapper" :class="containerClass">
    <NavbarCompanent/>
    <div class="layout-sidebar">
      <side-bar/>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <footer-companent/>
    </div>
  </div>
</template>

<script>
import {useI18n} from "vue-i18n";
import store from "@/store";
import SideBar from "@/components/SideBar";
import NavbarCompanent from "@/components/Navbar";
import FooterCompanent from "@/components/Footer";
import {useLayout} from "@/layout";

export default {
  name: "HomeView",
  components: {FooterCompanent, SideBar, NavbarCompanent},
  setup() {
    const {t} = useI18n();
    return {t}; // return render context that included `t`
  },
  mounted() {
    const user_lang = store.getters.get_selected_lang
    store.commit('select_lang', {lang: user_lang || 'ru', i18n: this.$i18n})
  },
  computed: {
    containerClass() {
      const {layoutConfig, layoutState} = useLayout()
      return {
        'layout-theme-light': layoutConfig.darkTheme.value === false,
        'layout-theme-dark': layoutConfig.darkTheme.value === true,
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value
      };
    }
  }
}
</script>

<style scoped>

</style>