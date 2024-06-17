<script setup lang="ts">
import type { Chapa, Cidade, Pessoa } from '~/types'

const props = defineProps<{
  modelValue: any
  cidade: any
}>()
const emit = defineEmits(['update:modelValue'])

const { modelValue, cidade } = toRefs(props)
const chapasCriadas = ref<Chapa[]>(modelValue)
const partidos = [
  { nome: 'MDB - 15', valor: 'MDB', logo: '/partido/MDB.png' },
  { nome: 'PT - 13', valor: 'PT', logo: '/partido/PT.png' },
  { nome: 'PRD - 25', valor: 'PRD', logo: '/partido/PRD.png' },
  { nome: 'PSDB - 45', valor: 'PSDB', logo: '/partido/PSDB.png' },
  { nome: 'PP - 11', valor: 'PP', logo: '/partido/PP.png' },
  { nome: 'PDT - 12', valor: 'PDT', logo: '/partido/PDT.png' },
  { nome: 'UNIÃO - 44', valor: 'UNIÃO', logo: '/partido/UNIAO.png' },
  { nome: 'PL - 22', valor: 'PL', logo: '/partido/PL.png' },
  { nome: 'PODE - 20', valor: 'PODE', logo: '/partido/PODE.png' },
  { nome: 'PSB - 40', valor: 'PSB', logo: '/partido/PSB.png' },
  {
    nome: 'REPUBLICANOS - 10',
    valor: 'REPUBLICANOS',
    logo: '/partido/REPUBLICANOS.png',
  },
  {
    nome: 'CIDADANIA - 23',
    valor: 'CIDADANIA',
    logo: '/partido/CIDADANIA.png',
  },
  { nome: 'PSD - 55', valor: 'PSD', logo: '/partido/PSD.png' },
  { nome: 'PCdoB - 65', valor: 'PCdoB', logo: '/partido/PCdoB.png' },
  {
    nome: 'SOLIDARIEDADE - 77',
    valor: 'SOLIDARIEDADE',
    logo: '/partido/SOLIDARIEDADE.png',
  },
  { nome: 'PV - 43', valor: 'PV', logo: '/partido/PV.png' },
  { nome: 'PSOL - 50', valor: 'PSOL', logo: '/partido/PSOL.png' },
  { nome: 'AVANTE - 70', valor: 'AVANTE', logo: '/partido/AVANTE.png' },
  { nome: 'MOBILIZA - 33', valor: 'MOBILIZA', logo: '/partido/MOBILIZA.png' },
  { nome: 'AGIR - 36', valor: 'AGIR', logo: '/partido/AGIR.png' },
  { nome: 'DC - 27', valor: 'DC', logo: '/partido/DC.png' },
  { nome: 'PRTB - 28', valor: 'PRTB', logo: '/partido/PRTB.png' },
  { nome: 'PMB - 35', valor: 'PMB', logo: '/partido/PMB.png' },
  { nome: 'NOVO - 30', valor: 'NOVO', logo: '/partido/NOVO.png' },
  { nome: 'REDE - 18', valor: 'REDE', logo: '/partido/REDE.png' },
  { nome: 'PSTU - 16', valor: 'PSTU', logo: '/partido/PSTU.png' },
  { nome: 'PCB - 21', valor: 'PCB', logo: '/partido/PCB.png' },
  { nome: 'UP - 80', valor: 'UP', logo: '/partido/UP.png' },
  { nome: 'PCO - 29', valor: 'PCO', logo: '/partido/PCO.png' },
]
function totalVotosChapa(pessoas: Pessoa[]) {
  return pessoas.reduce((total, pessoa) => total + Number(pessoa.votos), 0)
}
function somaTotalDePessoas(pessoas: Pessoa[]) {
  return pessoas.length || 0
}
</script>

<template>
  <v-container>
    <ChapaDashboard
      :key="chapasCriadas.length"
      v-model="chapasCriadas"
    />
    <v-row id="partidos">
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(chapa, index) in chapasCriadas"
          :key="index"
        >
          <v-expansion-panel-title>
            <v-row align-self="center">
              <v-col cols="8" class="d-flex align-center">
                <NuxtImg
                  :src="chapa.logo"
                  :alt="chapa.nome"
                  width="35"
                  densities="x1 x2"
                />
                <h3 class="ml-2 mb-0">
                  {{ totalVotosChapa(chapa.pessoas) }}
                </h3>
                <span class="ml-1 text-truncate">votos {{ chapa.valor }}</span>
              </v-col>
              <v-col cols="3" class="d-flex justify-end">
                <v-chip
                  prepend-icon="mdi-account-tie"
                  color="primary"
                  class="pa-3 mr-3"
                >
                  {{ somaTotalDePessoas(chapa.pessoas) }}
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <ChapaVereadores v-model="chapa.pessoas" class="mt-n10" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>
