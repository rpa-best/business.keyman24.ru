<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>
    <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url"
       @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </a>
    <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)"
                 :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </router-link>
    <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
      <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
        <side-bar-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey"
                       :root="false"></side-bar-item>
      </ul>
    </Transition>
  </li>
</template>

<script>
import {useLayout} from "@/layout";
const { layoutConfig, layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

export default {
  name: "SideBarItem",
  props: ['item', 'index', 'root', 'parentItemKey'],
  data() {
    return {
      isActiveMenu: false,
      itemKey: null,
    }
  },
  beforeMount() {
    this.itemKey = this.parentItemKey ? this.parentItemKey + '-' + this.index : String(this.index);
    const activeItem = layoutState.activeMenuItem;
    this.isActiveMenu = activeItem === this.itemKey || activeItem ? activeItem.startsWith(this.itemKey + '-') : false;
  },
  methods: {
    itemClick(event, item) {
      if (item.disabled) {
        event.preventDefault();
        return;
      }
      const {overlayMenuActive, staticMenuMobileActive} = layoutState;
      if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
        onMenuToggle();
      }
      if (item.command) {
        item.command({originalEvent: event, item: item});
      }
      const foundItemKey = item.items ? (this.isActiveMenu ? this.parentItemKey : this.itemKey) : this.itemKey;
      setActiveMenuItem(foundItemKey);
    },
    checkActiveRoute (item) {
      return this.$route.path === item.to;
    }
  }
}
</script>

<style scoped>

</style>