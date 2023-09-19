<template lang="pug">
.Page.Props-page
  if !info
    DaoNotFound
</template>

<script lang="coffee">
import DaoNotFound from '@/views/not-found-dao'

export default
  components: { DaoNotFound }
</script>
