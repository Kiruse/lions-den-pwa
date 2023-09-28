<template>
  <svg :class="cls" :width="size" :height="size * 10/18" viewBox="0 0 18 10" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0L8 8L16 0" id="Caret" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>

<script lang="coffee">
export default
  props:
    size:
      type: Number
      default: 16
    dir:
      type: String
      default: 'down'
      validate: (v) -> ['up', 'left', 'right', 'down'].includes v
  computed:
    cls: -> ['IconCaret', "IconCaret-#{@dir}"]
</script>

<style lang="sass">
.IconCaret
  transition: transform 0.2s ease-in-out
  &-up
    transform: rotate(180deg)
  &-left
    transform: rotate(90deg)
  &-right
    transform: rotate(-90deg)
</style>
