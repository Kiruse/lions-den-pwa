<template lang="pug">
.Page.Dao-page
  if !info
    DaoNotFound
  else
    DaoHeader(:dao='id')
    ul.Dao-links
      li.Dao-link.surface: a(:href='`#/daos/${address}/props`') Proposals
      li.Dao-link.surface: a(:href='`#/daos/${address}/discussion`') Dicussions
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

ul.Dao-links
  width: var(--page-width)
  list-style: none
  margin: 0 auto
  padding: 0
.Dao-link > a
  display: block
  padding: 20px
  margin-bottom: 4px
  &:hover
    background: rgba(0, 0, 0, 0.1)
</style>

<script lang="coffee">
import { params } from '@/hooks/route'
import { config } from '@/lib/misc'
import DaoHeader from '@/comp/dao/dao-header'
import DaoNotFound from '@/views/not-found-dao'

export default
  components: { DaoHeader, DaoNotFound }
  setup: -> { params }
  data: ->
    logo: undefined
  computed:
    info: -> Object.values(config.daos).find (meta) => meta.treasury is @params.address
    id: -> @info?.id
    address: -> @params.address
    daoType: -> switch @info?.type
      when 'token'    then 'Token DAO'
      when 'nft'      then 'NFT DAO'
      when 'multisig' then 'Multisig DAO'
      else 'unknown DAO type'
</script>
