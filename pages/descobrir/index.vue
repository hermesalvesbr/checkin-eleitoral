<script setup lang="ts">
import type { Chapa } from '~/types'

const d = new useDirectus()
const chapas = ref<Chapa[]>([])
const cidadesUnicas = ref<string[]>([])

async function fetchChapas() {
  const data = await d.getItems('chapas', {
    fields: ['cidade.*', 'usuario.*', 'chapas', 'date_created', 'id'],
  })
  chapas.value = data
  cidadesUnicas.value = extrairCidadesUnicas(data)
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

fetchChapas()
</script>

<template>
  <div>
    {{ cidadesUnicas }}
    <v-card>
      <v-card-title> Lista de Cidades </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="cidadeId in cidadesUnicas" :key="cidadeId">
            <v-list-item-title>{{ cidadeId }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
