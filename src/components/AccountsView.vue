<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'

const accountTypes = [
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' },
]

const store = useAccountsStore()
</script>

<template>
  <div class="accounts-form">
    <div class="header">
      <h2>Учетные записи</h2>
      <Button icon="pi pi-plus" @click="store.addAccount" variant="outlined" />
    </div>

    <div class="hint">
      <i class="pi pi-question-circle" />
      Для указания нескольких меток для одной пары логин/пароль используйте Enter;
    </div>

    <div class="accounts-list">
      <div class="header-row">
        <div class="column">Метки</div>
        <div class="column">Тип записи</div>
        <div class="column">Логин</div>
        <div class="column">Пароль</div>
        <div class="column actions"></div>
      </div>

      <div v-for="account in store.accounts" :key="account.id" class="account-row">
        <div class="column">
          <AutoComplete
            v-model="account.labels"
            multiple
            fluid
            @complete="() => {}"
            :typeahead="false"
          />
        </div>

        <div class="column">
          <Select
            v-model="account.type"
            :options="accountTypes"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div class="column">
          <InputText v-model="account.login" placeholder="Логин" :maxlength="100" />
        </div>

        <div class="column" v-if="account.type === 'Локальная'">
          <Password
            v-model="account.password"
            placeholder="Пароль"
            :maxlength="100"
            :feedback="false"
            toggleMask
          />
        </div>

        <div class="column actions">
          <Button
            icon="pi pi-trash"
            @click="store.deleteAccount(account.id)"
            text
            rounded
            severity="danger"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accounts-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.hint {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  color: #666;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header-row,
.account-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 50px;
  gap: 10px;
  align-items: center;
}

.header-row {
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.account-row {
  padding: 10px 0;
}

.column {
  display: flex;
  align-items: center;
}

.actions {
  justify-content: center;
}

.p-invalid {
  border-color: #f44336 !important;
}
</style>
