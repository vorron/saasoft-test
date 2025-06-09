import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Account {
  id: string
  labels: { text: string }[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}

export type AccountDTO = Omit<Account, 'id'>

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  function addAccount(accountDTO: AccountDTO) {
    accounts.value.push({ ...accountDTO, id: Date.now().toString() })
  }

  function updateAccount(id: string, updatedAccount: AccountDTO) {
    const index = accounts.value.findIndex((acc) => acc.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...updatedAccount, id }
    }
  }

  function deleteAccount(id: string) {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('accounts')
    if (saved) {
      accounts.value = JSON.parse(saved)
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    loadFromLocalStorage,
    saveToLocalStorage,
  }
})
