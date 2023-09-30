<template lang="pug">
.Page.Props-page
  if !meta
    DaoNotFound
  else
    DaoHeader(:dao='id')
    if props.pending
      Spinner.Props-spinner(color='var(--on-background-highlight)')
    else
      NavList.Props-content
        for prop in props.value
          NavListItem.Props-prop(:to='`#/daos/${address}/props/${prop.id}`')
            .Props-propId= `#${prop.id}`
            .Props-propData
              h2.Props-propTitle= prop.title
              DaoPropStatus.Props-propStatus(:status='prop.status')
</template>

<script lang="coffee">
import { params } from '@/hooks/route'
import { config } from '@/lib/misc'
import { getProps } from '@/lib/queries/dao-queries'
import DaoNotFound from '@/views/not-found-dao'
import DaoHeader from '@/comp/dao/dao-header'
import DaoProp from '@/comp/dao/dao-prop'
import DaoPropStatus from '@/comp/dao/dao-prop-status'
import NavList from '@/comp/navlist'
import NavListItem from '@/comp/navlist-item'
import Spinner from '@/comp/spinner'

export default
  components: { DaoHeader, DaoNotFound, DaoProp, DaoPropStatus, NavList, NavListItem, Spinner }
  setup: -> { params }
  computed:
    meta: -> Object.values(config.daos).find (dao) => dao.treasury is @params.address
    address: -> @params.address
    id: -> @meta?.id
  deferred:
    props: ->
      return [] unless @id
      res = await getProps @id
      if res.ok
        res.ok
      else
        console.warn 'Failed to load props', res
        []
</script>

<style lang="sass">
.Props-spinner
  margin: 0 auto

.Props-prop > a
  display: flex
  flex-direction: row
  &:hover
    text-decoration: none
.Props-propId
  display: inline-block
  width: 4rem
  margin-right: 8px
  text-align: right
  color: var(--on-background)
  opacity: 0.5

.Props-propData
  flex: 1
.Props-propTitle
  font-size: 1rem
</style>
