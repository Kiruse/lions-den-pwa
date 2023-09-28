<template lang="pug">
.Page.Dao-page
  if !info
    DaoNotFound
  else
    DaoHeader(:dao='id')
    NavList.Dao-links
      NavListItem(:to='`#/daos/${address}/props`') Proposals
      NavListItem(:to='`#/daos/${address}/discussion`') Dicussions
</template>

<style lang="sass">
.Dao-page
  display: flex
  flex-direction: column
  align-items: stretch
  gap: 20px

.addr
  flex: 1
  padding: 5px
  border-radius: 5px
  border: 1px solid var(--line)

.Dao-links
  width: var(--page-width)
  margin: 0 auto
</style>

<script lang="coffee">
import { params } from '@/hooks/route'
import { config } from '@/lib/misc'
import DaoHeader from '@/comp/dao/dao-header'
import NavList from '@/comp/navlist'
import NavListItem from '@/comp/navlist-item'
import DaoNotFound from '@/views/not-found-dao'

export default
  components: { DaoHeader, DaoNotFound, NavList, NavListItem }
  setup: -> { params }
  computed:
    info: -> Object.values(config.daos).find (meta) => meta.treasury is @params.address
    id: -> @info?.id
    address: -> @params.address
</script>
