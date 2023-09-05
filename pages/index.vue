<template lang="pug">
.Page.Home-page
  header.Page-header.center-h
    h1.highlight Lions' Den
    h2.italic.highlight News
  section.center-h
    Article(
      author='Kiruse'
      date='2023-09-06'
      :contents='dummyNews'
    )
</template>

<style lang="sass" scoped>
.Page-header
  margin-bottom: 60px

.Article
  max-width: 800px
  margin: 0 auto
  border-radius: 15px
</style>

<script lang="coffee">
import Article from '@/comp/article'
import dummyNews from '@/assets/news/230906-a-new-beginning.md'

export default
  components: { Article }
  data: ->
    dummyNews: dummyNews
</script>
