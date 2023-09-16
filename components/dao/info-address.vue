<template lang="pug">
.DaoInfo-address
  .DaoInfo-addressLabel= label
  a.DaoInfo-addressValue(
    @click='copyAddress'
    title='Copy address to clipboard'
  )= addressShort
</template>

<style lang="sass">
.DaoInfo-address
  display: flex
  flex-direction: column
.DaoInfo-addressLabel
  font-size: 0.8rem
  opacity: 0.5
.DaoInfo-addressValue
  font-size: 1rem
  font-weight: 500
  cursor: pointer
</style>

<script lang="coffee">
export default
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
  methods:
    copyAddress: ->
      navigator.clipboard.writeText @address
</script>
