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
          autocomplete="off"
        ></v-autocomplete>
      </v-col>
      <v-col cols="5" class="d-flex justify-end">
        <v-btn color="primary" @click="criarChapa" class="my-auto"
          >Criar Chapa</v-btn
        >
      </v-col>
    </v-row>
    <v-row
      id="indicadores"
      v-if="chapasCriadas.length > 0"
      class="my-5 d-flex flex-wrap"
    >
      <v-col cols="4" v-for="(card, index) in dashboardCards" :key="index">
        <v-card
          class="d-flex flex-column align-center"
          elevation="10"
          :color="card.color"
        >
          <v-card-title
            class="justify-center text-truncate"
            :style="{
              backgroundColor: card.titleBackground,
              color: card.titleColor,
            }"
          >
            {{ card.title }}
          </v-card-title>
          <v-card-text
            class="display-2 text-center"
            :class="formatCardTextClass(card.value)"
          >
            {{ card.value }}
          </v-card-text>
        </v-card>
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
                <h3 class="ml-2 mb-0">{{ totalVotosChapa(chapa.pessoas) }}</h3>
                <span class="ml-1">votos do {{ chapa.valor }}</span>
              </v-col>
              <v-col cols="4" class="d-flex justify-end">
                <v-chip
                  prepend-icon="mdi-account-tie"
                  color="primary"
                  class="mr-6"
                  >{{ somaTotalDePessoas(chapa.pessoas) }}</v-chip
                >
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

<script setup lang="ts">
  import { ref } from 'vue'
  interface Pessoa {
    nome: string
    votos: number
  }
  interface Chapa {
    nome: string
    valor: string
    logo: string
    id: number // Adicionado um ID único
    pessoas: Pessoa[] // Cada chapa tem seu próprio array de pessoas
  }
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

  const partidoSelecionado = ref(null)
  const chapasCriadas = ref<Chapa[]>([])
  let nextId = 0
  const criarChapa = () => {
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

    const chapaExiste = chapasCriadas.value.some(
      (chapa) => chapa.valor === partidoDetalhes.valor
    )

    if (!chapaExiste) {
      chapasCriadas.value.push({
        ...partidoDetalhes,
        id: nextId++,
        pessoas: [],
      })
      partidoSelecionado.value = null
    } else {
      console.log(
        'Tentativa de adicionar chapa duplicada para:',
        partidoDetalhes
      )
      alert('Uma chapa para este partido já foi criada.')
    }
  }
  function totalVotosChapa(pessoas: Pessoa[]) {
    return pessoas.reduce((total, pessoa) => total + Number(pessoa.votos), 0)
  }
  function somaTotalDePessoas(pessoas: Pessoa[]) {
    return pessoas.length || 0
  }
  // Calculando as métricas para o dashboard
  const totalDeChapas = computed(() => chapasCriadas.value.length)
  const totalDePessoas = computed(() =>
    chapasCriadas.value.reduce(
      (total, chapa) => total + chapa.pessoas.length,
      0
    )
  )
  const totalDeVotos = computed(() =>
    chapasCriadas.value.reduce(
      (total, chapa) =>
        total +
        chapa.pessoas.reduce(
          (totalVotos, pessoa) => totalVotos + Number(pessoa.votos),
          0
        ),
      0
    )
  )
  const dashboardCards = computed(() => [
    {
      title: 'Chapas',
      value: totalDeChapas.value,
      color: 'primary', // Usando a cor primária do tema
      titleBackground: 'surface-variant', // Cor de fundo para o título do card
      titleColor: 'on-surface-variant', // Cor do texto para o título do card
      textClass: 'text-h3', // Classe para aumentar o tamanho do número
    },
    {
      title: 'Pessoas',
      value: totalDePessoas.value,
      color: 'secondary', // Usando a cor secundária do tema
      titleBackground: 'surface-variant',
      titleColor: 'on-surface-variant',
      textClass: 'text-h3',
    },
    {
      title: 'Votos',
      value: totalDeVotos.value,
      color: 'accent', // Usando uma cor adicional definida no tema
      titleBackground: 'surface-variant',
      titleColor: 'on-surface-variant',
      textClass: 'text-h3',
    },
  ])
  const formatCardTextClass = (value: number | string) => {
    const length = value.toString().length
    if (length <= 3) return 'text-h3' // Menos ou igual a 4 dígitos, tamanho grande
    if (length <= 6) return 'text-h5' // Menos ou igual a 6 dígitos, tamanho médio
    return 'display-1' // Mais de 6 dígitos, tamanho menor
  }
</script>
<style scoped>
  .text-truncate-display {
    max-width: 100%; /* Garante que o texto não ultrapasse a largura do cartão */
    white-space: nowrap; /* Impede quebra de linha */
    overflow: hidden; /* Esconde conteúdo que passa da largura */
    text-overflow: ellipsis; /* Adiciona "..." ao final do conteúdo truncado */
  }
</style>
