<template lang="pug">
.Page.Account-page
  header.Page-header.center-h
    h1.highlight My Account
  section.center-h
    i Under construction :)
</template>

<style lang="sass" scoped>

</style>

<script lang="coffee">
import useAccounts from '@/hooks/accounts'

export default
  setup: -> useAccounts()
</script>
