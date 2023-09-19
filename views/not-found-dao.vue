<template lang="pug">
NotFound.DaoNotFound-root(title='DAO not found' subtitle='Please check the address and try again.')
  section
    p
      | Note that this is a permissioned website currently exposing only curated DAOs. The DAO you
      | are looking for might not be listed here. In the future, it will be possible for DAOs to
      | join this site.
</template>

<script lang="coffee">
import NotFound from './not-found'

export default
  components: { NotFound }
</script>

<style lang="sass">
.DaoNotFound-root .NotFound-title
  h1
    font-size: 2rem
    margin-bottom: 10px
  h2
    font-size: 1.5rem
</style>
