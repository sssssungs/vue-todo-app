<template>
  <h1>{{ msg }}</h1>
</template>

<script>
export default {
  data () {
    return {
      msg: 'hello vuew ?'
    }
  }
}
</script>

<style scoped lang="scss">
$color: blue;
  h1 {
    color: $color;
    text-decoration-line: underline;
    display: flex;
  }
</style>
