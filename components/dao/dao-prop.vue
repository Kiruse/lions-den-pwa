<template lang="pug">
.DaoProp-root
  header.DaoProp-header
    h2.DaoProp-title= prop.title
    span.DaoProp-author= prop.proposer
  section.DaoProp-content
    Markdown(:content='prop.description')
</template>

<script lang="coffee">
import Markdown from '@/comp/markdown'

# TODO: load description from IPFS where applicable
export default
  props:
    prop:
      type: Object
      required: true
</script>

<style lang="sass">

</style>
