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
  <v-container class="pa-6 pa-md-12" fluid>
    <p class="font-weight-medium text-primary">
      Chapas Eleitorais de Cidades
    </p>

    <p class="mt-2 text-h6 font-weight-bold text-sm-h4">
      Cidades que já possuem ánalise
    </p>
    <p class="mt-4 mb-6 text-body-1">
      Bem-vindo! Explore as cidades onde usuários já fizeram previsões para vereadores, criando coligações e estimando votos. Esta ferramenta colaborativa é pública e os dados são responsabilidade dos usuários. Participe, compartilhe suas ideias e veja a soma dos votos por partido, ajudando a moldar o futuro da sua cidade!
    </p>

    <v-row justify="center">
      <v-progress-linear v-if="loading" indeterminate />
      <v-list>
        <v-list-item v-for="item in cidadesUnicas" :key="item">
          <v-list-item-title>
            <CidadeListar :key="item" :chapas="chapas" :cidade="item" />
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-row>
  </v-container>
</template>
