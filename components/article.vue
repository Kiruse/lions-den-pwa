<template lang="pug">
.Article
  header
    h3= article.title
    .note
      author(v-show='!!article.author')= article.author
      span ,&nbsp;
      time(v-show='!!date' :datetime='date')= date
  section
    Markdown(:contents='article.content')
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
  props:
    article:
      type: Object
      required: true
  computed:
    date: -> if @article?.date then new Date(@article.date.seconds * 1000).toLocaleDateString() else ''
</script>
