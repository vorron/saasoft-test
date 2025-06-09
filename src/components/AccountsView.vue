<script setup lang="ts">
import { useAccountsStore, type Account, type AccountDTO } from '@/stores/accounts'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import { reactive, ref, type Ref } from 'vue'
import ChipsView from './ChipsView.vue'

const accountTypes = [
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' },
]

const store = useAccountsStore()

const editableAccount: Ref<Partial<Account> | null> = ref(null)

const startFieldValidity = {
  labels: true,
  type: undefined,
  login: undefined,
  password: undefined,
}

const fieldValidity = reactive<{
  labels?: boolean
  type?: boolean
  login?: boolean
  password?: boolean
}>(startFieldValidity)

const add = () => {
  if (editableAccount.value) return

  editableAccount.value = {
    id: '-1',
    labels: [],
    type: undefined,
    login: undefined,
    password: undefined,
  }
}

const del = (id: string) => {
  if (id === '-1') editableAccount.value = null
  else {
    store.deleteAccount(id)
    store.saveToLocalStorage()
  }
}

const validateRules = {
  labels: () =>
    (fieldValidity.labels =
      editableAccount.value?.labels?.length === 0 ||
      editableAccount.value?.labels?.every((e) => e.text.length < 100)),
  type: () => (fieldValidity.type = !!editableAccount.value?.type),
  login: () =>
    (fieldValidity.login =
      !!editableAccount.value?.login &&
      editableAccount.value?.login.length > 0 &&
      editableAccount.value?.login.length < 100),
  password: () =>
    (fieldValidity.password =
      editableAccount.value?.type === 'LDAP'
        ? editableAccount.value?.password === null
        : !!editableAccount.value?.password &&
          editableAccount.value?.password.length > 0 &&
          editableAccount.value?.password.length < 100),
}

const validateAndSave = (name: keyof typeof validateRules) => {
  if (!editableAccount.value) return

  validateRules[name]()

  if (Object.values(fieldValidity).every((e) => e)) {
    store.addAccount(editableAccount.value as AccountDTO)
    store.saveToLocalStorage()
    editableAccount.value = null
    Object.assign(fieldValidity, startFieldValidity)
  }
}
</script>

<template>
  <div class="accounts-form">
    <div class="header">
      <h2>Учетные записи</h2>
      <Button icon="pi pi-plus" @click="add" variant="outlined" />
    </div>

    <div class="hint">
      <i class="pi pi-question-circle" />
      Для указания нескольких меток для одной пары логин/пароль используйте ;
    </div>

    <div class="accounts-list">
      <div class="header-row">
        <div class="column">Метки</div>
        <div class="column">Тип записи</div>
        <div class="column">Логин</div>
        <div class="column">Пароль</div>
        <div class="column actions"></div>
      </div>

      <div
        v-for="account in !editableAccount ? store.accounts : [...store.accounts, editableAccount]"
        :key="account.id"
        :class="account.type === 'LDAP' ? 'account-row-2' : 'account-row'"
        :style="account.id === '-1' ? 'background-color: azure;' : ''"
      >
        <div class="column">
          <ChipsView
            v-model="account.labels"
            @blur="validateAndSave('labels')"
            :class="{ 'p-invalid': fieldValidity.labels === false && account.id === '-1' }"
            style="width: 100%"
          />
        </div>

        <div class="column">
          <Select
            v-model="account.type"
            :options="accountTypes"
            optionLabel="label"
            optionValue="value"
            @blur="validateAndSave('type')"
            :class="{ 'p-invalid': fieldValidity.type === false && account.id === '-1' }"
            @change="
              () => {
                if (account.type === 'LDAP') account.password = null
              }
            "
            style="width: 100%"
          />
        </div>

        <div class="column">
          <InputText
            v-model="account.login"
            placeholder="Логин"
            :maxlength="100"
            @blur="validateAndSave('login')"
            :class="{ 'p-invalid': fieldValidity.login === false && account.id === '-1' }"
            style="width: 100%"
          />
        </div>

        <div
          v-if="account.type !== 'LDAP'"
          :class="[
            'column',
            { 'p-invalid': fieldValidity.password === false && account.id === '-1' },
          ]"
        >
          <Password
            v-model="account.password"
            placeholder="Пароль"
            :maxlength="100"
            :feedback="false"
            toggleMask
            @blur="validateAndSave('password')"
            :class="{ 'p-invalid': fieldValidity.password === false && account.id === '-1' }"
          />
        </div>

        <div class="column actions">
          <Button
            icon="pi pi-trash"
            @click="del(account.id ?? '-1')"
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

.account-row-2 {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 50px;
  gap: 10px;
  align-items: center;
  padding: 10px 0 10px 10px;
}

.header-row {
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.account-row {
  padding: 10px 0 10px 10px;
  border-radius: 10px;
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
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
}
</style>
