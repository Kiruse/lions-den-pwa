<template lang="pug">
.Page.Prop-page
  DaoHeader(:dao='dao')
  if prop.pending
    Spinner.Prop-spinner(color='var(--on-background-highlight)')
  else
    DaoProp.surface(:address='address' :prop='prop.value')
</template>

<script lang="coffee">
import DaoHeader from '@/comp/dao/dao-header'
import DaoProp from '@/comp/dao/dao-prop'
import Spinner from '@/comp/spinner'
import { params } from '@/hooks/route'
import { getDaoByAddress } from '@/lib/misc'
import { getProp } from '@/lib/queries/dao-queries'

export default
  name: 'DAOPropPage'
  components: { DaoHeader, DaoProp, Spinner }
  setup: -> { params }
  computed:
    address: -> @params.address
    id: -> @params.propId
    daoMeta: -> getDaoByAddress @params.address
    dao: -> @daoMeta?.id
  deferred:
    prop: ->
      return unless @dao and @id
      res = await getProp @dao, @id
      return res.ok if res.ok
      console.error "Failed to load prop: #{@dao} #{@id}", res.err
      return {}
</script>

<style lang="sass">
.Prop-spinner
  margin: 0 auto
.Prop-page .DaoProp-root
  padding: var(--spacing)
</style>
