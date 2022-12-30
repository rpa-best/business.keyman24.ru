<script>
import store from "@/store";

export default {
  name: "FromPublicView",
  async created() {
    const refresh = new URL(window.location).searchParams.get('refresh')
    await store.dispatch('refresh_token', refresh)
    const url = new URL(window.location.href)
    if (url.searchParams.get('next')) {
      try {
        const next_url = new URL(url.searchParams.get('next'))
        window.location.replace(next_url)
      } catch (e) {
        await this.$router.push({name: 'home'})
      }
    } else {
      await this.$router.push({name: 'home'})
    }
  }
}
</script>