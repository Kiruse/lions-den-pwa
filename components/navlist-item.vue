<template lang="pug">
li.NavList-item.surface
  a(:href='to')
    slot
</template>

<script lang="coffee">
export default
  props: ['to']
</script>

<style lang="sass">
.NavList-item
  list-style: none
  margin: 0
  padding: 0

  > a
    display: block
    padding: var(--spacing)
    margin-bottom: 4px
    &:hover
      background: rgba(0, 0, 0, 0.1)
</style>
