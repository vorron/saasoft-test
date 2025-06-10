import { mount } from '@vue/test-utils'
import AccountsView from '@/components/AccountsView.vue'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest'
import PrimeVue from 'primevue/config'

// Моки для всех необходимых браузерных API
beforeAll(() => {
  // Для Textarea
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver

  // Для Select
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
})

describe('AccountsView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    const wrapper = mount(AccountsView, {
      global: {
        plugins: [PrimeVue],
      },
    })

    expect(wrapper.find('h2').text()).toBe('Учетные записи')
    expect(wrapper.find('.pi-plus').exists()).toBe(true)
  })

  it('adds new account when plus button clicked', async () => {
    const wrapper = mount(AccountsView, {
      global: {
        plugins: [PrimeVue],
      },
    })

    expect(wrapper.findAll('.account-row')).toHaveLength(0)
    await wrapper.find('.pi-plus').trigger('click')
    expect(wrapper.findAll('.account-row')).toHaveLength(1)
    expect(wrapper.findComponent({ name: 'Select' }).exists()).toBe(true)
  })
})
