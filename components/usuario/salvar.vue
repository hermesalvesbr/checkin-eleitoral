<script setup lang="ts">
import { StorageSerializers, useStorage } from '@vueuse/core'
import type { Chapa } from '~/types'

const props = defineProps<{
  modelValue: Chapa[]
  cidade: any
}>()
const usuarioCriado = useStorage('usuario', null, undefined, {
  serializer: StorageSerializers.object,
})
const userID = ref('')
userID.value = usuarioCriado.value && usuarioCriado.value.id ? usuarioCriado.value.id : ''

const dialog = ref(false)
const chapas = computed(() => props.modelValue)
const d = new useDirectus()

async function gerenciaChapa() {
  const chapaID = await buscarChapas()
  if (!chapaID) {
    await salvarChapa()
  }
  updateChapa(chapaID)
}

async function salvarChapa() {
  return await d.createItem('chapas', {
    cidade: props.cidade,
    usuario: userID.value,
    chapas: props.modelValue,
  })
}

async function updateChapa(chapaID: string) {
  return await d.updateItem('chapas', chapaID, {
    chapas: chapas.value,
  })
}

async function buscarChapas() {
  const [data] = await d.getItems('chapas', {
    filter: {
      usuario: { _eq: userID.value },
    },
  })

  return data.id
}
const color = ref('')
function salvar() {
  color.value = 'primary'
  setTimeout(() => {
    color.value = ''
  }, 3000)
}
function abrirDialogo() {
  if (!usuarioCriado.value || !usuarioCriado.value.id) {
    dialog.value = true
  }
  else {
    salvar()
    gerenciaChapa()
  }
}
</script>

<template>
  <v-card
    append-icon="mdi-content-save-check"
    class="mx-auto"
    subtitle="Guarde sua chapa para continuar depois"
    title="Salve sua análise"
    :model-value="dialog"
    :color="color"
    @click="abrirDialogo"
  />
  <div>
    <UsuarioLogin
      :model-value="dialog"
      :chapas="chapas"
      @update:model-value="dialog = $event"
    />
  </div>
</template>
