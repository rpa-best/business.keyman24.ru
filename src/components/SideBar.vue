<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in get_sidebar" :key="item">
      <side-bar-item v-if="!item.separator" :item="item" :index="i"></side-bar-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<script>
import SideBarItem from "@/components/SideBarItem.vue";
import {useI18n} from "vue-i18n";
import store from "@/store";

export default {
  name: "SideBar",
  setup() {
    const {t} = useI18n()
    return {t}
  },
  components: {SideBarItem},
  async mounted() {
    await store.dispatch('fetch_sidebar')
  },
  computed: {
    get_sidebar: () => {
      return store.getters.get_sidebar
    }
  }
}
</script>

<style scoped>

</style>