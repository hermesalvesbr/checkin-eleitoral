<template>
  <v-card>
    <v-card-title> Click to Action </v-card-title>
    <v-card-text>
      <v-btn
        @click="buscarChapas('f4b7d87e-af78-47cf-82fd-efda868963c9')"
        color="primary"
        >Click Me!</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { Chapa, Cidade } from '~/types'

  const props = defineProps<{
    modelValue: Chapa[]
  }>()

  const chapas = computed(() => props.modelValue)
  const d = new useDirectus()
  const userID = 'f4b7d87e-af78-47cf-82fd-efda868963c9'

  async function salvarChapa() {
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

  //   const chapaID = await buscarChapas(userID)
  //   const atualizada = await updateChapa(userID)
  //   console.log('chapa@@@@@', chapaID, atualizada)
</script>
