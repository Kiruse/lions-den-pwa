<template lang="pug">
.NotFound-root.surface
  header.NotFound-title
    h1.center-h= title
    if subtitle
      h2.center-h= subtitle
  slot
</template>

<script lang="coffee">
export default
  props:
    title:
      type: String
      default: 'Whoops!'
    subtitle:
      type: String
      default: 'This page does not seem to exist.'
</script>

<style lang="sass">
.NotFound-root
  width: var(--page-width)
  margin: 0 auto
  padding: var(--spacing)

  > header
    margin-bottom: var(--spacing)
</style>
