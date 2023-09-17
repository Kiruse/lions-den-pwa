<template lang="pug">
ul.DaoList-root
  for dao in daos
    a(:href='`#/daos/${dao.treasury}`')
      li.DaoList-item
        DaoLogo.DaoList-itemLogo(:address='dao.treasury')
        span.DaoList-itemLabel= dao.name
</template>

<style lang="sass">
.DaoList-root
  display: flex
  flex-direction: column
ul.DaoList-root, ol.DaoList-root
  list-style: none
  margin: 0
  padding: 0

.DaoList-item
  display: flex
  flex-direction: row
  align-items: center
  gap: 10px
  padding: 10px
  color: var(--on-surface-highlight)
  cursor: pointer

  transition: transform 0.5s ease-in-out
  &:hover
    transform: translate3d(-4px, -2px, 4px) scale(1.01)
.DaoList-itemLogo
  width: 50px
  height: 50px
  background: transparent
  border-radius: 50%
.DaoList-itemLabel
  font-size: 20px
  font-weight: bold
</style>

<script lang="coffee">
import config from '@/assets/config.yaml'
import DaoLogo from '@/comp/dao/logo'
{daos} = config

export default
  components: { DaoLogo }
  computed:
    daos: -> Object.values daos
</script>
