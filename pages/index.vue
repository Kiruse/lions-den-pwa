<template lang="pug">
.Page.Home-page
  header.Page-header.center-h
    h1.highlight Lions' Den
    h2.italic.highlight News
  section.center-h
    for article in articles
      Article(:article="article")
</template>

<style lang="sass" scoped>
.Article
  max-width: 800px
  margin: 0 auto
  border-radius: 15px
</style>

<script lang="coffee">
import Article from '@/comp/article'
import useAccounts from '@/hooks/accounts'
import { getNews } from '@/lib/firebase'

export default
  components: { Article }
  setup: -> useAccounts()
  data: ->
    articles: []
  watch:
    accounts: (val) ->
      return unless val
      @articles = await getNews()
</script>
