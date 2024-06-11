<template>
  <v-row>
    <v-col cols="12">
      <v-dialog
        v-model="localDialog"
        transition="dialog-bottom-transition"
        max-width="400"
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Entrar/Registrar Salvar</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="fecharDialogo">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="validarFormulario">
              <v-text-field
                v-model="novaPessoa.nome"
                label="Nome Completo"
                outlined
                dense
                autofocus
                :rules="[rules.nome]"
              ></v-text-field>
              <CitySearch
                v-model:cidade="cityUser"
                :initialCityId="initialCityId"
              />
              <v-text-field
                v-model="novaPessoa.email"
                label="E-mail"
                :rules="[rules.email]"
                type="email"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                id="votos"
                v-model="novaPessoa.telefone"
                label="Telefone"
                :rules="[rules.telefone]"
                outlined
                dense
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="text-none ms-4 text-white"
              color="primary"
              variant="flat"
              @click="validarFormulario"
              >Registrar</v-btn
            >
            <v-btn
              class="text-none ms-4 text-white"
              color="secondary"
              variant="flat"
              @click="fecharDialogo"
              >Não Salvar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const d = new useDirectus()
  const u = new useUtils()
  const emit = defineEmits(['update:modelValue'])
  const cityUser = ref<Cidade | null>(null)
  const localDialog = ref(props.modelValue)
  const cidadeID = ref(await buscarCidade())
  const initialCityId = ref(cidadeID.value.id)
  const formRef = ref(null)
  const loading = ref(false)
  const submitted = ref(false)

  watch(
    () => props.modelValue,
    (newVal) => {
      localDialog.value = newVal
    }
  )

  watch(localDialog, (newVal) => {
    emit('update:modelValue', newVal)
  })

  const novaPessoa = ref({
    nome: 'Hermes Alves',
    cidade: '',
    email: 'hermes@arara.com.br',
    telefone: '87992005656',
  })

  function fecharDialogo() {
    localDialog.value = false
  }

  async function adicionarPessoa() {
    const location = `${cityUser.value.nome}`
    const [first_name, last_name] = (() => {
      const [first, ...rest] = novaPessoa.value.nome.split(' ')
      return [first, rest.pop()]
    })()
    const password = u.gerarSenhaFacil(cityUser.value.nome)
    const directusUser = {
      first_name: first_name,
      last_name: last_name,
      email: novaPessoa.value.email,
      password: password,
      location: location,
      language: 'pt-BR',
      status: 'active',
      role: '50d854e3-b29a-4522-9de5-15bef50565fe',
      cidade: cityUser.value.id
    }
    console.log(directusUser, cityUser.value)
    const insertDirectusUser = await d.createUser(directusUser)
        if (insertDirectusUser === false) {
          return false
        } else {
          console.log('Usuário inserido com sucesso!')
        }
  }

  async function buscarCidade() {
    const location = await useGeolocation()
    if (!location) return
    const cidade = location
    const [data] = await d.getItems('votantes', {
      search: location.city,
      filter: { uf: { _eq: cidade.region } },
      fields: ['id','cidade','uf'],
    })
    return data
  }

  const rules = {
    nome: (value: string) => {
      if (value && value.length > 10) return true
      return 'O nome deve ter mais de 10 letras.'
    },
    telefone: (value: string) => {
      if (value && value.length > 10) return true
      return 'O telefone deve ter 11 dígitos.'
    },
    email: (value: string) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailPattern.test(value)) return true
      return 'O e-mail deve ser válido.'
    },
    cidade: () => {
      if (cityUser.value) return true
      return 'A cidade deve ser definida.'
    },
  }

  const isNomeValid = computed(() => {
    return rules.nome(novaPessoa.value.nome) === true
  })

  const isEmailValid = computed(() => {
    return rules.email(novaPessoa.value.email) === true
  })

  const isTelefoneValid = computed(() => {
    return rules.telefone(novaPessoa.value.telefone) === true
  })

  const isFormValid = computed(() => {
    return isNomeValid.value && isEmailValid.value && isTelefoneValid.value
  })

  function validarFormulario() {
    if (formRef.value && isFormValid.value) {
      adicionarPessoa()
      console.log('Formulário VALIDO!!!')
      submitted.value = true
    } else {
      console.log('Formulário inválido')
    }
  }
</script>

<style lang="scss">
  .v-data-table-header__content {
    font-weight: bold;
  }
  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(odd) > td,
  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(odd) th {
    background-color: #f5f5f5 !important;
  }

  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(even) > td,
  .v-data-table .v-table__wrapper > table tbody > tr:nth-of-type(even) th {
    background-color: #f9faf4 !important;
  }
</style>
