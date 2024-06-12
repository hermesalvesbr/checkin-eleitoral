<script setup lang="ts">
import type { Chapa } from '~/types'

const d = new useDirectus()

const chapas = ref([])
chapas.value = await d.getItems('chapas')

interface Data {
  data: Array<{ chapas: Chapa[] }>
}

function groupByCidadeId(chapas: Chapa[]) {
  console.log(chapas)
  return chapas.reduce((acc, curr) => {
    curr.chapas.forEach((chapa) => {
      if (!acc[chapa.cidadeId]) {
        acc[chapa.cidadeId] = []
      }
      acc[chapa.cidadeId].push(chapa)
    })
    return acc
  }, {} as { [key: string]: Chapa[] })
}

const groupedData = groupByCidadeId(chapas.value)
</script>

<template>
  <div>
    {{ groupedData }}
    <v-card>
      <v-card-title> Lista de Cidades </v-card-title>
      <v-card-text>
        <v-list>
          <!-- <v-list-item v-for="cidade in chapas" :key="cidade.id">
            <v-list-item-title>{{ cidade.nome }}</v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
