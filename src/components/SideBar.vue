<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in get_sidebar" :key="item">
      <side-bar-item v-if="!item.separator" :item="item" :index="i"></side-bar-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<script>

import SideBarItem from "@/components/SideBarItem";
import {useI18n} from "vue-i18n";

export default {
  name: "SideBar",
  setup() {
    const {t} = useI18n()
    return {t}
  },
  components: {SideBarItem},
  computed: {
    get_sidebar() {
      return [
        // {
        //   label: this.$t('sidebar.home'),
        //   items: [{label: this.$t('sidebar.dashboard'), icon: 'pi pi-fw pi-home', to: '/'}]
        // },
        //
        // {
        //   label: this.$t('sidebar.main'),
        //   items: [
        //     {
        //       label: this.$t('sidebar.orders'),
        //       icon: 'pi pi-fw pi-home',
        //       to: '/orders'
        //     },
        //     {
        //       label: this.$t('sidebar.supplies'),
        //       icon: 'pi pi-fw pi-home',
        //       to: '/supply'
        //     },
        //   ]
        // },
        // {
        //   label: this.$t('sidebar.users_and_groups'),
        //   items: [
        //     {
        //       label: this.$t('sidebar.users'),
        //       icon: 'pi pi-fw pi-home',
        //       to: '/users'
        //     },
        //     {
        //       label: this.$t('sidebar.groups'),
        //       icon: 'pi pi-fw pi-home',
        //       to: '/groups'
        //     },
        //   ]
        // },
      ]
    }
  }
}
</script>

<style scoped>

</style>