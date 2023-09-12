import { computed, ref } from 'vue'
import { firebaseUser } from '@/lib/firebase'

accounts = computed ->
  firebase: firebaseUser.value

export default useAccounts = -> { accounts }
