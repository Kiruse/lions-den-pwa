<template lang="pug">
.DaoHeader-root.surface
  DaoLogo.DaoHeader-logo(:dao='dao' :size='150')
  .DaoHeader-data
    .DaoHeader-title
      h1.DaoHeader-name.highlight= meta.name
      h2.DaoHeader-type= daoType
    .DaoHeader-addresses
      DaoAddress.addr(label='Treasury'    :address='meta.treasury')
      DaoAddress.addr(label='Token'       :address='meta.token' v-if='meta.token')
      DaoAddress.addr(label='Distributor' :address='meta.distributor')
</template>

<script lang="coffee">
import { config } from '@/lib/misc'
import DaoAddress from './dao-address'
import DaoLogo from './dao-logo'

export default
  components: { DaoLogo, DaoAddress }
  props: ['dao']
  computed:
    meta: -> config.daos[@dao]
</script>

<style lang="sass">
.DaoHeader-root
  display: flex
  flex-direction: row
  align-items: center
  gap: 20px
  width: var(--page-width)
  margin: 0 auto
  padding: 20px

.DaoHeader-data
  flex: 1

.DaoHeader-title
  display: flex
  flex-direction: row
  align-items: baseline
  gap: 20px
  padding-bottom: 10px
  margin-bottom: 10px
  border-bottom: 0.5px solid var(--line)
h1.DaoHeader-name
  font-size: 2rem
h2.DaoHeader-type
  font-size: 1.5rem
  opacity: 0.5

.DaoHeader-addresses
  display: flex
  flex-direction: row
  gap: 10px
</style>
