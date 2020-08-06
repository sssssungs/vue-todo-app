<template>
  <div>
    <router-link
      to="/"
      class="to-home">
      <i class="material-icons">home</i>
    </router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  created () {
    console.log('router', this.$router)
    console.log('route', this.$route)
  }
}
</script>

<style scoped lang="scss">
  .to-home.router-link-exact-active {  // 현재 페이지 인지 아닌지 router-link-exact-active 클래스로 구분
    display: none;
  }
</style>
