<template>
  <v-row
    id="indicadores"
    v-if="modelValue.length > 0"
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
</template>

<script setup lang="ts">
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

  const { modelValue } = defineProps<{
    modelValue: Chapa[]
  }>()

  const totalDeChapas = computed(() => modelValue.length)
  const totalDePessoas = computed(() =>
    modelValue.reduce((total, chapa) => total + chapa.pessoas.length, 0)
  )
  const totalDeVotos = computed(() =>
    modelValue.reduce(
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
    if (length <= 3) return 'text-h3'
    if (length <= 6) return 'text-h5'
    return 'text-h6' // Mais de 6 dígitos, tamanho menor
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
