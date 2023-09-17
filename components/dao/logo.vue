<template lang="pug">
.DaoInfo-logo(:style='_style')
  img(v-if='url' :src='url' alt='DAO Logo')
</template>

<style lang="sass">
.DaoInfo-logo
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  border-radius: 50%
  overflow: hidden

  img, svg
    max-width: 100%
    max-height: 100%
</style>

<script lang="coffee">
import { getSmartQuery } from '@/lib/onchain'

export default
  props:
    address:
      type: String
      required: true
    size:
      type: Number
      default: 50
  data: ->
    url: undefined
  computed:
    _style: ->
      width: @size + 'px'
      height: @size + 'px'
  watch:
    address:
      handler: (address) ->
        data = await getSmartQuery address, { dao_info: {} }, '3d'
        @url = data?.metadata?.logo?.url
      immediate: true
</script>
