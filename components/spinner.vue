<template lang="pug">
.Spinner-root(:style='_style')
  .Spinner-inner
    svg.Spinner-circle(width='100%' height='100%' viewBox='0 0 100 100')
      path(
        d='M 50 5 C 74.85 5 95 25.15 95 50'
        fill='none'
        stroke='currentColor'
        stroke-width='10'
      )
</template>

<style lang="sass">
.Spinner-root
  display: block
.Spinner-inner
  display: block
  width: 100%
  height: 100%
  animation: breathe 2s ease-in-out infinite alternate
svg.Spinner-circle
  display: block
  width: 100%
  height: 100%
  animation: spin .65s linear infinite

@keyframes spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
@keyframes breathe
  from
    transform: scale(1)
    opacity: 0.5
  to
    transform: scale(1.15)
    opacity: 1
</style>

<script lang="coffee">
export default
  props:
    size:
      default: 'default'
      validate: (val) -> typeof val is 'number' or val in ['small', 'default', 'large']
    color:
      type: String
      default: 'inherit'
  computed:
    _size: ->
      if typeof @size is 'string'
        switch @size.toLowerCase()
          when 'small' then 20
          when 'large' then 60
          else 40
    _style: ->
      width: @_size + 'px'
      height: @_size + 'px'
      color: @color
</script>
