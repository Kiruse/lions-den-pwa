<template lang="pug">
.Markdown(v-html="html" :class="{ busy }")
</template>

<style lang="sass" src="./markdown.sass"></style>

<script lang="coffee">
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

pipeline = unified()
  .use remarkParse
  .use remarkRehype
  .use rehypeSanitize
  .use rehypeStringify

export default
  props:
    contents:
      type: String
      default: ''
  data: ->
    busy: false
    html: ''
  mounted: -> @process()
  watch:
    contents: -> @process()
  methods:
    process: ->
      return if @busy
      @busy = true
      try
        @html = await pipeline.process @contents
      catch err
        console.error 'Failed to process markdown:', err
        @html = ''
      finally
        @busy = false
</script>
