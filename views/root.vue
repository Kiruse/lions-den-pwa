<template lang="pug">
#omega.AppRoot
  NavBar
  Router.AppRoot-content
</template>

<script lang="coffee">
import NavBar from '@/comp/navbar'
import Router from '@/comp/router'

export default
  components: { NavBar, Router }
</script>

<style lang="sass">
.AppRoot-content
  flex: 1
</style>
