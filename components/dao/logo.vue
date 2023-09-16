<template lang="pug">
.DaoInfo-logo
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
</style>

<script lang="coffee">
import { getSmartQuery } from '@/lib/onchain'

export default
  props:
    address:
      type: String
      required: true
  data: ->
    url: undefined
  watch:
    address:
      handler: (address) ->
        data = await getSmartQuery address, { dao_info: {} }
        @url = data?.metadata?.logo?.url
      immediate: true
</script>
