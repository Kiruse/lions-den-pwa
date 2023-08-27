<template lang="pug">
.NavBar-root.surface
  a.NavBar-link(href='#/') Home
  a.NavBar-link(href='#/daos') DAOs
  a.NavBar-link(href='#/account') Account
  a.NavBar-link(href='#/settings') Settings
</template>

<style lang="sass">
.NavBar-root
  display: flex
  flex-direction: row
  align-items: stretch
  justify-content: center
  width: 100%
  height: 50px

.NavBar-link
  display: flex
  align-items: center
  font-size: 18px
  text-decoration: none
  padding: 0 12px
  opacity: 0.8
  &:hover
    opacity: 1
  transition: opacity 0.2s linear
</style>
