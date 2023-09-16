<template lang="pug">
.Page.Dao-page
  if info === undefined
    .Dao-details.surface
      h1.center-h DAO not found
      p.center-h Please check the address and try again.
      p.center-h
        | Note that this is a permissioned website exposing only curated DAOs. The DAO you are
        | looking for might not be listed here.
  else
    .Dao-details.surface
      .Dao-title
        //- DaoLogo.Dao-logo(:address='address')
        h1.Dao-name.highlight= info.name
        h2.Dao-type= daoType
      .Dao-addresses
        DaoAddress.addr(label='Treasury'    :address='info.treasury')
        DaoAddress.addr(label='Token'       :address='info.token' v-if='info.token')
        DaoAddress.addr(label='Distributor' :address='info.distributor')
</template>

<style lang="sass">
.Dao-details
  width: 1000px
  margin: 0 auto
  padding: 20px
  border-radius: 15px

.Dao-title
  display: flex
  flex-direction: row
  align-items: baseline
  gap: 20px
  padding-bottom: 10px
  margin-bottom: 10px
  border-bottom: 0.5px solid var(--line)
.Dao-logo
  max-width: 50px
  max-height: 50px
h1.Dao-name
  font-size: 2rem
h2.Dao-type
  font-size: 1.5rem
  opacity: 0.5

.Dao-addresses
  display: flex
  flex-direction: row
  gap: 10px

.addr
  flex: 1
  padding: 5px
  border-radius: 5px
  border: 1px solid var(--line)
</style>

<script lang="coffee">
import { params } from '@/hooks/route'
import { daos } from '@/lib/constants'
import DaoAddress from '@/comp/dao/info-address'
import DaoLogo from '@/comp/dao/logo'

export default
  components: { DaoAddress, DaoLogo }
  setup: -> { params }
  data: ->
    logo: undefined
  computed:
    info: -> Object.values(daos).find (dao) => dao.treasury is @params.address
    address: -> @params.address
    daoType: -> switch @info?.type
      when 'token'    then 'Token DAO'
      when 'nft'      then 'NFT DAO'
      when 'multisig' then 'Multisig DAO'
      else 'unknown DAO type'
</script>
