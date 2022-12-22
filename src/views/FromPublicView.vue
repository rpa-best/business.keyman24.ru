<script>
import store from "@/store";

export default {
  name: "FromPublicView",
  async created() {
    const refresh = new URL(window.location).searchParams.get('refresh')
    localStorage.setItem('refresh', refresh)
    await store.dispatch('refresh_token', refresh)
    this.$router.push({name: 'home'})
  }
}
</script>