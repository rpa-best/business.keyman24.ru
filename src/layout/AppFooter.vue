<template>
  <div class="layout-footer">
    <span class="font-medium ml-2">{{ $t('org_name') }}</span>
  </div>
</template>
<script>
import {useI18n} from "vue-i18n";

export default {
  name: 'AppFooter',
  setup() {
    const {t} = useI18n()
    return {t}
  }
}
</script>

<style lang="scss" scoped></style>
