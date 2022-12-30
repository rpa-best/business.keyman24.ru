<script setup>
import {computed, onMounted} from 'vue';
import store from "@/store";
import AppMenuItem from './AppMenuItem.vue';

onMounted(() => {
  store.dispatch('fetch_sidebar')
})

const sidebar = computed(() => store.getters.get_sidebar)
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in sidebar" :key="item">
      <li v-if="item.separator" class="menu-separator"></li>
      <app-menu-item v-if="!item.not_show" :item="item" :index="i"></app-menu-item>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
