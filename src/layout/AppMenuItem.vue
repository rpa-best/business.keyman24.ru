<script>
import {useLayout} from '@/layout/composables/layout';
import {useI18n} from "vue-i18n";

const {layoutConfig, layoutState, setActiveMenuItem, onMenuToggle} = useLayout();

export default {
  name: 'AppMenuItem',
  setup() {
    const {t} = useI18n()
    return {t}
  },
  data() {
    return {
      isActiveMenu: false,
      itemKey: null,
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    root: {
      type: Boolean,
      default: true
    },
    parentItemKey: {
      type: String,
      default: null
    }
  },
  beforeMount() {
    this.itemKey = this.parentItemKey ? this.parentItemKey + '-' + this.index : String(this.index);

    const activeItem = layoutState.activeMenuItem;

    this.isActiveMenu = activeItem === this.itemKey || activeItem ? activeItem.startsWith(this.itemKey + '-') : false;
  },
  methods: {
    itemClick(e, item) {
      if (item.disabled) {
        e.preventDefault();
        return;
      }

      const {overlayMenuActive, staticMenuMobileActive} = layoutState;

      if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
        onMenuToggle();
      }

      if (item.command) {
        item.command({originalEvent: e, item: item});
      }

      const foundItemKey = item.items ? (this.isActiveMenu ? props.parentItemKey : this.itemKey) : this.itemKey;

      setActiveMenuItem(foundItemKey);
    },
    checkActiveRoute(item) {
      return this.$route === item.to;
    }
  }
}

// watch(
//     () => layoutConfig.activeMenuItem.value,
//     (newVal) => {
//       isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
//     }
// );

</script>

<template>
  <li v-if="!item.not_show" :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ $t(item.label) }}</div>
    <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url"
       @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ $t(item.label) }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </a>
    <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)"
                 :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ $t(item.label) }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </router-link>
    <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
      <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
        <template v-for="(child, i) in item.items" :key="child">
          <app-menu-item v-if="!item.not_show" :index="i" :item="child" :parentItemKey="itemKey"
                         :root="false"></app-menu-item>
        </template>

      </ul>
    </Transition>
  </li>
</template>

<style lang="scss" scoped></style>
