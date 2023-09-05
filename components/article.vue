<template lang="pug">
.Article
  header
    h3= title
    .note
      author(v-show='!!author')= author
      span ,&nbsp;
      time(v-show='!!date' :datetime='date')= date
  section
    Markdown(:contents='body')
</template>

<style lang="sass">
.note
  font-size: 0.9em
  color: #888
  font-style: italic
  margin-bottom: 1em
</style>

<script lang="coffee">
import Markdown from './markdown.vue'

export default
  components: { Markdown }
  props: ['author', 'date', 'contents']
  computed:
    body: -> @contents.split('\n').slice(1).join('\n')
    title: -> @contents.split('\n')[0].replace(/^#+\s*/, '')
</script>
