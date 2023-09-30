<template lang="pug">
.DaoPropStatus-root(:class='status')= statusText
</template>

<script lang="coffee">
export default
  props:
    status:
      type: String
      required: true
      validate: (v) => ['passed', 'rejected', 'in_progress', 'executed'].includes v
  computed:
    statusText: -> switch @status
      when 'passed', 'rejected', 'executed' then @status
      when 'in_progress' then 'in progress'
      else 'unknown status'
</script>

<style lang="sass">
.DaoPropStatus-root.passed, .DaoPropStatus-root.executed
  color: green
.DaoPropStatus-root.in_progress
  color: yellow
.DaoPropStatus-root.rejected
  color: red
</style>
