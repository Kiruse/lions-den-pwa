<template lang="pug">
.DaoProp-root
  header.DaoProp-header
    .DaoProp-titleLine
      h2.DaoProp-title.highlight
        | #{'#'}{{prop.id}}: {{prop.title}}
      h3.DaoProp-type= propType
    span.DaoProp-author
      | Proposed by #[Copyable(:value='prop.proposer')= proposer]
  section.DaoProp-content
    Markdown(:contents='prop.description')
</template>

<script lang="coffee">
import Copyable from '@/comp/copyable'
import Markdown from '@/comp/markdown'
import { addr } from '@/lib/misc'

# TODO: load description from IPFS where applicable
# TODO: process & sanitize links in description
export default
  components: { Copyable, Markdown }
  props:
    prop:
      type: Object
      required: true
  computed:
    proposer: -> addr @prop.proposer
    propType: -> switch @prop.type
      when 'general' then 'General Proposal'
      when 'council' then 'Council Proposal'
      else 'unknown proposal type'
</script>

<style lang="sass">
.DaoProp-header
  margin-bottom: var(--spacing)
.DaoProp-titleLine
  margin-bottom: 8px
  h1, h2, h3
    display: inline
    margin-right: var(--spacing)
.DaoProp-type
  font-size: 1.2rem
  opacity: 0.5
.DaoProp-author .Copyable-root
  font-style: italic
</style>
