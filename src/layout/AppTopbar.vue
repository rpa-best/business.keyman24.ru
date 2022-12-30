<script>
import router from "@/router";
import {useLayout} from '@/layout/composables/layout';
import {useI18n} from "vue-i18n";
import store from "@/store";

const {layoutConfig, onMenuToggle, contextPath} = useLayout();

export default {
  setup() {
    const {t} = useI18n()
    return {t}
  },
  data() {
    return {
      outsideClickListener: null,
      topbarMenuActive: false,
      org: 1,
    }
  },
  async mounted() {
    this.bindOutsideClickListener();
    await store.dispatch('fetch_orgs')
  },
  beforeUnmount() {
    this.unbindOutsideClickListener();
  },
  methods: {
    onMenuToggle,
    onTopBarMenuButton() {
      this.topbarMenuActive = !this.topbarMenuActive;
    },
    onSettingsClick() {
      this.topbarMenuActive = false;
      router.push({'name': 'settings'});
    },
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
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener('click', this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    isOutsideClicked(event) {
      if (!this.topbarMenuActive) return;

      const sidebarEl = document.querySelector('.layout-topbar-menu');
      const topbarEl = document.querySelector('.layout-topbar-menu-button');

      return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
    },
    async onNavbarLogoutButton() {
      window.location.replace(process.env.VUE_APP_PUBLIC_HOST)
    },
    org_change(e) {
      localStorage.setItem('org', e.value)
      this.org = e.value
      window.location.reload()
    },
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

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <!--            <img :src="logoUrl" alt="logo" />-->
      <span>{{ $t('org_name') }}</span>
    </router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <Dropdown class="ml-3" :options="organizations" optionLabel="name"
                optionValue="id" :model-value="org"
                @change="org_change" inputStyle="padding: 1rem"
      />

      <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-cog"></i>
        <span>{{ $t('navbar.settings') }}</span>
      </button>

      <button @click="onNavbarLogoutButton()" class="p-link layout-topbar-button">
        <i class="pi pi-sign-out"></i>
        <span>{{ $t("navbar.logout") }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
