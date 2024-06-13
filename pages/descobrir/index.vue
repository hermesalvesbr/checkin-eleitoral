<script setup lang="ts">
import type { Chapa } from '~/types'

const d = new useDirectus()
const chapas = ref<Chapa[]>([])
const cidadesUnicas = ref<string[]>([])
const loading = ref(true)
async function fetchChapas() {
  const data = await d.getItems('chapas', {
    fields: ['cidade.*', 'usuario.*', '*'],
  })
  return data
}

function extrairCidadesUnicas(dados: any[]): string[] {
  const cidadeIds = new Set<string>()

  dados.forEach((item) => {
    if (Array.isArray(item.chapas)) {
      item.chapas.forEach((chapa: { cidadeId: string }) => {
        cidadeIds.add(chapa.cidadeId)
      })
    }
  })

  return Array.from(cidadeIds)
}
function countChapasByCidadeId(chapas: any[], cidadeId: string): number {
  let count = 0
  chapas.forEach((item) => {
    if (Array.isArray(item.chapas)) {
      item.chapas.forEach((chapa: { cidadeId: string }) => {
        if (chapa.cidadeId === cidadeId) {
          count++
        }
      })
    }
  })
  return count
}

chapas.value = await fetchChapas()
cidadesUnicas.value = extrairCidadesUnicas(chapas.value)

setTimeout(() => {
  loading.value = false
}, 1000)
</script>

<template>
  <div>
    {{ chapas }}
    <v-card :loading="loading">
      <v-card-title> Lista de Cidades </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="cidadeId in cidadesUnicas" :key="cidadeId">
            <v-list-item-title>
              {{ cidadeId }}
              {{ countChapasByCidadeId(chapas, cidadeId) }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
