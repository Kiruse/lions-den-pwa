<template lang="pug">
.Page.Home-page
  header.Page-header.center-h
    h1.highlight Lions' Den
    h2.italic.highlight News
  section.center-h
    if articles.length
      for article in articles
        Article(:article="article")
    else
      .center-h: Spinner(color="var(--on-background-highlight)")
</template>

<style lang="sass" scoped>
.Article
  max-width: 800px
  margin: 0 auto
  border-radius: 15px
</style>

<script lang="coffee">
import Article from '@/comp/article'
import Spinner from '@/comp/spinner'
import useAccounts from '@/hooks/accounts'
import { getNews } from '@/lib/firebase'

export default
  components: { Article, Spinner }
  setup: -> useAccounts()
  data: ->
    error: null
    articles: []
  mounted: -> await @loadNews()
  watch:
    accounts: -> await @loadNews()
  methods:
    loadNews: ->
      return unless @accounts?.firebase
      try
        @articles = await getNews()
      catch err
        console.error 'Failed to load news articles:', err
        @error = err
</script>
