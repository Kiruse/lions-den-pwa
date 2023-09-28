<template lang="pug">
.Copyable-root
  .Copyable-content: slot
  CopyIcon.Copyable-copy(alt='Copy' :title='title' @click='copy' :size='14')
</template>

<script lang="coffee">
import CopyIcon from '@/comp/icons/copy-icon'
export default
  components: { CopyIcon }
  props:
    value:
      type: [String, Function]
      required: true
    title:
      type: String
      default: 'Copy to clipboard'
  methods:
    copy: ->
      value = if typeof @value is 'function' then @value() else @value
      navigator.clipboard.writeText value
</script>

<style lang="sass">
.Copyable-root
  display: inline-flex
  flex-direction: row
  align-items: center
  gap: 8px
.Copyable-copy
  opacity: 0.75
  cursor: pointer
  transition: opacity 0.2s ease-in-out
  &:hover
    opacity: 1
</style>
