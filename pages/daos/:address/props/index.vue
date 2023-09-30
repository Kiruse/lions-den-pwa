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
          NavListItem.Props-item(:to='`#/daos/${address}/props/${prop.id}`')
            | #[span.Props-itemId #{'#'}{{prop.id}}:] {{prop.title}}
</template>

<script lang="coffee">
import { params } from '@/hooks/route'
import { config } from '@/lib/misc'
import { getProps } from '@/lib/queries/dao-queries'
import DaoNotFound from '@/views/not-found-dao'
import DaoHeader from '@/comp/dao/dao-header'
import DaoProp from '@/comp/dao/dao-prop'
import NavList from '@/comp/navlist'
import NavListItem from '@/comp/navlist-item'
import Spinner from '@/comp/spinner'

export default
  components: { DaoHeader, DaoNotFound, DaoProp, NavList, NavListItem, Spinner }
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
.Props-itemId
  color: var(--on-background)
  opacity: 0.5
</style>
