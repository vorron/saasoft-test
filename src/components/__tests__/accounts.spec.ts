import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from '@/stores/accounts'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Accounts Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should add new account', () => {
    const store = useAccountsStore()
    const newAccount = {
      labels: [{ text: 'test' }],
      type: 'Локальная' as const,
      login: 'user',
      password: 'pass',
    }

    store.addAccount(newAccount)
    expect(store.accounts).toHaveLength(1)
    expect(store.accounts[0].login).toBe('user')
  })

  it('should save and load from localStorage', () => {
    const store = useAccountsStore()
    const newAccount = {
      labels: [{ text: 'test' }],
      type: 'Локальная' as const,
      login: 'user',
      password: 'pass',
    }

    store.addAccount(newAccount)
    store.saveToLocalStorage()

    const newStore = useAccountsStore()
    newStore.loadFromLocalStorage()
    expect(newStore.accounts).toHaveLength(1)
  })

  it('should delete account', () => {
    const store = useAccountsStore()
    const newAccount = {
      labels: [{ text: 'test' }],
      type: 'Локальная' as const,
      login: 'user',
      password: 'pass',
    }

    store.addAccount(newAccount)
    const id = store.accounts[0].id
    store.deleteAccount(id)
    expect(store.accounts).toHaveLength(0)
  })
})
