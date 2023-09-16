<template lang="pug">
.Page.Daos-page: DaoList.surface
</template>

<style lang="sass" scoped>
.Daos-page .DaoList-root
  width: 800px
  margin: 0 auto
  border-radius: 15px
  overflow: none
</style>

<script lang="coffee">
import DaoList from '@/comp/dao/list'

export default
  components: { DaoList }
</script>
