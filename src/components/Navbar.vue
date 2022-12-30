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
      <Dropdown class="ml-3" :options="organizations" optionLabel="name"
                optionValue="id" :model="selected_org"
                @change="org_change"
      />

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
import Dropdown from "primevue/dropdown";

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
  components: {Dropdown},
  async mounted() {
    this.bindOutsideClickListener()
    await store.dispatch('fetch_orgs')
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
    org_change(e) {
      store.commit('basic', {key: 'selected_org', value: e.value})
      localStorage.setItem('org', e.value)
      window.location.reload()
    },
    onNavbarProfileButton() {
      console.log('')
    },
    async onNavbarLogoutButton() {
      window.location.replace(process.env.VUE_APP_PUBLIC_HOST)
    }
  },
  computed: {
    topbarMenuClasses() {
      return {
        'layout-topbar-menu-mobile-active': this.topbarMenuActive
      };
    },
    organizations: () => store.state.my_orgs,
    selected_org: () => store.getters.get_selected_org,
  }
}
</script>

<style scoped>

</style>