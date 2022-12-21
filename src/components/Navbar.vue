<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <span>{{ t('org_name') }}</span>
    </router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
<!--      <Dropdown class="ml-3" :options="language_menu_items" optionLabel="lang"-->
<!--                optionValue="code" :model-value="selected_lang"-->
<!--                @change="language_change"-->
<!--      />-->
      <button @click="onNavbarProfileButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>{{ t("navbar.profile") }}</span>
      </button>

      <button @click="onNavbarLogoutButton()" class="p-link layout-topbar-button">
        <i class="pi pi-sign-out"></i>
        <span>{{ t("navbar.logout") }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import {useI18n} from "vue-i18n/dist/vue-i18n.esm-bundler";
import {useLayout} from "@/layout";
import store from "@/store";

const {onMenuToggle} = useLayout()
export default {
  name: "NavbarCompanent",
  setup() {
    const {t} = useI18n();
    return {t};
  },
  data() {
    return {
      outsideClickListener: null,
      topbarMenuActive: false,
    }
  },
  components: {},
  mounted() {
    this.bindOutsideClickListener()
  },
  beforeUnmount() {
    this.unbindOutsideClickListener()
  },
  methods: {
    onMenuToggle,
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event) => {
          if (this.isOutsideClicked(event)) {
            this.topbarMenuActive = false;
          }
        };
        document.addEventListener('click', this.outsideClickListener);
      }
    },
    isOutsideClicked(event) {
      if (!this.topbarMenuActive) return;
      const sidebarEl = document.querySelector('.layout-topbar-menu');
      const topbarEl = document.querySelector('.layout-topbar-menu-button');
      return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener('click', this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    onTopBarMenuButton() {
      this.topbarMenuActive = !this.topbarMenuActive;
    },
    language_change(e) {
      store.commit('select_lang', {lang: e.value, i18n: this.$i18n})
    },
    onNavbarProfileButton() {
      console.log('')
    },
    async onNavbarLogoutButton() {
      await this.$router.push({"name": "login"})
    }
  },
  computed: {
    topbarMenuClasses() {
      return {
        'layout-topbar-menu-mobile-active': this.topbarMenuActive
      };
    },
    language_menu_items: () => store.getters.get_languages,
    selected_lang: () => store.getters.get_selected_lang
  }
}
</script>

<style scoped>

</style>