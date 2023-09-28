<template lang="pug">
.DaoAddress-root
  .DaoAddress-label= label
  Copyable.DaoAddress-value(:value='address' title='Copy address to clipboard')= addressShort
</template>

<style lang="sass">
.DaoAddress-root
  display: flex
  flex-direction: column
.DaoAddress-label
  font-size: 0.8rem
  opacity: 0.5
.DaoAddress-value
  font-size: 1rem
  font-weight: 500
  cursor: pointer
</style>

<script lang="coffee">
import Copyable from '@/comp/copyable'
export default
  components: { Copyable }
  props:
    label:
      type: String
      required: true
    address:
      type: String
      required: true
  computed:
    addressShort: ->
      bechPrefix = @address.slice 0, @address.indexOf '1'
      addr = if /^[a-z]+$/.test bechPrefix
        @address.slice @address.indexOf('1') + 1
      else
        bechPrefix = ''
        @address
      bechPrefix + '1' + addr.slice(0, 6) + '...' + addr.slice(-6)
</script>
