<template lang="pug">
.DaoLogo(:style='_style')
  img(v-if='url' :src='url' alt='DAO Logo')
</template>

<style lang="sass">
.DaoLogo
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
import { getDaoLogos } from '@/lib/queries'

export default
  props:
    dao:
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
    dao:
      handler: (dao) ->
        @url = (await getDaoLogos())[dao]
      immediate: true
</script>
