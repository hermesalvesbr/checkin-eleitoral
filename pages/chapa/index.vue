<template>
  <v-container>
    <v-row align-self="center" no-gutters>
      <v-col cols="7">
        <v-autocomplete
          density="comfortable"
          :items="partidos"
          item-title="nome"
          item-value="valor"
          label="Escolha um partido"
          v-model="partidoSelecionado"
          class="pt-2"
        ></v-autocomplete>
      </v-col>
      <v-col cols="5" class="d-flex justify-end">
        <v-btn color="primary" @click="criarChapa" class="my-auto"
          >Criar Chapa</v-btn
        >
      </v-col>
    </v-row>
    <v-row id="partidos">
      <v-expansion-panels>
        <v-expansion-panel v-for="(chapa, index) in chapasCriadas" :key="index">
          <v-expansion-panel-title>
            <v-row align-self="center">
              <v-col cols="8" class="d-flex align-center">
                <NuxtImg
                  :src="chapa.logo"
                  :alt="chapa.nome"
                  height="35"
                  densities="x1 x2"
                />
                <h3 class="ml-2 mb-0">5.600</h3>
                <span class="ml-1">votos do {{ chapa.valor }}</span>
              </v-col>
              <v-col cols="4" class="d-flex justify-end">
                <v-chip
                  prepend-icon="mdi-account-tie"
                  color="primary"
                  class="mr-6"
                  >8</v-chip
                >
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <ChapaVereadores />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const partidos = [
    { nome: 'MDB - 15', valor: 'MDB', logo: '/partido/MDB.png' },
    { nome: 'PT - 13', valor: 'PT', logo: '/partido/PT.png' },
    { nome: 'PRD - 25', valor: 'PRD', logo: '/partido/PRD.png' },
    { nome: 'PSDB - 45', valor: 'PSDB', logo: '/partido/PSDB.png' },
    { nome: 'PP - 11', valor: 'PP', logo: '/partido/PP.png' },
    { nome: 'PDT - 12', valor: 'PDT', logo: '/partido/PDT.png' },
    { nome: 'UNIÃO - 44', valor: 'UNIÃO', logo: '/partido/UNIÃO.png' },
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

  const partidoSelecionado = ref(null)
  const chapasCriadas = ref([])

  const criarChapa = () => {
    console.log('Partido selecionado:', partidoSelecionado.value)

    if (!partidoSelecionado.value) {
      alert('Por favor, selecione um partido.')
      return
    }

    const partidoDetalhes = partidos.find(
      (partido) => partido.valor === partidoSelecionado.value
    )

    if (!partidoDetalhes) {
      console.log('Não foram encontrados detalhes para o partido selecionado.')
      return
    }

    console.log(
      `Detalhes do partido selecionado: Nome: ${partidoDetalhes.nome}, Valor: ${partidoDetalhes.valor}, Logo: ${partidoDetalhes.logo}`
    )

    const chapaExiste = chapasCriadas.value.some(
      (chapa) => chapa.valor === partidoDetalhes.valor
    )

    if (!chapaExiste) {
      chapasCriadas.value.push(partidoDetalhes)
      console.log('Chapa adicionada com sucesso:', partidoDetalhes)
      partidoSelecionado.value = null
    } else {
      console.log(
        'Tentativa de adicionar chapa duplicada para:',
        partidoDetalhes
      )
      alert('Uma chapa para este partido já foi criada.')
    }
  }
</script>
