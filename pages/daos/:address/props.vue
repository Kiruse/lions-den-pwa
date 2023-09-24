<template lang="pug">
.Page.Props-page
  if !meta
    DaoNotFound
  else
    DaoHeader(:dao='id')
    for prop in props
      DaoProp.surface(:prop='prop')
</template>

<script lang="coffee">
import { params } from '@/hooks/route'
import { config } from '@/lib/misc'
import { getProps } from '@/lib/queries/dao-queries'
import DaoNotFound from '@/views/not-found-dao'
import DaoHeader from '@/comp/dao/dao-header'

export default
  components: { DaoHeader, DaoNotFound }
  setup: -> { params }
  computed:
    meta: -> Object.values(config.daos).find (dao) => dao.treasury is @params.address
    id: -> @meta?.id
  deferred:
    props: ->
      return [] unless @id
      await getProps @id
</script>
