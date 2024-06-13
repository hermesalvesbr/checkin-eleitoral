<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Chapa } from '~/types'

const d = new useDirectus()
const chapas = ref<Chapa[]>([])
const cidadesUnicas = ref<string[]>([])
const loading = ref(true)

async function fetchChapas() {
  try {
    const data = await d.getItems('chapas', {
      fields: ['cidade.*', 'usuario.*', '*'],
    })
    return data
  }
  catch (error) {
    console.error('Erro ao buscar chapas:', error)
    return []
  }
}

function extrairCidadesUnicas(data: any[]): string[] {
  const cidadeIds = new Set<string>()

  data.forEach((item) => {
    if (Array.isArray(item.chapas)) {
      item.chapas.forEach((chapa: { cidadeId: string }) => {
        cidadeIds.add(chapa.cidadeId)
      })
    }
    else {
      item.chapas.chapas.forEach((chapa: { cidadeId: string }) => {
        cidadeIds.add(chapa.cidadeId)
      })
    }
  })

  return Array.from(cidadeIds)
}

onMounted(async () => {
  chapas.value = await fetchChapas()
  cidadesUnicas.value = extrairCidadesUnicas(chapas.value)
  loading.value = false
})
</script>

<template>
  <div>
    <v-card :loading="loading">
      <v-card-title>Lista de Cidades</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="item in cidadesUnicas" :key="item">
            <v-list-item-title>
              <CidadeListar :key="item" :chapas="chapas" :cidade="item" />
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
