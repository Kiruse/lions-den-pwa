<template lang="pug">
.DaoInfo-logo
  img(v-if='url' :src='url' alt='DAO Logo')
</template>

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
