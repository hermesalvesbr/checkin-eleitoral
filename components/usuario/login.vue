<script setup lang="ts">
import { StorageSerializers, useStorage } from '@vueuse/core'

interface Pessoa {
  id?: string
  nome: string
  cidade: string
  email: string
  telefone?: string
}
const props = defineProps<{
  modelValue: boolean
  chapas: any
}>()

const emit = defineEmits(['update:modelValue'])
const d = new useDirectus()
const u = new useUtils()
const cityUser: any = ref(null)
const localDialog = ref(props.modelValue)
const cidadeID = ref(await buscarCidade())
const initialCityId = ref(cidadeID.value.id)
const formRef = ref(null)
const submitted = ref(false)
const usuarioAtivo = useStorage<Pessoa>('usuario', null, undefined, {
  serializer: StorageSerializers.object,
})

const chapasCriadas = computed(() =>
  JSON.stringify(
    typeof props.chapas === 'string' ? JSON.parse(props.chapas) : props.chapas,
  ),
)

const novaPessoa = ref({
  nome: 'Hermes Alves',
  cidade: '',
  email: 'hermes@arara.com.br',
  telefone: '87992005656',
})

watch(
  () => props.modelValue,
  (newVal) => {
    localDialog.value = newVal
  },
)
watch(localDialog, (newVal) => {
  emit('update:modelValue', newVal)
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
    first_name,
    last_name,
    email: novaPessoa.value.email,
    password,
    location,
    language: 'pt-BR',
    status: 'active',
    role: '50d854e3-b29a-4522-9de5-15bef50565fe',
    cidade: cityUser.value.id,
  }
  const insertDirectusUser = await d.createUser(directusUser)
  if (insertDirectusUser === false) {
    alert('Erro ao inserir usuário, e-mail já existe')
    return false
  }
  else {
    usuarioAtivo.value = insertDirectusUser
    setTimeout(() => {
      fecharDialogo()
    }, 3000)
    salvarChapa()
    return true
  }
}

async function salvarChapa() {
  return await d.createItem('chapas', {
    cidade: cityUser.value.id,
    usuario: usuarioAtivo.value.id,
    chapas: chapasCriadas.value,
  })
}

async function buscarCidade() {
  const location = await useGeolocation()
  if (!location)
    return
  const cidade = location
  const [data] = await d.getItems('votantes', {
    search: location.city,
    filter: { uf: { _eq: cidade.region } },
    fields: ['id', 'cidade', 'uf'],
  })
  return data
}

const rules = {
  nome: (value: string) => {
    if (value && value.length > 10)
      return true
    return 'O nome deve ter mais de 10 letras.'
  },
  telefone: (value: string) => {
    if (value && value.length > 10)
      return true
    return 'O telefone deve ter 11 dígitos.'
  },
  email: (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    if (emailPattern.test(value))
      return true
    return 'O e-mail deve ser válido.'
  },
  cidade: () => {
    if (cityUser.value)
      return true
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

async function validarFormulario() {
  if (formRef.value && isFormValid.value) {
    const retorno = await adicionarPessoa()
    if (retorno) {
      submitted.value = true
    }
    else {
      submitted.value = true
    }
  }
  else {
    console.info('Formulário inválido')
  }
}
</script>

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
            <v-spacer />
            <v-btn icon @click="fecharDialogo">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text v-if="!submitted">
            <v-form ref="formRef" @submit.prevent="validarFormulario">
              <v-text-field
                v-model="novaPessoa.nome"
                label="Nome Completo"
                outlined
                dense
                autofocus
                :rules="[rules.nome]"
              />
              <CitySearch
                v-model:cidade="cityUser"
                :initial-city-id="initialCityId"
              />
              <v-text-field
                v-model="novaPessoa.email"
                label="E-mail"
                :rules="[rules.email]"
                type="email"
                outlined
                dense
              />
              <v-text-field
                id="votos"
                v-model="novaPessoa.telefone"
                label="Telefone"
                :rules="[rules.telefone]"
                outlined
                dense
              />
            </v-form>
          </v-card-text>
          <v-card-text v-if="submitted">
            <v-row>
              <v-col cols="12">
                <v-alert outlined dense color="info" icon="mdi-information">
                  A senha de acesso foi enviada para o seu e-mail
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="text-none ms-4 text-white"
              color="primary"
              variant="flat"
              @click="validarFormulario"
            >
              Registrar
            </v-btn>
            <v-btn
              class="text-none ms-4 text-white"
              color="secondary"
              variant="flat"
              @click="fecharDialogo"
            >
              Não Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

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
