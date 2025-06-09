<script setup lang="ts">
import AccountsView from '@/components/AccountsView.vue'
import { onMounted } from 'vue'
import { useAccountsStore } from './stores/accounts'

const accountsStore = useAccountsStore()

onMounted(() => {
  accountsStore.loadFromLocalStorage()
})
</script>

<template>
  <main>
    <AccountsView />
  </main>
</template>
