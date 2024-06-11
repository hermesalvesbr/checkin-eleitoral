<template>
  <v-card
    append-icon="mdi-content-save-check"
    class="mx-auto"
    subtitle="Guarde sua chapa para continuar depois"
    title="Salve sua análise"
    :modelValue="dialog"
    @click="abrirDialogo"
  ></v-card>
  <div>
    <UsuarioLogin :modelValue="dialog" @update:modelValue="dialog = $event" />
  </div>
</template>

<script setup lang="ts">
  import type { Chapa } from '~/types'

  const props = defineProps<{
    modelValue: Chapa[]
  }>()
  const dialog = ref(false)
  const chapas = computed(() => props.modelValue)
  const d = new useDirectus()
  const userID = 'f4b7d87e-af78-47cf-82fd-efda868963c9'

  async function gerenciaChapa(userID: string) {
    const chapaID = await buscarChapas(userID)
    if (!chapaID) {
      await salvarChapa(userID)
    }
    const atualizada = await updateChapa(userID)
    console.log('chapa@@@@@', chapaID, atualizada)
  }

  async function salvarChapa(userID: string) {
    return await d.createItem('chapas', {
      nome: 'Chapa 1',
      cidadeId: 1,
      userId: userID,
    })
  }

  async function updateChapa(userID: string) {
    console.log('chapas', chapas.value)
    return await d.updateItem('chapas', userID, {
      chapas: chapas.value,
    })
  }

  async function buscarChapas(userID: string) {
    const [data] = await d.getItems('chapas', {
      filter: {
        usuario: { _eq: userID },
      },
    })

    return data.id
  }
  function abrirDialogo() {
    dialog.value = true
  }
  //   const chapaID = await buscarChapas(userID)
  //   const atualizada = await updateChapa(userID)
  //   console.log('chapa@@@@@', chapaID, atualizada)
</script>
